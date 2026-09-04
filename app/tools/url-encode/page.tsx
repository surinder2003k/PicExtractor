"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Copy, ArrowDownUp } from "lucide-react";

type Mode = "encode" | "decode";

export default function UrlEncodePage() {
  const [mode, setMode] = useState<Mode>("encode");
  const [input, setInput] = useState("");

  const output = (() => {
    if (!input) return "";
    try {
      return mode === "encode" ? encodeURIComponent(input) : decodeURIComponent(input.replace(/\+/g, "%20"));
    } catch {
      return "⚠️ Invalid encoded input";
    }
  })();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">URL Encoder / Decoder</h1>
      <p className="mt-2 text-muted-foreground">Escape query params and unescape URLs — API testing staple.</p>

      <button
        type="button"
        onClick={() => setMode(mode === "encode" ? "decode" : "encode")}
        className="mt-6 inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary"
      >
        <ArrowDownUp className="h-4 w-4" />
        {mode === "encode" ? "Text → URL-encoded" : "URL-encoded → Text"}
      </button>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="mb-2 font-semibold">{mode === "encode" ? "Plain text" : "Encoded"}</h3>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
            placeholder={mode === "encode" ? "hello world & more" : "hello%20world%20%26%20more"}
            className="h-56 w-full resize-y rounded-md border border-input bg-background p-3 font-mono text-xs outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-semibold">{mode === "encode" ? "Encoded" : "Plain text"}</h3>
            <button
              type="button"
              onClick={async () => {
                if (!output) return;
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
          <pre className="h-56 overflow-auto whitespace-pre-wrap rounded-md border border-border bg-muted p-3 font-mono text-xs">{output || "Result appears here…"}</pre>
        </div>
      </div>
    </div>
  );
}
