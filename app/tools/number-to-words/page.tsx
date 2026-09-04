"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Copy } from "lucide-react";

const ONES = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten",
  "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
const TENS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];

function twoDigits(n: number): string {
  if (n < 20) return ONES[n];
  return TENS[Math.floor(n / 10)] + (n % 10 ? "-" + ONES[n % 10] : "");
}

function toWordsIndian(n: number): string {
  if (n === 0) return "zero";
  const parts: string[] = [];
  const crore = Math.floor(n / 10000000); n %= 10000000;
  const lakh = Math.floor(n / 100000); n %= 100000;
  const thousand = Math.floor(n / 1000); n %= 1000;
  const hundred = Math.floor(n / 100); n %= 100;
  if (crore) parts.push(twoDigits(crore), "crore");
  if (lakh) parts.push(twoDigits(lakh), "lakh");
  if (thousand) parts.push(twoDigits(thousand), "thousand");
  if (hundred) parts.push(ONES[hundred], "hundred");
  if (n) parts.push("and", twoDigits(n));
  return parts.join(" ");
}

export default function NumberToWordsPage() {
  const [input, setInput] = useState("");
  const n = Number(input.replace(/,/g, "").trim());
  const valid = Number.isFinite(n) && Number.isInteger(n) && n >= 0 && n <= 9999999999;
  const words = valid ? toWordsIndian(n) : "";
  const out = valid ? words.charAt(0).toUpperCase() + words.slice(1) + " only" : "";

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Number to Words</h1>
      <p className="mt-2 text-muted-foreground">Indian numbering (lakh/crore) — perfect for cheques and invoices.</p>

      <div className="mt-6 rounded-xl border border-border bg-card p-6">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          inputMode="numeric"
          spellCheck={false}
          placeholder="e.g. 1234567"
          className="w-full rounded-md border border-input bg-background p-3 font-mono text-lg outline-none focus:ring-2 focus:ring-ring"
        />
        {input && !valid && (
          <p className="mt-3 text-sm text-destructive">⚠️ Enter a whole number between 0 and 9,99,99,99,999.</p>
        )}
        {valid && input && (
          <div className="mt-4 rounded-lg border border-border bg-muted p-4">
            <p className="text-lg font-semibold leading-relaxed">{out}</p>
            <button
              type="button"
              onClick={async () => {
                try { await navigator.clipboard.writeText(out); toast.success("Copied."); }
                catch { toast.error("Could not copy."); }
              }}
              className="mt-3 inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs transition-colors hover:bg-secondary"
            >
              <Copy className="h-3.5 w-3.5" /> Copy
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
