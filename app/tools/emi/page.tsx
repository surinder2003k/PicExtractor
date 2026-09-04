"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Copy } from "lucide-react";

export default function EmiPage() {
  const [principal, setPrincipal] = useState("1000000");
  const [rate, setRate] = useState("9");
  const [years, setYears] = useState("20");

  const P = Number(principal), R = Number(rate), Y = Number(years);
  const valid = P > 0 && R > 0 && Y > 0;
  const r = R / 12 / 100, n = Y * 12;
  const emi = valid ? (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : null;
  const total = emi ? emi * n : null;

  const fmt = (v: number) => Math.round(v).toLocaleString();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">EMI Calculator</h1>
      <p className="mt-2 text-muted-foreground">Monthly EMI, total interest, and total payment for any loan.</p>

      <div className="mt-6 rounded-xl border border-border bg-card p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs text-muted-foreground">Loan amount (₹)</label>
            <input type="number" value={principal} onChange={(e) => setPrincipal(e.target.value)} className="w-full rounded-md border border-input bg-background p-3 font-mono text-sm outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="mb-1 block text-xs text-muted-foreground">Interest rate (%/yr)</label>
            <input type="number" value={rate} onChange={(e) => setRate(e.target.value)} className="w-full rounded-md border border-input bg-background p-3 font-mono text-sm outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="mb-1 block text-xs text-muted-foreground">Tenure (years)</label>
            <input type="number" value={years} onChange={(e) => setYears(e.target.value)} className="w-full rounded-md border border-input bg-background p-3 font-mono text-sm outline-none focus:ring-2 focus:ring-ring" />
          </div>
        </div>

        {emi !== null && (
          <div className="mt-6 space-y-3">
            <div className="rounded-lg border border-primary/40 bg-primary/10 p-5 text-center">
              <span className="text-xs text-muted-foreground">Monthly EMI</span>
              <p className="text-4xl font-bold">₹{fmt(emi)}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-border bg-muted p-4 text-center">
                <p className="text-xl font-bold">₹{fmt(total! - P)}</p>
                <p className="text-xs text-muted-foreground">Total interest</p>
              </div>
              <div className="rounded-lg border border-border bg-muted p-4 text-center">
                <p className="text-xl font-bold">₹{fmt(total!)}</p>
                <p className="text-xs text-muted-foreground">Total payment</p>
              </div>
            </div>
            <div className="flex justify-center">
              <button
                type="button"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(`EMI: ₹${fmt(emi)} | Interest: ₹${fmt(total! - P)} | Total: ₹${fmt(total!)}`);
                    toast.success("Copied.");
                  } catch {
                    toast.error("Could not copy.");
                  }
                }}
                className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs transition-colors hover:bg-secondary"
              >
                <Copy className="h-3.5 w-3.5" /> Copy summary
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
