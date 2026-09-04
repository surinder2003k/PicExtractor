"use client";

import { useState } from "react";

export default function RandomizerPage() {
  const [min, setMin] = useState("1");
  const [max, setMax] = useState("100");
  const [num, setNum] = useState<number | null>(null);
  const [coin, setCoin] = useState<string | null>(null);
  const [dice, setDice] = useState<number | null>(null);

  const roll = () => {
    const lo = Math.ceil(Number(min)), hi = Math.floor(Number(max));
    if (!Number.isFinite(lo) || !Number.isFinite(hi) || lo > hi) return;
    setNum(Math.floor(Math.random() * (hi - lo + 1)) + lo);
    setCoin(Math.random() < 0.5 ? "🪙 Heads" : "🪙 Tails");
    setDice(1 + Math.floor(Math.random() * 6));
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Randomizer</h1>
      <p className="mt-2 text-muted-foreground">Lucky draw numbers, coin flips, and dice rolls — decisions made easy.</p>

      <div className="mt-6 rounded-xl border border-border bg-card p-6">
        <div className="flex flex-wrap items-end gap-3">
          <div className="w-28">
            <label className="mb-1 block text-xs text-muted-foreground">Min</label>
            <input type="number" value={min} onChange={(e) => setMin(e.target.value)} className="w-full rounded-md border border-input bg-background p-3 font-mono text-sm outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div className="w-28">
            <label className="mb-1 block text-xs text-muted-foreground">Max</label>
            <input type="number" value={max} onChange={(e) => setMax(e.target.value)} className="w-full rounded-md border border-input bg-background p-3 font-mono text-sm outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <button
            type="button"
            onClick={roll}
            className="rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            🎲 Roll all
          </button>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-border bg-muted p-5 text-center">
            <p className="text-xs text-muted-foreground">Lucky number</p>
            <p className="mt-1 text-4xl font-bold">{num ?? "—"}</p>
          </div>
          <div className="rounded-lg border border-border bg-muted p-5 text-center">
            <p className="text-xs text-muted-foreground">Coin flip</p>
            <p className="mt-1 text-2xl font-bold">{coin ?? "—"}</p>
          </div>
          <div className="rounded-lg border border-border bg-muted p-5 text-center">
            <p className="text-xs text-muted-foreground">Dice</p>
            <p className="mt-1 text-4xl font-bold">{dice ?? "—"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
