import type { FrameFormat, VideoInfo } from "@/lib/types";

export const ACCEPTED_VIDEO = "video/mp4,video/webm,video/quicktime,video/x-msvideo,video/x-matroska";

export function isValidVideoFile(file: File): boolean {
  return (
    ["video/mp4", "video/webm", "video/quicktime", "video/x-msvideo", "video/x-matroska"].some(
      (t) => file.type.includes(t)
    ) || file.type.startsWith("video/")
  );
}

export function formatTime(seconds: number): string {
  const s = Math.max(0, seconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = Math.floor(s % 60);
  const ms = Math.floor((s % 1) * 1000);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}.${String(ms).padStart(3, "0")}`;
}

export function timeToSeconds(hhmmssmmm: string): number | null {
  const match = hhmmssmmm.trim().match(/^(\d+):(\d{1,2}):(\d{1,2})(?:\.(\d{1,3}))?$/);
  if (!match) return null;
  const [, h, m, s, ms] = match;
  return Number(h) * 3600 + Number(m) * 60 + Number(s) + Number((ms ?? "0").padEnd(3, "0")) / 1000;
}

export function sanitizeFileName(name: string): string {
  return name
    .replace(/\.[^.]+$/, "")
    .replace(/[^\w-]+/g, "_")
    .replace(/_+/g, "_")
    .slice(0, 60);
}

export function frameFileName(videoName: string, frameId: number, timestamp: number, format: FrameFormat): string {
  const ext = format === "jpeg" ? "jpg" : format;
  const base = sanitizeFileName(videoName || "video") || "video";
  const stamp = formatTime(timestamp).replace(/[:.]/g, "-");
  return `${base}_frame-${String(frameId + 1).padStart(5, "0")}_${stamp}.${ext}`;
}

export function getMime(format: FrameFormat): string {
  if (format === "jpeg") return "image/jpeg";
  if (format === "webp") return "image/webp";
  return "image/png";
}

export function estimateFrameCount(duration: number, intervalMs: number, start: number, end: number): number {
  const dur = Math.max(0, Math.min(end, duration) - start);
  if (dur <= 0 || intervalMs <= 0) return 0;
  return Math.ceil((dur * 1000) / intervalMs);
}

export async function readVideoInfo(file: File): Promise<VideoInfo> {
  const url = URL.createObjectURL(file);
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.muted = true;
    const cleanup = () => {
      video.removeAttribute("src");
      video.load();
      URL.revokeObjectURL(url);
    };
    video.onloadedmetadata = () => {
      const info = {
        duration: video.duration,
        width: video.videoWidth,
        height: video.videoHeight,
      };
      cleanup();
      resolve(info);
    };
    video.onerror = () => {
      cleanup();
      reject(new Error("Failed to load video metadata"));
    };
    video.src = url;
  });
}

export function captureFrameAtTime(
  video: HTMLVideoElement,
  format: FrameFormat,
  quality: number
): string | null {
  const canvas = document.createElement("canvas");
  const width = video.videoWidth;
  const height = video.videoHeight;
  if (!width || !height) return null;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.drawImage(video, 0, 0, width, height);
  return canvas.toDataURL(getMime(format), quality);
}
