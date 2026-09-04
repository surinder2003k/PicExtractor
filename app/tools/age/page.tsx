"use client";

import { useState } from "react";
import { computePeriod } from "@/lib/tools/period";

export default function AgePage() {
  const [dob, setDob] = useState("");
  const result = dob ? computePeriod(dob, new Date().toISOString().slice(0, 10)) : null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Age Calculator</h1>
      <p className="mt-2 text-muted-foreground">Exact age in years, months, and days — forms and KYC ready.</p>

      <div className="mt-6 rounded-xl border border-border bg-card p-6">
        <label className="mb-1 block text-sm font-medium">Date of birth</label>
        <input
          type="date"
          value={dob}
          max={new Date().toISOString().slice(0, 10)}
          onChange={(e) => setDob(e.target.value)}
          className="w-full rounded-md border border-input bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-ring"
        />

        {result && (
          result.valid ? (
            <div className="mt-6 space-y-3">
              <div className="rounded-lg border border-border bg-muted p-6 text-center">
                <p className="text-4xl font-bold">{result.breakdown}</p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-lg border border-border bg-muted p-4 text-center">
                  <p className="text-2xl font-bold">{result.totalYears}</p>
                  <p className="text-xs text-muted-foreground">years</p>
                </div>
                <div className="rounded-lg border border-border bg-muted p-4 text-center">
                  <p className="text-2xl font-bold">{result.totalMonths}</p>
                  <p className="text-xs text-muted-foreground">months</p>
                </div>
                <div className="rounded-lg border border-border bg-muted p-4 text-center">
                  <p className="text-2xl font-bold">{result.totalDays.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">days</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="mt-6 rounded-md border border-destructive/50 bg-destructive/10 p-3 text-center text-sm text-destructive">{result.error}</p>
          )
        )}
      </div>
    </div>
  );
}
