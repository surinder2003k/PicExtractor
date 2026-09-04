import type { ToolResult } from "./csv";

/** Interprets a numeric timestamp as either seconds or milliseconds. */
function toMs(input: number): number | null {
  if (!Number.isFinite(input)) return null;
  const abs = Math.abs(input);
  // Unix seconds for 2038 ≈ 2.15e9; milliseconds for 1970 → up through 2080 are >1e12.
  const isSeconds = abs < 1e11;
  return isSeconds ? input * 1000 : input;
}

export function timestampToDate(text: string): ToolResult {
  const trimmed = text.trim();
  const input = Number(trimmed);
  if (trimmed === "" || Number.isNaN(input)) {
    return { ok: false, error: "Enter a valid numeric timestamp." };
  }
  const ms = toMs(input);
  if (ms === null) return { ok: false, error: "Timestamp out of range." };
  const d = new Date(ms);
  if (Number.isNaN(d.getTime())) return { ok: false, error: "Timestamp out of range." };
  return {
    ok: true,
    result: JSON.stringify(
      {
        iso: d.toISOString(),
        local: d.toLocaleString(),
        utc: d.toUTCString(),
        date: d.toLocaleDateString(),
        time: d.toLocaleTimeString(),
        weekday: d.toLocaleString(undefined, { weekday: "long" }),
      },
      null,
      2
    ),
  };
}

export function dateToTimestamp(text: string): ToolResult {
  const d = new Date(text);
  if (Number.isNaN(d.getTime())) return { ok: false, error: "Invalid date. Use ISO (2025-01-01T12:00:00Z) or natural date." };
  return {
    ok: true,
    result: `seconds: ${Math.floor(d.getTime() / 1000)}\nmilliseconds: ${d.getTime()}`,
  };
}