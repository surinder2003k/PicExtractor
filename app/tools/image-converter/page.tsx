"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Download, ImagePlus, RefreshCcw } from "lucide-react";
import { convertImage, fileToDataUrl, type OutFormat } from "@/lib/tools/image";

const FORMATS: { value: OutFormat; label: string }[] = [
  { value: "png", label: "PNG" },
  { value: "jpeg", label: "JPEG" },
  { value: "webp", label: "WebP" },
];

export default function ImageConverterPage() {
  const [src, setSrc] = useState("");
  const [fileName, setFileName] = useState("image");
  const [format, setFormat] = useState<OutFormat>("jpeg");
  const [quality, setQuality] = useState(90);
  const [maxDim, setMaxDim] = useState(0);
  const [out, setOut] = useState("");
  const [busy, setBusy] = useState(false);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    try {
      const dataUrl = await fileToDataUrl(file);
      setSrc(dataUrl);
      setFileName(file.name.replace(/\\.[^.]+$/, "") || "image");
      setOut("");
    } catch {
      toast.error("Could not read the image file.");
    }
  };

  const handleConvert = async () => {
    if (!src) return;
    setBusy(true);
    try {
      const dim = maxDim > 0 ? maxDim : undefined;
      const res = await convertImage(src, format, quality / 100, dim);
      setOut(res.dataUrl);
      toast.success(`Converted (${res.width}×${res.height}).`);
    } catch {
      toast.error("Could not convert the image.");
    } finally {
      setBusy(false);
    }
  };

  const handleDownload = () => {
    if (!out) return;
    const a = document.createElement("a");
    a.href = out;
    a.download = `${fileName}.${format === "jpeg" ? "jpg" : format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Image Converter</h1>
      <p className="mt-2 text-muted-foreground">Convert and resize images — PNG, JPEG, WebP. Everything stays on your device.</p>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="mb-3 font-semibold">Source</h3>
          {src ? (
            <img src={src} alt="Source preview" className="max-h-64 w-full rounded-lg border border-border bg-muted object-contain" />
          ) : (
            <label className="flex h-56 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border text-muted-foreground transition-colors hover:border-primary/60">
              <ImagePlus className="mb-2 h-10 w-10" />
              <span className="text-sm">Choose an image</span>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0])}
              />
            </label>
          )}

          {src && (
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => { setSrc(""); setOut(""); }}
                className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs transition-colors hover:bg-secondary"
              >
                <RefreshCcw className="h-3.5 w-3.5" /> Change
              </button>
            </div>
          )}
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="mb-3 font-semibold">Output settings</h3>

          <label className="mb-1 block text-xs text-muted-foreground">Format</label>
          <div className="flex gap-1 rounded-lg border border-border p-1">
            {FORMATS.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => setFormat(f.value)}
                className={`flex-1 rounded-md px-2 py-1.5 text-xs font-medium transition-colors ${
                  format === f.value ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <label className="mt-4 mb-1 block text-xs text-muted-foreground">Quality: {quality}%</label>
          <input
            type="range"
            min={10}
            max={100}
            step={5}
            value={quality}
            onChange={(e) => setQuality(Number(e.target.value))}
            className="w-full cursor-pointer accent-primary"
          />

          <label className="mt-4 mb-1 block text-xs text-muted-foreground">
            Max dimension {maxDim > 0 ? `(${maxDim}px)` : "(off)"}
          </label>
          <input
            type="range"
            min={0}
            max={2048}
            step={64}
            value={maxDim}
            onChange={(e) => setMaxDim(Number(e.target.value))}
            className="w-full cursor-pointer accent-primary"
          />

          <button
            type="button"
            onClick={handleConvert}
            disabled={busy || !src}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            <Download className="h-4 w-4" />
            {busy ? "Converting…" : "Convert image"}
          </button>

          {out && (
            <>
              <img src={out} alt="Converted preview" className="mt-4 max-h-40 w-full rounded-lg border border-border bg-muted object-contain" />
              <button
                type="button"
                onClick={handleDownload}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                <Download className="h-4 w-4" /> Download {format.toUpperCase()}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}