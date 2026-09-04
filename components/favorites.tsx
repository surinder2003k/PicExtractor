"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";

const STORAGE_KEY = "picextractor_favorites";

function getFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function toggleFavorite(href: string) {
  const favs = getFavorites();
  const idx = favs.indexOf(href);
  if (idx >= 0) {
    favs.splice(idx, 1);
    toast.success("Removed from favorites");
  } else {
    favs.push(href);
    toast.success("Added to favorites ⭐");
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favs));
  window.dispatchEvent(new Event("favorites-changed"));
  return idx < 0;
}

export function useFavorites() {
  const [favs, setFavs] = useState<string[]>([]);
  useEffect(() => {
    setFavs(getFavorites());
    const handler = () => setFavs(getFavorites());
    window.addEventListener("favorites-changed", handler);
    return () => window.removeEventListener("favorites-changed", handler);
  }, []);
  return favs;
}

export function FavoriteButton({ href }: { href: string }) {
  const favs = useFavorites();
  const isFav = favs.includes(href);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        toggleFavorite(href);
      }}
      className={`absolute top-3 right-3 rounded-lg p-2 transition-all ${
        isFav
          ? "bg-yellow-500/20 text-yellow-500"
          : "bg-card/80 text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-yellow-500"
      }`}
      aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
    >
      <Star className="h-4 w-4" fill={isFav ? "currentColor" : "none"} />
    </button>
  );
}

export function isFavorite(href: string) {
  return getFavorites().includes(href);
}
