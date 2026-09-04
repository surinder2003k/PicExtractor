"use client";

import { useState } from "react";

function mdToHtml(md: string): string {
  const esc = md.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const parts = esc.split(/```/);
  return parts
    .map((chunk, i) => {
      if (i % 2 === 1) return `<pre class="code">${chunk.replace(/^\w*\n/, "")}</pre>`;
      return chunk
        .split("\n")
        .map((line) => {
          let l = line;
          if (/^\s*$/.test(l)) return "";
          l = l
            .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
            .replace(/\*([^*]+)\*/g, "<em>$1</em>")
            .replace(/`([^`]+)`/g, "<code>$1</code>")
            .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');
          const h = l.match(/^(#{1,6})\s+(.*)$/);
          if (h) return `<h${h[1].length}>${h[2]}</h${h[1].length}>`;
          if (/^\s*[-*]\s+/.test(l)) return `<li>${l.replace(/^\s*[-*]\s+/, "")}</li>`;
          if (/^\s*\d+\.\s+/.test(l)) return `<li>${l.replace(/^\s*\d+\.\s+/, "")}</li>`;
          if (/^>\s?/.test(l)) return `<blockquote>${l.replace(/^>\s?/, "")}</blockquote>`;
          return `<p>${l}</p>`;
        })
        .join("\n");
    })
    .join("");
}

const SAMPLE = `# Project Update — Q3
**Status:** On track · *Owner:* You

## Done
- Shipped the extractor engine
- Fixed the \`lag on extract\` bug

## Next
1. GIF export
2. Mobile polish

> Ship fast, fix faster.
[Team wiki](https://example.com)`;

export default function MarkdownPreviewPage() {
  const [md, setMd] = useState(SAMPLE);
  const html = mdToHtml(md);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Markdown Preview</h1>
      <p className="mt-2 text-muted-foreground">Write markdown on the left, see rendered output live — README drafts, notes.</p>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="mb-2 font-semibold">Markdown</h3>
          <textarea value={md} onChange={(e) => setMd(e.target.value)} rows={18} spellCheck={false} className="w-full resize-y rounded-md border border-input bg-background p-3 font-mono text-xs outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="mb-2 font-semibold">Preview</h3>
          <div
            className="prose-sm max-h-[32rem] max-w-none overflow-auto rounded-md border border-border bg-muted p-4 text-sm [&_a]:text-primary [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-primary/50 [&_blockquote]:pl-3 [&_blockquote]:italic [&_code]:rounded [&_code]:bg-secondary [&_code]:px-1 [&_h1]:mb-2 [&_h1]:text-2xl [&_h1]:font-bold [&_h2]:mb-2 [&_h2]:mt-3 [&_h2]:text-xl [&_h2]:font-bold [&_h3]:font-semibold [&_li]:ml-5 [&_li]:list-disc [&_p]:my-2 [&_pre.code]:my-2 [&_pre.code]:overflow-auto [&_pre.code]:rounded-md [&_pre.code]:bg-secondary [&_pre.code]:p-3 [&_pre.code]:font-mono [&_pre.code]:text-xs"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>
    </div>
  );
}
