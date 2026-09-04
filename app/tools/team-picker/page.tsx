"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Shuffle, Copy } from "lucide-react";

export default function TeamPickerPage() {
  const [names, setNames] = useState("");
  const [teams, setTeams] = useState(2);
  const [result, setResult] = useState<string[][] | null>(null);

  const shuffle = () => {
    const list = names.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean);
    if (list.length < teams) {
      toast.error(`Need at least ${teams} people for ${teams} teams.`);
      return;
    }
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    const buckets: string[][] = Array.from({ length: teams }, () => []);
    list.forEach((name, i) => buckets[i % teams].push(name));
    setResult(buckets);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Random Team Picker</h1>
      <p className="mt-2 text-muted-foreground">Fairly split people into random teams — standups, events, games.</p>

      <div className="mt-6 rounded-xl border border-border bg-card p-6">
        <label className="mb-1 block text-sm font-medium">Names (one per line or comma-separated)</label>
        <textarea
          value={names}
          onChange={(e) => setNames(e.target.value)}
          placeholder={"Asha\nRahul\nPriya\nVikram\nNeha\nArjun"}
          className="h-40 w-full resize-y rounded-md border border-input bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <label className="text-sm text-muted-foreground">Teams:</label>
          <select
            value={teams}
            onChange={(e) => setTeams(Number(e.target.value))}
            className="rounded-md border border-border bg-background p-2 text-sm outline-none"
          >
            {[2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
          <button
            type="button"
            onClick={shuffle}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Shuffle className="h-4 w-4" /> Shuffle teams
          </button>
          {result && (
            <button
              type="button"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(result.map((t, i) => `Team ${i + 1}: ${t.join(", ")}`).join("\n"));
                  toast.success("Copied teams.");
                } catch {
                  toast.error("Could not copy.");
                }
              }}
              className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-2 text-xs transition-colors hover:bg-secondary"
            >
              <Copy className="h-3.5 w-3.5" /> Copy
            </button>
          )}
        </div>

        {result && (
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {result.map((team, i) => (
              <div key={i} className="rounded-lg border border-border bg-muted p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">Team {i + 1}</p>
                <ul className="mt-2 space-y-1 text-sm">
                  {team.map((n) => <li key={n}>{n}</li>)}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
