"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Copy, RefreshCcw, KeyRound } from "lucide-react";
import { generatePassword, estimateStrength } from "@/lib/tools/password";

export default function PasswordPage() {
  const [length, setLength] = useState(16);
  const [symbols, setSymbols] = useState(false);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = () => {
    setPassword(generatePassword({ length, symbols, excludeAmbiguous }));
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      toast.success("Copied.");
        setTimeout(function () { setCopied(false); }, 1500);
    } catch {
      toast.error("Could not copy.");
    }
  };

  const strength = estimateStrength(length, symbols);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Password Generator</h1>
      <p className="mt-2 text-muted-foreground">Generate strong, secure random passwords.</p>

      <div className="mt-6 rounded-xl border border-border bg-card p-6">
        <label className="mb-2 flex items-center justify-between text-sm">
          <span>Length: <strong>{length}</strong></span>
          <span className="text-muted-foreground">Strength: {strength.label}</span>
        </label>
        <input
          type="range"
          min={6}
          max={48}
          value={length}
          onChange={(e) => setLength(Number(e.target.value))}
          className="w-full cursor-pointer accent-primary"
        />

        <div className="mt-5 space-y-2">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={symbols} onChange={(e) => setSymbols(e.target.checked)} className="h-4 w-4 accent-primary" />
            Include symbols (!@#$%^&*)
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={excludeAmbiguous} onChange={(e) => setExcludeAmbiguous(e.target.checked)} className="h-4 w-4 accent-primary" />
            Exclude ambiguous chars (Il0O)
          </label>
        </div>

        <div className="mt-5">
          <div className="flex gap-2">
            <input
              readOnly
              value={password}
              placeholder="Click Generate"
              onFocus={(e) => e.target.select()}
              className="w-full cursor-pointer rounded-md border border-input bg-background p-3 font-mono text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              type="button"
              onClick={generate}
              className="inline-flex shrink-0 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              <KeyRound className="h-4 w-4" /> Generate
            </button>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleCopy}
              disabled={!password}
              className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs transition-colors hover:bg-secondary disabled:opacity-50"
            >
              <Copy className="h-3.5 w-3.5" /> {copied ? "Copied" : "Copy"}
            </button>
            <button
              type="button"
              onClick={() => setPassword("")}
              className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs transition-colors hover:bg-secondary"
            >
              <RefreshCcw className="h-3.5 w-3.5" /> Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
