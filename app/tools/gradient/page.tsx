"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Copy, Shuffle } from "lucide-react";

type Angle = "to bottom" | "to top" | "to right" | "to left" | "45deg" | "135deg";

const ANGLES: Angle[] = ["to bottom", "to top", "to right", "to left", "45deg", "135deg"];

export default function GradientPage() {
  const [c1, setC1] = useState("#2563eb");
  const [c2, setC2] = useState("#06b6d4");
  const [angle, setAngle] = useState<Angle>("to bottom");

  const css = `linear-gradient(${angle}, ${c1}, ${c2})`;

  const randomize = () => {
    const rnd = () => "#" + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, "0");
    setC1(rnd());
    setC2(rnd());
    setAngle(ANGLES[Math.floor(Math.random() * ANGLES.length)]);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">CSS Gradient Generator</h1>
      <p className="mt-2 text-muted-foreground">Beautiful gradients for websites, decks, and thumbnails.</p>

      <div
        className="mt-6 h-48 rounded-xl border border-border"
        style={{ background: css }}
      />

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <input type="color" value={c1} onChange={(e) => setC1(e.target.value)} className="h-11 w-14 cursor-pointer rounded-lg border border-border bg-card" />
        <input type="color" value={c2} onChange={(e) => setC2(e.target.value)} className="h-11 w-14 cursor-pointer rounded-lg border border-border bg-card" />
        <select
          value={angle}
          onChange={(e) => setAngle(e.target.value as Angle)}
          className="rounded-md border border-border bg-background p-2 text-sm outline-none"
        >
          {ANGLES.map((a) => <option key={a} value={a}>{a}</option>)}
        </select>
        <button
          type="button"
          onClick={randomize}
          className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm transition-colors hover:bg-secondary"
        >
          <Shuffle className="h-4 w-4" /> Surprise me
        </button>
        <button
          type="button"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(`background: ${css};`);
              toast.success("CSS copied.");
            } catch {
              toast.error("Could not copy.");
            }
          }}
          className="inline-flex items-center gap-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Copy className="h-4 w-4" /> Copy CSS
        </button>
      </div>

      <pre className="mt-4 overflow-auto rounded-xl border border-border bg-muted p-4 font-mono text-xs">background: {css};</pre>
    </div>
  );
}
