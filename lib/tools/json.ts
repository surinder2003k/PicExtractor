import type { ToolResult } from "./csv";

export function formatJson(text: string): ToolResult {
  try {
    const parsed = JSON.parse(text);
    return { ok: true, result: JSON.stringify(parsed, null, 2) };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export function minifyJson(text: string): ToolResult {
  try {
    const parsed = JSON.parse(text);
    return { ok: true, result: JSON.stringify(parsed) };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export interface JsonStats {
  types: Record<string, number>;
  totalKeys: number;
  arrays: number;
  depth: number;
}

export function jsonStats(text: string): JsonStats | null {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    return null;
  }
  const types: Record<string, number> = {};
  let totalKeys = 0;
  let arrays = 0;
  let depth = 0;

  const walk = (val: unknown, d: number) => {
    depth = Math.max(depth, d);
    const t = Array.isArray(val) ? "array" : typeof val;
    types[t] = (types[t] ?? 0) + 1;
    if (Array.isArray(val)) {
      arrays++;
      val.forEach((it) => walk(it, d + 1));
    } else if (val !== null && typeof val === "object") {
      const keys = Object.keys(val as Record<string, unknown>);
      totalKeys += keys.length;
      keys.forEach((k) => walk((val as Record<string, unknown>)[k], d + 1));
    }
  };
  walk(data, 0);
  return { types, totalKeys, arrays, depth };
}