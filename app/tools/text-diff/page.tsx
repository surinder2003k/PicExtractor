"use client";

import { useMemo, useState } from "react";

type Line = { text: string; type: "same" | "add" | "del" };

function diffLines(a: string[], b: string[]): Line[] {
  const n = a.length, m = b.length;
  const lcs: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      lcs[i][j] = a[i] === b[j] ? lcs[i + 1][j + 1] + 1 : Math.max(lcs[i + 1][j], lcs[i][j + 1]);
    }
  }
  const out: Line[] = [];
  let i = 0, j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) { out.push({ text: a[i], type: "same" }); i++; j++; }
    else if (lcs[i + 1][j] >= lcs[i][j + 1]) { out.push({ text: a[i], type: "del" }); i++; }
    else { out.push({ text: b[j], type: "add" }); j++; }
  }
  while (i < n) { out.push({ text: a[i++], type: "del" }); }
  while (j < m) { out.push({ text: b[j++], type: "add" }); }
  return out;
}

const cls = { same: "", add: "bg-green-500/10 text-green-600 dark:text-green-400", del: "bg-red-500/10 text-red-600 dark:text-red-400" };
const sign = { same: " ", add: "+", del: "-" };

export default function TextDiffPage() {
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");

  const changes = useMemo(() => {
    if (!left && !right) return [];
    return diffLines(left.split("\n"), right.split("\n"));
  }, [left, right]);

  const added = changes.filter((c) => c.type === "add").length;
  const removed = changes.filter((c) => c.type === "del").length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Text Diff</h1>
      <p className="mt-2 text-muted-foreground">Compare two versions of text or a config — line by line, like git.</p>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="mb-2 font-semibold">Original</h3>
          <textarea
            value={left}
            onChange={(e) => setLeft(e.target.value)}
            spellCheck={false}
            className="h-56 w-full resize-y rounded-md border border-input bg-background p-3 font-mono text-xs outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="mb-2 font-semibold">Changed</h3>
          <textarea
            value={right}
            onChange={(e) => setRight(e.target.value)}
            spellCheck={false}
            className="h-56 w-full resize-y rounded-md border border-input bg-background p-3 font-mono text-xs outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      {(left || right) && (
        <div className="mt-4 rounded-xl border border-border bg-card p-4">
          <div className="mb-2 flex items-center gap-3 text-xs text-muted-foreground">
            <h3 className="font-semibold text-foreground">Differences</h3>
            <span className="text-green-600 dark:text-green-400">+{added} added</span>
            <span className="text-red-600 dark:text-red-400">-{removed} removed</span>
          </div>
          <pre className="max-h-96 overflow-auto rounded-md border border-border bg-muted p-3 font-mono text-xs leading-relaxed">
            {changes.map((l, i) => (
              <div key={i} className={cls[l.type]}>
                {sign[l.type]} {l.text}
              </div>
            ))}
          </pre>
        </div>
      )}
    </div>
  );
}
