"use client";

import { useEffect, useState } from "react";
import { Command, Search, ArrowUp, ArrowDown } from "lucide-react";

export default function ShortcutsHelp() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "?" && !e.metaKey && !e.ctrlKey && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-20 right-4 z-50 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs font-medium text-muted-foreground shadow-lg transition-all hover:bg-secondary hover:text-foreground"
        title="Keyboard shortcuts (?)"
      >
        <Command className="h-3.5 w-3.5" />
        Shortcuts
      </button>
    );
  }

  return (
    <>
      <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl" role="dialog" aria-label="Keyboard shortcuts">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <Command className="h-5 w-5 text-primary" />
              Keyboard Shortcuts
            </h2>
            <button type="button" onClick={() => setOpen(false)} className="rounded-lg px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
              Esc
            </button>
          </div>
          <div className="space-y-3 text-sm">
            {[
              { key: "Ctrl/⌘ + K", desc: "Open global search" },
              { key: "?", desc: "Show this help" },
              { key: "Esc", desc: "Close any modal" },
              { key: "Space", desc: "Play/pause video (on extractor)" },
              { key: "C", desc: "Capture current frame (on extractor)" },
            ].map((s) => (
              <div key={s.key} className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">{s.desc}</span>
                <kbd className="rounded-md border border-border bg-muted px-2.5 py-1 font-mono text-xs">{s.key}</kbd>
              </div>
            ))}
          </div>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Press <kbd className="rounded border border-border bg-muted px-1.5 font-mono">?</kbd> anytime to open this
          </p>
        </div>
      </div>
    </>
  );
}
