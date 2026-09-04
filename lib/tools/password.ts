export interface PasswordOptions {
  length?: number;
  upper?: boolean;
  lower?: boolean;
  digits?: boolean;
  symbols?: boolean;
  excludeAmbiguous?: boolean;
}

const AMBIGUOUS = /[Il0O]/g;

export function generatePassword(opts: PasswordOptions = {}): string {
  const length = Math.max(4, Math.min(128, opts.length ?? 16));
  let pool = "";
  if (opts.upper !== false) pool += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (opts.lower !== false) pool += "abcdefghijklmnopqrstuvwxyz";
  if (opts.digits !== false) pool += "0123456789";
  if (opts.symbols) pool += "!@#$%^&*()-_=+[]{};:,.<>?";
  if (opts.excludeAmbiguous) pool = pool.replace(AMBIGUOUS, "");
  if (!pool) pool = "abcdefghijklmnopqrstuvwxyz";

  const arr = new Uint32Array(length);
  crypto.getRandomValues(arr);
  const out = Array.from(arr, (n) => pool[n % pool.length]).join("");

  // Guarantee at least one char from each enabled set (when it makes sense).
  const sets: string[] = [];
  if (opts.upper !== false) sets.push("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
  if (opts.lower !== false) sets.push("abcdefghijklmnopqrstuvwxyz");
  if (opts.digits !== false) sets.push("0123456789");
  if (opts.symbols) sets.push("!@#$%^&*()-_=+[]{};:,.<>?");
  let final = out;
  for (const set of sets) {
    if (!new RegExp(`[${set.replace(/[\]\\^$*+?.[\]{}()|]/g, "\\$&")}]`).test(final)) {
      final = final.slice(0, -1) + set.charAt(crypto.getRandomValues(new Uint32Array(1))[0] % set.length);
    }
  }
  return final;
}

export function estimateStrength(length: number, symbols: boolean): { label: string; score: number } {
  // Rough entropy estimate ignoring char mix; just a friendly gauge.
  const base = length >= 20 ? 4 : length >= 16 ? 3 : length >= 12 ? 2 : length >= 8 ? 1 : 0;
  const moderate = !symbols && length >= 12 ? 1 : 0;
  const score = Math.min(5, (symbols ? 1 : 0) + moderate + base);
  const labels = ["Very weak", "Weak", "Fair", "Good", "Strong", "Very strong"];
  return { label: labels[score], score };
}