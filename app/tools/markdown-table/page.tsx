"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Copy } from "lucide-react";

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [], field = "", inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') inQuotes = false;
      else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      if (field || row.length) { row.push(field); rows.push(row); row = []; field = ""; }
    } else field += c;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  return rows;
}

export default function MarkdownTablePage() {
  const [csv, setCsv] = useState("");

  const md = useMemo(() => {
    const rows = parseCsv(csv).filter((r) => r.length > 0);
    if (rows.length === 0) return "";
    const width = Math.max(...rows.map((r) => r.length));
    const pad = rows.map((r) => { const c = [...r]; while (c.length < width) c.push(""); return c; });
    const esc = (s: string) => s.replace(/\|/g, "\\|");
    const head = `| ${pad[0].map(esc).join(" | ")} |`;
    const sep = `| ${Array(width).fill("---").join(" | ")} |`;
    const body = pad.slice(1).map((r) => `| ${r.map(esc).join(" | ")} |`);
    return [head, sep, ...body].join("\n");
  }, [csv]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">CSV → Markdown Table</h1>
      <p className="mt-2 text-muted-foreground">Paste spreadsheet data, get a GitHub/Notion-ready Markdown table.</p>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="mb-2 font-semibold">CSV / pasted rows</h3>
          <textarea
            value={csv}
            onChange={(e) => setCsv(e.target.value)}
            spellCheck={false}
            placeholder={"name,role,city\nAsha,PM,Delhi\nRahul,Dev,Mumbai"}
            className="h-64 w-full resize-y rounded-md border border-input bg-background p-3 font-mono text-xs outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-semibold">Markdown</h3>
            <button
              type="button"
              onClick={async () => {
                if (!md) return;
                try {
                  await navigator.clipboard.writeText(md);
                  toast.success("Copied Markdown.");
                } catch {
                  toast.error("Could not copy.");
                }
              }}
              disabled={!md}
              className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs transition-colors hover:bg-secondary disabled:opacity-50"
            >
              <Copy className="h-3.5 w-3.5" /> Copy
            </button>
          </div>
          <pre className="h-64 overflow-auto whitespace-pre-wrap rounded-md border border-border bg-muted p-3 font-mono text-xs">{md || "Markdown table appears here…"}</pre>
        </div>
      </div>
    </div>
  );
}
