"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Copy, RefreshCcw, CheckCircle2, AlertCircle } from "lucide-react";
import { formatJson, minifyJson, jsonStats } from "@/lib/tools/json";

type Action = "format" | "minify";

export default function JsonFormatterPage() {
  const [input, setInput] = useState("");
  const [action, setAction] = useState<Action>("format");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    if (!input.trim()) return { ok: true, text: "", stats: null };
    const r = action === "format" ? formatJson(input) : minifyJson(input);
    const stats = action === "format" ? jsonStats(input) : null;
    if (r.ok) return { ok: true, text: r.result ?? "", stats };
    return { ok: false, text: r.error ?? "Invalid JSON", stats: null };
  }, [input, action]);

  const isEmpty = !result.text;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result.text);
      setCopied(true);
      toast.success("Copied to clipboard.");
        setTimeout(function () { setCopied(false); }, 1500);
    } catch {
      toast.error("Could not copy.");
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">JSON Formatter</h1>
      <p className="mt-2 text-muted-foreground">Pretty-print, minify, validate, and inspect JSON.</p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {(["format", "minify"] as Action[]).map((a) => (
          <button
            key={a}
            type="button"
            onClick={() => setAction(a)}
            className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
              action === a ? "bg-primary text-primary-foreground" : "border-border bg-card hover:bg-secondary"
            }`}
          >
            {a === "format" ? "Format" : "Minify"}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            disabled={isEmpty}
            className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs transition-colors hover:bg-secondary disabled:opacity-50"
          >
            {copied ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy"}
          </button>
          <button
            type="button"
            onClick={() => setInput("")}
            className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs transition-colors hover:bg-secondary"
          >
            <RefreshCcw className="h-3.5 w-3.5" /> Clear
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="mb-2 font-semibold">Input</h3>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='{"name": "Alice", "tags": ["a", "b"]}'
            spellCheck={false}
            className="h-72 w-full resize-y rounded-md border border-input bg-background p-3 font-mono text-xs outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-semibold">Output</h3>
            {result.stats && (
              <span className="text-xs text-muted-foreground">
                {result.stats.totalKeys} keys · {result.stats.arrays} arrays · depth {result.stats.depth}
              </span>
            )}
          </div>
          {!result.ok && (
            <p className="mb-2 flex items-center gap-2 rounded-md border border-destructive/50 bg-destructive/10 p-2 text-xs text-destructive">
              <AlertCircle className="h-3.5 w-3.5" /> {result.text}
            </p>
          )}
          <pre className={`h-72 overflow-auto rounded-md border border-border bg-muted p-3 font-mono text-xs ${result.ok ? "text-foreground" : "text-destructive"}`}>
            {isEmpty ? "Result appears here…" : result.text}
          </pre>
        </div>
      </div>
    </div>
  );
}
