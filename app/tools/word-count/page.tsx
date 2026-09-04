"use client";

import { useMemo, useState } from "react";
import { countStats } from "@/lib/tools/text";

const SAMPLE_TEXT =
  "PicExtractor is a free, private, browser-based toolkit. " +
  "No uploads. No accounts. No waiting.\n\n" +
  "Everything runs locally on your machine, so your files never leave your laptop. " +
  "Try it with any video, any size — frames appear in seconds.";

export default function WordCountPage() {
  const [text, setText] = useState("");
  const stats = useMemo(function () { return countStats(text); }, [text]);

  const cards = [
    { label: "Words", value: stats.words },
    { label: "Characters", value: stats.chars },
    { label: "No spaces", value: stats.charsNoSpace },
    { label: "Sentences", value: stats.sentences },
    { label: "Lines", value: stats.lines },
    { label: "Paragraphs", value: stats.paragraphs },
    { label: "Reading time (min)", value: stats.readingMinutes },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Word &amp; Character Counter</h1>
      <p className="mt-2 text-muted-foreground">Live stats for any text.</p>

      <div className="mt-6 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setText(SAMPLE_TEXT)}
          className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs transition-colors hover:bg-secondary"
        >
          Sample
        </button>
        <button
          type="button"
          onClick={() => setText("")}
          className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs transition-colors hover:bg-secondary"
        >
          Clear
        </button>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type or paste your text here…"
        spellCheck={false}
        className="mt-6 h-56 w-full resize-y rounded-md border border-input bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-ring"
      />

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
        {cards.map((card) => (
          <div key={card.label} className="rounded-xl border border-border bg-card p-4 text-center">
            <p className="text-2xl font-bold">{card.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{card.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
