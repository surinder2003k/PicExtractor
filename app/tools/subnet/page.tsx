"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Copy } from "lucide-react";

function ipToInt(ip: string): number | null {
  const parts = ip.trim().split(".");
  if (parts.length !== 4) return null;
  let n = 0;
  for (const p of parts) {
    const v = Number(p);
    if (!Number.isInteger(v) || v < 0 || v > 255) return null;
    n = n * 256 + v;
  }
  return n;
}

function intToIp(n: number): string {
  return [24, 16, 8, 0].map((s) => (n >>> s) & 255).join(".");
}

export default function SubnetPage() {
  const [ip, setIp] = useState("192.168.1.10");
  const [prefix, setPrefix] = useState("24");

  const p = Number(prefix);
  const ipInt = ipToInt(ip);
  const valid = ipInt !== null && Number.isInteger(p) && p >= 0 && p <= 32;

  let mask = "", network = "", broadcast = "", first = "", last = "", hosts = "", wildcard = "";
  if (valid && ipInt !== null) {
    const m = p === 0 ? 0 : (0xffffffff << (32 - p)) >>> 0;
    const net = (ipInt & m) >>> 0;
    const bcast = (net | (~m >>> 0)) >>> 0;
    mask = intToIp(m);
    wildcard = intToIp(~m >>> 0);
    network = intToIp(net);
    broadcast = intToIp(bcast);
    first = p >= 31 ? network : intToIp(net + 1);
    last = p >= 31 ? broadcast : intToIp(bcast - 1);
    hosts = p >= 31 ? (p === 32 ? "1" : "2") : (Math.pow(2, 32 - p) - 2).toLocaleString();
  }

  const rows = [
    { label: "Subnet mask", value: mask },
    { label: "Wildcard", value: wildcard },
    { label: "Network address", value: network },
    { label: "Broadcast address", value: broadcast },
    { label: "Host range", value: first && last ? `${first} — ${last}` : "" },
    { label: "Usable hosts", value: hosts },
    { label: "Total addresses", value: valid ? Math.pow(2, 32 - p).toLocaleString() : "" },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Subnet Calculator</h1>
      <p className="mt-2 text-muted-foreground">CIDR → mask, network, broadcast, host range — networking interviews &amp; configs.</p>

      <div className="mt-6 flex flex-wrap items-end gap-3 rounded-xl border border-border bg-card p-5">
        <div className="min-w-44 flex-1">
          <label className="mb-1 block text-xs text-muted-foreground">IP address</label>
          <input value={ip} onChange={(e) => setIp(e.target.value)} placeholder="192.168.1.10" className="w-full rounded-md border border-input bg-background p-3 font-mono text-sm outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <div className="w-28">
          <label className="mb-1 block text-xs text-muted-foreground">Prefix (/)</label>
          <input type="number" min="0" max="32" value={prefix} onChange={(e) => setPrefix(e.target.value)} className="w-full rounded-md border border-input bg-background p-3 text-center font-mono text-sm outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <button
          type="button"
          disabled={!valid}
          onClick={async () => {
            try { await navigator.clipboard.writeText(`${ip}/${p} → mask ${mask}, network ${network}, broadcast ${broadcast}, hosts ${hosts}`); toast.success("Summary copied."); }
            catch { toast.error("Could not copy."); }
          }}
          className="inline-flex items-center gap-1 rounded-md border border-border px-4 py-3 text-sm transition-colors hover:bg-secondary disabled:opacity-50"
        >
          <Copy className="h-4 w-4" /> Copy
        </button>
      </div>

      {valid ? (
        <div className="mt-4 overflow-hidden rounded-xl border border-border">
          {rows.map((r, i) => (
            <div key={r.label} className={`flex items-center justify-between px-5 py-3 text-sm ${i % 2 ? "bg-card" : "bg-muted/50"}`}>
              <span className="text-muted-foreground">{r.label}</span>
              <span className="font-mono font-semibold">{r.value || "—"}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-center text-sm text-destructive">Enter a valid IPv4 (0-255 per octet) and prefix 0–32.</p>
      )}
    </div>
  );
}
