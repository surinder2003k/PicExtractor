"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Download } from "lucide-react";

export default function ChartPage() {
  const [raw, setRaw] = useState("Mon, 42\nTue, 78\nWed, 55\nThu, 91\nFri, 63");
  const [color, setColor] = useState("#2563eb");
  const [title, setTitle] = useState("Weekly Sales");

  const data = raw
    .split("\n")
    .map((l) => l.split(","))
    .filter((p) => p.length >= 2 && p[1].trim() !== "" && Number.isFinite(Number(p[1])))
    .map((p) => ({ label: p[0].trim(), value: Number(p[1]) }));
  const max = Math.max(...data.map((d) => d.value), 1);

  const download = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 800; canvas.height = 500;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, 800, 500);
    ctx.fillStyle = "#111827"; ctx.font = "bold 24px sans-serif"; ctx.textAlign = "center";
    ctx.fillText(title, 400, 40);
    const pad = 60, w = 800 - pad * 2, h = 500 - 120;
    data.forEach((d, i) => {
      const bw = (w / data.length) * 0.6;
      const x = pad + (w / data.length) * i + (w / data.length - bw) / 2;
      const bh = (d.value / max) * h;
      ctx.fillStyle = color;
      ctx.fillRect(x, 80 + h - bh, bw, bh);
      ctx.fillStyle = "#111827"; ctx.font = "13px sans-serif";
      ctx.fillText(d.label, x + bw / 2, 80 + h + 20);
      ctx.fillText(String(d.value), x + bw / 2, 80 + h - bh - 8);
    });
    canvas.toBlob((blob) => {
      if (!blob) return;
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "chart.png";
      a.click();
      URL.revokeObjectURL(a.href);
      toast.success("Chart downloaded.");
    });
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Bar Chart Maker</h1>
      <p className="mt-2 text-muted-foreground">Paste label-value pairs → instant chart → download PNG for slides.</p>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-5">
        <div className="space-y-3 lg:col-span-2">
          <div className="rounded-xl border border-border bg-card p-4">
            <label className="mb-1 block text-xs text-muted-foreground">Data (label, value per line)</label>
            <textarea value={raw} onChange={(e) => setRaw(e.target.value)} rows={8} spellCheck={false} className="w-full rounded-md border border-input bg-background p-3 font-mono text-xs outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div className="flex gap-3">
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Chart title" className="min-w-0 flex-1 rounded-md border border-input bg-background p-2.5 text-sm outline-none" />
            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-11 w-14 cursor-pointer rounded-lg border border-border" />
          </div>
          <button type="button" onClick={download} className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90">
            <Download className="h-4 w-4" /> Download PNG
          </button>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 lg:col-span-3">
          {title && <h3 className="mb-4 text-center font-semibold">{title}</h3>}
          <div className="flex h-64 items-end gap-2">
            {data.map((d) => (
              <div key={d.label} className="flex min-w-0 flex-1 flex-col items-center gap-1">
                <span className="text-xs font-mono">{d.value}</span>
                <div className="w-full rounded-t-md transition-all" style={{ height: `${(d.value / max) * 100}%`, background: color, minHeight: 4 }} />
                <span className="w-full truncate text-center text-xs text-muted-foreground">{d.label}</span>
              </div>
            ))}
          </div>
          {data.length === 0 && <p className="text-center text-xs text-muted-foreground">Enter valid data to see the chart.</p>}
        </div>
      </div>
    </div>
  );
}
