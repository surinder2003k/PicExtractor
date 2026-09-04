"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Copy } from "lucide-react";

function hexToRgb(hex: string): [number, number, number] | null {
  const m = hex.replace("#", "").match(/^(?:[0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (!m) return null;
  const full = hex.replace("#", "").length === 3
    ? hex.replace("#", "").split("").map((c) => c + c).join("")
    : hex.replace("#", "");
  return [parseInt(full.slice(0, 2), 16), parseInt(full.slice(2, 4), 16), parseInt(full.slice(4, 6), 16)];
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0));
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
  }
  return [Math.round(h), Math.round(s * 100), Math.round(l * 100)];
}

export default function ColorPage() {
  const [hex, setHex] = useState("#2563eb");
  const rgb = hexToRgb(hex);
  const hsl = rgb ? rgbToHsl(...rgb) : null;

  const shades = rgb
    ? [0.8, 0.6, 0.4, 0.2, 0, -0.2, -0.4].map((f) => {
        const [r, g, b] = rgb;
        const adj = f >= 0
          ? [r + (255 - r) * f, g + (255 - g) * f, b + (255 - b) * f]
          : [r * (1 + f), g * (1 + f), b * (1 + f)];
        return "#" + adj.map((v) => Math.round(Math.min(255, Math.max(0, v))).toString(16).padStart(2, "0")).join("");
      })
    : [];

  const copy = async (v: string) => {
    try {
      await navigator.clipboard.writeText(v);
      toast.success(`Copied ${v}`);
    } catch {
      toast.error("Could not copy.");
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Color Converter</h1>
      <p className="mt-2 text-muted-foreground">HEX ⇄ RGB ⇄ HSL with tints and shades — for decks, docs, and CSS.</p>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <input
          type="color"
          value={rgb ? hex : "#000000"}
          onChange={(e) => setHex(e.target.value)}
          className="h-16 w-16 cursor-pointer rounded-lg border border-border bg-card"
        />
        <input
          value={hex}
          onChange={(e) => setHex(e.target.value)}
          spellCheck={false}
          className="w-40 rounded-md border border-input bg-background p-3 font-mono text-sm outline-none focus:ring-2 focus:ring-ring"
        />
        {rgb && (
          <button
            type="button"
            onClick={() => copy(`rgb(${rgb.join(", ")})`)}
            className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-2 text-xs transition-colors hover:bg-secondary"
          >
            <Copy className="h-3 w-3" /> rgb({rgb.join(", ")})
          </button>
        )}
        {hsl && (
          <button
            type="button"
            onClick={() => copy(`hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`)}
            className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-2 text-xs transition-colors hover:bg-secondary"
          >
            <Copy className="h-3 w-3" /> hsl({hsl[0]}, {hsl[1]}%, {hsl[2]}%)
          </button>
        )}
      </div>

      {!rgb && hex.trim() && <p className="mt-4 text-sm text-destructive">Invalid hex color.</p>}

      {shades.length > 0 && (
        <div className="mt-8">
          <p className="mb-2 text-xs text-muted-foreground">Tints &amp; shades — click to copy:</p>
          <div className="flex overflow-hidden rounded-xl border border-border">
            {shades.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => copy(s)}
                style={{ backgroundColor: s }}
                className="h-20 flex-1 font-mono text-[10px] text-transparent transition-colors hover:text-white"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
