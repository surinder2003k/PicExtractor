"use client";

import { useEffect, useState } from "react";

type Holiday = { date: string; name: string; localName: string; global: boolean };

const COUNTRIES = [
  { code: "IN", label: "🇮🇳 India" },
  { code: "US", label: "🇺🇸 United States" },
  { code: "GB", label: "🇬🇧 United Kingdom" },
  { code: "AE", label: "🇦🇪 UAE" },
  { code: "SG", label: "🇸🇬 Singapore" },
  { code: "DE", label: "🇩🇪 Germany" },
  { code: "AU", label: "🇦🇺 Australia" },
  { code: "CA", label: "🇨🇦 Canada" },
];

export default function HolidaysPage() {
  const year = new Date().getFullYear();
  const [country, setCountry] = useState("IN");
  const [holidays, setHolidays] = useState<Holiday[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setHolidays(null);
    setError("");
    fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/${country}`)
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((j) => setHolidays(j))
      .catch(() => setError("Could not load holidays (network)."));
  }, [country, year]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Public Holidays {year}</h1>
      <p className="mt-2 text-muted-foreground">Official holidays by country — plan meetings, leaves, and deadlines.</p>

      <div className="mt-6">
        <select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="w-full rounded-md border border-border bg-background p-3 text-sm outline-none"
        >
          {COUNTRIES.map((c) => <option key={c.code} value={c.code}>{c.label}</option>)}
        </select>
      </div>

      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
      {!holidays && !error && <p className="mt-4 text-sm text-muted-foreground">Loading…</p>}

      {holidays && (
        <div className="mt-6 space-y-2">
          {holidays.map((h) => (
            <div key={h.date + h.name} className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
              <div>
                <p className="font-medium">{h.localName}</p>
                <p className="text-xs text-muted-foreground">{h.name}{h.global ? "" : " · regional"}</p>
              </div>
              <span className="shrink-0 rounded-md bg-primary/10 px-3 py-1 font-mono text-xs text-primary">{h.date}</span>
            </div>
          ))}
          {holidays.length === 0 && <p className="text-sm text-muted-foreground">No holidays found.</p>}
        </div>
      )}
    </div>
  );
}
