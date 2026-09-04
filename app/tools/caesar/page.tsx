"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Copy } from "lucide-react";

function caesar(text: string, shift: number): string {
  return text.replace(/[a-zA-Z]/g, (c) => {
    const base = c <= "Z" ? 65 : 97;
    return String.fromCharCode(((c.charCodeAt(0) - base + ((shift % 26) + 26)) % 26) + base);
  });
}

const ROTBEST = (() => {
  const words = [" the ", " and ", " is ", " of ", " to ", " ing ", " that "];
  return (s: string): number => {
    const low = " " + s.toLowerCase() + " ";
    return words.reduce((n, w) => n + (low.split(w).length - 1), 0);
  };
})();

export default function CaesarPage() {
  const [text, setText] = useState("");
  const [shift, setShift] = useState(3);

  const encoded = caesar(text, shift);
  const decoded = caesar(text, -shift);

  const brute = text
    ? Array.from({ length: 26 }, (_, i) => ({ shift: i, text: caesar(text, -i) }))
        .sort((a, b) => ROTBEST(b.text) - ROTBEST(a.text))
        .slice(0, 3)
    : [];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Caesar Cipher</h1>
      <p className="mt-2 text-muted-foreground">Classic shift cipher — encode, decode, and auto-crack (ROT13 etc.).</p>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
        placeholder="Type text here…"
        className="mt-6 w-full resize-y rounded-xl border border-input bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-ring"
      />

      <div className="mt-4 flex items-center gap-3">
        <label className="flex flex-1 items-center gap-3 text-sm">
          <span className="text-muted-foreground">Shift</span>
          <input type="range" min={1} max={25} value={shift} onChange={(e) => setShift(Number(e.target.value))} className="flex-1 cursor-pointer accent-primary" />
          <span className="w-16 font-mono">{shift} ({shift === 13 ? "ROT13" : `−${26 - shift} to decode`})</span>
        </label>
      </div>

      {(["Encode", "Decode"] as const).map((mode) => {
        const val = mode === "Encode" ? encoded : decoded;
        return (
          <div key={mode} className="mt-4 rounded-xl border border-border bg-card p-4">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-primary">{mode}</h3>
              <button
                type="button"
                onClick={async () => { try { await navigator.clipboard.writeText(val); toast.success(`${mode} copied.`); } catch { toast.error("Could not copy."); } }}
                className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs transition-colors hover:bg-secondary"
              >
                <Copy className="h-3.5 w-3.5" /> Copy
              </button>
            </div>
            <p className="break-words rounded-md border border-border bg-muted p-3 font-mono text-sm">{val || "—"}</p>
          </div>
        );
      })}

      {brute.length > 0 && (
        <div className="mt-4 rounded-xl border border-border bg-card p-4">
          <h3 className="mb-2 text-sm font-semibold text-primary">🕵️ Auto-crack — most likely originals</h3>
          {brute.map((b) => (
            <p key={b.shift} className="mt-1 break-words text-sm text-muted-foreground">
              <span className="mr-2 font-mono text-xs text-primary">shift {b.shift}:</span>
              {b.text.slice(0, 90)}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
