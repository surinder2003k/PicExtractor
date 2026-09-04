"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function CountdownPage() {
  const [minutes, setMinutes] = useState("10");
  const [remaining, setRemaining] = useState<number | null>(null);
  const [running, setRunning] = useState(false);
  const [deadline, setDeadline] = useState<number | null>(null);

  useEffect(() => {
    if (!running || deadline === null) return;
    const iv = setInterval(() => {
      const left = Math.max(0, Math.round((deadline - Date.now()) / 1000));
      setRemaining(left);
      if (left === 0) {
        setRunning(false);
        toast.success("⏰ Time's up!");
      }
    }, 250);
    return () => clearInterval(iv);
  }, [running, deadline]);

  const start = () => {
    const m = Number(minutes);
    if (!Number.isFinite(m) || m <= 0) return;
    const total = Math.round(m * 60);
    setRemaining(total);
    setDeadline(Date.now() + total * 1000);
    setRunning(true);
  };

  const mm = remaining === null ? "--" : String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = remaining === null ? "--" : String(remaining % 60).padStart(2, "0");
  const totalSec = (Number(minutes) || 0) * 60;
  const pct = remaining === null || totalSec === 0 ? 0 : ((totalSec - remaining) / totalSec) * 100;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Countdown Timer</h1>
      <p className="mt-2 text-muted-foreground">Meetings, pomodoro sprints, chai breaks — set it and forget it.</p>

      <div className="mt-8 rounded-xl border border-border bg-card p-8 text-center">
        <p className="font-mono text-7xl font-bold tabular-nums tracking-tight">
          {mm}<span className="text-muted-foreground">:</span>{ss}
        </p>
        <div className="mx-auto mt-5 h-2 max-w-sm overflow-hidden rounded-full bg-muted">
          <div className="h-full bg-primary transition-all duration-300" style={{ width: `${pct}%` }} />
        </div>

        {!running ? (
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <input type="number" min="1" value={minutes} onChange={(e) => setMinutes(e.target.value)} className="w-24 rounded-md border border-input bg-background p-2.5 text-center font-mono text-sm outline-none" />
            <span className="text-sm text-muted-foreground">minutes</span>
            <button type="button" onClick={start} className="rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90">▶ Start</button>
            {[5, 10, 25].map((m) => (
              <button key={m} type="button" onClick={() => setMinutes(String(m))} className="rounded-md border border-border px-3 py-2 text-xs transition-colors hover:bg-secondary">
                {m}m
              </button>
            ))}
          </div>
        ) : (
          <button type="button" onClick={() => { setRunning(false); setRemaining(null); }} className="mt-6 rounded-md border border-destructive/50 px-6 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10">
            ✕ Cancel
          </button>
        )}
      </div>
    </div>
  );
}
