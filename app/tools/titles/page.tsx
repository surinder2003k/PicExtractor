"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Copy, RefreshCw } from "lucide-react";

const PATTERNS = [
  (t: string) => `${t}: What Nobody Tells You`,
  (t: string) => `The Complete Guide to ${t} (2026)`,
  (t: string) => `${t} — 7 Mistakes Everyone Makes`,
  (t: string) => `How I Mastered ${t} in 30 Days`,
  (t: string) => `${t} vs The World: An Honest Take`,
  (t: string) => `Why Your ${t} Isn't Working (And How to Fix It)`,
  (t: string) => `${t} for Beginners: Start Here`,
  (t: string) => `The Psychology of ${t}`,
  (t: string) => `${t}: Before and After — A Case Study`,
  (t: string) => `10 ${t} Hacks That Actually Work`,
  (t: string) => `Stop Doing ${t} Like This`,
  (t: string) => `${t} Explained in 5 Minutes`,
];

export default function TitlesPage() {
  const [topic, setTopic] = useState("");
  const [seed, setSeed] = useState(0);

  const t = topic.trim() || "Your Topic";
  const rotated = [...PATTERNS.slice(seed % PATTERNS.length), ...PATTERNS.slice(0, seed % PATTERNS.length)];
  const titles = rotated.slice(0, 6).map((fn) => fn(t));

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Blog Title Generator</h1>
      <p className="mt-2 text-muted-foreground">Beat writer&apos;s block — proven headline patterns for your topic.</p>

      <div className="mt-6 flex gap-2">
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter your topic (e.g. morning routines)"
          className="min-w-0 flex-1 rounded-md border border-input bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
        <button type="button" onClick={() => setSeed(seed + 1)} className="inline-flex items-center gap-1.5 rounded-md border border-border px-4 py-2 text-sm transition-colors hover:bg-secondary">
          <RefreshCw className="h-4 w-4" /> Shuffle
        </button>
      </div>

      <ul className="mt-6 space-y-2">
        {titles.map((title) => (
          <li key={title} className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card p-3.5">
            <span className="text-sm font-medium">{title}</span>
            <button
              type="button"
              onClick={async () => {
                try { await navigator.clipboard.writeText(title); toast.success("Title copied."); }
                catch { toast.error("Could not copy."); }
              }}
              aria-label="Copy title"
              className="shrink-0 text-muted-foreground transition-colors hover:text-primary"
            >
              <Copy className="h-4 w-4" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
