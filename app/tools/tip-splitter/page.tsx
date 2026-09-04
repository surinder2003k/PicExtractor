"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Copy } from "lucide-react";

export default function TipSplitterPage() {
  const [bill, setBill] = useState("");
  const [tip, setTip] = useState(10);
  const [people, setPeople] = useState(2);
  const [roundUp, setRoundUp] = useState(false);

  const b = Number(bill);
  const valid = Number.isFinite(b) && b > 0 && people >= 1;
  const tipAmt = valid ? (b * tip) / 100 : 0;
  const total = valid ? b + tipAmt : 0;
  let per = valid ? total / people : 0;
  if (roundUp && per > 0) per = Math.ceil(per);
  const grandTotal = roundUp ? per * people : total;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Tip Splitter</h1>
      <p className="mt-2 text-muted-foreground">Restaurant bills, team lunches — tip calculate karo aur evenly baanto.</p>

      <div className="mt-6 rounded-xl border border-border bg-card p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs text-muted-foreground">Bill amount (₹)</label>
            <input type="number" min="0" value={bill} onChange={(e) => setBill(e.target.value)} placeholder="2400" className="w-full rounded-md border border-input bg-background p-3 font-mono text-sm outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="mb-1 block text-xs text-muted-foreground">People</label>
            <input type="number" min="1" value={people} onChange={(e) => setPeople(Math.max(1, Number(e.target.value) || 1))} className="w-full rounded-md border border-input bg-background p-3 font-mono text-sm outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div className="flex items-end">
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input type="checkbox" checked={roundUp} onChange={(e) => setRoundUp(e.target.checked)} className="accent-primary" />
              Round up per person
            </label>
          </div>
        </div>

        <div className="mt-5">
          <label className="mb-2 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Tip</span>
            <strong>{tip}%</strong>
          </label>
          <div className="flex flex-wrap gap-2">
            {[5, 10, 15, 20].map((p) => (
              <button key={p} type="button" onClick={() => setTip(p)} className={`rounded-md border px-4 py-1.5 text-sm transition-colors ${tip === p ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-secondary"}`}>
                {p}%
              </button>
            ))}
          </div>
        </div>

        {valid && (
          <div className="mt-6 grid grid-cols-2 gap-3 text-center sm:grid-cols-4">
            <div className="rounded-lg border border-border bg-muted p-4">
              <p className="text-xs text-muted-foreground">Tip</p>
              <p className="mt-1 text-lg font-bold">₹{tipAmt.toFixed(2)}</p>
            </div>
            <div className="rounded-lg border border-border bg-muted p-4">
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="mt-1 text-lg font-bold">₹{total.toFixed(2)}</p>
            </div>
            <div className="rounded-lg border border-primary/50 bg-primary/10 p-4">
              <p className="text-xs text-muted-foreground">Per person</p>
              <p className="mt-1 text-xl font-bold text-primary">₹{per.toFixed(2)}</p>
            </div>
            <div className="rounded-lg border border-border bg-muted p-4">
              <p className="text-xs text-muted-foreground">Grand total</p>
              <p className="mt-1 text-lg font-bold">₹{grandTotal.toFixed(2)}</p>
            </div>
            <button
              type="button"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(`Bill ₹${b.toFixed(2)} + ${tip}% tip = ₹${total.toFixed(2)} | ${people} people → ₹${per.toFixed(2)} each`);
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
