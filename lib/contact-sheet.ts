import type { ExtractedFrame } from "@/lib/types";

export interface ContactSheetOptions {
  /** Number of columns in the grid. Defaults to 4. */
  columns?: number;
  /** Gap between cells in px. Defaults to 8. */
  gap?: number;
  /** Background color of the sheet. Defaults to "#111111". */
  background?: string;
  /** Draw a timestamp label under each frame. Defaults to true. */
  label?: boolean;
  /** Use the PNG format for the output sheet. */
  format?: "png" | "jpeg";
  /** Output quality for JPEG sheets. */
  quality?: number;
}

export interface ContactSheetResult {
  dataUrl: string;
  width: number;
  height: number;
}

/**
 * Builds a single "contact sheet" image (a grid montage) from the provided
 * frames and returns it as a data URL. Runs entirely client-side.
 */
export async function buildContactSheet(
  frames: ExtractedFrame[],
  opts: ContactSheetOptions = {}
): Promise<ContactSheetResult | null> {
  if (frames.length === 0) return null;

  const columns = Math.max(1, Math.min(opts.columns ?? 4, frames.length));
  const gap = Math.max(0, opts.gap ?? 8);
  const label = opts.label ?? true;
  const labelH = label ? 22 : 0;
  const background = opts.background ?? "#111111";

  // Decode every frame image off the data URL (matches the createImageBitmap
  // API used by the extraction engine).
  const images = await Promise.all(
    frames.map(async (f) => {
      const blob = await (await fetch(f.dataUrl)).blob();
      return createImageBitmap(blob);
    })
  );

  const rows = Math.ceil(images.length / columns);
  let cellW = 1;
  let cellH = 1;
  for (const img of images) {
    if (img.width > cellW) cellW = img.width;
    if (img.height > cellH) cellH = img.height;
  }
  const totalW = columns * cellW + Math.max(0, columns - 1) * gap;
  const totalH = rows * (cellH + labelH) + Math.max(0, rows - 1) * gap;

  const canvas = document.createElement("canvas");
  canvas.width = totalW;
  canvas.height = totalH;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.fillStyle = background;
  ctx.fillRect(0, 0, totalW, totalH);

  for (let i = 0; i < images.length; i++) {
    const col = i % columns;
    const row = Math.floor(i / columns);
    const x = col * (cellW + gap);
    const y = row * (cellH + labelH + gap);

    ctx.drawImage(images[i], x, y, cellW, cellH);
    images[i].close();

    if (label) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
      ctx.fillRect(x, y + cellH, cellW, labelH);
      ctx.fillStyle = "#ffffff";
      ctx.font = "11px monospace";
      ctx.fillText(`#${String(frames[i].id + 1).padStart(5, "0")} ${frames[i].formattedTime}`, x + 4, y + cellH + 15);
    }
  }

  const mime = opts.format === "jpeg" ? "image/jpeg" : "image/png";
  const dataUrl = canvas.toDataURL(mime, opts.quality ?? 85);
  return { dataUrl, width: totalW, height: totalH };
}

/**
 * Roughly estimates the total byte size of a set of frames based on their
 * base64 data-URL payloads. Useful for showing "~X MB" before downloading.
 */
export function estimateFramesSize(frames: ExtractedFrame[]): number {
  let bytes = 0;
  for (const f of frames) {
    const idx = f.dataUrl.indexOf(",");
    const payload = idx >= 0 ? f.dataUrl.length - idx - 1 : f.dataUrl.length;
    // base64 ~ 4/3 expansion → bytes ≈ len * 3 / 4
    bytes += (payload * 3) / 4;
  }
  return bytes;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  if (mb < 1024) return `${mb.toFixed(1)} MB`;
  return `${(mb / 1024).toFixed(2)} GB`;
}