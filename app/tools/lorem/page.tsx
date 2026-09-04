"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Copy, RefreshCcw } from "lucide-react";

const WORDS = "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum".split(" ");

const sentence = () => {
  const len = 8 + Math.floor(Math.random() * 12);
  const words = Array.from({ length: len }, () => WORDS[Math.floor(Math.random() * WORDS.length)]);
  const s = words.join(" ");
  return s.charAt(0).toUpperCase() + s.slice(1) + ".";
};

const paragraph = (startLorem: boolean) => {
  const len = 3 + Math.floor(Math.random() * 3);
  const parts = Array.from({ length: len }, sentence);
  if (startLorem) parts[0] = "Lorem ipsum dolor sit amet, " + parts[0].charAt(0).toLowerCase() + parts[0].slice(1);
  return parts.join(" ");
};

export default function LoremPage() {
  const [count, setCount] = useState(3);
  const [output, setOutput] = useState("");

  const generate = () => {
    setOutput(Array.from({ length: count }, (_, i) => paragraph(i === 0)).join("\n\n"));
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Lorem Ipsum Generator</h1>
      <p className="mt-2 text-muted-foreground">Placeholder text for mockups, decks, and templates.</p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <label className="text-sm text-muted-foreground">Paragraphs:</label>
        <select
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          className="rounded-md border border-border bg-background p-2 text-sm outline-none"
        >
          {[1, 3, 5, 10].map((n) => <option key={n} value={n}>{n}</option>)}
        </select>
        <button
          type="button"
          onClick={generate}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          <RefreshCcw className="h-4 w-4" /> Generate
        </button>
        {output && (
          <button
            type="button"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(output);
                toast.success("Copied.");
              } catch {
                toast.error("Could not copy.");
              }
            }}
            className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-2 text-xs transition-colors hover:bg-secondary"
          >
            <Copy className="h-3.5 w-3.5" /> Copy
          </button>
        )}
      </div>

      {output && (
        <pre className="mt-6 max-h-96 overflow-auto whitespace-pre-wrap rounded-xl border border-border bg-card p-5 text-sm leading-relaxed">{output}</pre>
      )}
    </div>
  );
}
