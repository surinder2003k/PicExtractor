"use client";

import { useState } from "react";
import { Search } from "lucide-react";

type Entry = {
  word: string;
  phonetic?: string;
  meanings: {
    partOfSpeech: string;
    definitions: { definition: string; example?: string }[];
    synonyms?: string[];
  }[];
};

export default function DictionaryPage() {
  const [word, setWord] = useState("");
  const [data, setData] = useState<Entry[] | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const lookup = (w: string) => {
    const term = w.trim();
    if (!term) return;
    setLoading(true);
    setError("");
    setData(null);
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(term)}`)
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((j) => setData(j))
      .catch(() => setError(`No definition found for "${term}".`))
      .finally(() => setLoading(false));
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Dictionary</h1>
      <p className="mt-2 text-muted-foreground">Instant word definitions — great for emails, docs, and proposals.</p>

      <div className="mt-6 flex gap-2">
        <input
          value={word}
          onChange={(e) => setWord(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && lookup(word)}
          placeholder="Search a word… e.g. synergy"
          className="w-full rounded-md border border-input bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
        <button
          type="button"
          onClick={() => lookup(word)}
          className="inline-flex shrink-0 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Search className="h-4 w-4" /> Look up
        </button>
      </div>

      {loading && <p className="mt-4 text-sm text-muted-foreground">Looking up…</p>}
      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

      {data?.[0] && (
        <div className="mt-6 space-y-4">
          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="text-2xl font-bold">{data[0].word}</h2>
            {data[0].phonetic && <p className="text-sm text-muted-foreground">{data[0].phonetic}</p>}
          </div>
          {data[0].meanings.map((m, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-5">
              <p className="text-xs font-medium uppercase tracking-wide text-primary">{m.partOfSpeech}</p>
              <ol className="mt-2 list-decimal space-y-2 pl-5 text-sm">
                {m.definitions.slice(0, 4).map((d, j) => (
                  <li key={j}>
                    {d.definition}
                    {d.example && <p className="mt-1 text-xs italic text-muted-foreground">“{d.example}”</p>}
                  </li>
                ))}
              </ol>
              {m.synonyms && m.synonyms.length > 0 && (
                <p className="mt-3 text-xs text-muted-foreground">Synonyms: {m.synonyms.slice(0, 8).join(", ")}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
