"use client";

import { useMemo, useState } from "react";

const SAMPLE = "the quick brown fox jumps over the lazy dog while programming in javascript and typing fast on the keyboard every single day";

export default function TypingPage() {
  const [started, setStarted] = useState(false);
  const [input, setInput] = useState("");
  const [startTime, setStartTime] = useState(0);
  const [done, setDone] = useState(false);

  const target = useMemo(() => SAMPLE, []);

  const seconds = started ? (Date.now() - startTime) / 1000 : 0;
  const correctChars = [...input].filter((c, i) => c === target[i]).length;
  const wpm = seconds > 0 ? Math.round((correctChars / 5) / (seconds / 60)) : 0;
  const accuracy = input.length > 0 ? Math.round((correctChars / input.length) * 100) : 100;

  const onChange = (v: string) => {
    if (done) return;
    if (!started && v.length > 0) { setStarted(true); setStartTime(Date.now()); }
    setInput(v.slice(0, target.length));
    if (v.length >= target.length) setDone(true);
  };

  const reset = () => { setStarted(false); setInput(""); setDone(false); };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Typing Speed Test</h1>
      <p className="mt-2 text-muted-foreground">How fast do you type? Start typing — WPM updates live.</p>

      <div className="mt-6 rounded-xl border border-border bg-card p-6">
        <p className="font-mono text-lg leading-relaxed">
          {[...target].map((c, i) => {
            const typed = input[i];
            const cls = typed === undefined
              ? "text-muted-foreground"
              : typed === c ? "text-primary" : "bg-destructive/30 text-destructive";
            return (
              <span key={i} className={`${cls} ${i === input.length ? "border-l-2 border-primary animate-pulse" : ""}`}>
                {c}
              </span>
            );
          })}
        </p>

        <textarea
          value={input}
          onChange={(e) => onChange(e.target.value)}
          disabled={done}
          placeholder="Start typing here…"
          spellCheck={false}
          className="mt-5 h-24 w-full resize-none rounded-md border border-input bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-ring"
        />

        <div className="mt-4 grid grid-cols-3 gap-3 text-center">
          <div className="rounded-lg border border-border bg-muted p-4">
            <p className="text-xs text-muted-foreground">WPM</p>
            <p className="mt-1 text-3xl font-bold text-primary">{done || started ? wpm : "—"}</p>
          </div>
          <div className="rounded-lg border border-border bg-muted p-4">
            <p className="text-xs text-muted-foreground">Accuracy</p>
            <p className="mt-1 text-3xl font-bold">{started ? accuracy : "—"}%</p>
          </div>
          <div className="rounded-lg border border-border bg-muted p-4">
            <p className="text-xs text-muted-foreground">Time</p>
            <p className="mt-1 text-3xl font-bold">{started ? Math.round(seconds) : 0}s</p>
          </div>
        </div>

        {done && (
          <p className="mt-4 text-center text-sm font-medium text-primary">
            🎉 Done! {wpm} WPM at {accuracy}% accuracy.
          </p>
        )}

        <button type="button" onClick={reset} className="mt-4 w-full rounded-md border border-border px-4 py-2 text-sm transition-colors hover:bg-secondary">
          Reset
        </button>
      </div>
    </div>
  );
}
