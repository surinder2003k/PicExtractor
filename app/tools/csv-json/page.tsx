"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { ArrowDownUp, Copy, RefreshCcw } from "lucide-react";
import { csvToJson, jsonToCsv } from "@/lib/tools/csv";

type Dir = "csv2json" | "json2csv";

export default function CsvJsonPage() {
  const [mode, setDirection] = useState<Dir>("csv2json");
  const [input, setInput] = useState("");
  const output = useMemo(() => {
    if (!input.trim()) return "";
    const first = csvToJson(input);
    const p = mode === "csv2json" ? first : jsonToCsv(input);
    return p.ok ? (p.result ?? "") : "Error: " + (p.error ?? "unknown");
  }, [input, mode]);

  const handleCopy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      toast.success("Copied to clipboard.");
    } catch {
      toast.error("Could not copy.");
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">CSV ⇥ JSON Converter</h1>
      <p className="mt-2 text-muted-foreground">Convert between CSV and JSON right in your browser.</p>

      <button
        type="button"
        onClick={() =>
          setDirection((d) => (d === "csv2json" ? "json2csv" : "csv2json"))
        }
        className="mt-6 inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary"
      >
        <ArrowDownUp className="h-4 w-4" />
        {mode === "csv2json" ? "CSV → JSON" : "JSON → CSV"}
      </button>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="mb-2 font-semibold">{mode === "csv2json" ? "CSV Input" : "JSON Input"}</h3>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              mode === "csv2json"
                ? 'name,age\nAlice,30\nBob,25'
                : '[{"name":"Alice","age":30}]'
            }
            spellCheck={false}
            className="h-72 w-full resize-y rounded-md border border-input bg-background p-3 font-mono text-xs outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-semibold">{mode === "csv2json" ? "JSON Output" : "CSV Output"}</h3>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopy}
                disabled={!output}
                className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs transition-colors hover:bg-secondary disabled:opacity-50"
              >
                <Copy className="h-3.5 w-3.5" /> Copy
              </button>
              <button
                type="button"
                onClick={() => setInput("")}
                className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs transition-colors hover:bg-secondary"
              >
                <RefreshCcw className="h-3.5 w-3.5" /> Clear
              </button>
            </div>
          </div>
          <pre className="h-72 overflow-auto rounded-md border border-border bg-muted p-3 text-xs">{output || "Result sẽ appear here…"}</pre>
        </div>
      </div>
    </div>
  );
}
