"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Copy, Sparkles } from "lucide-react";

const OPS: [string, (t: string) => string][] = [
  ["Trim lines", (t) => t.split("\n").map((l) => l.trim()).join("\n")],
  ["Collapse spaces", (t) => t.replace(/[ \t]+/g, " ")],
  ["Remove blank lines", (t) => t.split("\n").filter((l) => l.trim()).join("\n")],
  ["Remove line breaks", (t) => t.replace(/\s*\n\s*/g, " ")],
  ["Remove duplicates", (t) => [...new Set(t.split("\n"))].join("\n")],
  ["Sort lines A→Z", (t) => t.split("\n").sort((a, b) => a.localeCompare(b)).join("\n")],
  ["Sort lines Z→A", (t) => t.split("\n").sort((a, b) => b.localeCompare(a)).join("\n")],
  ["Reverse lines", (t) => t.split("\n").reverse().join("\n")],
  ["Number lines", (t) => t.split("\n").map((l, i) => `${i + 1}. ${l}`).join("\n")],
  ["UPPERCASE", (t) => t.toUpperCase()],
  ["lowercase", (t) => t.toLowerCase()],
  ["Escape HTML", (t) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")],
  ["Strip HTML tags", (t) => t.replace(/<[^>]*>/g, "")],
];

export default function TextCleanerPage() {
  const [text, setText] = useState("");

  const run = async (op: [string, (t: string) => string]) => {
    setText(op[1](text));
    toast.success(op[0] + " applied.");
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Text Cleaner</h1>
      <p className="mt-2 text-muted-foreground">13 one-click cleanup operations — paste, clean, copy.</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {OPS.map((op) => (
          <button
            key={op[0]}
            type="button"
            onClick={() => run(op)}
            disabled={!text}
            className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium transition-colors hover:bg-secondary disabled:opacity-40"
          >
            <Sparkles className="h-3 w-3 text-primary" />
            {op[0]}
          </button>
        ))}
      </div>

      <div className="mt-4 rounded-xl border border-border bg-card p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {text.length} chars · {text.split("\n").length} lines
          </span>
          <button
            type="button"
            onClick={async () => {
              if (!text) return;
              try { await navigator.clipboard.writeText(text); toast.success("Copied."); }
              catch { toast.error("Could not copy."); }
            }}
            className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1 text-xs transition-colors hover:bg-secondary"
          >
            <Copy className="h-3.5 w-3.5" /> Copy result
          </button>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          spellCheck={false}
          placeholder="Paste your messy text here…"
          className="h-80 w-full resize-y rounded-md border border-input bg-background p-3 font-mono text-sm outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
    </div>
  );
}
