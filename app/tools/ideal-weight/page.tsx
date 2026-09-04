"use client";

import { useState } from "react";

export default function IdealWeightPage() {
  const [height, setHeight] = useState("170");
  const [gender, setGender] = useState<"male" | "female">("male");

  const cm = Number(height) || 0;
  const inchesOver5ft = Math.max(0, cm / 2.54 - 60);
  // Robinson formula
  const robinson = gender === "male" ? 52 + 1.9 * inchesOver5ft : 49 + 1.7 * inchesOver5ft;
  // Devine formula
  const devine = gender === "male" ? 50 + 2.3 * inchesOver5ft : 45.5 + 2.3 * inchesOver5ft;
  // healthy BMI range (18.5–24.9)
  const bmiLo = 18.5 * (cm / 100) ** 2;
  const bmiHi = 24.9 * (cm / 100) ** 2;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Ideal Weight Calculator</h1>
      <p className="mt-2 text-muted-foreground">Science-based ranges (Robinson &amp; Devine formulas + healthy BMI band).</p>

      <div className="mt-6 rounded-xl border border-border bg-card p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs text-muted-foreground">Height (cm)</label>
            <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} className="w-full rounded-md border border-input bg-background p-3 font-mono text-sm outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="mb-1 block text-xs text-muted-foreground">Gender</label>
            <div className="flex gap-2">
              <button type="button" onClick={() => setGender("male")} className={`flex-1 rounded-md border px-4 py-2.5 text-sm transition-colors ${gender === "male" ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-secondary"}`}>Male</button>
              <button type="button" onClick={() => setGender("female")} className={`flex-1 rounded-md border px-4 py-2.5 text-sm transition-colors ${gender === "female" ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-secondary"}`}>Female</button>
            </div>
          </div>
        </div>

        {cm >= 140 && cm <= 230 ? (
          <div className="mt-6 grid grid-cols-1 gap-3 text-center sm:grid-cols-3">
            <div className="rounded-lg border border-border bg-muted p-4">
              <p className="text-xs text-muted-foreground">Robinson formula</p>
              <p className="mt-1 text-xl font-bold">{robinson.toFixed(1)} kg</p>
            </div>
            <div className="rounded-lg border border-border bg-muted p-4">
              <p className="text-xs text-muted-foreground">Devine formula</p>
              <p className="mt-1 text-xl font-bold">{devine.toFixed(1)} kg</p>
            </div>
            <div className="rounded-lg border border-primary/50 bg-primary/10 p-4">
              <p className="text-xs text-muted-foreground">Healthy BMI range</p>
              <p className="mt-1 text-xl font-bold text-primary">{bmiLo.toFixed(0)}–{bmiHi.toFixed(0)} kg</p>
            </div>
          </div>
        ) : (
          <p className="mt-4 text-center text-xs text-destructive">Enter a height between 140–230 cm.</p>
        )}
      </div>
    </div>
  );
}
