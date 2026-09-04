"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Copy, Download } from "lucide-react";

export default function CsvCleanerPage() {
  const [raw, setRaw] = useState("");
  const [status, setStatus] = useState("");

  const clean = (opts: { dedupe: boolean; trim: boolean; dropEmpty: boolean }) => {
    const lines = raw.split(/\r?\n/);
    let out = lines;
    if (opts.trim) out = out.map((l) => l.split(",").map((c) => c.trim()).join(","));
    if (opts.dropEmpty) out = out.filter((l) => l.replace(/,/g, "").trim() !== "");
    if (opts.dedupe) {
      const seen = new Set<string>();
      out = out.filter((l) => {
        const key = l.toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    }
    if (!raw.trim()) { toast.error("Paste some CSV first."); return; }
    const removed = lines.length - out.length;
    setStatus(`${lines.length} → ${out.length} rows (${removed} removed)`);
    setRaw(out.join("\n"));
    toast.success("Cleaned.");
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">CSV Cleaner</h1>
      <p className="mt-2 text-muted-foreground">Trim cells, drop empty rows, remove duplicates — spreadsheet hygiene in one click.</p>

      <div className="mt-6 flex flex-wrap gap-2">
        <button type="button" onClick={() => clean({ trim: true, dedupe: false, dropEmpty: false })} className="rounded-md border border-border px-4 py-2 text-sm transition-colors hover:bg-secondary">Trim cells</button>
        <button type="button" onClick={() => clean({ trim: false, dedupe: true, dropEmpty: false })} className="rounded-md border border-border px-4 py-2 text-sm transition-colors hover:bg-secondary">Remove duplicates</button>
        <button type="button" onClick={() => clean({ trim: false, dedupe: false, dropEmpty: true })} className="rounded-md border border-border px-4 py-2 text-sm transition-colors hover:bg-secondary">Drop empty rows</button>
        <button type="button" onClick={() => clean({ trim: true, dedupe: true, dropEmpty: true })} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90">Clean all</button>
        <button type="button" onClick={() => { setRaw(""); setStatus(""); }} className="rounded-md border border-border px-4 py-2 text-sm transition-colors hover:bg-secondary">Clear</button>
      </div>

      {status && <p className="mt-3 text-sm font-medium text-primary">{status}</p>}

      <textarea
        value={raw}
        onChange={(e) => setRaw(e.target.value)}
        rows={16}
        spellCheck={false}
        placeholder={"name,email,city\nAmit,amit@x.com,Delhi\n\nAmit,amit@x.com ,Delhi\nPriya,priya@y.com,Mumbai"}
        className="mt-4 w-full resize-y rounded-xl border border-input bg-background p-3 font-mono text-xs outline-none focus:ring-2 focus:ring-ring"
      />

      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={async () => { try { await navigator.clipboard.writeText(raw); toast.success("Copied."); } catch { toast.error("Could not copy."); } }}
          disabled={!raw}
          className="inline-flex items-center gap-1 rounded-md border border-border px-4 py-2 text-sm transition-colors hover:bg-secondary disabled:opacity-50"
        >
          <Copy className="h-4 w-4" /> Copy result
        </button>
        <button
          type="button"
          onClick={() => { const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([raw], { type: "text/csv" })); a.download = "cleaned.csv"; a.click(); URL.revokeObjectURL(a.href); toast.success("cleaned.csv downloaded."); }}
          disabled={!raw}
          className="inline-flex items-center gap-1 rounded-md border border-border px-4 py-2 text-sm transition-colors hover:bg-secondary disabled:opacity-50"
        >
          <Download className="h-4 w-4" /> Download CSV
        </button>
      </div>
    </div>
  );
}
