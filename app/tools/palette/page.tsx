"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Copy } from "lucide-react";

interface Swatch { hex: string; count: number; }

export default function PalettePage() {
  const [swatches, setSwatches] = useState<Swatch[]>([]);
  const [preview, setPreview] = useState("");

  const extract = (file: File) => {
    const url = URL.createObjectURL(file);
    setPreview(url);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const size = 80;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, size, size);
      const { data } = ctx.getImageData(0, 0, size, size);
      const buckets = new Map<string, number>();
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i + 1], b = data[i + 2];
        const key = `${Math.round(r / 24) * 24},${Math.round(g / 24) * 24},${Math.round(b / 24) * 24}`;
        buckets.set(key, (buckets.get(key) ?? 0) + 1);
      }
      const top = [...buckets.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([key, count]) => {
          const [r, g, b] = key.split(",").map(Number);
          return { hex: "#" + [r, g, b].map((c) => c.toString(16).padStart(2, "0")).join(""), count };
        });
      setSwatches(top);
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  const copy = async (hex: string) => {
    try { await navigator.clipboard.writeText(hex); toast.success(`${hex} copied.`); }
    catch { toast.error("Could not copy."); }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Color Palette Extractor</h1>
      <p className="mt-2 text-muted-foreground">Upload any image — get its dominant colors as copyable HEX codes. 100% local.</p>

      <label className="mt-6 block cursor-pointer rounded-xl border-2 border-dashed border-border p-10 text-center transition-colors hover:border-primary/60">
        <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) extract(f); }} />
        <p className="text-sm font-medium">Click to choose an image</p>
      </label>

      {preview && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={preview} alt="source" className="mt-6 max-h-72 w-auto rounded-xl border border-border" />
      )}

      {swatches.length > 0 && (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {swatches.map((s) => (
            <button
              key={s.hex}
              type="button"
              onClick={() => copy(s.hex)}
              className="group overflow-hidden rounded-xl border border-border text-left transition-transform hover:-translate-y-0.5"
            >
              <div className="h-20 w-full" style={{ background: s.hex }} />
              <div className="flex items-center justify-between bg-card px-3 py-2">
                <code className="font-mono text-xs">{s.hex}</code>
                <Copy className="h-3.5 w-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
