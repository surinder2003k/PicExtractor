"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ToolWrapper({ children, title }: { children: React.ReactNode; title: string }) {
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("recent-tools") || "[]");
      const updated = [title, ...stored.filter((t: string) => t !== title)].slice(0, 10);
      localStorage.setItem("recent-tools", JSON.stringify(updated));
    } catch { /* ignore */ }
  }, [title]);

  return (
    <div>
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
        <Link
          href="/tools"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> All tools
        </Link>
      </div>
      <div className="border-t border-border/60" />
      {children}
    </div>
  );
}
