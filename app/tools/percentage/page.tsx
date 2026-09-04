"use client";

import { useState } from "react";

const fmt = (n: number) => n.toLocaleString(undefined, { maximumFractionDigits: 4 });

export default function PercentagePage() {
  const [a, setA] = useState("25");
  const [b, setB] = useState("200");
  const [c, setC] = useState("50");
  const [d, setD] = useState("400");
  const [oldV, setOldV] = useState("80");
  const [newV, setNewV] = useState("100");

  const na = Number(a), nb = Number(b), nc = Number(c), nd = Number(d), no = Number(oldV), nn = Number(newV);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Percentage Calculator</h1>
      <p className="mt-2 text-muted-foreground">Three everyday percentage calculations in one place.</p>

      <div className="mt-6 space-y-4">
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="font-semibold">What is X% of Y?</h3>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
            <input type="number" value={a} onChange={(e) => setA(e.target.value)} className="w-24 rounded-md border border-input bg-background p-2 font-mono text-sm outline-none" />
            <span>% of</span>
            <input type="number" value={b} onChange={(e) => setB(e.target.value)} className="w-24 rounded-md border border-input bg-background p-2 font-mono text-sm outline-none" />
            <span>=</span>
            <span className="rounded-md bg-primary/10 px-3 py-2 font-mono font-bold text-primary">
              {Number.isFinite(na) && Number.isFinite(nb) ? fmt((na / 100) * nb) : "—"}
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="font-semibold">X is what % of Y?</h3>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
            <input type="number" value={c} onChange={(e) => setC(e.target.value)} className="w-24 rounded-md border border-input bg-background p-2 font-mono text-sm outline-none" />
            <span>is what % of</span>
            <input type="number" value={d} onChange={(e) => setD(e.target.value)} className="w-24 rounded-md border border-input bg-background p-2 font-mono text-sm outline-none" />
            <span>=</span>
            <span className="rounded-md bg-primary/10 px-3 py-2 font-mono font-bold text-primary">
              {Number.isFinite(nc) && Number.isFinite(nd) && nd !== 0 ? fmt((nc / nd) * 100) + "%" : "—"}
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="font-semibold">% change (old → new)</h3>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
            <input type="number" value={oldV} onChange={(e) => setOldV(e.target.value)} className="w-24 rounded-md border border-input bg-background p-2 font-mono text-sm outline-none" />
            <span>→</span>
            <input type="number" value={newV} onChange={(e) => setNewV(e.target.value)} className="w-24 rounded-md border border-input bg-background p-2 font-mono text-sm outline-none" />
            <span>=</span>
            {Number.isFinite(no) && Number.isFinite(nn) && no !== 0 && (
              <span className={`rounded-md px-3 py-2 font-mono font-bold ${nn >= no ? "bg-green-500/10 text-green-600 dark:text-green-400" : "bg-red-500/10 text-red-600 dark:text-red-400"}`}>
                {nn >= no ? "+" : ""}{fmt(((nn - no) / Math.abs(no)) * 100)}%
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
