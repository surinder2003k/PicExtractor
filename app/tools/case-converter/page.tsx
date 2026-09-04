"use client";

import { useState } from "react";
import { useMemo } from "react";
import { toast } from "sonner";
import { Copy, RefreshCcw } from "lucide-react";
import { toCase, type CaseMode } from "@/lib/tools/text";

const MODES: CaseMode[] = [
  "upper",
  "lower",
  "title",
  "sentence",
  "camel",
  "pascal",
  "snake",
  "kebab",
  "constant",
];

export default function CaseConverterPage() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  const outputs = useMemo(() => {
    const map = new Map<CaseMode, string>();
    MODES.forEach((m) => map.set(m, toCase(text, m)));
    return map;
  }, [text]);

  const handleCopy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success("Copied.");
        setTimeout(function () { setCopied(false); }, 1500);
    } catch {
      toast.error("Could not copy.");
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Case Converter</h1>
      <p className="mt-2 text-muted-foreground">Convert text to any casing in one click.</p>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type or paste your text here…"
        spellCheck={false}
        className="mt-6 h-36 w-full resize-y rounded-md border border-input bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-ring"
      />

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {MODES.map((mode) => (
          <div key={mode} className="rounded-xl border border-border bg-card p-4">
            <div className="mb-2 flex items-center justify-between capitalize">
              <span className="text-sm font-medium">{mode}</span>
              <button
                type="button"
                onClick={() => handleCopy(outputs.get(mode) ?? "")}
                className="rounded-md border border-border px-2 py-1 text-xs transition-colors hover:bg-secondary"
              >
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <p className="min-h-12 break-all rounded-md border border-border bg-muted p-2 font-mono text-xs">
              {outputs.get(mode)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
