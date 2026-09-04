"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const KEY = "habit-tracker-v1";

interface Habit { id: number; name: string; done: boolean[]; }

export default function HabitPage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [name, setName] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setHabits(JSON.parse(raw));
    } catch { /* ignore */ }
  }, []);

  const save = (next: Habit[]) => {
    setHabits(next);
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* ignore */ }
  };

  const add = () => {
    if (!name.trim()) return;
    save([...habits, { id: Date.now(), name: name.trim(), done: Array(7).fill(false) }]);
    setName("");
  };

  const toggle = (hid: number, day: number) => {
    save(habits.map((h) => h.id === hid ? { ...h, done: h.done.map((d, i) => i === day ? !d : d) } : h));
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Weekly Habit Tracker</h1>
      <p className="mt-2 text-muted-foreground">Track daily habits for the week — saved right in your browser.</p>

      <div className="mt-6 flex gap-2 print:hidden">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder="New habit (e.g. Read 30 min)"
          className="flex-1 rounded-md border border-input bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
        <button type="button" onClick={add} className="rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90">
          Add
        </button>
      </div>

      {habits.length === 0 ? (
        <p className="mt-10 text-center text-sm text-muted-foreground">No habits yet — add your first one above.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                <th className="p-3 text-left">Habit</th>
                {DAYS.map((d) => <th key={d} className="p-3">{d}</th>)}
                <th className="p-3">Streak</th>
                <th className="p-3 print:hidden"></th>
              </tr>
            </thead>
            <tbody>
              {habits.map((h) => (
                <tr key={h.id} className="border-b border-border/50 last:border-0">
                  <td className="p-3 font-medium">{h.name}</td>
                  {h.done.map((d, i) => (
                    <td key={i} className="p-3 text-center">
                      <button
                        type="button"
                        onClick={() => toggle(h.id, i)}
                        aria-label={`${h.name} ${DAYS[i]}`}
                        className={`inline-flex h-8 w-8 items-center justify-center rounded-md border transition-colors ${d ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-secondary"}`}
                      >
                        {d && <Check className="h-4 w-4" />}
                      </button>
                    </td>
                  ))}
                  <td className="p-3 text-center font-mono font-bold text-primary">{h.done.filter(Boolean).length}/7</td>
                  <td className="p-3 text-right print:hidden">
                    <button type="button" onClick={() => save(habits.filter((x) => x.id !== h.id))} className="text-muted-foreground transition-colors hover:text-destructive" aria-label="Delete habit">
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
