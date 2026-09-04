"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ArrowDownUp, Copy } from "lucide-react";

type Rates = { rates: Record<string, number>; time_last_update_utc: string };

const POPULAR = ["USD", "EUR", "GBP", "INR", "JPY", "AUD", "CAD", "CNY", "AED", "SGD"];

export default function CurrencyPage() {
  const [data, setData] = useState<Rates | null>(null);
  const [error, setError] = useState("");
  const [amount, setAmount] = useState("100");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("INR");

  useEffect(() => {
    fetch("https://open.er-api.com/v6/latest/USD")
      .then((r) => r.json())
      .then((j) => {
        if (j && j.result === "success") setData({ rates: j.rates, time_last_update_utc: j.time_last_update_utc });
        else setError("Could not load rates.");
      })
      .catch(() => setError("Could not load rates (network)."));
  }, []);

  const codes = data ? Object.keys(data.rates).sort() : POPULAR;
  const value = Number(amount);
  const result =
    data && from && to && data.rates[from] && data.rates[to] && Number.isFinite(value)
      ? (value / data.rates[from]) * data.rates[to]
      : null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Currency Converter</h1>
      <p className="mt-2 text-muted-foreground">Live exchange rates. Free API, no key — runs in your browser.</p>

      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
      {!data && !error && <p className="mt-4 text-sm text-muted-foreground">Loading live rates…</p>}

      {data && (
        <div className="mt-6 rounded-xl border border-border bg-card p-6">
          <div className="flex flex-wrap items-end gap-3">
            <div className="min-w-32 flex-1">
              <label className="mb-1 block text-xs text-muted-foreground">Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full rounded-md border border-input bg-background p-3 font-mono text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="min-w-28">
              <label className="mb-1 block text-xs text-muted-foreground">From</label>
              <select value={from} onChange={(e) => setFrom(e.target.value)} className="w-full rounded-md border border-border bg-background p-3 text-sm outline-none">
                {codes.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <button
              type="button"
              onClick={() => {
                const f = from;
                setFrom(to);
                setTo(f);
              }}
              title="Swap currencies"
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-border transition-colors hover:bg-secondary"
            >
              <ArrowDownUp className="h-4 w-4" />
            </button>
            <div className="min-w-28">
              <label className="mb-1 block text-xs text-muted-foreground">To</label>
              <select value={to} onChange={(e) => setTo(e.target.value)} className="w-full rounded-md border border-border bg-background p-3 text-sm outline-none">
                {codes.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {result !== null && (
            <div className="mt-6 rounded-lg border border-border bg-muted p-5 text-center">
              <p className="text-3xl font-bold">
                {value.toLocaleString()} {from} = {result.toLocaleString(undefined, { maximumFractionDigits: 2 })} {to}
              </p>
              <div className="mt-2 flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(`${value} ${from} = ${result.toFixed(2)} ${to}`);
                      toast.success("Copied.");
                    } catch {
                      toast.error("Could not copy.");
                    }
                  }}
                  className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-0.5 text-xs transition-colors hover:bg-secondary"
                >
                  <Copy className="h-3 w-3" /> Copy
                </button>
                <span className="text-xs text-muted-foreground">Rates updated: {data.time_last_update_utc}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
