"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Copy, Check } from "lucide-react";

const TRACKERS = [
  "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content",
  "gclid", "fbclid", "msclkid", "dclid", "twclid",
  "ref", "ref_src", "igshid", "si", "spm", "mc_cid", "mc_eid",
];

export default function UrlCleanerPage() {
  const [url, setUrl] = useState("https://example.com/article?utm_source=news&id=42&fbclid=AbC&ref=twitter");
  const [aggressive, setAggressive] = useState(false);

  const result = (() => {
    const raw = url.trim();
    if (!raw) return "";
    try {
      const u = new URL(raw);
      const removed: string[] = [];
      const params = [...u.searchParams.keys()];
      for (const k of params) {
        const lower = k.toLowerCase();
        const junk = TRACKERS.some((t) => lower === t || lower.startsWith("utm_"));
        const junkish = aggressive && /^(sessionid|sid|phpsessid|_hsenc|_hsmi|yclid|vbrefsrc|action_ref_map)$/i.test(lower);
        if (junk || junkish) {
          removed.push(k);
          u.searchParams.delete(k);
        }
      }
      let out = u.toString();
      if (out.endsWith("?")) out = out.slice(0, -1);
      return out;
    } catch {
      return "⚠️ Invalid URL";
    }
  })();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">URL Cleaner</h1>
      <p className="mt-2 text-muted-foreground">Strip utm_*, gclid, fbclid and other tracking params — share clean links.</p>

      <input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        spellCheck={false}
        className="mt-6 w-full rounded-md border border-input bg-background p-3 font-mono text-xs outline-none focus:ring-2 focus:ring-ring"
      />

      <label className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
        <input type="checkbox" checked={aggressive} onChange={(e) => setAggressive(e.target.checked)} className="accent-primary" />
        Also strip session IDs (sessionid, sid, _hsenc…)
      </label>

      {result && !result.startsWith("⚠️") && result !== url.trim() && (
        <div className="mt-4 rounded-xl border border-primary/50 bg-primary/10 p-4">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-primary">Clean URL</p>
          <p className="break-all font-mono text-sm">{result}</p>
          <button
            type="button"
            onClick={async () => { try { await navigator.clipboard.writeText(result); toast.success("Clean URL copied."); } catch { toast.error("Could not copy."); } }}
            className="mt-3 inline-flex items-center gap-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Copy className="h-4 w-4" /> Copy clean link
          </button>
        </div>
      )}
      {result && !result.startsWith("⚠️") && result === url.trim() && (
        <p className="mt-4 inline-flex items-center gap-1 rounded-lg border border-border bg-card p-3 text-sm text-muted-foreground">
          <Check className="h-4 w-4 text-emerald-500" /> Already clean — no tracking params found.
        </p>
      )}

      <pre className="mt-4 max-h-32 overflow-auto rounded-xl border border-border bg-muted p-4 font-mono text-xs">{result || "Result appears here…"}</pre>
    </div>
  );
}
