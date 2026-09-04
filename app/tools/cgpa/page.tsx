"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Copy, Plus, Trash2, RotateCcw } from "lucide-react";

interface Sem { id: number; name: string; sgpa: string; credits: string; }
const KEY = "cgpa-semesters";

const blank = (n: number): Sem[] =>
  Array.from({ length: n }, (_, i) => ({ id: i + 1, name: `Sem ${i + 1}`, sgpa: "", credits: "" }));

export default function CgpaPage() {
  const [sems, setSems] = useState<Sem[]>(blank(4));

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Sem[];
        if (Array.isArray(parsed) && parsed.length) setSems(parsed);
      }
    } catch { /* ignore */ }
  }, []);
  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(sems));
  }, [sems]);

  const valid = sems.filter((s) => {
    const g = Number(s.sgpa), c = Number(s.credits);
    return Number.isFinite(g) && g > 0 && g <= 10 && Number.isFinite(c) && c > 0;
  });
  const totalCredits = valid.reduce((sum, s) => sum + Number(s.credits), 0);
  const cgpa = totalCredits > 0 ? valid.reduce((sum, s) => sum + Number(s.sgpa) * Number(s.credits), 0) / totalCredits : 0;

  const division =
    cgpa === 0 ? { label: "—", color: "text-muted-foreground" }
    : cgpa >= 9 ? { label: "Outstanding 🏆", color: "text-emerald-500" }
    : cgpa >= 8 ? { label: "Distinction 🎖️", color: "text-emerald-500" }
    : cgpa >= 7 ? { label: "First Class 🎓", color: "text-primary" }
    : cgpa >= 6 ? { label: "Second Class", color: "text-yellow-500" }
    : cgpa >= 5 ? { label: "Pass", color: "text-yellow-500" }
    : { label: "Needs improvement", color: "text-destructive" };

  const update = (id: number, field: "name" | "sgpa" | "credits", value: string) =>
    setSems(sems.map((s) => (s.id === id ? { ...s, [field]: value } : s)));

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">CGPA Calculator</h1>
      <p className="mt-2 text-muted-foreground">
        Enter each semester&apos;s SGPA and credits — get your credit-weighted CGPA instantly.
      </p>

      <div className="mt-6 rounded-xl border border-border bg-card p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-semibold">Semesters</p>
          <div className="flex flex-wrap gap-1.5">
            {[2, 4, 6, 8].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() =>
                  setSems((cur) =>
                    blank(n).map((s, i) => ({
                      ...s,
                      sgpa: cur[i]?.sgpa ?? "",
                      credits: cur[i]?.credits ?? "",
                    })),
                  )
                }
                className="rounded-md border border-border px-2.5 py-1 text-xs transition-colors hover:bg-secondary"
              >
                {n} sem
              </button>
            ))}
            <button
              type="button"
              onClick={() => setSems([...sems, { id: Date.now(), name: `Sem ${sems.length + 1}`, sgpa: "", credits: "" }])}
              className="inline-flex items-center gap-1 rounded-md bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              <Plus className="h-3.5 w-3.5" /> Add
            </button>
            <button
              type="button"
              onClick={() => { setSems(blank(4)); toast.success("Cleared."); }}
              aria-label="Reset"
              className="rounded-md border border-border p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <div className="space-y-2">
          {sems.map((s) => (
            <div key={s.id} className="grid grid-cols-[1fr_4.5rem_4.5rem_1.5rem] items-center gap-2">
              <input
                value={s.name}
                onChange={(e) => update(s.id, "name", e.target.value)}
                className="min-w-0 rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
              <input
                type="number" min="0" max="10" step="0.01"
                value={s.sgpa}
                onChange={(e) => update(s.id, "sgpa", e.target.value)}
                placeholder="SGPA"
                className="rounded-md border border-input bg-background p-2 text-center font-mono text-sm outline-none focus:ring-2 focus:ring-ring"
              />
              <input
                type="number" min="1"
                value={s.credits}
                onChange={(e) => update(s.id, "credits", e.target.value)}
                placeholder="Cr."
                className="rounded-md border border-input bg-background p-2 text-center font-mono text-sm outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                type="button"
                onClick={() => setSems(sems.filter((x) => x.id !== s.id))}
                aria-label="Remove semester"
                className={`text-muted-foreground transition-colors hover:text-destructive ${sems.length <= 1 ? "pointer-events-none opacity-0" : ""}`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Columns: name · SGPA (out of 10) · credits for that semester. Auto-saves on your device.
        </p>
      </div>

      {cgpa > 0 && (
        <div className="mt-4 grid grid-cols-1 gap-3 text-center sm:grid-cols-3">
          <div className="rounded-xl border border-primary/50 bg-primary/10 p-6">
            <p className="text-xs text-muted-foreground">Your CGPA</p>
            <p className="mt-1 text-4xl font-bold text-primary">{cgpa.toFixed(2)}</p>
          </div>
          <div className="rounded-xl border border-border bg-muted p-6">
            <p className="text-xs text-muted-foreground">Class / Division</p>
            <p className={`mt-2 text-lg font-bold ${division.color}`}>{division.label}</p>
          </div>
          <div className="rounded-xl border border-border bg-muted p-6">
            <p className="text-xs text-muted-foreground">Credits counted</p>
            <p className="mt-2 text-lg font-bold">{totalCredits}</p>
            <button
              type="button"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(
                    `CGPA: ${cgpa.toFixed(2)} / 10 across ${valid.length} semesters (${totalCredits} credits).`,
                  );
                  toast.success("Result copied.");
                } catch { toast.error("Could not copy."); }
              }}
              className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-primary"
            >
              <Copy className="h-3 w-3" /> Copy result
            </button>
          </div>
        </div>
      )}

      <p className="mt-4 text-center text-xs text-muted-foreground">
        Formula: CGPA = Σ(SGPA × credits) ÷ Σ(credits)
      </p>
    </div>
  );
}
