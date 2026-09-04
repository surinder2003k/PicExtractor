"use client";

import { useState } from "react";

export default function DiscountPage() {
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [extra, setExtra] = useState("0");

  const p = Number(price) || 0;
  const d = Math.min(100, Math.max(0, Number(discount) || 0));
  const e = Math.min(100, Math.max(0, Number(extra) || 0));

  const afterFirst = p * (1 - d / 100);
  const final = afterFirst * (1 - e / 100);
  const saved = p - final;
  const effective = p > 0 ? ((saved / p) * 100).toFixed(1) : "0";

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Discount Calculator</h1>
      <p className="mt-2 text-muted-foreground">Stacked sales (flat 30% + coupon 10%) — know the real final price.</p>

      <div className="mt-6 rounded-xl border border-border bg-card p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs text-muted-foreground">Original price (₹)</label>
            <input type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="2999" className="w-full rounded-md border border-input bg-background p-3 font-mono text-sm outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="mb-1 block text-xs text-muted-foreground">Discount %</label>
            <input type="number" min="0" max="100" value={discount} onChange={(e) => setDiscount(e.target.value)} placeholder="30" className="w-full rounded-md border border-input bg-background p-3 font-mono text-sm outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="mb-1 block text-xs text-muted-foreground">Extra coupon % (optional)</label>
            <input type="number" min="0" max="100" value={extra} onChange={(e) => setExtra(e.target.value)} placeholder="10" className="w-full rounded-md border border-input bg-background p-3 font-mono text-sm outline-none focus:ring-2 focus:ring-ring" />
          </div>
        </div>

        {p > 0 && d > 0 && (
          <div className="mt-6 grid grid-cols-2 gap-3 text-center sm:grid-cols-4">
            <div className="rounded-lg border border-border bg-muted p-4">
              <p className="text-xs text-muted-foreground">After {d}%</p>
              <p className="mt-1 text-lg font-bold">₹{afterFirst.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
            </div>
            <div className="rounded-lg border border-border bg-muted p-4">
              <p className="text-xs text-muted-foreground">You save</p>
              <p className="mt-1 text-lg font-bold text-primary">₹{Math.round(saved).toLocaleString()}</p>
            </div>
            <div className="rounded-lg border border-border bg-muted p-4">
              <p className="text-xs text-muted-foreground">Effective off</p>
              <p className="mt-1 text-lg font-bold">{effective}%</p>
            </div>
            <div className="rounded-lg border border-primary/50 bg-primary/10 p-4">
              <p className="text-xs text-muted-foreground">Final price</p>
              <p className="mt-1 text-xl font-bold text-primary">₹{final.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
