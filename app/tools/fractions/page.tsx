"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Copy } from "lucide-react";

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

type Frac = { n: number; d: number };

function parseFrac(s: string): Frac | null {
  const t = s.trim();
  let m = t.match(/^(-?\d+)\s+(\d+)\/(\d+)$/); // mixed: 1 1/2
  if (m) {
    const whole = Number(m[1]), n = Number(m[2]), d = Number(m[3]);
    if (!d) return null;
    const sign = whole < 0 ? -1 : 1;
    return { n: sign * (Math.abs(whole) * d + n), d };
  }
  m = t.match(/^(-?\d+)\/(\d+)$/); // simple: 3/4
  if (m) {
    if (!Number(m[2])) return null;
    return { n: Number(m[1]), d: Number(m[2]) };
  }
  m = t.match(/^-?\d+(\.\d+)?$/); // decimal
  if (m) {
    const v = Number(t);
    let d = 1, n = v;
    while (!Number.isInteger(n) && d < 1e6) { n *= 10; d *= 10; }
    return Number.isInteger(n) ? { n, d } : null;
  }
  return null;
}

function simplify(f: Frac): Frac {
  const g = gcd(Math.abs(f.n), Math.abs(f.d)) || 1;
  return { n: f.n / g, d: f.d / g };
}

function toMixed(f: Frac): string {
  const whole = Math.trunc(f.n / f.d);
  const rem = Math.abs(f.n % f.d);
  if (rem === 0) return String(whole);
  const s = `${rem}/${Math.abs(f.d)}`;
  return whole === 0 ? `${f.n}/${f.d}` : `${whole} ${s}`;
}

export default function FractionsPage() {
  const [a, setA] = useState("1/2");
  const [b, setB] = useState("3/4");
  const [op, setOp] = useState<"+" | "-" | "×" | "÷">("+");

  const fa = parseFrac(a), fb = parseFrac(b);
  let result: Frac | null = null;
  if (fa && fb) {
    let r: Frac | null = null;
    if (op === "+") r = { n: fa.n * fb.d + fb.n * fa.d, d: fa.d * fb.d };
    else if (op === "-") r = { n: fa.n * fb.d - fb.n * fa.d, d: fa.d * fb.d };
    else if (op === "×") r = { n: fa.n * fb.n, d: fa.d * fb.d };
    else if (fb.n !== 0) r = { n: fa.n * fb.d, d: fa.d * fb.n };
    if (r && r.d !== 0) result = simplify(r);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Fraction Calculator</h1>
      <p className="mt-2 text-muted-foreground">1/2 + 3/4, mixed numbers, decimals — recipe and homework math.</p>

      <div className="mt-6 rounded-xl border border-border bg-card p-6">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <input value={a} onChange={(e) => setA(e.target.value)} className="w-28 rounded-md border border-input bg-background p-3 text-center font-mono text-sm outline-none" placeholder="1/2" />
          <div className="grid grid-cols-2 gap-1">
            {(["+", "-", "×", "÷"] as const).map((o) => (
              <button key={o} type="button" onClick={() => setOp(o)} className={`h-9 w-9 rounded-md border text-sm transition-colors ${op === o ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-secondary"}`}>
                {o}
              </button>
            ))}
          </div>
          <input value={b} onChange={(e) => setB(e.target.value)} className="w-28 rounded-md border border-input bg-background p-3 text-center font-mono text-sm outline-none" placeholder="3/4" />
          <span className="font-mono text-2xl">=</span>
          <span className="min-w-24 rounded-lg border border-primary/50 bg-primary/10 p-3 text-center font-mono text-lg font-bold text-primary">
            {result ? `${result.n}/${result.d}` : "—"}
          </span>
        </div>

        {result && (
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm text-muted-foreground">
            <span>Mixed: <strong className="text-foreground">{toMixed(result)}</strong></span>
            <span>·</span>
            <span>Decimal: <strong className="text-foreground">{(result.n / result.d).toFixed(4).replace(/\.?0+$/, "")}</strong></span>
            <button
              type="button"
              onClick={async () => {
                try { await navigator.clipboard.writeText(`${a} ${op} ${b} = ${result!.n}/${result!.d} (${toMixed(result!)})`); toast.success("Copied."); }
                catch { toast.error("Could not copy."); }
              }}
              className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs transition-colors hover:bg-secondary"
            >
              <Copy className="h-3.5 w-3.5" /> Copy
            </button>
          </div>
        )}
        {(!fa || !fb) && (a || b) && (
          <p className="mt-4 text-center text-xs text-destructive">Use formats like 3/4, 1 1/2, or 0.75 (no zero denominators).</p>
        )}
      </div>
    </div>
  );
}
