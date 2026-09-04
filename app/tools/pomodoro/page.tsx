"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";

const MODES = [
  { label: "Focus", minutes: 25, cls: "border-primary/40 bg-primary/10" },
  { label: "Short break", minutes: 5, cls: "border-green-500/40 bg-green-500/10" },
  { label: "Long break", minutes: 15, cls: "border-blue-500/40 bg-blue-500/10" },
];

export default function PomodoroPage() {
  const [modeIdx, setModeIdx] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(MODES[0].minutes * 60);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running) {
      timer.current = setInterval(() => {
        setSecondsLeft((s) => {
          if (s <= 1) {
            setRunning(false);
            if (modeIdx === 0) setSessions((n) => n + 1);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [running, modeIdx]);

  const pickMode = (i: number) => {
    setModeIdx(i);
    setRunning(false);
    setSecondsLeft(MODES[i].minutes * 60);
  };

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Pomodoro Timer</h1>
      <p className="mt-2 text-muted-foreground">25-minute focus sprints with breaks — beat procrastination.</p>

      <div className="mt-6 rounded-xl border border-border bg-card p-8 text-center">
        <div className="flex justify-center gap-2">
          {MODES.map((m, i) => (
            <button
              key={m.label}
              type="button"
              onClick={() => pickMode(i)}
              className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                modeIdx === i ? m.cls : "border-border bg-card hover:bg-secondary"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        <p className="mt-8 font-mono text-7xl font-bold tabular-nums">{mm}:{ss}</p>

        <div className="mt-8 flex justify-center gap-3">
          <button
            type="button"
            onClick={() => setRunning(!running)}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {running ? "Pause" : "Start"}
          </button>
          <button
            type="button"
            onClick={() => pickMode(modeIdx)}
            className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-3 text-sm transition-colors hover:bg-secondary"
          >
            <RotateCcw className="h-4 w-4" /> Reset
          </button>
        </div>

        <p className="mt-6 text-sm text-muted-foreground">🍅 {sessions} focus session{sessions === 1 ? "" : "s"} completed</p>
      </div>
    </div>
  );
}
