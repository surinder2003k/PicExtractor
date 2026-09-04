"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { toast } from "sonner";
import { Download } from "lucide-react";

type Style = "classic" | "dots" | "tree";

const STYLES: { value: Style; label: string }[] = [
  { value: "classic", label: "🔲 Classic" },
  { value: "dots", label: "⚫ Dots" },
  { value: "tree", label: "🌳 3D Tree" },
];

function inFinder(row: number, col: number, size: number): boolean {
  return (
    (row < 7 && col < 7) ||
    (row < 7 && col >= size - 7) ||
    (row >= size - 7 && col < 7)
  );
}

export default function QrPage() {
  const [text, setText] = useState("https://picextractor.vercel.app");
  const [style, setStyle] = useState<Style>("tree");
  const [dark, setDark] = useState("#14532d");
  const [light, setLight] = useState("#f0fdf4");
  const [error, setError] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const value = text.trim();
    if (!value) { setError("Enter some text or a URL."); setReady(false); return; }
    setError("");

    let qr;
    try {
      qr = QRCode.create(value, { errorCorrectionLevel: "H" });
    } catch {
      setError("Too much data for one QR code — shorten the text.");
      setReady(false);
      return;
    }

    const size: number = qr.modules.size;
    const data: Uint8Array = qr.modules.data;
    const quiet = 4;
    const total = size + quiet * 2;
    const px = 640;
    const cell = px / total;
    canvas.width = px;
    canvas.height = px;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = light;
    ctx.fillRect(0, 0, px, px);

    const cx = (col: number) => (col + quiet) * cell;
    const cy = (row: number) => (row + quiet) * cell;

    const drawFinder = (r0: number, c0: number) => {
      const x = cx(c0), y = cy(r0), s = cell * 7, r = cell;
      ctx.fillStyle = dark;
      ctx.beginPath();
      ctx.roundRect(x, y, s, s, r);
      ctx.fill();
      ctx.fillStyle = light;
      ctx.beginPath();
      ctx.roundRect(x + cell, y + cell, s - cell * 2, s - cell * 2, r * 0.7);
      ctx.fill();
      ctx.fillStyle = dark;
      ctx.beginPath();
      ctx.roundRect(x + cell * 2, y + cell * 2, s - cell * 4, s - cell * 4, r * 0.5);
      ctx.fill();
    };
    drawFinder(0, 0);
    drawFinder(0, size - 7);
    drawFinder(size - 7, 0);

    if (style === "classic") {
      ctx.fillStyle = dark;
      for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
          if (data[row * size + col] && !inFinder(row, col, size)) {
            ctx.fillRect(cx(col), cy(row), cell + 0.5, cell + 0.5);
          }
        }
      }
    } else if (style === "dots") {
      ctx.fillStyle = dark;
      for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
          if (data[row * size + col] && !inFinder(row, col, size)) {
            ctx.beginPath();
            ctx.arc(cx(col) + cell / 2, cy(row) + cell / 2, cell * 0.44, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    } else {
      // 3D tree: every dark module becomes a tiny tree — trunk + shaded canopy
      for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
          if (!data[row * size + col] || inFinder(row, col, size)) continue;
          const jitter = ((row * 31 + col * 17) % 5) / 5; // deterministic 0..0.8
          const baseX = cx(col) + cell / 2;
          const baseY = cy(row) + cell;
          const trunkH = cell * (0.9 + jitter * 0.5);
          const canopyR = cell * (0.5 + jitter * 0.14);
          const canopyY = baseY - trunkH - canopyR * 0.55;

          ctx.fillStyle = "rgba(0,0,0,0.18)";
          ctx.beginPath();
          ctx.ellipse(baseX, baseY - cell * 0.08, canopyR * 0.95, cell * 0.16, 0, 0, Math.PI * 2);
          ctx.fill();

          const tw = cell * 0.16;
          ctx.fillStyle = "#5b3a1a";
          ctx.fillRect(baseX - tw / 2, baseY - trunkH, tw, trunkH);
          ctx.fillStyle = "#7c5227";
          ctx.fillRect(baseX - tw / 2, baseY - trunkH, tw * 0.45, trunkH);

          const grad = ctx.createRadialGradient(
            baseX - canopyR * 0.35, canopyY - canopyR * 0.35, canopyR * 0.15,
            baseX, canopyY, canopyR
          );
          grad.addColorStop(0, "#7ed957");
          grad.addColorStop(0.6, dark);
          grad.addColorStop(1, "#0a2e12");
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(baseX, canopyY, canopyR, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
    setReady(true);
  }, [text, style, dark, light]);

  useEffect(() => { render(); }, [render]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">QR Code Generator</h1>
      <p className="mt-2 text-muted-foreground">Link/text → QR in three styles — including the 3D tree forest. Generated locally.</p>

      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="URL or text…"
        className="mt-6 w-full rounded-md border border-input bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-ring"
      />
      {error && <p className="mt-2 text-xs text-destructive">{error}</p>}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <div className="flex gap-1.5">
          {STYLES.map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => setStyle(s.value)}
              className={`rounded-md border px-3 py-2 text-sm transition-colors ${style === s.value ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-secondary"}`}
            >
              {s.label}
            </button>
          ))}
        </div>
        <input type="color" value={dark} onChange={(e) => setDark(e.target.value)} aria-label="Module color" className="h-10 w-12 cursor-pointer rounded-lg border border-border" />
        <input type="color" value={light} onChange={(e) => setLight(e.target.value)} aria-label="Background color" className="h-10 w-12 cursor-pointer rounded-lg border border-border" />
        <button
          type="button"
          onClick={() => {
            const canvas = canvasRef.current;
            if (!canvas || !ready) return;
            const a = document.createElement("a");
            a.href = canvas.toDataURL("image/png");
            a.download = `qr-${style}.png`;
            a.click();
            toast.success("QR downloaded.");
          }}
          disabled={!ready}
          className="ml-auto inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          <Download className="h-4 w-4" /> Download PNG
        </button>
      </div>

      <div className="mt-6 flex justify-center rounded-xl border border-border bg-card p-6">
        <canvas ref={canvasRef} className="max-w-full rounded-lg shadow-lg" />
      </div>

      <p className="mt-3 text-center text-xs text-muted-foreground">
        Tip: 3D tree style scans best with a dark green / light background and high-contrast colors.
      </p>
    </div>
  );
}
