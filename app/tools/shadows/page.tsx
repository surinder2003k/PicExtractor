"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Copy } from "lucide-react";

export default function ShadowsPage() {
  const [x, setX] = useState(0);
  const [y, setY] = useState(8);
  const [blur, setBlur] = useState(24);
  const [spread, setSpread] = useState(0);
  const [color, setColor] = useState("#0f172a");
  const [opacity, setOpacity] = useState(25);
  const [inset, setInset] = useState(false);

  const hexToRgba = (hex: string, alpha: number) => {
    const m = hex.replace("#", "");
    const full = m.length === 3 ? m.split("").map((c) => c + c).join("") : m;
    const r = parseInt(full.slice(0, 2), 16), g = parseInt(full.slice(2, 4), 16), b = parseInt(full.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${(alpha / 100).toFixed(2)})`;
  };

  const value = `${inset ? "inset " : ""}${x}px ${y}px ${blur}px ${spread}px ${hexToRgba(color, opacity)}`;
  const css = `box-shadow: ${value};`;

  const sliders = [
    { label: "Offset X", val: x, set: setX, min: -50, max: 50 },
    { label: "Offset Y", val: y, set: setY, min: -50, max: 50 },
    { label: "Blur", val: blur, set: setBlur, min: 0, max: 100 },
    { label: "Spread", val: spread, set: setSpread, min: -50, max: 50 },
    { label: "Opacity %", val: opacity, set: setOpacity, min: 0, max: 100 },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Box Shadow Generator</h1>
      <p className="mt-2 text-muted-foreground">Tune sliders, watch the preview, copy production-ready CSS.</p>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="flex items-center justify-center rounded-xl border border-border bg-muted p-10">
          <div className="h-32 w-48 rounded-xl border border-border bg-card" style={{ boxShadow: value }} />
        </div>

        <div className="space-y-4 rounded-xl border border-border bg-card p-5">
          {sliders.map((s) => (
            <div key={s.label}>
              <label className="mb-1 flex justify-between text-xs">
                <span className="text-muted-foreground">{s.label}</span>
                <span className="font-mono">{s.val}</span>
              </label>
              <input type="range" min={s.min} max={s.max} value={s.val} onChange={(e) => s.set(Number(e.target.value))} className="w-full cursor-pointer accent-primary" />
            </div>
          ))}
          <div className="flex items-center gap-3">
            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} aria-label="Shadow color" className="h-10 w-12 cursor-pointer rounded-lg border border-border" />
            <button type="button" onClick={() => setInset(!inset)} className={`rounded-md border px-3 py-1.5 text-xs transition-colors ${inset ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-secondary"}`}>
              inset
            </button>
            <button
              type="button"
              onClick={async () => { try { await navigator.clipboard.writeText(css); toast.success("CSS copied."); } catch { toast.error("Could not copy."); } }}
              className="ml-auto inline-flex items-center gap-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              <Copy className="h-4 w-4" /> Copy
            </button>
          </div>
          <pre className="overflow-auto rounded-md border border-border bg-muted p-3 font-mono text-xs">{css}</pre>
        </div>
      </div>
    </div>
  );
}
