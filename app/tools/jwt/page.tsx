"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Copy } from "lucide-react";

function b64urlDecode(s: string): string {
  const pad = s.replace(/-/g, "+").replace(/_/g, "/");
  return decodeURIComponent(
    atob(pad.padEnd(pad.length + ((4 - (pad.length % 4)) % 4)),)
      .split("")
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  );
}

export default function JwtPage() {
  const [token, setToken] = useState("");

  const parts = token.trim().split(".");
  const valid = parts.length === 3;
  let header = "", payload = "", error = "";

  if (token.trim() && valid) {
    try {
      header = JSON.stringify(JSON.parse(b64urlDecode(parts[0])), null, 2);
      payload = JSON.stringify(JSON.parse(b64urlDecode(parts[1])), null, 2);
      const claims = JSON.parse(b64urlDecode(parts[1])) as { exp?: number; iat?: number };
      if (claims.exp) {
        const expired = claims.exp * 1000 < Date.now();
        payload += `\n\n// ${expired ? "⚠️ EXPIRED" : "✅ Valid"} as of now (exp: ${new Date(claims.exp * 1000).toLocaleString()})`;
      }
    } catch {
      error = "⚠️ Could not decode — check the token.";
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">JWT Decoder</h1>
      <p className="mt-2 text-muted-foreground">Inspect JWT header &amp; payload locally — signature is NOT verified (never paste production secrets).</p>

      <div className="mt-6 rounded-xl border border-border bg-card p-4">
        <label className="mb-1 block text-xs text-muted-foreground">Paste JWT token</label>
        <textarea
          value={token}
          onChange={(e) => setToken(e.target.value)}
          rows={4}
          spellCheck={false}
          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NSJ9.signature…"
          className="w-full resize-y rounded-md border border-input bg-background p-3 font-mono text-xs outline-none focus:ring-2 focus:ring-ring"
        />
        {token.trim() && !valid && <p className="mt-2 text-xs text-destructive">⚠️ A JWT has 3 dot-separated parts.</p>}
        {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
      </div>

      {header && (
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {[{ label: "Header", data: header }, { label: "Payload", data: payload }].map((sec) => (
            <div key={sec.label} className="rounded-xl border border-border bg-card p-4">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-primary">{sec.label}</h3>
                <button
                  type="button"
                  onClick={async () => { try { await navigator.clipboard.writeText(sec.data); toast.success(`${sec.label} copied.`); } catch { toast.error("Could not copy."); } }}
                  className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs transition-colors hover:bg-secondary"
                >
                  <Copy className="h-3.5 w-3.5" /> Copy
                </button>
              </div>
              <pre className="max-h-72 overflow-auto whitespace-pre-wrap rounded-md border border-border bg-muted p-3 font-mono text-xs">{sec.data}</pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
