"use client";

import { useState } from "react";

const MAP: [number, string][] = [
  [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"], [90, "XC"],
  [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
];

export default function RomanPage() {
  const [mode, setMode] = useState<"toRoman" | "toNumber">("toRoman");
  const [input, setInput] = useState("");

  const output = (() => {
    const v = input.trim();
    if (!v) return "";
    if (mode === "toRoman") {
      let n = parseInt(v, 10);
      if (!Number.isFinite(n) || n < 1 || n > 3999) return "⚠️ Enter 1 – 3999";
      let out = "";
      for (const [val, sym] of MAP) {
        while (n >= val) { out += sym; n -= val; }
      }
      return out;
    }
    const s = v.toUpperCase();
    if (!/^[MDCLXVI]+$/.test(s)) return "⚠️ Invalid Roman numeral";
    const values: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
    let total = 0;
    for (let i = 0; i < s.length; i++) {
      const cur = values[s[i]], next = values[s[i + 1]] ?? 0;
      total += cur < next ? -cur : cur;
    }
    return String(total);
  })();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Roman Numerals</h1>
      <p className="mt-2 text-muted-foreground">Numbers ⇄ Roman numerals — outlines, events, movie credits.</p>

      <div className="mt-6 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => { setMode("toRoman"); setInput(""); }}
          className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${mode === "toRoman" ? "bg-primary text-primary-foreground" : "border-border bg-card hover:bg-secondary"}`}
        >
          Number → Roman
        </button>
        <button
          type="button"
          onClick={() => { setMode("toNumber"); setInput(""); }}
          className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${mode === "toNumber" ? "bg-primary text-primary-foreground" : "border-border bg-card hover:bg-secondary"}`}
        >
          Roman → Number
        </button>
      </div>

      <div className="mt-4 rounded-xl border border-border bg-card p-6">
        <label className="mb-1 block text-xs text-muted-foreground">
          {mode === "toRoman" ? "Number (1 – 3999)" : "Roman numeral (MDCLXVI)"}
        </label>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          spellCheck={false}
          placeholder={mode === "toRoman" ? "2024" : "MMXXIV"}
          className="w-full rounded-md border border-input bg-background p-3 font-mono text-sm outline-none focus:ring-2 focus:ring-ring"
        />
        {output && (
          <div className={`mt-4 rounded-lg border p-5 text-center font-mono text-3xl font-bold ${
            output.startsWith("⚠️") ? "border-destructive/50 text-destructive" : "border-border bg-muted text-primary"
          }`}>
            {output}
          </div>
        )}
      </div>
    </div>
  );
}
