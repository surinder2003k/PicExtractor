"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Copy } from "lucide-react";

export default function InterestPage() {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("12");
  const [years, setYears] = useState("5");
  const [freq, setFreq] = useState(1);
  const [monthly, setMonthly] = useState("0");

  const p = Number(principal) || 0;
  const r = (Number(rate) || 0) / 100;
  const t = Number(years) || 0;
  const m = Number(monthly) || 0;

  // compound growth of lump sum
  const lumpFV = p * Math.pow(1 + r / freq, freq * t);
  // future value of monthly SIP (approx with monthly compounding at same rate)
  const monthlyRate = Math.pow(1 + r, 1 / 12) - 1;
  const nMonths = t * 12;
  const sipFV = m > 0 && monthlyRate > 0 ? m * ((Math.pow(1 + monthlyRate, nMonths) - 1) / monthlyRate) : m * nMonths;
  const total = lumpFV + sipFV;
  const invested = p + m * nMonths;
  const gain = total - invested;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Compound Interest Calculator</h1>
      <p className="mt-2 text-muted-foreground">Lump sum + monthly savings — see what compounding really does.</p>

      <div className="mt-6 rounded-xl border border-border bg-card p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs text-muted-foreground">Lump sum (₹)</label>
            <input type="number" min="0" value={principal} onChange={(e) => setPrincipal(e.target.value)} placeholder="100000" className="w-full rounded-md border border-input bg-background p-3 font-mono text-sm outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="mb-1 block text-xs text-muted-foreground">Monthly savings (₹)</label>
            <input type="number" min="0" value={monthly} onChange={(e) => setMonthly(e.target.value)} placeholder="5000" className="w-full rounded-md border border-input bg-background p-3 font-mono text-sm outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="mb-1 block text-xs text-muted-foreground">Annual return (%)</label>
            <input type="number" min="0" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} className="w-full rounded-md border border-input bg-background p-3 font-mono text-sm outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="mb-1 block text-xs text-muted-foreground">Years</label>
            <input type="number" min="0" value={years} onChange={(e) => setYears(e.target.value)} className="w-full rounded-md border border-input bg-background p-3 font-mono text-sm outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs text-muted-foreground">Compounding frequency</label>
            <select value={freq} onChange={(e) => setFreq(Number(e.target.value))} className="w-full rounded-md border border-border bg-background p-2.5 text-sm outline-none">
              <option value={1}>Yearly</option>
              <option value={2}>Half-yearly</option>
              <option value={4}>Quarterly</option>
              <option value={12}>Monthly</option>
            </select>
          </div>
        </div>

        {t > 0 && (
          <div className="mt-6 grid grid-cols-2 gap-3 text-center sm:grid-cols-4">
            <div className="rounded-lg border border-border bg-muted p-4">
              <p className="text-xs text-muted-foreground">Invested</p>
              <p className="mt-1 text-lg font-bold">₹{Math.round(invested).toLocaleString()}</p>
            </div>
            <div className="rounded-lg border border-border bg-muted p-4">
              <p className="text-xs text-muted-foreground">Interest earned</p>
              <p className="mt-1 text-lg font-bold text-primary">₹{Math.round(gain).toLocaleString()}</p>
            </div>
            <div className="col-span-2 rounded-lg border border-primary/50 bg-primary/10 p-4">
              <p className="text-xs text-muted-foreground">Final value</p>
              <p className="mt-1 text-2xl font-bold text-primary">₹{Math.round(total).toLocaleString()}</p>
            </div>
            <button
              type="button"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(`Invested ₹${Math.round(invested).toLocaleString()} → ₹${Math.round(total).toLocaleString()} in ${t}y (${(rate)}% p.a., interest ₹${Math.round(gain).toLocaleString()})`);
                  toast.success("Summary copied.");
                } catch { toast.error("Could not copy."); }
              }}
              className="col-span-2 inline-flex items-center justify-center gap-2 rounded-md border border-border px-4 py-2 text-sm transition-colors hover:bg-secondary sm:col-span-4"
            >
              <Copy className="h-4 w-4" /> Copy summary
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
