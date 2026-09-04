"use client";

import { useState } from "react";

const CODES: Record<number, string> = {
  0: "☀️ Clear", 1: "🌤️ Mostly clear", 2: "⛅ Partly cloudy", 3: "☁️ Overcast",
  45: "🌫️ Fog", 48: "🌫️ Rime fog", 51: "🌦️ Light drizzle", 53: "🌦️ Drizzle",
  55: "🌦️ Heavy drizzle", 61: "🌧️ Light rain", 63: "🌧️ Rain", 65: "🌧️ Heavy rain",
  71: "🌨️ Light snow", 73: "🌨️ Snow", 75: "🌨️ Heavy snow", 80: "🌦️ Showers",
  81: "🌧️ Showers", 82: "⛈️ Violent showers", 95: "⛈️ Thunderstorm",
};

export default function WeatherPage() {
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [wx, setWx] = useState<{ place: string; temp: number; humidity: number; wind: number; code: number } | null>(null);

  const lookup = () => {
    const q = city.trim();
    if (!q) return;
    setLoading(true);
    setError("");
    setWx(null);
    fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=1`)
      .then((r) => r.json())
      .then((geo) => {
        const loc = geo?.results?.[0];
        if (!loc) throw new Error();
        return fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${loc.latitude}&longitude=${loc.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`
        ).then((r) => r.json()).then((w) => ({ loc, w }));
      })
      .then(({ loc, w }) => {
        setWx({
          place: [loc.name, loc.country].filter(Boolean).join(", "),
          temp: w.current.temperature_2m,
          humidity: w.current.relative_humidity_2m,
          wind: w.current.wind_speed_10m,
          code: w.current.weather_code,
        });
      })
      .catch(() => setError(`Weather not found for "${city.trim()}".`))
      .finally(() => setLoading(false));
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Weather Check</h1>
      <p className="mt-2 text-muted-foreground">Current weather anywhere — Open-Meteo, free, no key.</p>

      <div className="mt-6 flex gap-2">
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && lookup()}
          placeholder="City name… e.g. Delhi"
          className="w-full rounded-md border border-input bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
        <button
          type="button"
          onClick={lookup}
          className="shrink-0 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          Check
        </button>
      </div>

      {loading && <p className="mt-4 text-sm text-muted-foreground">Checking…</p>}
      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

      {wx && (
        <div className="mt-6 rounded-xl border border-border bg-card p-8 text-center">
          <p className="text-sm text-muted-foreground">{wx.place}</p>
          <p className="mt-2 text-6xl font-bold">{wx.temp}°C</p>
          <p className="mt-2 text-lg">{CODES[wx.code] ?? "🌡️"}</p>
          <div className="mt-4 flex justify-center gap-6 text-sm text-muted-foreground">
            <span>💧 {wx.humidity}% humidity</span>
            <span>💨 {wx.wind} km/h wind</span>
          </div>
        </div>
      )}
    </div>
  );
}
