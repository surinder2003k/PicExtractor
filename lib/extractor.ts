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
const MAX_ENCODER_WORKERS = 4;

/** Inline source for the encoding worker (avoids bundler-specific worker support). */
const ENCODER_WORKER_SOURCE = `
self.onmessage = async function (e) {
  var d = e.data;
  var id = d.id;
  var bitmap = d.bitmap;
  var format = d.format;
  var quality = d.quality;
  try {
    var canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
    var ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("no 2d ctx");
    ctx.drawImage(bitmap, 0, 0);
    bitmap.close();
    var mime = format === "jpeg" ? "image/jpeg" : format === "webp" ? "image/webp" : "image/png";
    var blob = await canvas.convertToBlob({ type: mime, quality: quality });
    var reader = new FileReaderSync();
    self.postMessage({ id: id, dataUrl: reader.readAsDataURL(blob) });
  } catch (err) {
    try { bitmap.close(); } catch (_) {}
    self.postMessage({ id: id, error: String(err) });
  }
};
`;

const encoderWorkers: Worker[] = [];
const encoderPending = new Map<number, { resolve: (v: string) => void; reject: () => void }>();
let encoderNextId = 0;
let encoderRR = 0;
let encoderPoolReady = false;

function supportsWorkerEncode(): boolean {
  return (
    typeof Worker !== "undefined" &&
    typeof OffscreenCanvas !== "undefined" &&
    typeof createImageBitmap === "function" &&
    typeof Blob === "function" &&
    typeof URL === "function"
  );
}

function ensureEncoderPool(): boolean {
  if (encoderPoolReady) return encoderWorkers.length > 0;
  encoderPoolReady = true;
  if (!supportsWorkerEncode()) return false;
  try {
    const blobUrl = URL.createObjectURL(new Blob([ENCODER_WORKER_SOURCE], { type: "application/javascript" }));
    const count = Math.max(1, Math.min(MAX_ENCODER_WORKERS, navigator.hardwareConcurrency || 2));
    for (let i = 0; i < count; i++) {
      const w = new Worker(blobUrl);
      w.onmessage = (e) => {
        const { id, dataUrl, error } = e.data as { id: number; dataUrl?: string; error?: string };
        const p = encoderPending.get(id);
        if (!p) return;
        encoderPending.delete(id);
        if (error) p.reject();
        else p.resolve(dataUrl ?? "");
      };
      w.onerror = () => {
        // Fall back to the synchronous path for this request.
        encoderPending.forEach((p) => p.reject());
        encoderPending.clear();
        encoderWorkers.forEach((x) => x.terminate());
        encoderWorkers.length = 0;
      };
      encoderWorkers.push(w);
    }
    return encoderWorkers.length > 0;
  } catch {
    return false;
  }
}

function encodeOffMainThread(bitmap: ImageBitmap, format: FrameFormat, quality: number): Promise<string> {
  if (encoderWorkers.length === 0) {
    bitmap.close();
    return Promise.reject(new Error("no encoder workers"));
  }
  const id = ++encoderNextId;
  const w = encoderWorkers[encoderRR++ % encoderWorkers.length];
  return new Promise((resolve, reject) => {
    encoderPending.set(id, { resolve, reject });
    try {
      w.postMessage({ id, bitmap, format, quality }, [bitmap]);
    } catch {
      encoderPending.delete(id);
      reject();
    }
  });
}

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
  // Fallback encoder (main thread) used only when worker encoding is unavailable.
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  const useWorker = ensureEncoderPool();

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
            let dataUrl: string;
            try {
              if (useWorker && typeof createImageBitmap === "function") {
                // Capture the presented frame as a bitmap and encode it on a
                // worker thread so the main thread can keep seeking frames in
                // parallel instead of blocking on a synchronous toDataURL().
                const bitmap = await createImageBitmap(video);
                dataUrl = await encodeOffMainThread(bitmap, format, quality);
              } else {
                throw new Error("worker encode unavailable");
              }
            } catch {
              // Fall back to the synchronous main-thread encoder.
              if (!ctx) throw new Error("no canvas context");
              ctx.drawImage(video, 0, 0, width, height);
              dataUrl = canvas.toDataURL(getMime(format), quality);
            }
            results[idx] = {
              id: idx,
              timestamp: time,
              formattedTime: formatTime(time),
              dataUrl,
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
