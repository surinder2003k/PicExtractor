"use client";

import { useState } from "react";
import { Plus, Trash2, Printer } from "lucide-react";

interface Item { id: number; desc: string; qty: number; price: number; }

export default function InvoicePage() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [number, setNumber] = useState("INV-001");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [gst, setGst] = useState(18);
  const [items, setItems] = useState<Item[]>([{ id: 1, desc: "", qty: 1, price: 0 }]);

  const subtotal = items.reduce((s, i) => s + i.qty * i.price, 0);
  const gstAmt = (subtotal * gst) / 100;
  const total = subtotal + gstAmt;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div>
          <h1 className="text-3xl font-bold">Invoice Generator</h1>
          <p className="mt-2 text-muted-foreground">Fill details, hit print — save as PDF from the print dialog.</p>
        </div>
        <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90">
          <Printer className="h-4 w-4" /> Print / Save PDF
        </button>
      </div>

      <div className="mt-6 rounded-xl border border-border bg-card p-6 print:border-0 print:p-0">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <input value={number} onChange={(e) => setNumber(e.target.value)} placeholder="Invoice #" className="rounded-md border border-input bg-background p-2.5 font-mono text-sm outline-none focus:ring-2 focus:ring-ring print:border-0" />
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="rounded-md border border-input bg-background p-2.5 text-sm outline-none focus:ring-2 focus:ring-ring print:border-0" />
          <textarea value={from} onChange={(e) => setFrom(e.target.value)} placeholder="From — your business name & address" rows={2} className="rounded-md border border-input bg-background p-2.5 text-sm outline-none focus:ring-2 focus:ring-ring print:border-0" />
          <textarea value={to} onChange={(e) => setTo(e.target.value)} placeholder="Bill To — client name & address" rows={2} className="rounded-md border border-input bg-background p-2.5 text-sm outline-none focus:ring-2 focus:ring-ring print:border-0" />
        </div>

        <table className="mt-6 w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="py-2">Description</th>
              <th className="py-2 w-20">Qty</th>
              <th className="py-2 w-28">Price (₹)</th>
              <th className="py-2 w-28 text-right">Amount</th>
              <th className="w-8 print:hidden"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.id} className="border-b border-border/50">
                <td className="py-1.5 pr-2">
                  <input value={it.desc} onChange={(e) => setItems(items.map((x) => x.id === it.id ? { ...x, desc: e.target.value } : x))} placeholder="Service / item" className="w-full bg-transparent p-1 outline-none" />
                </td>
                <td className="py-1.5 pr-2">
                  <input type="number" min="0" value={it.qty} onChange={(e) => setItems(items.map((x) => x.id === it.id ? { ...x, qty: Number(e.target.value) || 0 } : x))} className="w-full bg-transparent p-1 font-mono outline-none" />
                </td>
                <td className="py-1.5 pr-2">
                  <input type="number" min="0" value={it.price || ""} onChange={(e) => setItems(items.map((x) => x.id === it.id ? { ...x, price: Number(e.target.value) || 0 } : x))} className="w-full bg-transparent p-1 font-mono outline-none" />
                </td>
                <td className="py-1.5 text-right font-mono">{(it.qty * it.price).toFixed(2)}</td>
                <td className="print:hidden">
                  <button type="button" onClick={() => setItems(items.filter((x) => x.id !== it.id))} className="text-muted-foreground hover:text-destructive" aria-label="Remove">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button type="button" onClick={() => setItems([...items, { id: Date.now(), desc: "", qty: 1, price: 0 }])} className="mt-3 inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-sm transition-colors hover:bg-secondary print:hidden">
          <Plus className="h-4 w-4" /> Add line
        </button>

        <div className="mt-4 flex flex-col items-end gap-1 text-sm">
          <label className="flex items-center gap-2 text-xs text-muted-foreground print:hidden">
            GST %
            <input type="number" min="0" max="100" value={gst} onChange={(e) => setGst(Number(e.target.value) || 0)} className="w-16 rounded border border-input bg-background p-1 text-center font-mono" />
          </label>
          <p className="font-mono">Subtotal: ₹{subtotal.toFixed(2)}</p>
          <p className="font-mono">GST ({gst}%): ₹{gstAmt.toFixed(2)}</p>
          <p className="font-mono text-lg font-bold text-primary">Total: ₹{total.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}
