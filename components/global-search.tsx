"use client";

import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { tools } from "./search-data";
import { moreTools } from "./search-data-2";

const allTools = [...tools, ...moreTools];

export default function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const results = query
    ? allTools.filter((t) =>
        t.title.toLowerCase().includes(query.toLowerCase()) ||
        t.keywords.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8)
    : [];

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-3 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
      >
        <Search className="h-4 w-4" />
        <span className="hidden sm:inline">Search tools</span>
        <kbd className="ml-2 hidden rounded bg-muted px-1.5 text-[10px] font-mono text-muted-foreground sm:inline">⌘K</kbd>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 pt-20 backdrop-blur-sm" onClick={() => setOpen(false)}>
          <div className="w-full max-w-lg rounded-xl border border-border bg-card shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 border-b border-border p-4">
              <Search className="h-5 w-5 text-muted-foreground" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search 80+ tools..."
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              <button type="button" onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="max-h-80 overflow-auto p-2">
              {results.length > 0 ? (
                results.map((t) => (
                  <button
                    key={t.href}
                    type="button"
                    onClick={() => { router.push(t.href); setOpen(false); setQuery(""); }}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-secondary"
                  >
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{t.title}</span>
                    <span className="ml-auto text-xs text-muted-foreground">{t.href}</span>
                  </button>
                ))
              ) : query ? (
                <p className="p-4 text-center text-sm text-muted-foreground">No tools found for &quot;{query}&quot;</p>
              ) : (
                <p className="p-4 text-center text-sm text-muted-foreground">Type to search...</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
