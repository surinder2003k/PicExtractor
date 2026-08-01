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

const MAX_POOL_SIZE = 8;
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
      // Let the decoder present the frame before drawing. A single rAF is
      // enough (the frame is already decoded by the time "seeked" fires);
      // this avoids occasional stale/blank captures from drawing too early.
      requestAnimationFrame(() => finish(true));
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

let hiddenHost: HTMLDivElement | null = null;

function getHiddenHost(): HTMLDivElement {
  if (!hiddenHost) {
    hiddenHost = document.createElement("div");
    hiddenHost.style.cssText =
      "position:fixed;left:-9999px;top:-9999px;width:1px;height:1px;opacity:0;pointer-events:none;";
    document.body.appendChild(hiddenHost);
  }
  return hiddenHost;
}

async function loadVideoElement(src: string): Promise<HTMLVideoElement> {
  const video = document.createElement("video");
  // metadata only: we seek frame-by-frame, so preloading the whole file into
  // each of the pool elements would multiply memory use by the pool size.
  video.preload = "metadata";
  video.muted = true;
  video.playsInline = true;
  // Attach to the DOM (hidden) so seeking reliably fires "seeked" events.
  getHiddenHost().appendChild(video);
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

  let completed = 0;
  let lastReport = 0;

  const report = () => {
    const now = Date.now();
    // Throttle progress pushes to ~20/sec to avoid drowning the UI in
    // state updates while hundreds of frames complete per second.
    if (now - lastReport >= 50 || completed === total) {
      lastReport = now;
      onProgress({
        done: completed,
        total,
        elapsedMs: now - startedAt,
      });
    }
  };

  const worker = async (indices: number[]) => {
    if (indices.length === 0) return;
    const video = await loadVideoElement(src);
    try {
      // Seek only forward through a contiguous chunk: the browser keeps the
      // decoder positioned, so forward seeks are far cheaper than random access.
      let lastTime = -1;
      for (const idx of indices) {
        if (signal.aborted) return;
        const time = timestamps[idx];
        // Seek forward, but if a time is somehow below the current position,
        // still set it (handles non-monotonic edge cases safely).
        const ok = await seekTo(video, Math.max(time, lastTime), signal);
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
        lastTime = Math.max(lastTime, time);
        completed++;
        report();
      }
    } finally {
      video.removeAttribute("src");
      video.load();
      video.remove();
    }
  };

  const poolSize = Math.max(1, Math.min(MAX_POOL_SIZE, total, navigator.hardwareConcurrency || 4));
  // Split timestamps into contiguous chunks, one per worker. Each chunk stays
  // within a narrow time window so all seeks are short forward hops.
  const chunks: number[][] = Array.from({ length: poolSize }, () => []);
  for (let i = 0; i < total; i++) {
    chunks[Math.floor((i * poolSize) / total)].push(i);
  }
  await Promise.all(chunks.map((c) => worker(c)));

  const frames = results.filter((f): f is ExtractedFrame => f !== null);
  report();
  return { frames, aborted: signal.aborted };
}
