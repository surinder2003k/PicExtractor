"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

const KEY = "savings-goal";

export default function SavingsPage() {
  const [target, setTarget] = useState("");
  const [saved, setSaved] = useState("");
  const [monthly, setMonthly] = useState("");
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = JSON.parse(localStorage.getItem(KEY) || "{}");
      setTarget(raw.target ?? "");
      setSaved(raw.saved ?? "");
      setMonthly(raw.monthly ?? "");
      setHistory(raw.history ?? []);
    } catch { /* ignore */ }
  }, []);
  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify({ target, saved, monthly, history }));
  }, [target, saved, monthly, history]);

  const t = Number(target) || 0;
  const s = Number(saved) || 0;
  const m = Number(monthly) || 0;
  const pct = t > 0 ? Math.min(100, (s / t) * 100) : 0;
  const remaining = Math.max(0, t - s);
  const months = m > 0 ? Math.ceil(remaining / m) : null;
  const eta = months !== null ? new Date(Date.now() + months * 30.44 * 864e5) : null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Savings Goal Tracker</h1>
      <p className="mt-2 text-muted-foreground">Laptop, trip, emergency fund — see exactly when you&apos;ll hit your target.</p>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-xs text-muted-foreground">Goal (₹)</label>
          <input type="number" min="0" value={target} onChange={(e) => setTarget(e.target.value)} className="w-full rounded-md border border-input bg-background p-3 font-mono text-sm outline-none" />
        </div>
        <div>
          <label className="mb-1 block text-xs text-muted-foreground">Saved so far (₹)</label>
          <input type="number" min="0" value={saved} onChange={(e) => setSaved(e.target.value)} className="w-full rounded-md border border-input bg-background p-3 font-mono text-sm outline-none" />
        </div>
        <div>
          <label className="mb-1 block text-xs text-muted-foreground">Monthly saving (₹)</label>
          <input type="number" min="0" value={monthly} onChange={(e) => setMonthly(e.target.value)} className="w-full rounded-md border border-input bg-background p-3 font-mono text-sm outline-none" />
        </div>
      </div>

      {t > 0 && (
        <div className="mt-6 rounded-xl border border-border bg-card p-6">
          <div className="flex justify-between text-sm">
            <span className="font-mono">₹{s.toLocaleString()}</span>
            <span className="font-mono text-muted-foreground">₹{t.toLocaleString()}</span>
          </div>
          <div className="mt-2 h-4 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-gradient-to-r from-primary to-emerald-500 transition-all duration-500" style={{ width: `${pct}%` }} />
          </div>
          <p className="mt-2 text-center text-2xl font-bold text-primary">{pct.toFixed(1)}%</p>

          {s >= t ? (
            <p className="mt-2 text-center text-sm font-semibold text-emerald-500">🎉 Goal achieved! Time to set a bigger one.</p>
          ) : months !== null ? (
            <div className="mt-3 grid grid-cols-2 gap-3 text-center">
              <div className="rounded-lg border border-border bg-muted p-3">
                <p className="text-xs text-muted-foreground">Remaining</p>
                <p className="mt-0.5 font-bold">₹{remaining.toLocaleString()}</p>
              </div>
              <div className="rounded-lg border border-border bg-muted p-3">
                <p className="text-xs text-muted-foreground">ETA at ₹{m.toLocaleString()}/mo</p>
                <p className="mt-0.5 font-bold">{months} mo{eta ? ` · ${eta.toLocaleDateString("en-IN", { month: "short", year: "numeric" })}` : ""}</p>
              </div>
            </div>
          ) : (
            <p className="mt-3 text-center text-xs text-muted-foreground">Add a monthly saving amount to see your ETA.</p>
          )}
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => {
            if (!m) { toast.error("Set a monthly amount first."); return; }
            const stamp = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short" });
            const next = saved ? String(Number(saved) + m) : String(m);
            setSaved(next);
            setHistory([`${stamp}: +₹${m.toLocaleString()} → ₹{${Number(next).toLocaleString()}}`.replace("{", "").replace("}", ""), ...history].slice(0, 12));
            toast.success("Deposit logged.");
          }}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          + Log this month&apos;s deposit
        </button>
        <button type="button" onClick={() => setHistory([])} className="rounded-md border border-border px-4 py-2 text-sm transition-colors hover:bg-secondary">Clear history</button>
      </div>

      {history.length > 0 && (
        <ul className="mt-3 space-y-1 rounded-xl border border-border bg-card p-4 text-xs text-muted-foreground">
          {history.map((h, i) => <li key={i}>{h}</li>)}
        </ul>
      )}
    </div>
  );
}
