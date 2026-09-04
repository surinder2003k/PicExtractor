"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Star, Heart } from "lucide-react";

const STORAGE_KEY = "picextractor_favorites";

const ALL_TOOLS = [
  { href: "/tools/qr-code", title: "QR Code Generator", emoji: "🌳" },
  { href: "/tools/cgpa", title: "CGPA Calculator", emoji: "🎓" },
  { href: "/tools/currency", title: "Currency Converter", emoji: "💱" },
  { href: "/tools/image-compressor", title: "Image Compressor", emoji: "🗜️" },
  { href: "/tools/invoice", title: "Invoice Generator", emoji: "🧾" },
  { href: "/tools/typing", title: "Typing Test", emoji: "⌨️" },
  { href: "/tools/weather", title: "Weather Check", emoji: "⛅" },
  { href: "/tools/markdown-preview", title: "Markdown Preview", emoji: "📝" },
  { href: "/tools/password", title: "Password Generator", emoji: "🔑" },
  { href: "/tools/json-formatter", title: "JSON Formatter", emoji: "{}" },
  { href: "/tools/color", title: "Color Converter", emoji: "🎨" },
  { href: "/tools/hash", title: "Hash Generator", emoji: "🔒" },
  { href: "/tools/lorem", title: "Lorem Ipsum", emoji: "📄" },
  { href: "/tools/uuid", title: "UUID Generator", emoji: "🔢" },
  { href: "/tools/base64", title: "Base64 Encoder", emoji: "🔣" },
  { href: "/tools/stopwatch", title: "Stopwatch", emoji: "⏱️" },
];

export default function FavoritesGrid() {
  const [favs, setFavs] = useState<string[]>([]);

  useEffect(() => {
    const load = () => {
      try {
        setFavs(JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"));
      } catch {
        setFavs([]);
      }
    };
    load();
    window.addEventListener("favorites-changed", load);
    window.addEventListener("storage", load);
    return () => {
      window.removeEventListener("favorites-changed", load);
      window.removeEventListener("storage", load);
    };
  }, []);

  const favoriteTools = ALL_TOOLS.filter((t) => favs.includes(t.href));

  if (favoriteTools.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card/50 p-8 text-center">
        <Star className="mx-auto h-8 w-8 text-muted-foreground/50" />
        <p className="mt-3 text-sm text-muted-foreground">
          No favorites yet. Browse the tools below and click the ⭐ star to save your most-used ones here.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {favoriteTools.map((t) => (
        <Link
          key={t.href}
          href={t.href}
          className="group flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-yellow-500/50 hover:shadow-md"
        >
          <span className="text-2xl">{t.emoji}</span>
          <span className="text-sm font-medium leading-snug group-hover:text-primary">{t.title}</span>
        </Link>
      ))}
    </div>
  );
}
