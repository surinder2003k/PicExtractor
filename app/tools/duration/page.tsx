"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Copy } from "lucide-react";
import { computePeriod } from "@/lib/tools/period";

export default function DurationPage() {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const result = start ? computePeriod(start, end) : null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Duration Calculator</h1>
      <p className="mt-2 text-muted-foreground">Days, months, years between two dates — age, tenure, elapsed time.</p>

      <div className="mt-6 rounded-xl border border-border bg-card p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Start date</label>
            <input
              type="date"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="w-full rounded-md border border-input bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">End date <span className="text-muted-foreground">(blank = today)</span></label>
            <input
              type="date"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              className="w-full rounded-md border border-input bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        {result ? (
          result.valid ? (
            <div className="mt-6 space-y-3">
              <div className="rounded-lg border border-border bg-muted p-5 text-center">
                <span className="text-xs text-muted-foreground">Total</span>
                <p className="text-4xl font-bold">{result.totalDays.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">days</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-border bg-muted p-4 text-center">
                  <p className="text-2xl font-bold">{result.totalMonths}</p>
                  <p className="text-sm text-muted-foreground">Total months</p>
                </div>
                <div className="rounded-lg border border-border bg-muted p-4 text-center">
                  <p className="text-2xl font-bold">{result.totalYears}</p>
                  <p className="text-sm text-muted-foreground">Total years</p>
                </div>
              </div>
              <p className="text-center text-sm text-muted-foreground">
                ~ <strong className="text-foreground">{result.breakdown}</strong>
              </p>
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(
                        `${start} → ${end || "today"}: ${result.totalDays} days (${result.breakdown})`
                      );
                      toast.success("Copied.");
                    } catch {
                      toast.error("Could not copy.");
                    }
                  }}
                  className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs transition-colors hover:bg-secondary"
                >
                  <Copy className="h-3.5 w-3.5" /> Copy result
                </button>
              </div>
            </div>
          ) : (
            <p className="mt-6 rounded-md border border-destructive/50 bg-destructive/10 p-3 text-center text-sm text-destructive">
              {result.error}
            </p>
          )
        ) : (
          <p className="mt-6 text-center text-sm text-muted-foreground">Pick a start date to begin.</p>
        )}
      </div>
    </div>
  );
}