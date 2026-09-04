export type CaseMode =
  | "upper"
  | "lower"
  | "title"
  | "sentence"
  | "camel"
  | "pascal"
  | "snake"
  | "kebab"
  | "constant";

export function toCase(text: string, mode: CaseMode): string {
  switch (mode) {
    case "upper":
      return text.toUpperCase();
    case "lower":
      return text.toLowerCase();
    case "title":
      return text
        .toLowerCase()
        .replace(/\b\w/g, (c) => c.toUpperCase());
    case "sentence":
      return text.toLowerCase().replace(/(^\s*\w|[.!?]\s+\w)/g, (m) => m.toUpperCase());
    case "camel": {
      const parts = text.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
      return parts.map((p, i) => (i === 0 ? p : p.charAt(0).toUpperCase() + p.slice(1))).join("");
    }
    case "pascal": {
      const parts = text.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
      return parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join("");
    }
    case "snake":
      return text.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean).join("_");
    case "kebab":
      return text.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean).join("-");
    case "constant":
      return text.toUpperCase().split(/[^a-zA-Z0-9]+/).filter(Boolean).join("_");
  }
}

export interface TextStats {
  words: number;
  chars: number;
  charsNoSpace: number;
  sentences: number;
  lines: number;
  paragraphs: number;
  readingMinutes: number;
}

export function countStats(text: string): TextStats {
  const trimmed = text.trim();
  const words = trimmed ? trimmed.split(/\s+/).length : 0;
  const sentences = trimmed ? trimmed.split(/[.!?]+/).filter((s) => s.trim()).length : 0;
  const lines = text ? text.split(/\n/).filter((l) => l.trim() !== "").length : 0;
  const paragraphs = text
    ? text.split(/\n\s*\n/).filter((p) => p.trim() !== "").length
    : 0;
  return {
    words,
    chars: text.length,
    charsNoSpace: text.replace(/\s/g, "").length,
    sentences,
    lines,
    paragraphs,
    // ~200 words per minute average reading speed.
    readingMinutes: Math.round((words / 200) * 100) / 100,
  };
}