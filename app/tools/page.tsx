import Link from "next/link";
import {
  FileSpreadsheet,
  Braces,
  Image as ImageIcon,
  CaseUpper,
  AlignLeft,
  Clock,
  KeyRound,
  Ruler,
  CalendarRange,
} from "lucide-react";

const tools = [
  {
    icon: FileSpreadsheet,
    title: "CSV ⇄ JSON",
    description: "Convert CSV to JSON and back. Handles quotes and commas.",
    href: "/tools/csv-json",
  },
  {
    icon: Braces,
    title: "JSON Formatter",
    description: "Pretty-print, minify, and validate JSON plus structure stats.",
    href: "/tools/json-formatter",
  },
  {
    icon: ImageIcon,
    title: "Image Converter",
    description: "Convert PNG/JPEG/WebP and resize. Stays on your device.",
    href: "/tools/image-converter",
  },
  {
    icon: CaseUpper,
    title: "Case Converter",
    description: "UPPERCASE, lowercase, Title Case, camelCase, snake_case, and more.",
    href: "/tools/case-converter",
  },
  {
    icon: AlignLeft,
    title: "Word Counter",
    description: "Live word, character, sentence, and reading-time stats.",
    href: "/tools/word-count",
  },
  {
    icon: Clock,
    title: "Timestamp Converter",
    description: "Unix timestamp to human date and back, instantly.",
    href: "/tools/timestamp",
  },
  {
    icon: KeyRound,
    title: "Password Generator",
    description: "Strong, secure random passwords with custom options.",
    href: "/tools/password",
  },
  {
    icon: Ruler,
    title: "Unit Converter",
    description: "Length, weight, temperature,and data-size conversions.",
    href: "/tools/unit-converter",
  },
  {
    icon: CalendarRange,
    title: "Duration Calculator",
    description: "Days/months/years between two dates (age or tenure)",
    href: "/tools/duration",
  },
];

export default function ToolsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="text-4xl font-bold tracking-tight">Business Toolkit</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Free productivity tools that run entirely in your browser. No uploads, no server, no sign-in.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="group rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/60"
          >
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <tool.icon className="h-5 w-5" />
            </div>
            <h3 className="font-semibold">{tool.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{tool.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}