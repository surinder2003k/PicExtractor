"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Copy } from "lucide-react";

async function digest(algo: string, text: string): Promise<string> {
  const buf = await crypto.subtle.digest(algo, new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export default function HashPage() {
  const [text, setText] = useState("");
  const [hashes, setHashes] = useState<{ algo: string; hex: string }[]>([]);

  const compute = async () => {
    if (!text) return;
    const algos = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"];
    const out = await Promise.all(algos.map(async (a) => ({ algo: a, hex: await digest(a, text) })));
    setHashes(out);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Hash Generator</h1>
      <p className="mt-2 text-muted-foreground">SHA checksums via the Web Crypto API — never leaves your device.</p>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste any text…"
        spellCheck={false}
        className="mt-6 h-32 w-full resize-y rounded-md border border-input bg-background p-3 font-mono text-xs outline-none focus:ring-2 focus:ring-ring"
      />
      <button
        type="button"
        onClick={compute}
        disabled={!text}
        className="mt-3 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        Compute hashes
      </button>

      <div className="mt-6 space-y-3">
        {hashes.map((h) => (
          <div key={h.algo} className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-primary">{h.algo}</span>
              <button
                type="button"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(h.hex);
                    toast.success("Copied.");
                  } catch {
                    toast.error("Could not copy.");
                  }
                }}
                className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs transition-colors hover:bg-secondary"
              >
                <Copy className="h-3 w-3" /> Copy
              </button>
            </div>
            <p className="mt-2 font-mono text-xs break-all">{h.hex}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
