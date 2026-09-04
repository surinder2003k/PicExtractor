"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Copy, ArrowDownUp } from "lucide-react";

const MORSE: Record<string, string> = {
  a: ".-", b: "-...", c: "-.-.", d: "-..", e: ".", f: "..-.", g: "--.", h: "....",
  i: "..", j: ".---", k: "-.-", l: ".-..", m: "--", n: "-.", o: "---", p: ".--.",
  q: "--.-", r: ".-.", s: "...", t: "-", u: "..-", v: "...-", w: ".--", x: "-..-",
  y: "-.--", z: "--..", "0": "-----", "1": ".----", "2": "..---", "3": "...--",
  "4": "....-", "5": ".....", "6": "-....", "7": "--...", "8": "---..", "9": "----.",
  ".": ".-.-.-", ",": "--..--", "?": "..--..", "!": "-.-.--", "/": "-..-.", "@": ".--.-.",
  "-": "-....-", "(": "-.--.", ")": "-.--.-",
};

const REVERSE: Record<string, string> = Object.fromEntries(Object.entries(MORSE).map(([k, v]) => [v, k]));

type Mode = "toMorse" | "toText";

export default function MorsePage() {
  const [mode, setMode] = useState<Mode>("toMorse");
  const [input, setInput] = useState("");

  const output = (() => {
    if (!input.trim()) return "";
    try {
      if (mode === "toMorse") {
        return input.toLowerCase().split("").map((c) => (c === " " ? "/" : MORSE[c] ?? c)).join(" ");
      }
      return input.trim().split(/\s+/).map((t) => (t === "/" ? " " : REVERSE[t] ?? t)).join("");
    } catch {
      return "⚠️ Could not translate";
    }
  })();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Morse Code Translator</h1>
      <p className="mt-2 text-muted-foreground">Text ⇄ Morse code — fun for events, puzzles, and treasure hunts.</p>

      <button
        type="button"
        onClick={() => setMode(mode === "toMorse" ? "toText" : "toMorse")}
        className="mt-6 inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary"
      >
        <ArrowDownUp className="h-4 w-4" />
        {mode === "toMorse" ? "Text → Morse" : "Morse → Text"}
      </button>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="mb-2 font-semibold">{mode === "toMorse" ? "Text" : "Morse ( . - / )"}</h3>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
            placeholder={mode === "toMorse" ? "SOS" : "... --- ..."}
            className="h-52 w-full resize-y rounded-md border border-input bg-background p-3 font-mono text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-semibold">{mode === "toMorse" ? "Morse" : "Text"}</h3>
            <button
              type="button"
              onClick={async () => {
                if (!output) return;
                try {
                  await navigator.clipboard.writeText(output);
                  toast.success("Copied.");
                } catch {
                  toast.error("Could not copy.");
                }
              }}
              disabled={!output}
              className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs transition-colors hover:bg-secondary disabled:opacity-50"
            >
              <Copy className="h-3.5 w-3.5" /> Copy
            </button>
          </div>
          <pre className="h-52 overflow-auto whitespace-pre-wrap rounded-md border border-border bg-muted p-3 font-mono text-sm">{output || "Translation appears here…"}</pre>
        </div>
      </div>
    </div>
  );
}
