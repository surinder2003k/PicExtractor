"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Copy } from "lucide-react";

export default function DateMathPage() {
  const [base, setBase] = useState(new Date().toISOString().slice(0, 10));
  const [amount, setAmount] = useState("30");
  const [unit, setUnit] = useState<"days" | "weeks" | "months" | "years">("days");
  const [dir, setDir] = useState<"add" | "sub">("add");

  const compute = (): Date | null => {
    const n = Number(amount);
    if (!Number.isFinite(n) || !base) return null;
    const d = new Date(base + "T00:00:00");
    if (Number.isNaN(d.getTime())) return null;
    const sign = dir === "add" ? 1 : -1;
    if (unit === "days") d.setDate(d.getDate() + sign * n);
    else if (unit === "weeks") d.setDate(d.getDate() + sign * n * 7);
    else if (unit === "months") d.setMonth(d.getMonth() + sign * n);
    else d.setFullYear(d.getFullYear() + sign * n);
    return d;
  };

  const result = compute();
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Date Add / Subtract</h1>
      <p className="mt-2 text-muted-foreground">Deadline hote hain — &ldquo;30 days from today&rdquo; type questions ka instant jawab.</p>

      <div className="mt-6 rounded-xl border border-border bg-card p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs text-muted-foreground">Start date</label>
            <input type="date" value={base} onChange={(e) => setBase(e.target.value)} className="w-full rounded-md border border-input bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="mb-1 block text-xs text-muted-foreground">Amount</label>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full rounded-md border border-input bg-background p-3 font-mono text-sm outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="mb-1 block text-xs text-muted-foreground">Unit</label>
            <select value={unit} onChange={(e) => setUnit(e.target.value as typeof unit)} className="w-full rounded-md border border-border bg-background p-2.5 text-sm outline-none">
              <option value="days">Days</option>
              <option value="weeks">Weeks</option>
              <option value="months">Months</option>
              <option value="years">Years</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs text-muted-foreground">Direction</label>
            <div className="flex gap-2">
              <button type="button" onClick={() => setDir("add")} className={`flex-1 rounded-md border px-4 py-2 text-sm transition-colors ${dir === "add" ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-secondary"}`}>
                Add (+)
              </button>
              <button type="button" onClick={() => setDir("sub")} className={`flex-1 rounded-md border px-4 py-2 text-sm transition-colors ${dir === "sub" ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-secondary"}`}>
                Subtract (−)
              </button>
            </div>
          </div>
        </div>

        {result && (
          <div className="mt-6 rounded-lg border border-primary/50 bg-primary/10 p-5 text-center">
            <p className="text-xs text-muted-foreground">
              {base} {dir === "add" ? "+" : "−"} {amount} {unit}
            </p>
            <p className="mt-1 text-2xl font-bold text-primary">{fmt(result)}</p>
            <button
              type="button"
              onClick={async () => {
                try { await navigator.clipboard.writeText(result.toISOString().slice(0, 10)); toast.success("Date copied (YYYY-MM-DD)."); }
                catch { toast.error("Could not copy."); }
              }}
              className="mt-3 inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs transition-colors hover:bg-secondary"
            >
              <Copy className="h-3.5 w-3.5" /> Copy date
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
