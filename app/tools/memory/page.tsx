"use client";

import { useState } from "react";

const ICONS = ["🍎", "🚀", "🎧", "🌵", "🐙", "⚡", "🎲", "🌈"];

interface Card { id: number; icon: string; flipped: boolean; matched: boolean; }

function shuffle(): Card[] {
  const pairs = [...ICONS.slice(0, 8), ...ICONS.slice(0, 8)];
  for (let i = pairs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
  }
  return pairs.map((icon, i) => ({ id: i, icon, flipped: false, matched: false }));
}

export default function MemoryPage() {
  const [cards, setCards] = useState<Card[]>(shuffle);
  const [picked, setPicked] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const won = cards.every((c) => c.matched);

  const flip = (id: number) => {
    if (picked.length === 2) return;
    const card = cards.find((c) => c.id === id)!;
    if (card.flipped || card.matched) return;
    const next = cards.map((c) => (c.id === id ? { ...c, flipped: true } : c));
    const nowPicked = [...picked, id];
    setCards(next);
    setPicked(nowPicked);

    if (nowPicked.length === 2) {
      setMoves(moves + 1);
      const [a, b] = nowPicked.map((i) => next.find((c) => c.id === i)!);
      if (a.icon === b.icon) {
        setTimeout(() => {
          setCards((cs) => cs.map((c) => (c.id === a.id || c.id === b.id ? { ...c, matched: true } : c)));
          setPicked([]);
        }, 350);
      } else {
        setTimeout(() => {
          setCards((cs) => cs.map((c) => (c.id === a.id || c.id === b.id ? { ...c, flipped: false } : c)));
          setPicked([]);
        }, 750);
      }
    }
  };

  const reset = () => { setCards(shuffle()); setPicked([]); setMoves(0); };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Memory Match</h1>
      <p className="mt-2 text-muted-foreground">Brain break between meetings — find all 8 pairs.</p>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Moves: <strong className="text-foreground">{moves}</strong></span>
        <button type="button" onClick={reset} className="rounded-md border border-border px-4 py-1.5 text-sm transition-colors hover:bg-secondary">
          🔄 New game
        </button>
      </div>

      {won && (
        <p className="mt-4 rounded-lg border border-primary/50 bg-primary/10 p-3 text-center font-semibold text-primary">
          🎉 You won in {moves} moves!
        </p>
      )}

      <div className="mt-4 grid grid-cols-4 gap-3">
        {cards.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => flip(c.id)}
            className={`flex aspect-square items-center justify-center rounded-xl border text-3xl transition-all duration-200 ${
              c.flipped || c.matched
                ? c.matched ? "border-primary/60 bg-primary/15" : "border-border bg-card"
                : "border-border bg-muted hover:bg-secondary"
            }`}
            aria-label={c.flipped || c.matched ? c.icon : "hidden card"}
          >
            {c.flipped || c.matched ? c.icon : "❓"}
          </button>
        ))}
      </div>
    </div>
  );
}
