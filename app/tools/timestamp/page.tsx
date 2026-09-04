"use client";

import { useState } from "react";
import { useEffect } from "react";
import { toast } from "sonner";
import { ArrowDownUp, Clock, Copy, RefreshCcw } from "lucide-react";
import { timestampToDate, dateToTimestamp } from "@/lib/tools/time";

type Dir = "toDate" | "toTimestamp";

export default function TimestampPage() {
  const [mode, setMode] = useState<Dir>("toDate");
  const [input, setInput] = useState("");
  const [out, setOut] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!input.trim()) {
      setOut("");
      setError("");
      return;
    }
    const res = mode === "toDate" ? timestampToDate(input) : dateToTimestamp(input);
    if (res.ok) {
      setOut(res.result ?? "");
      setError("");
    } else {
      setOut("");
      setError(res.error ?? "Error");
    }
  }, [input, mode]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(out);
      toast.success("Copied.");
    } catch {
      toast.error("Could not copy.");
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Timestamp Converter</h1>
      <p className="mt-2 text-muted-foreground">Unix timestamp to human-readable date and back.</p>

      <button
        type="button"
        onClick={() => setMode((m) => (m === "toDate" ? "toTimestamp" : "toDate"))}
        className="mt-6 inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary"
      >
        <ArrowDownUp className="h-4 w-4" />
        {mode === "toDate" ? "Timestamp → Date" : "Date → Timestamp"}
      </button>
      <button
        type="button"
        onClick={() =>
          setInput(mode === "toDate" ? String(Math.floor(Date.now() / 1000)) : new Date().toISOString())
        }
        className="mt-6 ml-2 inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary"
      >
        <Clock className="h-4 w-4" /> Now
      </button>
      <button
        type="button"
        onClick={() => setInput("")}
        className="mt-6 ml-2 inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary"
      >
        <RefreshCcw className="h-4 w-4" /> Clear
      </button>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="mb-2 font-semibold">{mode === "toDate" ? "Timestamp (seconds or ms)" : "Date (ISO or natural)"}</h3>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === "toDate" ? "1699999999" : "2025-01-01"}
            spellCheck={false}
            className="w-full rounded-md border border-input bg-background p-3 font-mono text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-semibold">Result</h3>
            <button
              type="button"
              onClick={handleCopy}
              disabled={!out}
              className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs transition-colors hover:bg-secondary disabled:opacity-50"
            >
              <Copy className="h-3.5 w-3.5" /> Copy
            </button>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <pre className="mt-2 min-h-24 overflow-auto rounded-md border border-border bg-muted p-3 font-mono text-xs">{out || "Result"}</pre>
        </div>
      </div>
    </div>
  );
}