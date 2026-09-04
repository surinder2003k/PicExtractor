"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Download, Copy } from "lucide-react";

export default function PlaceholderPage() {
  const [w, setW] = useState("800");
  const [h, setH] = useState("400");
  const [bg, setBg] = useState("#1e293b");
  const [fg, setFg] = useState("#94a3b8");
  const [label, setLabel] = useState("");

  const width = Math.max(1, Math.min(4000, Number(w) || 800));
  const height = Math.max(1, Math.min(4000, Number(h) || 400));
  const text = label || `${width} × ${height}`;
  const fontSize = Math.max(12, Math.min(width, height) / 8);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="100%" height="100%" fill="${bg}"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="monospace" font-size="${fontSize}" fill="${fg}">${text.replace(/</g, "&lt;")}</text></svg>`;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">SVG Placeholder Generator</h1>
      <p className="mt-2 text-muted-foreground">Mockup images for layouts — instant SVG, no external service needed.</p>

      <div className="mt-6 flex flex-wrap items-end gap-3">
        <div className="w-24">
          <label className="mb-1 block text-xs text-muted-foreground">Width</label>
          <input type="number" value={w} onChange={(e) => setW(e.target.value)} className="w-full rounded-md border border-input bg-background p-2.5 font-mono text-sm outline-none" />
        </div>
        <div className="w-24">
          <label className="mb-1 block text-xs text-muted-foreground">Height</label>
          <input type="number" value={h} onChange={(e) => setH(e.target.value)} className="w-full rounded-md border border-input bg-background p-2.5 font-mono text-sm outline-none" />
        </div>
        <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} aria-label="Background" className="h-11 w-14 cursor-pointer rounded-lg border border-border" />
        <input type="color" value={fg} onChange={(e) => setFg(e.target.value)} aria-label="Text color" className="h-11 w-14 cursor-pointer rounded-lg border border-border" />
        <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Custom label" className="min-w-40 flex-1 rounded-md border border-input bg-background p-2.5 text-sm outline-none" />
      </div>

      <div
        className="mt-6 flex h-64 items-center justify-center overflow-hidden rounded-xl border border-border font-mono"
        style={{ background: bg, color: fg, fontSize: Math.min(28, fontSize) }}
      >
        {text}
      </div>

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={() => {
            const a = document.createElement("a");
            a.href = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
            a.download = `placeholder-${width}x${height}.svg`;
            a.click();
            URL.revokeObjectURL(a.href);
            toast.success("SVG downloaded.");
          }}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Download className="h-4 w-4" /> Download SVG
        </button>
        <button
          type="button"
          onClick={async () => { try { await navigator.clipboard.writeText(svg); toast.success("SVG code copied."); } catch { toast.error("Could not copy."); } }}
          className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2.5 text-sm transition-colors hover:bg-secondary"
        >
          <Copy className="h-4 w-4" /> Copy code
        </button>
      </div>

      <pre className="mt-4 max-h-40 overflow-auto rounded-xl border border-border bg-muted p-4 font-mono text-xs">{svg}</pre>
    </div>
  );
}
