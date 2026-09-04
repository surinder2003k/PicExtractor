"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";

export default function NotFound() {
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("recent-tools") || "[]");
      setRecent(stored.slice(0, 4));
    } catch { /* ignore */ }
  }, []);

  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6 sm:py-32">
      <p className="text-7xl font-bold tracking-tight text-primary sm:text-8xl">404</p>
      <h1 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">Page not found</h1>
      <p className="mt-3 text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/"
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-6 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          <ArrowLeft className="h-4 w-4" /> Go home
        </Link>
        <Link
          href="/tools"
          className="inline-flex h-11 items-center gap-2 rounded-xl border border-border bg-card px-6 text-sm font-medium transition-colors hover:bg-secondary"
        >
          Browse all tools
        </Link>
      </div>

      {recent.length > 0 && (
        <div className="mt-12 rounded-xl border border-border bg-card p-6 text-left">
          <p className="text-sm font-semibold">Recently visited</p>
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {recent.map((href) => (
              <Link
                key={href}
                href={href}
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                {href.replace("/tools/", "").replace(/-/g, " ")}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
