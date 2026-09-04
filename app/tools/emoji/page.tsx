"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Copy, Search } from "lucide-react";

const EMOJI: Record<string, string[]> = {
  "Smileys & People": ["😀", "😃", "😄", "😁", "😆", "😅", "😂", "🙂", "😉", "😊", "😍", "🤩", "😘", "😎", "🤔", "🤗", "🤝", "🙌", "👏", "🙏", "💪", "🫡", "🤓", "🥳"],
  "Work & Office": ["💼", "📈", "📉", "📊", "🧾", "📝", "📎", "🗂️", "📁", "📅", "⏰", "💡", "🔔", "📌", "✅", "❌", "⚠️", "🔄", "🚀", "🎯", "🧠", "💰", "🏆", "🔖"],
  "Tech": ["💻", "🖥️", "📱", "⌨️", "🖱️", "🔌", "🔋", "🛜", "🤖", "🧑‍💻", "🐙", "🐞", "🔧", "🧪", "📡", "💾", "🗄️", "⚙️"],
  "Hearts & Symbols": ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "💯", "✨", "⭐", "🔥", "⚡", "🌈", "✔️", "❓", "❗", "➡️", "🔁", "♻️"],
};

export default function EmojiPage() {
  const [q, setQ] = useState("");
  const ql = q.toLowerCase();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Emoji Copier</h1>
      <p className="mt-2 text-muted-foreground">Quick emoji lookup for chats, docs, and commits. Click to copy.</p>

      <div className="mt-6 flex items-center gap-2 rounded-md border border-input bg-background px-3">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter categories (work, tech, heart)…" className="min-w-0 flex-1 bg-transparent p-2.5 text-sm outline-none" />
      </div>

      {Object.entries(EMOJI).map(([cat, list]) => {
        const filtered = ql ? cat.toLowerCase().includes(ql) || cat.includes(q) ? list : [] : list;
        if (ql && filtered.length === 0) return null;
        return (
          <section key={cat} className="mt-5">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{cat}</h3>
            <div className="flex flex-wrap gap-1.5">
              {filtered.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={async () => { try { await navigator.clipboard.writeText(e); toast.success(`${e} copied.`); } catch { toast.error("Could not copy."); } }}
                  className="flex h-11 w-11 items-center justify-center rounded-lg border border-border bg-card text-xl transition-transform hover:scale-110 hover:bg-secondary"
                >
                  {e}
                </button>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
