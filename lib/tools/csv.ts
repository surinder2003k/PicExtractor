export interface ToolResult {
  ok: boolean;
  result?: string;
  error?: string;
}

/** Robust CSV parser that handles quoted fields, embedded commas/newlines. */
export function parseCsv(text: string): string[][] {
  if (text.trim() === "") return [];
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
    } else {
      if (c === '"') {
        inQuotes = true;
      } else if (c === ",") {
        row.push(field);
        field = "";
      } else if (c === "\n") {
        row.push(field);
        field = "";
        rows.push(row);
        row = [];
      } else if (c !== "\r") {
        field += c;
      }
    }
  }
  if (field !== "" || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.some((c) => c.trim() !== ""));
}

/** Convert CSV text to an array of JSON objects using the first row as headers. */
export function csvToJson(text: string): ToolResult {
  const rows = parseCsv(text);
  if (rows.length < 1) return { ok: false, error: "No rows found in the CSV data." };
  const headers = rows[0].map((c) => c.trim());
  if (headers.some((h) => h === "")) {
    return { ok: false, error: "CSV header contains an empty column name." };
  }
  const out = rows.slice(1).map((r) => {
    const obj: Record<string, unknown> = {};
    headers.forEach((h, i) => {
      obj[h] = r[i] ?? "";
    });
    return obj;
  });
  return { ok: true, result: JSON.stringify(out, null, 2) };
}

/** Convert JSON text (array or object) to CSV. */
export function jsonToCsv(text: string): ToolResult {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch (e) {
    return { ok: false, error: `Invalid JSON: ${(e as Error).message}` };
  }
  const arr = Array.isArray(data) ? data : [data];
  if (arr.length === 0) return { ok: false, error: "Input JSON is empty." };

  const headers = Array.from(new Set(arr.flatMap((row) => Object.keys((row as Record<string, unknown>) ?? {}))));
  if (headers.length === 0) return { ok: false, error: "No keys found in the JSON objects." };

  const escape = (v: unknown): string => {
    let s = v === null || v === undefined ? "" : String(v);
    if (typeof v === "object") s = JSON.stringify(v);
    return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };

  const lines = [
    headers.join(","),
    ...arr.map((item) =>
      headers.map((h) => escape((item as Record<string, unknown>)[h])).join(",")
    ),
  ];
  return { ok: true, result: lines.join("\n") };
}