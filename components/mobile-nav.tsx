"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Clapperboard, Sparkles } from "lucide-react";

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground md:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-0 flex h-full w-80 max-w-[85vw] flex-col bg-background p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <p className="text-lg font-semibold">Menu</p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="mt-6 flex-1 space-y-1">
              <Link href="/extractor" className="flex items-center gap-3 rounded-xl bg-primary/10 px-4 py-3.5 text-sm font-medium text-primary transition-colors hover:bg-primary/20">
                <Clapperboard className="h-4 w-4" />
                Extract Video Frames
              </Link>
              <Link href="/tools" className="flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
                <Sparkles className="h-4 w-4" />
                All 83+ Tools
              </Link>
              <Link href="/cheatsheets" className="flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
                📖 Cheat Sheets
              </Link>
            </nav>
            <p className="border-t border-border pt-4 text-center text-xs text-muted-foreground">
              100% free · No sign-up · No uploads
            </p>
          </div>
        </div>
      )}
    </>
  );
}
