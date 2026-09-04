"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Copy } from "lucide-react";

export default function MarksPage() {
  const [marks, setMarks] = useState("");
  const [total, setTotal] = useState("500");

  const m = Number(marks) || 0;
  const t = Number(total) || 0;
  const pct = t > 0 ? (m / t) * 100 : 0;
  // CGPA on 10-point scale (common Indian conversion: pct/9.5)
  const cgpa = pct / 9.5;

  const grade =
    pct >= 90 ? { g: "A+", c: "text-emerald-500" }
    : pct >= 80 ? { g: "A", c: "text-emerald-500" }
    : pct >= 70 ? { g: "B+", c: "text-primary" }
    : pct >= 60 ? { g: "B", c: "text-primary" }
    : pct >= 50 ? { g: "C", c: "text-yellow-500" }
    : pct >= 40 ? { g: "D", c: "text-yellow-500" }
    : { g: "F", c: "text-destructive" };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Marks Percentage Calculator</h1>
      <p className="mt-2 text-muted-foreground">Marks → percentage, grade, and approximate CGPA (÷9.5 rule).</p>

      <div className="mt-6 flex flex-wrap items-end gap-3 rounded-xl border border-border bg-card p-6">
        <div className="w-36">
          <label className="mb-1 block text-xs text-muted-foreground">Marks obtained</label>
          <input type="number" min="0" value={marks} onChange={(e) => setMarks(e.target.value)} placeholder="412" className="w-full rounded-md border border-input bg-background p-3 text-center font-mono text-sm outline-none" />
        </div>
        <span className="pb-3 text-muted-foreground">/</span>
        <div className="w-36">
          <label className="mb-1 block text-xs text-muted-foreground">Total marks</label>
          <input type="number" min="1" value={total} onChange={(e) => setTotal(e.target.value)} className="w-full rounded-md border border-input bg-background p-3 text-center font-mono text-sm outline-none" />
        </div>
        <div className="flex gap-1.5">
          {[300, 500, 600].map((v) => (
            <button key={v} type="button" onClick={() => setTotal(String(v))} className="rounded-md border border-border px-2.5 py-2 text-xs transition-colors hover:bg-secondary">
              {v}
            </button>
          ))}
        </div>
      </div>

      {t > 0 && m <= t && (
        <div className="mt-4 grid grid-cols-1 gap-3 text-center sm:grid-cols-3">
          <div className="rounded-lg border border-primary/50 bg-primary/10 p-5">
            <p className="text-xs text-muted-foreground">Percentage</p>
            <p className="mt-1 text-3xl font-bold text-primary">{pct.toFixed(2)}%</p>
          </div>
          <div className="rounded-lg border border-border bg-muted p-5">
            <p className="text-xs text-muted-foreground">Grade</p>
            <p className={`mt-1 text-3xl font-bold ${grade.c}`}>{grade.g}</p>
          </div>
          <div className="rounded-lg border border-border bg-muted p-5">
            <p className="text-xs text-muted-foreground">Approx. CGPA</p>
            <p className="mt-1 text-3xl font-bold">{cgpa.toFixed(1)}</p>
          </div>
          <button
            type="button"
            onClick={async () => { try { await navigator.clipboard.writeText(`${m}/${t} = ${pct.toFixed(2)}% (Grade ${grade.g}, ~CGPA ${cgpa.toFixed(1)})`); toast.success("Copied."); } catch { toast.error("Could not copy."); } }}
            className="inline-flex items-center justify-center gap-2 rounded-md border border-border px-4 py-2 text-sm transition-colors hover:bg-secondary sm:col-span-3"
          >
            <Copy className="h-4 w-4" /> Copy result
          </button>
        </div>
      )}
      {t > 0 && m > t && <p className="mt-4 text-center text-xs text-destructive">Marks can&apos;t exceed total.</p>}
    </div>
  );
}
