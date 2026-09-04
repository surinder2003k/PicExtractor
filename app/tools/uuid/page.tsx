"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Copy, RefreshCcw } from "lucide-react";

export default function UuidPage() {
  const [count, setCount] = useState(5);
  const [ids, setIds] = useState<string[]>([]);

  const generate = () => {
    const out: string[] = [];
    for (let i = 0; i < count; i++) {
      out.push(crypto.randomUUID ? crypto.randomUUID() : "not-supported");
    }
    setIds(out);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">UUID Generator</h1>
      <p className="mt-2 text-muted-foreground">Cryptographically random UUID v4 identifiers for tests, keys, and records.</p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <label className="text-sm text-muted-foreground">How many:</label>
        <select
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          className="rounded-md border border-border bg-background p-2 text-sm outline-none"
        >
          {[1, 5, 10, 25].map((n) => <option key={n} value={n}>{n}</option>)}
        </select>
        <button
          type="button"
          onClick={generate}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          <RefreshCcw className="h-4 w-4" /> Generate
        </button>
        {ids.length > 0 && (
          <button
            type="button"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(ids.join("\n"));
                toast.success("Copied all.");
              } catch {
                toast.error("Could not copy.");
              }
            }}
            className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-2 text-xs transition-colors hover:bg-secondary"
          >
            <Copy className="h-3.5 w-3.5" /> Copy all
          </button>
        )}
      </div>

      <div className="mt-6 space-y-2">
        {ids.map((id, i) => (
          <div key={id} className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3">
            <span className="font-mono text-xs break-all">{id}</span>
            <button
              type="button"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(id);
                  toast.success("Copied.");
                } catch {
                  toast.error("Could not copy.");
                }
              }}
              className="ml-3 shrink-0 rounded-md border border-border px-2 py-1 text-xs transition-colors hover:bg-secondary"
            >
              Copy
            </button>
          </div>
        ))}
        {ids.length === 0 && <p className="text-sm text-muted-foreground">Click Generate to create UUIDs.</p>}
      </div>
    </div>
  );
}
