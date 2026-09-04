"use client";

import { useState } from "react";
import { toast } from "sonner";

interface Card { id: number; text: string; }
const COLUMNS = ["To Do", "In Progress", "Done"] as const;
type Col = (typeof COLUMNS)[number];

export default function KanbanPage() {
  const [cards, setCards] = useState<Record<Col, Card[]>>({ "To Do": [], "In Progress": [], "Done": [] });
  const [draft, setDraft] = useState<Record<Col, string>>({ "To Do": "", "In Progress": "", "Done": "" });

  const add = (col: Col) => {
    const text = draft[col].trim();
    if (!text) return;
    setCards({ ...cards, [col]: [...cards[col], { id: Date.now(), text }] });
    setDraft({ ...draft, [col]: "" });
  };
  const move = (from: Col, id: number, dir: -1 | 1) => {
    const idx = COLUMNS.indexOf(from) + dir;
    if (idx < 0 || idx >= COLUMNS.length) return;
    const card = cards[from].find((c) => c.id === id);
    if (!card) return;
    setCards({
      ...cards,
      [from]: cards[from].filter((c) => c.id !== id),
      [COLUMNS[idx]]: [...cards[COLUMNS[idx]], card],
    });
    toast.success(`Moved to ${COLUMNS[idx]}`);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Mini Kanban</h1>
      <p className="mt-2 text-muted-foreground">Personal task board — lightweight, private, stays on your device.</p>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {COLUMNS.map((col) => (
          <div key={col} className="rounded-xl border border-border bg-card p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-primary">{col}</h3>
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">{cards[col].length}</span>
            </div>
            <div className="mb-3 flex gap-1.5">
              <input
                value={draft[col]}
                onChange={(e) => setDraft({ ...draft, [col]: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && add(col)}
                placeholder="New task…"
                className="min-w-0 flex-1 rounded border border-input bg-background p-2 text-xs outline-none"
              />
              <button type="button" onClick={() => add(col)} className="rounded bg-primary px-2.5 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90">+</button>
            </div>
            <ul className="space-y-2">
              {cards[col].map((c) => (
                <li key={c.id} className="group flex items-center justify-between gap-1 rounded-lg border border-border bg-muted p-2.5 text-sm">
                  <span className="min-w-0 break-words">{c.text}</span>
                  <span className="flex shrink-0 gap-1">
                    {COLUMNS.indexOf(col) > 0 && (
                      <button type="button" onClick={() => move(col, c.id, -1)} aria-label="Move left" className="text-muted-foreground hover:text-primary">←</button>
                    )}
                    {COLUMNS.indexOf(col) < COLUMNS.length - 1 && (
                      <button type="button" onClick={() => move(col, c.id, 1)} aria-label="Move right" className="text-muted-foreground hover:text-primary">→</button>
                    )}
                    <button type="button" onClick={() => setCards({ ...cards, [col]: cards[col].filter((x) => x.id !== c.id) })} aria-label="Delete" className="text-muted-foreground hover:text-destructive">✕</button>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
