import type { ExtractedFrame, FrameFormat, ProgressState } from "@/lib/types";
import { formatTime, getMime } from "@/lib/video";

export interface ExtractOptions {
  src: string;
  intervalMs: number;
  format: FrameFormat;
  quality: number;
  startTime: number;
  endTime: number;
  width: number;
  height: number;
  /** Known duration in seconds. If omitted it is probed from the source. */
  duration?: number;
  concurrency?: number;
  signal: AbortSignal;
  onProgress: (p: ProgressState) => void;
}

const POOL_SIZE = 4;
const SEEK_TIMEOUT_MS = 8000;

function buildTimestamps(duration: number, intervalMs: number, startTime: number, endTime: number): number[] {
  const start = Math.max(0, startTime);
  const end = Math.min(duration, endTime);
  const times: number[] = [];
  if (intervalMs <= 0 || end <= start) return times;
  const total = Math.ceil(((end - start) * 1000) / intervalMs);
  for (let i = 0; i < total; i++) {
    const t = start + (i * intervalMs) / 1000;
    if (t >= end) break;
    times.push(t);
  }
  return times;
}

function seekTo(video: HTMLVideoElement, time: number, signal: AbortSignal): Promise<boolean> {
  return new Promise((resolve) => {
    if (signal.aborted) return resolve(false);
    let settled = false;
    const finish = (ok: boolean) => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve(ok);
    };
    const cleanup = () => {
      video.removeEventListener("seeked", onSeeked);
      window.clearTimeout(timer);
    };
    const onSeeked = () => {
      // Give the decoder a frame to present before drawing.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => finish(true));
      });
    };
    video.addEventListener("seeked", onSeeked);
    const timer = window.setTimeout(() => finish(false), SEEK_TIMEOUT_MS);
    try {
      video.currentTime = time;
    } catch {
      finish(false);
    }
  });
}

async function loadVideoElement(src: string): Promise<HTMLVideoElement> {
  const video = document.createElement("video");
  video.preload = "auto";
  video.muted = true;
  video.playsInline = true;
  video.src = src;
  await new Promise<void>((resolve, reject) => {
    const onLoaded = () => resolve();
    const onError = () => reject(new Error("Failed to load video for extraction"));
    video.addEventListener("loadeddata", onLoaded, { once: true });
    video.addEventListener("error", onError, { once: true });
    video.addEventListener("canplay", onLoaded, { once: true });
    window.setTimeout(onLoaded, 15000);
  });
  return video;
}

export interface ExtractResult {
  frames: ExtractedFrame[];
  aborted: boolean;
}

export async function extractFrames(opts: ExtractOptions): Promise<ExtractResult> {
  const { src, intervalMs, format, quality, startTime, endTime, width, height, signal, onProgress } = opts;
  const duration =
    opts.duration ??
    (await new Promise<number>((resolve) => {
      const probe = document.createElement("video");
      probe.preload = "metadata";
      probe.muted = true;
      probe.onloadedmetadata = () => resolve(probe.duration);
      probe.onerror = () => resolve(0);
      probe.src = src;
      window.setTimeout(() => resolve(probe.duration || 0), 8000);
    }));

  const timestamps = buildTimestamps(duration, intervalMs, startTime, endTime);
  const total = timestamps.length;
  if (total === 0) {
    onProgress({ done: 0, total: 0, elapsedMs: 0 });
    return { frames: [], aborted: false };
  }

  const startedAt = Date.now();
  const results: (ExtractedFrame | null)[] = new Array(total).fill(null);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("Canvas 2D context unavailable");

  let nextIndex = 0;
  let completed = 0;

  const report = () =>
    onProgress({
      done: completed,
      total,
      elapsedMs: Date.now() - startedAt,
    });

  const worker = async () => {
    const video = await loadVideoElement(src);
    try {
      while (true) {
        if (signal.aborted) return;
        const idx = nextIndex++;
        if (idx >= total) return;
        const time = timestamps[idx];
        const ok = await seekTo(video, time, signal);
        if (ok) {
          try {
            ctx.drawImage(video, 0, 0, width, height);
            results[idx] = {
              id: idx,
              timestamp: time,
              formattedTime: formatTime(time),
              dataUrl: canvas.toDataURL(getMime(format), quality),
              width,
              height,
            };
          } catch {
            results[idx] = null;
          }
        }
        completed++;
        report();
        await new Promise((r) => setTimeout(r, 0));
      }
    } finally {
      video.removeAttribute("src");
      video.load();
    }
  };

  const poolSize = Math.max(1, Math.min(POOL_SIZE, total));
  await Promise.all(Array.from({ length: poolSize }, () => worker()));

  const frames = results.filter((f): f is ExtractedFrame => f !== null);
  report();
  return { frames, aborted: signal.aborted };
}
