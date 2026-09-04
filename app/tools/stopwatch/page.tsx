"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export default function StopwatchPage() {
  const [ms, setMs] = useState(0);
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const raf = useRef<number | null>(null);
  const last = useRef(0);

  useEffect(() => {
    if (!running) return;
    last.current = performance.now();
    const tick = (now: number) => {
      setMs((m) => m + (now - last.current));
      last.current = now;
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [running]);

  const fmt = (v: number) => {
    const m = Math.floor(v / 60000);
    const s = Math.floor((v % 60000) / 1000);
    const cs = Math.floor((v % 1000) / 10);
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}.${String(cs).padStart(2, "0")}`;
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Stopwatch</h1>
      <p className="mt-2 text-muted-foreground">Track tasks, meetings, and workouts — with laps.</p>

      <div className="mt-8 rounded-xl border border-border bg-card p-8 text-center">
        <p className="font-mono text-6xl font-bold tabular-nums sm:text-7xl">{fmt(ms)}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={() => setRunning(!running)} className="rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90">
            {running ? "Pause" : ms === 0 ? "Start" : "Resume"}
          </button>
          <button type="button" onClick={() => { if (running) setLaps([...laps, ms]); }} disabled={!running} className="rounded-md border border-border px-6 py-3 text-sm transition-colors hover:bg-secondary disabled:opacity-40">
            Lap
          </button>
          <button type="button" onClick={() => { setRunning(false); setMs(0); setLaps([]); toast.success("Reset."); }} className="rounded-md border border-border px-6 py-3 text-sm transition-colors hover:bg-secondary">
            Reset
          </button>
        </div>

        {laps.length > 0 && (
          <ul className="mx-auto mt-6 max-w-sm space-y-1 text-sm">
            {laps.map((l, i) => (
              <li key={i} className="flex justify-between rounded-md bg-muted px-4 py-2 font-mono">
                <span className="text-muted-foreground">Lap {i + 1}</span>
                <span>{fmt(l - (laps[i - 1] ?? 0))}</span>
                <span className="text-muted-foreground">{fmt(l)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
