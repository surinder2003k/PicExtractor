"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Copy } from "lucide-react";

export default function RadiusPage() {
  const [tl, setTl] = useState(16);
  const [tr, setTr] = useState(16);
  const [br, setBr] = useState(16);
  const [bl, setBl] = useState(16);
  const [unit, setUnit] = useState<"px" | "%" | "rem">("px");

  const linked = tl === tr && tr === br && br === bl;
  const setAll = (v: number) => { setTl(v); setTr(v); setBr(v); setBl(v); };

  const css = `border-radius: ${tl}${unit} ${tr}${unit} ${br}${unit} ${bl}${unit};`;

  const corners = [
    { label: "Top left", val: tl, set: setTl },
    { label: "Top right", val: tr, set: setTr },
    { label: "Bottom right", val: br, set: setBr },
    { label: "Bottom left", val: bl, set: setBl },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Border Radius Generator</h1>
      <p className="mt-2 text-muted-foreground">Per-corner rounding with live preview — copy the CSS.</p>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="flex items-center justify-center rounded-xl border border-border bg-muted p-10">
          <div className="h-40 w-56 border border-border bg-card" style={{ borderRadius: `${tl}${unit} ${tr}${unit} ${br}${unit} ${bl}${unit}` }} />
        </div>

        <div className="space-y-4 rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2">
            {(["px", "%", "rem"] as const).map((u) => (
              <button key={u} type="button" onClick={() => setUnit(u)} className={`rounded-md border px-3 py-1 text-xs font-mono transition-colors ${unit === u ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-secondary"}`}>
                {u}
              </button>
            ))}
            <button type="button" onClick={() => setAll(tl)} disabled={linked} className={`ml-auto rounded-md border px-3 py-1 text-xs transition-colors ${linked ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-secondary disabled:opacity-40"}`}>
              Link all
            </button>
          </div>

          {linked ? (
            <div>
              <label className="mb-1 flex justify-between text-xs">
                <span className="text-muted-foreground">All corners</span>
                <span className="font-mono">{tl}{unit}</span>
              </label>
              <input type="range" min={0} max={unit === "%" ? 50 : 100} value={tl} onChange={(e) => setAll(Number(e.target.value))} className="w-full cursor-pointer accent-primary" />
            </div>
          ) : (
            corners.map((c) => (
              <div key={c.label}>
                <label className="mb-1 flex justify-between text-xs">
                  <span className="text-muted-foreground">{c.label}</span>
                  <span className="font-mono">{c.val}{unit}</span>
                </label>
                <input type="range" min={0} max={unit === "%" ? 50 : 100} value={c.val} onChange={(e) => c.set(Number(e.target.value))} className="w-full cursor-pointer accent-primary" />
              </div>
            ))
          )}

          <div className="flex items-start gap-2">
            <pre className="min-w-0 flex-1 overflow-auto rounded-md border border-border bg-muted p-3 font-mono text-xs">{css}</pre>
            <button
              type="button"
              onClick={async () => { try { await navigator.clipboard.writeText(css); toast.success("CSS copied."); } catch { toast.error("Could not copy."); } }}
              className="inline-flex shrink-0 items-center gap-1 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              <Copy className="h-4 w-4" /> Copy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
