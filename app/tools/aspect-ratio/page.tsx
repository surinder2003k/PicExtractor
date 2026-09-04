"use client";

import { useState } from "react";

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

export default function AspectRatioPage() {
  const [w, setW] = useState("1920");
  const [h, setH] = useState("1080");

  const width = Number(w), height = Number(h);
  const valid = Number.isFinite(width) && Number.isFinite(height) && width > 0 && height > 0;
  const g = valid ? gcd(width, height) : 1;
  const rw = valid ? width / g : 0;
  const rh = valid ? height / g : 0;

  const PRESETS: [string, number, number][] = [
    ["16:9 HD", 16, 9], ["4:3 Classic", 4, 3], ["1:1 Square", 1, 1],
    ["9:16 Reels", 9, 16], ["21:9 Ultrawide", 21, 9], ["3:2 Photo", 3, 2],
  ];

  const targetHeight = (pw: number, ph: number) =>
    valid ? Math.round((pw * height) / width) : 0;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Aspect Ratio Calculator</h1>
      <p className="mt-2 text-muted-foreground">Simplify ratios and resize media without distortion.</p>

      <div className="mt-6 rounded-xl border border-border bg-card p-6">
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-32 flex-1">
            <label className="mb-1 block text-xs text-muted-foreground">Width (px)</label>
            <input type="number" value={w} onChange={(e) => setW(e.target.value)} className="w-full rounded-md border border-input bg-background p-3 font-mono text-sm outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <span className="pb-3 text-muted-foreground">×</span>
          <div className="min-w-32 flex-1">
            <label className="mb-1 block text-xs text-muted-foreground">Height (px)</label>
            <input type="number" value={h} onChange={(e) => setH(e.target.value)} className="w-full rounded-md border border-input bg-background p-3 font-mono text-sm outline-none focus:ring-2 focus:ring-ring" />
          </div>
        </div>

        {valid && (
          <div className="mt-6 rounded-lg border border-border bg-muted p-5 text-center">
            <span className="text-xs text-muted-foreground">Simplified ratio</span>
            <p className="text-4xl font-bold">{rw} : {rh}</p>
            <p className="mt-1 text-xs text-muted-foreground">Decimal: {(width / height).toFixed(4)}</p>
          </div>
        )}

        <div className="mt-6">
          <p className="mb-2 text-xs text-muted-foreground">Common presets — height for width {valid ? width : "—"}px:</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {PRESETS.map(([label, pw, ph]) => (
              <div key={label} className="rounded-lg border border-border bg-muted p-3 text-center">
                <p className="text-xs font-medium">{label}</p>
                <p className="font-mono text-sm text-primary">{valid ? `${pw} × ${targetHeight(pw, ph)}` : "—"}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
