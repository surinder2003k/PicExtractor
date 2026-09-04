"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Download } from "lucide-react";

export default function ImageCompressorPage() {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(70);
  const [preview, setPreview] = useState<string>("");
  const [outSize, setOutSize] = useState<number | null>(null);

  const pick = (f: File | undefined) => {
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setOutSize(null);
  };

  const compress = () => {
    if (!file) return;
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      canvas.getContext("2d")!.drawImage(img, 0, 0);
      canvas.toBlob(
        (blob) => {
          if (!blob) return;
          setOutSize(blob.size);
          const a = document.createElement("a");
          a.href = URL.createObjectURL(blob);
          a.download = `compressed_${quality}.` + (file.type === "image/png" ? "png" : "jpg");
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(a.href);
          toast.success(`Compressed: ${(blob.size / 1024).toFixed(0)} KB (was ${(file.size / 1024).toFixed(0)} KB)`);
        },
        "image/jpeg",
        quality / 100
      );
    };
    img.src = URL.createObjectURL(file);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Image Compressor</h1>
      <p className="mt-2 text-muted-foreground">Shrink images without leaving your device — 100% local.</p>

      <label
        className={`mt-6 block cursor-pointer rounded-xl border-2 border-dashed p-10 text-center transition-colors hover:border-primary/60`}
      >
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => pick(e.target.files?.[0])}
        />
        <p className="text-sm font-medium">{file ? file.name : "Drop an image here or click to browse"}</p>
        {file && <p className="mt-1 text-xs text-muted-foreground">Original: {(file.size / 1024).toFixed(0)} KB</p>}
      </label>

      {file && (
        <div className="mt-6 rounded-xl border border-border bg-card p-6">
          <label className="mb-2 flex items-center justify-between text-sm">
            <span>Quality</span>
            <strong>{quality}%</strong>
          </label>
          <input
            type="range"
            min={10}
            max={95}
            value={quality}
            onChange={(e) => setQuality(Number(e.target.value))}
            className="w-full cursor-pointer accent-primary"
          />
          <button
            type="button"
            onClick={compress}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Download className="h-4 w-4" /> Compress &amp; download
          </button>
          {outSize !== null && (
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Last result: {(outSize / 1024).toFixed(0)} KB
            </p>
          )}
        </div>
      )}

      {preview && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={preview} alt="preview" className="mt-6 max-h-80 w-auto rounded-xl border border-border" />
      )}
    </div>
  );
}
