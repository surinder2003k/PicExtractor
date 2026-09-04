"use client";

import { useMemo, useState } from "react";

export default function WordFrequencyPage() {
  const [text, setText] = useState("");

  const { top, unique, total } = useMemo(() => {
    const words = text.toLowerCase().match(/[a-z\u0900-\u097F']+/g) ?? [];
    const counts = new Map<string, number>();
    for (const w of words) counts.set(w, (counts.get(w) ?? 0) + 1);
    const top = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 20);
    return { top, unique: counts.size, total: words.length };
  }, [text]);

  const max = top[0]?.[1] ?? 1;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Word Frequency Analyzer</h1>
      <p className="mt-2 text-muted-foreground">Find overused words in essays, blogs, and reports — tighten your writing.</p>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={16}
          placeholder="Paste your text here…"
          className="w-full resize-y rounded-xl border border-input bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="mb-3 flex gap-4 text-sm">
            <span className="text-muted-foreground">Total words: <strong className="text-foreground">{total.toLocaleString()}</strong></span>
            <span className="text-muted-foreground">Unique: <strong className="text-foreground">{unique.toLocaleString()}</strong></span>
          </div>
          {top.length === 0 ? (
            <p className="text-sm text-muted-foreground">Top words appear here…</p>
          ) : (
            <ul className="space-y-1.5">
              {top.map(([word, count], i) => (
                <li key={word} className="flex items-center gap-2 text-sm">
                  <span className="w-6 text-right font-mono text-xs text-muted-foreground">{i + 1}.</span>
                  <span className="w-28 truncate font-medium">{word}</span>
                  <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-muted">
                    <span className="block h-full rounded-full bg-primary" style={{ width: `${(count / max) * 100}%` }} />
                  </span>
                  <span className="w-8 text-right font-mono text-xs">{count}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
