"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Copy, Download } from "lucide-react";

function toPascal(s: string): string {
  return s
    .replace(/[^a-zA-Z0-9]+(.)?/g, (_, c: string | undefined) => (c ? c.toUpperCase() : ""))
    .replace(/^(.)/, (m) => m.toUpperCase());
}

export default function JsonToTsPage() {
  const [json, setJson] = useState('{"id": 1, "name": "Ada", "email": "ada@ltd.dev", "active": true, "tags": ["admin", "dev"], "profile": {"city": "London", "age": 36}}');
  const [name, setName] = useState("User");

  const generate = (): string => {
    let root: unknown;
    try {
      root = JSON.parse(json);
    } catch {
      return "// ⚠️ Invalid JSON";
    }
    const lines: string[] = [];
    const seen = new Map<string, string>();
    let counter = 0;

    const tsType = (v: unknown, keyName: string): string => {
      if (v === null) return "null";
      if (Array.isArray(v)) {
        if (v.length === 0) return "unknown[]";
        return `${tsType(v[0], keyName)}[]`;
      }
      switch (typeof v) {
        case "string": return "string";
        case "number": return "number";
        case "boolean": return "boolean";
        case "object": {
          const ifaceName = `${toPascal(keyName || "Item")}${seen.has(keyName) && counter > 0 ? "" : ""}`;
          const unique = seen.get(keyName) ?? `${ifaceName}${++counter === 1 ? "" : counter}`;
          seen.set(keyName, unique);
          const inner = Object.entries(v as Record<string, unknown>)
            .map(([k, val]) => `  ${/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(k) ? k : `"${k}"`}: ${tsType(val, k)};`)
            .join("\n");
          lines.push(`interface ${unique} {\n${inner}\n}`);
          return unique;
        }
        default: return "unknown";
      }
    };

    const topType = tsType(root, name || "Root");
    return [...lines, Array.isArray(root) ? `type ${toPascal(name)}List = ${topType}[];` : "", "", `// Root type`, `type ${toPascal(name)} = ${topType};`].filter(Boolean).join("\n\n");
  };

  const out = generate();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">JSON → TypeScript</h1>
      <p className="mt-2 text-muted-foreground">Paste a JSON sample or API response — get matching TS interfaces instantly.</p>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="mb-2 flex items-center justify-between gap-2">
            <h3 className="font-semibold">JSON</h3>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Root name" className="w-32 rounded border border-input bg-background p-1.5 text-xs outline-none" />
          </div>
          <textarea value={json} onChange={(e) => setJson(e.target.value)} rows={12} spellCheck={false} className="w-full resize-y rounded-md border border-input bg-background p-3 font-mono text-xs outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-semibold">TypeScript</h3>
            <div className="flex gap-1.5">
              <button type="button" onClick={async () => { try { await navigator.clipboard.writeText(out); toast.success("Types copied."); } catch { toast.error("Could not copy."); } }} className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs transition-colors hover:bg-secondary">
                <Copy className="h-3.5 w-3.5" /> Copy
              </button>
              <button type="button" onClick={() => { const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([out], { type: "text/plain" })); a.download = "types.ts"; a.click(); URL.revokeObjectURL(a.href); toast.success("types.ts downloaded."); }} className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs transition-colors hover:bg-secondary">
                <Download className="h-3.5 w-3.5" /> .ts
              </button>
            </div>
          </div>
          <pre className="max-h-96 overflow-auto whitespace-pre-wrap rounded-md border border-border bg-muted p-3 font-mono text-xs">{out}</pre>
        </div>
      </div>
    </div>
  );
}
