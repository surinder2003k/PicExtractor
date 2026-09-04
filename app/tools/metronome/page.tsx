"use client";

import { useEffect, useRef, useState } from "react";

const BPM_PRESETS = [60, 90, 120, 160];

export default function MetronomePage() {
  const [bpm, setBpm] = useState(120);
  const [playing, setPlaying] = useState(false);
  const [beat, setBeat] = useState(0);
  const ivRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!playing) {
      if (ivRef.current) clearInterval(ivRef.current);
      return;
    }
    ivRef.current = setInterval(() => setBeat((b) => (b + 1) % 4), (60 / bpm) * 1000);
    return () => { if (ivRef.current) clearInterval(ivRef.current); };
  }, [playing, bpm]);

  // Web Audio click
  const clickRef = useRef<AudioContext | null>(null);
  const lastBeatRef = useRef(-1);
  useEffect(() => {
    if (!playing || beat === lastBeatRef.current) return;
    lastBeatRef.current = beat;
    if (!clickRef.current) clickRef.current = new AudioContext();
    const ctx = clickRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = beat === 0 ? 1200 : 800; // accent first beat
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.09);
  }, [beat, playing]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Metronome</h1>
      <p className="mt-2 text-muted-foreground">Practice tempo for music, pacing for runs, rhythm for speeches.</p>

      <div className="mt-8 rounded-xl border border-border bg-card p-8 text-center">
        <div className="flex justify-center gap-3">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className={`h-5 w-5 rounded-full transition-all duration-100 ${
                playing && beat === i
                  ? i === 0 ? "scale-150 bg-primary" : "scale-125 bg-primary/70"
                  : "bg-muted"
              }`}
            />
          ))}
        </div>

        <p className="mt-6 font-mono text-6xl font-bold">{bpm}<span className="ml-2 text-lg font-normal text-muted-foreground">BPM</span></p>
        <p className="mt-1 text-xs text-muted-foreground">4/4 time · accent on beat 1</p>

        <input
          type="range"
          min={40}
          max={208}
          value={bpm}
          onChange={(e) => setBpm(Number(e.target.value))}
          className="mx-auto mt-6 block w-64 cursor-pointer accent-primary"
        />

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          {BPM_PRESETS.map((p) => (
            <button key={p} type="button" onClick={() => setBpm(p)} className="rounded-md border border-border px-3 py-1.5 text-xs font-mono transition-colors hover:bg-secondary">
              {p}
            </button>
          ))}
          <button
            type="button"
            onClick={() => { setPlaying(!playing); lastBeatRef.current = -1; }}
            className={`ml-2 rounded-md px-6 py-2 text-sm font-medium transition-opacity hover:opacity-90 ${playing ? "border border-destructive/50 text-destructive" : "bg-primary text-primary-foreground"}`}
          >
            {playing ? "⏸ Stop" : "▶ Start"}
          </button>
        </div>
      </div>
    </div>
  );
}
