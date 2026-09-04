"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Copy, ArrowDownUp } from "lucide-react";

type Mode = "encode" | "decode";

export default function Base64Page() {
  const [mode, setMode] = useState<Mode>("encode");
  const [input, setInput] = useState("");
  const [urlSafe, setUrlSafe] = useState(false);

  const output = (() => {
    if (!input) return "";
    try {
      if (mode === "encode") {
        let b64 = btoa(String.fromCharCode(...new TextEncoder().encode(input)));
        if (urlSafe) b64 = b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
        return b64;
      }
      let normalized = input.trim().replace(/-/g, "+").replace(/_/g, "/");
      while (normalized.length % 4) normalized += "=";
      const bytes = Uint8Array.from(atob(normalized), (c) => c.charCodeAt(0));
      return new TextDecoder().decode(bytes);
    } catch {
      return "⚠️ Invalid Base64 input";
    }
  })();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Base64 Encoder / Decoder</h1>
      <p className="mt-2 text-muted-foreground">Encode text to Base64 or decode it back. Unicode safe, URL-safe option.</p>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setMode(mode === "encode" ? "decode" : "encode")}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary"
        >
          <ArrowDownUp className="h-4 w-4" />
          {mode === "encode" ? "Text → Base64" : "Base64 → Text"}
        </button>
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <input type="checkbox" checked={urlSafe} onChange={(e) => setUrlSafe(e.target.checked)} className="h-4 w-4 accent-primary" />
          URL-safe (encode only)
        </label>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="mb-2 font-semibold">{mode === "encode" ? "Plain text" : "Base64"}</h3>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
            placeholder={mode === "encode" ? "Hello, world!" : "SGVsbG8sIHdvcmxkIQ=="}
            className="h-64 w-full resize-y rounded-md border border-input bg-background p-3 font-mono text-xs outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-semibold">{mode === "encode" ? "Base64" : "Plain text"}</h3>
            <button
              type="button"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(output);
                  toast.success("Copied.");
                } catch {
                  toast.error("Could not copy.");
                }
              }}
              disabled={!output}
              className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs transition-colors hover:bg-secondary disabled:opacity-50"
            >
              <Copy className="h-3.5 w-3.5" /> Copy
            </button>
          </div>
          <pre className="h-64 overflow-auto whitespace-pre-wrap rounded-md border border-border bg-muted p-3 font-mono text-xs">{output || "Result appears here…"}</pre>
        </div>
      </div>
    </div>
  );
}
