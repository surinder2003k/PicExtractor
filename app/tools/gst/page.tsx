"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Copy } from "lucide-react";

export default function GstPage() {
  const [amount, setAmount] = useState("1000");
  const [rate, setRate] = useState(18);
  const [inclusive, setInclusive] = useState(false);

  const base = Number(amount);
  const valid = Number.isFinite(base) && base >= 0;

  const net = inclusive ? base / (1 + rate / 100) : base;
  const gst = inclusive ? base - net : (base * rate) / 100;
  const total = net + gst;

  const fmt = (n: number) => n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const rows: [string, number][] = valid
    ? inclusive
      ? [["Amount (incl. GST)", base], ["Base value", net], [`GST @ ${rate}%`, gst], ["Total", base]]
      : [["Base value", base], [`GST @ ${rate}%`, gst], ["Total (incl. GST)", total]]
    : [];

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">GST Calculator</h1>
      <p className="mt-2 text-muted-foreground">Add or remove GST from any amount — invoices made easy.</p>

      <div className="mt-6 rounded-xl border border-border bg-card p-6">
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-40 flex-1">
            <label className="mb-1 block text-xs text-muted-foreground">Amount (₹)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full rounded-md border border-input bg-background p-3 font-mono text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-muted-foreground">GST rate</label>
            <select
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="rounded-md border border-border bg-background p-3 text-sm outline-none"
            >
              {[0, 5, 12, 18, 28].map((r) => <option key={r} value={r}>{r}%</option>)}
            </select>
          </div>
          <label className="flex items-center gap-2 pb-3 text-sm text-muted-foreground">
            <input type="checkbox" checked={inclusive} onChange={(e) => setInclusive(e.target.checked)} className="h-4 w-4 accent-primary" />
            Amount includes GST
          </label>
        </div>

        {valid && (
          <div className="mt-6 space-y-2">
            {rows.map(([label, val], i) => (
              <div
                key={label}
                className={`flex items-center justify-between rounded-lg px-4 py-3 ${i === rows.length - 1 ? "border border-primary/40 bg-primary/10" : "bg-muted"}`}
              >
                <span className="text-sm text-muted-foreground">{label}</span>
                <span className="font-mono font-semibold">₹{fmt(val)}</span>
              </div>
            ))}
            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(rows.map(([l, v]) => `${l}: ₹${fmt(v)}`).join("\n"));
                    toast.success("Copied breakdown.");
                  } catch {
                    toast.error("Could not copy.");
                  }
                }}
                className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs transition-colors hover:bg-secondary"
              >
                <Copy className="h-3.5 w-3.5" /> Copy breakdown
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
