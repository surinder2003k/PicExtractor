export type OutFormat = "png" | "jpeg" | "webp";

export function imageMime(format: OutFormat): string {
  return format === "jpeg" ? "image/jpeg" : format === "webp" ? "image/webp" : "image/png";
}

export function loadImage(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not load image."));
    img.src = dataUrl;
  });
}

export interface ConvertResult {
  dataUrl: string;
  width: number;
  height: number;
}

export async function convertImage(
  dataUrl: string,
  format: OutFormat,
  quality = 0.9,
  maxDimension?: number
): Promise<ConvertResult> {
  const img = await loadImage(dataUrl);
  let w = img.naturalWidth || img.width;
  let h = img.naturalHeight || img.height;
  if (maxDimension && maxDimension > 0) {
    const scale = Math.min(1, maxDimension / Math.max(w, h));
    w = Math.round(w * scale);
    h = Math.round(h * scale);
  }
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No canvas context.");
  ctx.drawImage(img, 0, 0, w, h);
  return { dataUrl: canvas.toDataURL(imageMime(format), quality), width: w, height: h };
}

/** Read a File/Blob into a data URL. */
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Could not read file."));
    reader.readAsDataURL(file);
  });
}