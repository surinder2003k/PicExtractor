"use client";

import { useState } from "react";

export default function BmiPage() {
  const [height, setHeight] = useState("170");
  const [weight, setWeight] = useState("65");

  const h = Number(height) / 100;
  const w = Number(weight);
  const bmi = h > 0 && w > 0 ? w / (h * h) : null;

  const category = bmi === null ? "" : bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal" : bmi < 30 ? "Overweight" : "Obese";
  const color = bmi === null ? "" : bmi < 18.5 ? "text-yellow-500" : bmi < 25 ? "text-green-500" : bmi < 30 ? "text-orange-500" : "text-red-500";

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">BMI Calculator</h1>
      <p className="mt-2 text-muted-foreground">Quick body-mass-index check — wellness weeks and health forms.</p>

      <div className="mt-6 rounded-xl border border-border bg-card p-6">
        <div className="flex flex-wrap gap-4">
          <div className="min-w-40 flex-1">
            <label className="mb-1 block text-xs text-muted-foreground">Height (cm)</label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="w-full rounded-md border border-input bg-background p-3 font-mono text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="min-w-40 flex-1">
            <label className="mb-1 block text-xs text-muted-foreground">Weight (kg)</label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full rounded-md border border-input bg-background p-3 font-mono text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        {bmi !== null && (
          <div className="mt-6 rounded-lg border border-border bg-muted p-6 text-center">
            <p className="text-5xl font-bold">{bmi.toFixed(1)}</p>
            <p className={`mt-2 font-medium ${color}`}>{category}</p>
            <p className="mt-3 text-xs text-muted-foreground">Healthy range: 18.5 – 24.9 · consult a professional for advice</p>
          </div>
        )}
      </div>
    </div>
  );
}
