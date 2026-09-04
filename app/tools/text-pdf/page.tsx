"use client";

import { useRef, useState } from "react";
import { Printer } from "lucide-react";

export default function TextPdfPage() {
  const [title, setTitle] = useState("Untitled Document");
  const [text, setText] = useState("");
  const printRef = useRef<HTMLDivElement>(null);

  const print = () => {
    if (!printRef.current) return;
    const w = window.open("", "_blank");
    if (!w) return;
    const esc = printRef.current.innerText.replace(/&/g, "&amp;").replace(/</g, "&lt;");
    const body = esc.split("\n\n").map((p) => `<p>${p.replace(/\n/g, "<br/>")}</p>`).join("");
    w.document.write(`<!doctype html><html><head><title>${title.replace(/</g, "&lt;")}</title><style>body{font-family:Georgia,serif;max-width:42rem;margin:2rem auto;line-height:1.7;color:#111}h1{font-size:1.6rem;border-bottom:1px solid #ddd;padding-bottom:.5rem}p{margin:.8rem 0}@media print{body{margin:1rem}}</style></head><body><h1>${title.replace(/</g, "&lt;")}</h1>${body}<script>window.onload=()=>window.print()</script></body></html>`);
    w.document.close();
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Text → PDF</h1>
          <p className="mt-2 text-muted-foreground">Write or paste text, print it as a clean PDF — no upload, no signup.</p>
        </div>
        <button type="button" onClick={print} className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90">
          <Printer className="h-4 w-4" /> Print as PDF
        </button>
      </div>

      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Document title" className="mt-6 w-full rounded-md border border-input bg-background p-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-ring print:hidden" />
      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={16} placeholder="Write your document here… (blank line = new paragraph)" className="mt-3 w-full resize-y rounded-md border border-input bg-background p-3 font-mono text-xs outline-none focus:ring-2 focus:ring-ring print:hidden" />

      <div className="mt-4 rounded-xl border border-border bg-muted p-6" ref={printRef}>
        <p className="mb-2 border-b border-border pb-2 text-lg font-bold">{title || "Untitled Document"}</p>
        {text ? (
          text.split(/\n\n+/).map((para, i) => (
            <p key={i} className="my-2 whitespace-pre-wrap text-sm leading-relaxed">{para}</p>
          ))
        ) : (
          <p className="my-2 text-sm italic text-muted-foreground">Live preview appears here…</p>
        )}
      </div>
    </div>
  );
}
