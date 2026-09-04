"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Copy, Plus, Trash2 } from "lucide-react";

interface Entry { id: number; in: string; out: string; }

function toMin(t: string): number | null {
  const m = t.match(/^(\d{1,2}):(\d{2})$/);
  if (!m) return null;
  return Number(m[1]) * 60 + Number(m[2]);
}

export default function TimesheetPage() {
  const [entries, setEntries] = useState<Entry[]>([{ id: 1, in: "09:30", out: "18:00" }]);
  const [breakMin, setBreakMin] = useState("45");

  const worked = entries.reduce((sum, e) => {
    const i = toMin(e.in), o = toMin(e.out);
    return sum + (i !== null && o !== null && o > i ? o - i : 0);
  }, 0);
  const net = Math.max(0, worked - (Number(breakMin) || 0));
  const fmt = (m: number) => `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, "0")}m`;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Timesheet Calculator</h1>
      <p className="mt-2 text-muted-foreground">Multiple in/out pairs per day, minus breaks — perfect for daily logs.</p>

      <div className="mt-6 rounded-xl border border-border bg-card p-5">
        {entries.map((e, idx) => (
          <div key={e.id} className="mb-2 flex items-center gap-2">
            <span className="w-20 text-xs text-muted-foreground">Shift {idx + 1}</span>
            <input type="time" value={e.in} onChange={(ev) => setEntries(entries.map((x) => x.id === e.id ? { ...x, in: ev.target.value } : x))} className="rounded-md border border-input bg-background p-2 font-mono text-sm outline-none" />
            <span className="text-muted-foreground">→</span>
            <input type="time" value={e.out} onChange={(ev) => setEntries(entries.map((x) => x.id === e.id ? { ...x, out: ev.target.value } : x))} className="rounded-md border border-input bg-background p-2 font-mono text-sm outline-none" />
            {entries.length > 1 && (
              <button type="button" onClick={() => setEntries(entries.filter((x) => x.id !== e.id))} aria-label="Remove" className="text-muted-foreground hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <button type="button" onClick={() => setEntries([...entries, { id: Date.now(), in: "09:30", out: "18:00" }])} className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs transition-colors hover:bg-secondary">
            <Plus className="h-3.5 w-3.5" /> Add shift
          </button>
          <label className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Break (min)</span>
            <input type="number" min="0" value={breakMin} onChange={(ev) => setBreakMin(ev.target.value)} className="w-20 rounded-md border border-input bg-background p-2 text-center font-mono text-sm outline-none" />
          </label>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-center">
        <div className="rounded-lg border border-border bg-muted p-4">
          <p className="text-xs text-muted-foreground">Gross worked</p>
          <p className="mt-1 text-2xl font-bold">{fmt(worked)}</p>
        </div>
        <div className="rounded-lg border border-primary/50 bg-primary/10 p-4">
          <p className="text-xs text-muted-foreground">Net (after break)</p>
          <p className="mt-1 text-2xl font-bold text-primary">{fmt(net)}</p>
        </div>
        <button
          type="button"
          onClick={async () => { try { await navigator.clipboard.writeText(`Worked: ${fmt(net)} (gross ${fmt(worked)} − ${breakMin}m break)`); toast.success("Copied."); } catch { toast.error("Could not copy."); } }}
          className="col-span-2 inline-flex items-center justify-center gap-2 rounded-md border border-border px-4 py-2 text-sm transition-colors hover:bg-secondary"
        >
          <Copy className="h-4 w-4" /> Copy summary
        </button>
      </div>
    </div>
  );
}
