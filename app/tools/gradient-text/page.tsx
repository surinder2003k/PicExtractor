"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Copy } from "lucide-react";

const PRESETS = [
  { name: "Sunset", a: "#f97316", b: "#ec4899", dir: "to right" },
  { name: "Ocean", a: "#0ea5e9", b: "#6366f1", dir: "to right" },
  { name: "Forest", a: "#10b981", b: "#84cc16", dir: "to bottom right" },
  { name: "Candy", a: "#ec4899", b: "#8b5cf6", dir: "to right" },
  { name: "Fire", a: "#ef4444", b: "#f59e0b", dir: "to top" },
];

export default function GradientTextPage() {
  const [text, setText] = useState("PicExtractor");
  const [a, setA] = useState("#f97316");
  const [b, setB] = useState("#ec4899");
  const [dir, setDir] = useState("to right");

  const css = `background: linear-gradient(${dir}, ${a}, ${b});\n-webkit-background-clip: text;\nbackground-clip: text;\ncolor: transparent;`;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Gradient Text Generator</h1>
      <p className="mt-2 text-muted-foreground">Eye-catching gradient headlines — copy-paste CSS for your site.</p>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Your text" className="min-w-48 flex-1 rounded-md border border-input bg-background p-2.5 text-sm outline-none" />
        <input type="color" value={a} onChange={(e) => setA(e.target.value)} aria-label="Start color" className="h-10 w-12 cursor-pointer rounded-lg border border-border" />
        <input type="color" value={b} onChange={(e) => setB(e.target.value)} aria-label="End color" className="h-10 w-12 cursor-pointer rounded-lg border border-border" />
        <select value={dir} onChange={(e) => setDir(e.target.value)} className="rounded-md border border-border bg-background p-2 text-sm outline-none">
          {["to right", "to left", "to bottom", "to top", "45deg", "135deg"].map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button key={p.name} type="button" onClick={() => { setA(p.a); setB(p.b); setDir(p.dir); }} className="rounded-full border border-border px-3 py-1 text-xs transition-colors hover:bg-secondary">
            <span className="mr-1 inline-block h-2.5 w-2.5 rounded-full align-middle" style={{ background: `linear-gradient(${p.dir}, ${p.a}, ${p.b})` }} />
            {p.name}
          </button>
        ))}
      </div>

      <div className="mt-6 rounded-xl border border-border bg-card p-10 text-center">
        <p
          className="text-5xl font-extrabold tracking-tight sm:text-6xl"
          style={{ background: `linear-gradient(${dir}, ${a}, ${b})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}
        >
          {text || "Preview"}
        </p>
      </div>

      <div className="mt-4 flex items-start gap-2">
        <pre className="min-w-0 flex-1 overflow-auto rounded-xl border border-border bg-muted p-4 font-mono text-xs">{css}</pre>
        <button
          type="button"
          onClick={async () => { try { await navigator.clipboard.writeText(css); toast.success("CSS copied."); } catch { toast.error("Could not copy."); } }}
          className="inline-flex shrink-0 items-center gap-1 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Copy className="h-4 w-4" /> Copy
        </button>
      </div>
    </div>
  );
}
