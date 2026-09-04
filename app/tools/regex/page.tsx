"use client";

import { useState, type ReactNode } from "react";

export default function RegexPage() {
  const [pattern, setPattern] = useState("\\d{4}-\\d{2}-\\d{2}");
  const [flags, setFlags] = useState("g");
  const [text, setText] = useState("Meeting on 2026-01-15, review on 2026-02-20, launch 2026-03-01.");

  let error = "";
  let matches: { text: string; index: number }[] = [];
  let highlighted: ReactNode = null;

  try {
    if (pattern) {
      const re = new RegExp(pattern, flags.includes("g") ? flags : flags + "g");
      matches = [...text.matchAll(re)].map((m) => ({ text: m[0], index: m.index ?? 0 }));
      const esc = text.replace(/&/g, "&amp;").replace(/</g, "&lt;");
      if (matches.length) {
        const parts: ReactNode[] = [];
        let last = 0;
        // rebuild using regex on escaped text for safe slicing
        const reEsc = new RegExp(pattern.replace(/[<&]/g, (c) => (c === "<" ? "&lt;" : "&amp;")), flags.includes("g") ? flags : flags + "g");
        let m: RegExpExecArray | null;
        while ((m = reEsc.exec(esc)) !== null) {
          parts.push(esc.slice(last, m.index));
          parts.push(<mark key={m.index} className="rounded bg-primary/25 px-0.5 text-foreground">{m[0]}</mark>);
          last = m.index + m[0].length;
          if (m[0].length === 0) reEsc.lastIndex++;
        }
        parts.push(esc.slice(last));
        highlighted = parts;
      } else {
        highlighted = esc;
      }
    } else {
      highlighted = text.replace(/&/g, "&amp;").replace(/</g, "&lt;");
    }
  } catch (e) {
    error = e instanceof Error ? e.message : "Invalid pattern";
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Regex Tester</h1>
      <p className="mt-2 text-muted-foreground">Test patterns with live match highlighting — all local.</p>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <div className="flex min-w-64 flex-1 items-center rounded-md border border-input bg-background px-3 font-mono text-sm">
          <span className="text-muted-foreground">/</span>
          <input value={pattern} onChange={(e) => setPattern(e.target.value)} spellCheck={false} className="min-w-0 flex-1 bg-transparent p-2.5 outline-none" />
          <span className="text-muted-foreground">/</span>
          <input value={flags} onChange={(e) => setFlags(e.target.value.replace(/[^gimsuy]/g, ""))} className="w-12 bg-transparent p-2.5 outline-none" aria-label="flags" />
        </div>
        <span className={`text-xs ${error ? "text-destructive" : "text-muted-foreground"}`}>
          {error ? `⚠️ ${error}` : `${matches.length} match${matches.length === 1 ? "" : "es"}`}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="mb-2 font-semibold">Test string</h3>
          <textarea value={text} onChange={(e) => setText(e.target.value)} rows={10} spellCheck={false} className="w-full resize-y rounded-md border border-input bg-background p-3 font-mono text-xs outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="mb-2 font-semibold">Highlighted</h3>
          <pre className="max-h-64 overflow-auto whitespace-pre-wrap rounded-md border border-border bg-muted p-3 font-mono text-xs">{highlighted ?? "—"}</pre>
          {matches.length > 0 && (
            <ul className="mt-3 max-h-32 space-y-1 overflow-auto text-xs">
              {matches.slice(0, 50).map((m, i) => (
                <li key={i} className="flex gap-2 font-mono text-muted-foreground">
                  <span className="text-primary">#{i + 1}</span>
                  <span className="truncate text-foreground">&ldquo;{m.text}&rdquo;</span>
                  <span>@ {m.index}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
