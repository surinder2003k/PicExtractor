"use client";

import { useState } from "react";

type Sheet = {
  id: string;
  label: string;
  emoji: string;
  intro: string;
  sections: { title: string; rows: [string, string][] }[];
};

const SHEETS: Sheet[] = [
  {
    id: "git",
    label: "Git",
    emoji: "🌿",
    intro: "Everyday Git commands — from first commit to undoing mistakes.",
    sections: [
      {
        title: "Start & Save",
        rows: [
          ["git init", "Start a new repository in the current folder"],
          ["git clone <url>", "Copy a remote repository locally"],
          ["git add . / -p", "Stage everything / interactively choose hunks"],
          ["git commit -m \"msg\"", "Save a snapshot with a message"],
          ["git status / git diff", "See what changed and what's staged"],
        ],
      },
      {
        title: "Branches",
        rows: [
          ["git switch -c feat/x", "Create and switch to a new branch"],
          ["git branch -d <name>", "Delete a merged branch"],
          ["git merge <branch>", "Merge another branch into the current one"],
          ["git rebase main", "Move your branch on top of latest main"],
          ["git log --oneline --graph", "Pretty one-line history with branches"],
        ],
      },
      {
        title: "Undo & Remote",
        rows: [
          ["git restore <file>", "Discard local changes to a file"],
          ["git reset --soft HEAD~1", "Undo last commit, keep changes staged"],
          ["git revert <hash>", "Safely undo a pushed commit with a new commit"],
          ["git push -u origin <branch>", "Push a new branch and set upstream"],
          ["git pull --rebase", "Fetch remote and replay your work on top"],
        ],
      },
    ],
  },
  {
    id: "regex",
    label: "Regex",
    emoji: "🔍",
    intro: "Pattern matching — works in JS, Python, editors, everywhere.",
    sections: [
      {
        title: "Character Classes",
        rows: [
          ["\\d \\w \\s", "Digit / word character / whitespace"],
          ["\\D \\W \\S", "The negated versions of the above"],
          [". (dot)", "Any character except newline"],
          ["[a-z0-9]", "One character from the set"],
          ["[^abc]", "Any character NOT in the set"],
        ],
      },
      {
        title: "Quantifiers & Groups",
        rows: [
          ["* + ? {2,5}", "0+, 1+, 0 or 1, between 2 and 5 times"],
          ["^ $ \\b", "Start of string / end / word boundary"],
          ["(abc)", "Capturing group — reusable via \\1 or $1"],
          ["(?:abc)", "Non-capturing group (faster)"],
          ["a|b", "Either a or b"],
        ],
      },
      {
        title: "Common Patterns",
        rows: [
          ["^[\\w.+-]+@[\\w-]+\\.[\\w.]+$", "Basic email validation"],
          ["https?://[^\\s]+", "URL in text"],
          ["\\b\\d{4}-\\d{2}-\\d{2}\\b", "Date like 2026-09-04"],
        ],
      },
    ],
  },
  {
    id: "http",
    label: "HTTP Codes",
    emoji: "🌐",
    intro: "What every API status code actually means — debug faster.",
    sections: [
      {
        title: "2xx — Success",
        rows: [
          ["200 OK", "Standard success — here's your data"],
          ["201 Created", "New resource created (after POST)"],
          ["204 No Content", "Success, but empty body (after DELETE)"],
        ],
      },
      {
        title: "3xx — Redirect",
        rows: [
          ["301 Moved Permanently", "URL changed forever — update your links"],
          ["302 Found", "Temporary redirect"],
          ["304 Not Modified", "Cache is still valid — use local copy"],
        ],
      },
      {
        title: "4xx — Client Error",
        rows: [
          ["400 Bad Request", "Malformed input — check your payload"],
          ["401 Unauthorized", "Not logged in / bad token"],
          ["403 Forbidden", "Logged in, but not allowed"],
          ["404 Not Found", "Resource doesn't exist"],
          ["429 Too Many Requests", "Rate limited — slow down"],
        ],
      },
      {
        title: "5xx — Server Error",
        rows: [
          ["500 Internal Server Error", "Server crashed handling your request"],
          ["502 Bad Gateway", "Upstream service failed"],
          ["503 Service Unavailable", "Overloaded or down for maintenance"],
        ],
      },
    ],
  },
  {
    id: "md",
    label: "Markdown",
    emoji: "📝",
    intro: "READMEs, Notion, GitHub comments — markdown everywhere.",
    sections: [
      {
        title: "Text",
        rows: [
          ["# H1 … #### H4", "Headings (largest to smaller)"],
          ["**bold** · *italic* · ~~strike~~", "Emphasis styles"],
          ["`code` / ```block```", "Inline and fenced code"],
          ["> quote", "Blockquote for callouts"],
        ],
      },
      {
        title: "Structure",
        rows: [
          ["- item / 1. item", "Bulleted / numbered lists"],
          ["[text](url)", "Link"],
          ["![alt](img-url)", "Image"],
          ["| a | b |", "Table (with --- separator row)"],
          ["- [ ] / - [x]", "Task list checkbox"],
        ],
      },
    ],
  },
  {
    id: "excel",
    label: "Excel",
    emoji: "📊",
    intro: "The formulas and shortcuts that do 90% of spreadsheet work.",
    sections: [
      {
        title: "Must-Know Formulas",
        rows: [
          ["=SUM(A1:A10)", "Add up a range"],
          ["=AVERAGE / MIN / MAX", "Basic stats on a range"],
          ["=VLOOKUP(x, A:B, 2, FALSE)", "Find x in A, return matching B"],
          ["=IF(A1>10, \"Yes\", \"No\")", "Conditional output"],
          ["=COUNTIF(A:A, \"x\")", "Count cells equal to x"],
        ],
      },
      {
        title: "Power Shortcuts",
        rows: [
          ["Ctrl + Shift + L", "Toggle filters"],
          ["Ctrl + T", "Convert range to a smart table"],
          ["Alt + =", "Auto-sum selected range"],
          ["F4", "Lock reference ($A$1) / repeat last action"],
          ["Ctrl + ;", "Insert today's date"],
        ],
      },
    ],
  },
];

