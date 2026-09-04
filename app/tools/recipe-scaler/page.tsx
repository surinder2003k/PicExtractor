"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

interface Row { id: number; name: string; qty: string; }

export default function RecipeScalerPage() {
  const [rows, setRows] = useState<Row[]>([{ id: 1, name: "", qty: "" }]);
  const [factor, setFactor] = useState(2);

  const scale = (qty: string): string => {
    const m = qty.trim().match(/^(\d+(?:\.\d+)?)(?:\s*\/\s*(\d+(?:\.\d+)?))?\s*(.*)$/);
    if (!m) return qty;
    let v = Number(m[1]);
    if (m[2]) v /= Number(m[2]);
    if (!Number.isFinite(v)) return qty;
    const scaled = v * factor;
    const rounded = Math.round(scaled * 100) / 100;
    return `${rounded}${m[3] ? " " + m[3] : ""}`;
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Recipe Scaler</h1>
      <p className="mt-2 text-muted-foreground">Ingredients ko multiply/divide karo — 2 se 8 servings, ek click mein.</p>

      <div className="mt-6 rounded-xl border border-border bg-card p-6">
        <label className="mb-2 block text-sm">
          Scale factor: <strong className="text-primary">{factor}×</strong>
        </label>
        <div className="flex flex-wrap gap-2">
          {[0.5, 1, 1.5, 2, 3, 4].map((f) => (
            <button key={f} type="button" onClick={() => setFactor(f)} className={`rounded-md border px-4 py-1.5 text-sm transition-colors ${factor === f ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-secondary"}`}>
              {f}×
            </button>
          ))}
        </div>

        <div className="mt-5 space-y-2">
          {rows.map((r, i) => (
            <div key={r.id} className="flex gap-2">
              <input
                value={r.qty}
                onChange={(e) => setRows(rows.map((x) => x.id === r.id ? { ...x, qty: e.target.value } : x))}
                placeholder="250 g"
                className="w-28 rounded-md border border-input bg-background p-2.5 font-mono text-sm outline-none focus:ring-2 focus:ring-ring"
              />
              <input
                value={r.name}
                onChange={(e) => setRows(rows.map((x) => x.id === r.id ? { ...x, name: e.target.value } : x))}
                placeholder={`Ingredient ${i + 1} (e.g. flour)`}
                className="flex-1 rounded-md border border-input bg-background p-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
              <button type="button" onClick={() => setRows(rows.filter((x) => x.id !== r.id))} className="rounded-md border border-border px-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-destructive" aria-label="Remove">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        <button type="button" onClick={() => setRows([...rows, { id: Date.now(), name: "", qty: "" }])} className="mt-3 inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-sm transition-colors hover:bg-secondary">
          <Plus className="h-4 w-4" /> Add ingredient
        </button>

        {rows.some((r) => r.name.trim()) && (
          <div className="mt-6 rounded-lg border border-border bg-muted p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Scaled ({factor}×)</p>
            <ul className="space-y-1 font-mono text-sm">
              {rows.filter((r) => r.name.trim()).map((r) => (
                <li key={r.id}>
                  <span className="font-bold text-primary">{scale(r.qty) || "—"}</span> {r.name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
