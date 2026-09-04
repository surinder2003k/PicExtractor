"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Search } from "lucide-react";

interface Country {
  name?: { common?: string; official?: string };
  capital?: string[];
  population?: number;
  area?: number;
  region?: string;
  subregion?: string;
  currencies?: Record<string, { name?: string; symbol?: string }>;
  languages?: Record<string, string>;
  timezones?: string[];
  flags?: { svg?: string; alt?: string };
}

export default function CountryPage() {
  const [query, setQuery] = useState("");
  const [data, setData] = useState<Country | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const search = async () => {
    const q = query.trim();
    if (!q) return;
    setLoading(true);
    setError("");
    setData(null);
    try {
      const res = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(q)}`);
      if (!res.ok) throw new Error("not found");
      const list: Country[] = await res.json();
      if (!list?.length) throw new Error("not found");
      setData(list[0]);
    } catch {
      setError("Country not found — check spelling (e.g. India, Japan, Brazil).");
    } finally {
      setLoading(false);
    }
  };

  const fmt = (n?: number) => (n ? n.toLocaleString() : "—");
  const currency = data?.currencies ? Object.values(data.currencies)[0] : undefined;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Country Info</h1>
      <p className="mt-2 text-muted-foreground">Capital, population, currency, languages — instant country facts (REST Countries).</p>

      <div className="mt-6 flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && search()}
          placeholder="Search a country…"
          className="min-w-0 flex-1 rounded-md border border-input bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
        <button type="button" onClick={search} disabled={loading} className="inline-flex items-center gap-2 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60">
          <Search className="h-4 w-4" /> {loading ? "…" : "Search"}
        </button>
      </div>

      {error && <p className="mt-4 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}

      {data && (
        <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card">
          <div className="flex items-center gap-4 border-b border-border p-5">
            {data.flags?.svg && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={data.flags.svg} alt={data.flags?.alt || "flag"} className="h-14 w-auto rounded border border-border" />
            )}
            <div>
              <h2 className="text-2xl font-bold">{data.name?.common}</h2>
              <p className="text-sm text-muted-foreground">{data.name?.official} · {data.region}{data.subregion ? ` — ${data.subregion}` : ""}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-3">
            {[
              { label: "Capital", value: data.capital?.[0] || "—" },
              { label: "Population", value: fmt(data.population) },
              { label: "Area", value: `${fmt(data.area)} km²` },
              { label: "Currency", value: currency ? `${currency.name} (${currency.symbol})` : "—" },
              { label: "Languages", value: data.languages ? Object.values(data.languages).join(", ") : "—" },
              { label: "Timezone", value: data.timezones?.[0] || "—" },
            ].map((f) => (
              <div key={f.label} className="rounded-lg border border-border bg-muted p-3">
                <p className="text-xs text-muted-foreground">{f.label}</p>
                <p className="mt-0.5 truncate font-semibold" title={f.value}>{f.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
