"use client";

import { useState } from "react";

const BASES: [string, number][] = [
  ["Binary (2)", 2],
  ["Octal (8)", 8],
  ["Decimal (10)", 10],
  ["Hexadecimal (16)", 16],
];

export default function NumberBasePage() {
  const [value, setValue] = useState("255");

  const parsed = parseInt(value.replace(/^0[xob]/i, ""), 16) || 0;
  const isValid = /^[0-9a-f]+$/i.test(value) && !Number.isNaN(parsed);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Number Base Converter</h1>
      <p className="mt-2 text-muted-foreground">Binary, octal, decimal, hex — all at once. Great for debugging.</p>

      <div className="mt-6 rounded-xl border border-border bg-card p-6">
        <label className="mb-1 block text-xs text-muted-foreground">Enter any value (auto-detected, hex-safe)</label>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          spellCheck={false}
          className="w-full rounded-md border border-input bg-background p-3 font-mono text-sm outline-none focus:ring-2 focus:ring-ring"
        />

        {!isValid && <p className="mt-3 text-sm text-destructive">Enter a valid number (0-9, a-f).</p>}

        <div className="mt-6 space-y-2">
          {BASES.map(([label, base]) => (
            <div key={base} className="flex items-center justify-between rounded-lg border border-border bg-muted px-4 py-3">
              <span className="text-sm text-muted-foreground">{label}</span>
              <span className="font-mono text-sm font-semibold break-all">
                {isValid
                  ? base === 16
                    ? "0x" + parsed.toString(16).toUpperCase()
                    : base === 2
                      ? "0b" + parsed.toString(2)
                      : base === 8
                        ? "0o" + parsed.toString(8)
                        : parsed.toString(10)
                  : "—"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
