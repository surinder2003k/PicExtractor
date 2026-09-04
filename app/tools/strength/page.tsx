"use client";

import { useState } from "react";

interface Check { label: string; ok: boolean; }

export default function StrengthPage() {
  const [pw, setPw] = useState("");

  const checks: Check[] = [
    { label: "8+ characters", ok: pw.length >= 8 },
    { label: "12+ characters (strong)", ok: pw.length >= 12 },
    { label: "Uppercase letter", ok: /[A-Z]/.test(pw) },
    { label: "Lowercase letter", ok: /[a-z]/.test(pw) },
    { label: "Number", ok: /\d/.test(pw) },
    { label: "Special character", ok: /[^A-Za-z0-9]/.test(pw) },
    { label: "No common patterns (123, abc, qwerty)", ok: !/(123|abc|qwerty|password|111|000)/i.test(pw) },
  ];
  const passed = checks.filter((c) => c.ok).length;

  // crude entropy estimate
  let pool = 0;
  if (/[a-z]/.test(pw)) pool += 26;
  if (/[A-Z]/.test(pw)) pool += 26;
  if (/\d/.test(pw)) pool += 10;
  if (/[^A-Za-z0-9]/.test(pw)) pool += 33;
  const entropy = pw.length ? Math.round(pw.length * Math.log2(pool || 1)) : 0;

  const crackTime = (() => {
    // 10 billion guesses/sec offline attack
    const seconds = Math.pow(2, entropy) / 1e10;
    if (seconds < 1) return "instantly";
    const units: [number, string][] = [
      [60, "seconds"], [60, "minutes"], [24, "hours"], [365, "days"], [Infinity, "years"],
    ];
    let v = seconds, unit = "seconds";
    for (const [div, name] of units) {
      if (v < div) { unit = name; break; }
      v /= div; unit = name;
    }
    return `~${v < 10 ? v.toFixed(1) : Math.round(v).toLocaleString()} ${unit}`;
  })();

  const verdict =
    entropy === 0 ? { label: "—", color: "text-muted-foreground", bar: "bg-border", pct: 0 }
    : entropy < 40 ? { label: "Weak 😬", color: "text-destructive", bar: "bg-destructive", pct: 25 }
    : entropy < 60 ? { label: "Fair 😐", color: "text-yellow-500", bar: "bg-yellow-500", pct: 50 }
    : entropy < 80 ? { label: "Strong 💪", color: "text-primary", bar: "bg-primary", pct: 75 }
    : { label: "Fortress 🏰", color: "text-green-500", bar: "bg-green-500", pct: 100 };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Password Strength Checker</h1>
      <p className="mt-2 text-muted-foreground">Type a password — get instant entropy, crack time, and checks. Nothing is sent anywhere.</p>

      <div className="mt-6 rounded-xl border border-border bg-card p-6">
        <input
          type="text"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          placeholder="Type a password to test…"
          autoComplete="off"
          spellCheck={false}
          className="w-full rounded-md border border-input bg-background p-3 font-mono text-sm outline-none focus:ring-2 focus:ring-ring"
        />

        <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-muted">
          <div className={`h-full transition-all duration-300 ${verdict.bar}`} style={{ width: `${verdict.pct}%` }} />
        </div>
        <div className="mt-2 flex items-center justify-between text-sm">
          <span className={verdict.color}>{verdict.label}</span>
          <span className="font-mono text-xs text-muted-foreground">{entropy} bits entropy</span>
        </div>
        {pw && (
          <p className="mt-1 text-xs text-muted-foreground">
            Offline brute-force (10B guesses/sec): <strong className="text-foreground">{crackTime}</strong>
          </p>
        )}

        <ul className="mt-5 space-y-1.5 text-sm">
          {checks.map((c) => (
            <li key={c.label} className={`flex items-center gap-2 ${c.ok ? "text-primary" : "text-muted-foreground"}`}>
              <span>{c.ok ? "✅" : "⬜"}</span>
              {c.label}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-center text-xs font-mono text-muted-foreground">{passed}/{checks.length} checks passed</p>
      </div>
    </div>
  );
}
