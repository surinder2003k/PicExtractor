"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";

export default function AdvicePage() {
  const [advice, setAdvice] = useState<string | null>(null);
  const [id, setId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchAdvice = async () => {
    setLoading(true);
    try {
      const res = await fetch(`https://api.adviceslip.com/advice?t=${Date.now()}`, { cache: "no-store" });
      const json = await res.json();
      setAdvice(json.slip.advice);
      setId(json.slip.id);
    } catch {
      setAdvice("Could not reach the wisdom oracle. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Random Advice</h1>
      <p className="mt-2 text-muted-foreground">A nugget of wisdom for your day — great for team standup openers.</p>

      <div className="mt-8 rounded-xl border border-border bg-card p-10 text-center">
        {advice ? (
          <>
            {id !== null && <p className="text-xs font-mono text-muted-foreground">Advice #{id}</p>}
            <p className="mt-3 text-2xl font-medium leading-relaxed">&ldquo;{advice}&rdquo;</p>
          </>
        ) : (
          <p className="text-muted-foreground">Click the button and let the oracle speak…</p>
        )}
        <button
          type="button"
          onClick={fetchAdvice}
          disabled={loading}
          className="mt-8 inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          {loading ? "Thinking…" : advice ? "More wisdom" : "Get advice"}
        </button>
      </div>
    </div>
  );
}
