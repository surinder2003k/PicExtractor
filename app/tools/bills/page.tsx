"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

interface Bill { id: number; name: string; amount: number; due: string; paid: boolean; }
const KEY = "bill-reminder";

export default function BillsPage() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [due, setDue] = useState("");

  useEffect(() => {
    try { setBills(JSON.parse(localStorage.getItem(KEY) || "[]")); } catch { /* ignore */ }
  }, []);
  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(bills));
  }, [bills]);

  const add = () => {
    if (!name.trim() || !Number(amount)) { toast.error("Enter a name and amount."); return; }
    setBills([...bills, { id: Date.now(), name: name.trim(), amount: Number(amount), due: due || new Date().toISOString().slice(0, 10), paid: false }]);
    setName(""); setAmount(""); setDue("");
    toast.success("Bill added.");
  };

  const today = new Date().toISOString().slice(0, 10);
  const pending = bills.filter((b) => !b.paid);
  const pendingTotal = pending.reduce((s, b) => s + b.amount, 0);
  const overdue = pending.filter((b) => b.due < today);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Bill Reminder</h1>
      <p className="mt-2 text-muted-foreground">Track monthly bills — saved on your device, never uploaded.</p>

      <div className="mt-6 flex flex-wrap items-end gap-2 rounded-xl border border-border bg-card p-4">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Bill name (Rent, WiFi…)" className="min-w-36 flex-1 rounded-md border border-input bg-background p-2.5 text-sm outline-none" />
        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount ₹" className="w-28 rounded-md border border-input bg-background p-2.5 font-mono text-sm outline-none" />
        <input type="date" value={due} onChange={(e) => setDue(e.target.value)} className="rounded-md border border-input bg-background p-2.5 text-sm outline-none" />
        <button type="button" onClick={add} className="inline-flex items-center gap-1 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90">
          <Plus className="h-4 w-4" /> Add
        </button>
      </div>

      {bills.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-3 text-center">
          <div className="rounded-lg border border-border bg-muted p-4">
            <p className="text-xs text-muted-foreground">Pending ({pending.length})</p>
            <p className="mt-1 text-2xl font-bold text-primary">₹{pendingTotal.toLocaleString()}</p>
          </div>
          <div className={`rounded-lg border p-4 ${overdue.length ? "border-destructive/50 bg-destructive/10" : "border-border bg-muted"}`}>
            <p className="text-xs text-muted-foreground">Overdue</p>
            <p className={`mt-1 text-2xl font-bold ${overdue.length ? "text-destructive" : ""}`}>{overdue.length}</p>
          </div>
        </div>
      )}

      <ul className="mt-4 space-y-2">
        {bills.length === 0 && <p className="mt-6 text-center text-sm text-muted-foreground">No bills yet — add your first one above.</p>}
        {bills.map((b) => {
          const isOverdue = !b.paid && b.due < today;
          return (
            <li key={b.id} className={`flex items-center justify-between gap-3 rounded-lg border p-3.5 ${isOverdue ? "border-destructive/50 bg-destructive/5" : "border-border bg-card"}`}>
              <div className="min-w-0">
                <p className={`truncate text-sm font-medium ${b.paid ? "text-muted-foreground line-through" : ""}`}>{b.name}</p>
                <p className="text-xs text-muted-foreground">Due {b.due}{isOverdue && <span className="ml-1 font-semibold text-destructive">· OVERDUE</span>}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span className="font-mono text-sm font-semibold">₹{b.amount.toLocaleString()}</span>
                <button type="button" onClick={() => setBills(bills.map((x) => x.id === b.id ? { ...x, paid: !x.paid } : x))} className={`rounded-md border px-2.5 py-1 text-xs transition-colors ${b.paid ? "border-border text-muted-foreground hover:bg-secondary" : "border-primary/60 text-primary hover:bg-primary/10"}`}>
                  {b.paid ? "Undo" : "Paid ✓"}
                </button>
                <button type="button" onClick={() => setBills(bills.filter((x) => x.id !== b.id))} aria-label="Delete" className="text-muted-foreground transition-colors hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