export default function CheatsheetsPage() {
  const [active, setActive] = useState(SHEETS[0].id);
  const [query, setQuery] = useState("");

  const sheet = SHEETS.find((s) => s.id === active)!;
  const q = query.trim().toLowerCase();
  const sections = q
    ? sheet.sections
        .map((sec) => ({
          ...sec,
          rows: sec.rows.filter(([k, v]) => k.toLowerCase().includes(q) || v.toLowerCase().includes(q)),
        }))
        .filter((sec) => sec.rows.length > 0)
    : sheet.sections;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
          Developer reference · Always free
        </span>
        <h1 className="mt-4 text-4xl font-bold tracking-tight">Cheat Sheets</h1>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          The commands and patterns you keep googling — on one page, searchable.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-2">
        {SHEETS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => { setActive(s.id); setQuery(""); }}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              active === s.id
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card hover:bg-secondary"
            }`}
          >
            {s.emoji} {s.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Search in ${sheet.label}…`}
          className="w-full rounded-lg border border-input bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <p className="mt-4 text-center text-sm text-muted-foreground">{sheet.intro}</p>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        {sections.map((sec) => (
          <div key={sec.title} className="rounded-xl border border-border bg-card p-5">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary">{sec.title}</h2>
            <ul className="space-y-2.5">
              {sec.rows.map(([k, v]) => (
                <li key={k} className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-3">
                  <code className="shrink-0 rounded bg-muted px-2 py-0.5 font-mono text-xs text-foreground sm:max-w-[45%] sm:truncate" title={k}>
                    {k}
                  </code>
                  <span className="text-xs text-muted-foreground">{v}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
        {sections.length === 0 && (
          <p className="col-span-full py-10 text-center text-sm text-muted-foreground">No matches found.</p>
        )}
      </div>
    </div>
  );
}
