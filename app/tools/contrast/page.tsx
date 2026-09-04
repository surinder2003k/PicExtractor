"use client";

import { useState } from "react";
import { toast } from "sonner";

function luminance(hex: string): number {
  const m = hex.replace("#", "");
  const full = m.length === 3 ? m.split("").map((c) => c + c).join("") : m;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return -1;
  const [r, g, b] = [0, 2, 4].map((i) => {
    let c = parseInt(full.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
  const l1 = luminance(a), l2 = luminance(b);
  if (l1 < 0 || l2 < 0) return 0;
  const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}

export default function ContrastPage() {
  const [fg, setFg] = useState("#1e293b");
  const [bg, setBg] = useState("#f8fafc");

  const ratio = contrast(fg, bg);
  const grade = (min: number) =>
    ratio === 0 ? "—" : ratio >= min ? "✅ Pass" : "❌ Fail";

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Color Contrast Checker</h1>
      <p className="mt-2 text-muted-foreground">WCAG accessibility check for text/background pairs — for a11y-compliant designs.</p>

      <div className="mt-6 flex flex-wrap gap-4">
        <label className="flex items-center gap-2 text-sm">
          <input type="color" value={fg} onChange={(e) => setFg(e.target.value)} className="h-11 w-14 cursor-pointer rounded-lg border border-border" />
          <span>Text: <code className="font-mono text-xs">{fg}</code></span>
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="h-11 w-14 cursor-pointer rounded-lg border border-border" />
          <span>Background: <code className="font-mono text-xs">{bg}</code></span>
        </label>
      </div>

      <div
        className="mt-6 flex h-44 flex-col items-center justify-center gap-2 rounded-xl border border-border p-6 text-center"
        style={{ background: bg, color: fg }}
      >
        <p className="text-3xl font-bold">Sample heading text</p>
        <p className="text-sm">This is normal body copy at 14px.</p>
      </div>

      <div className="mt-4 rounded-xl border border-border bg-card p-6">
        <p className="text-center font-mono text-4xl font-bold">
          {ratio ? ratio.toFixed(2) : "—"}
          <span className="ml-2 text-sm font-normal text-muted-foreground">: 1</span>
        </p>
        <table className="mt-4 w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="py-2">WCAG level</th>
              <th className="py-2">Requires</th>
              <th className="py-2">Normal text</th>
              <th className="py-2">Large text</th>
            </tr>
          </thead>
          <tbody className="font-mono">
            <tr className="border-b border-border/50">
              <td className="py-2">AA</td><td className="py-2 font-sans">4.5 / 3.0</td>
              <td>{grade(4.5)}</td><td>{grade(3)}</td>
            </tr>
            <tr>
              <td className="py-2">AAA</td><td className="py-2 font-sans">7.0 / 4.5</td>
              <td>{grade(7)}</td><td>{grade(4.5)}</td>
            </tr>
          </tbody>
        </table>
        <button
          type="button"
          onClick={async () => {
            try { await navigator.clipboard.writeText(`${fg} on ${bg} — contrast ${ratio.toFixed(2)}:1`); toast.success("Copied."); }
            catch { toast.error("Could not copy."); }
          }}
          className="mt-4 w-full rounded-md border border-border px-4 py-2 text-sm transition-colors hover:bg-secondary"
        >
          Copy result
        </button>
      </div>
    </div>
  );
}
