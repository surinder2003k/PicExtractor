"use client";

import { useEffect, useState } from "react";
import { RefreshCcw } from "lucide-react";

type Info = {
  ip: string;
  city?: string;
  region?: string;
  country?: string;
  country_flag?: { emoji?: string };
  connection?: { isp?: string; org?: string };
  timezone?: { id?: string };
};

export default function MyIpPage() {
  const [info, setInfo] = useState<Info | null>(null);
  const [error, setError] = useState("");

  const load = () => {
    setInfo(null);
    setError("");
    fetch("https://ipwho.is/")
      .then((r) => r.json())
      .then((j) => {
        if (j && j.success !== false) setInfo(j);
        else setError("Could not detect IP.");
      })
      .catch(() => setError("Could not detect IP (network)."));
  };

  useEffect(() => {
    load();
  }, []);

  const rows: [string, string][] = info
    ? [
        ["IP address", info.ip],
        ["Location", [info.city, info.region, info.country].filter(Boolean).join(", ") || "—"],
        ["ISP / Org", info.connection?.isp || info.connection?.org || "—"],
        ["Timezone", info.timezone?.id || "—"],
      ]
    : [];

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">My IP &amp; Network Info</h1>
      <p className="mt-2 text-muted-foreground">What the internet sees about your connection right now.</p>

      <button
        type="button"
        onClick={load}
        className="mt-6 inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary"
      >
        <RefreshCcw className="h-4 w-4" /> Refresh
      </button>

      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

      {info && (
        <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card">
          {rows.map(([label, value]) => (
            <div key={label} className="flex items-center justify-between border-b border-border px-5 py-4 last:border-b-0">
              <span className="text-sm text-muted-foreground">{label}</span>
              <span className="font-mono text-sm font-medium">
                {info.country_flag?.emoji && label === "Location" ? `${info.country_flag.emoji} ` : ""}
                {value}
              </span>
            </div>
          ))}
        </div>
      )}

      {!info && !error && <p className="mt-4 text-sm text-muted-foreground">Detecting…</p>}
    </div>
  );
}
