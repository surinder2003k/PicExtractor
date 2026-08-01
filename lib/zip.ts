import JSZip from "jszip";
import type { ExtractedFrame, FrameFormat } from "@/lib/types";
import { frameFileName } from "@/lib/video";

function frameFormat(frame: ExtractedFrame): FrameFormat {
  if (frame.dataUrl.startsWith("data:image/jpeg")) return "jpeg";
  if (frame.dataUrl.startsWith("data:image/webp")) return "webp";
  return "png";
}

export async function downloadFramesZip(
  frames: ExtractedFrame[],
  videoName: string,
  onProgress?: (percent: number) => void
): Promise<void> {
  const zip = new JSZip();
  const folder = zip.folder("frames");
  if (!folder) return;
  for (const frame of frames) {
    const name = frameFileName(videoName, frame.id, frame.timestamp, frameFormat(frame));
    folder.file(name, frame.dataUrl.split(",")[1] ?? "", { base64: true });
  }
  const blob = await zip.generateAsync(
    { type: "blob", compression: "DEFLATE", compressionOptions: { level: 6 } },
    (metadata) => onProgress?.(Math.round(metadata.percent))
  );
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const base = (videoName || "frames").replace(/\.[^.]+$/, "") || "frames";
  a.download = `${base}-frames.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function downloadSingleFrame(frame: ExtractedFrame, videoName: string): Promise<void> {
  const url = frame.dataUrl;
  const a = document.createElement("a");
  a.href = url;
  a.download = frameFileName(videoName, frame.id, frame.timestamp, frameFormat(frame));
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export async function copyFrameToClipboard(frame: ExtractedFrame): Promise<void> {
  const blob = await (await fetch(frame.dataUrl)).blob();
  await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
}
