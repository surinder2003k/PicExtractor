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
  Coins,
  CalendarDays,
  BookOpen,
  Wifi,
  CloudSun,
  QrCode,
  Fingerprint,
  Hash,
  Type,
  Binary,
  Palette,
  Receipt,
  HeartPulse,
  GitCompare,
  Table,
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
  {
    icon: Coins,
    title: "Currency Converter",
    description: "Live exchange rates for 160+ currencies, updated daily.",
    href: "/tools/currency",
  },
  {
    icon: CalendarDays,
    title: "Public Holidays",
    description: "Official holidays by country — plan leaves and deadlines.",
    href: "/tools/holidays",
  },
  {
    icon: BookOpen,
    title: "Dictionary",
    description: "Instant word definitions, phonetics, and synonyms.",
    href: "/tools/dictionary",
  },
  {
    icon: Wifi,
    title: "My IP & Network",
    description: "See your public IP, location, ISP, and timezone.",
    href: "/tools/my-ip",
  },
  {
    icon: CloudSun,
    title: "Weather Check",
    description: "Current weather for any city, free and instant.",
    href: "/tools/weather",
  },
  {
    icon: QrCode,
    title: "QR Code Generator",
    description: "Turn links or text into downloadable QR codes.",
    href: "/tools/qr-code",
  },
  {
    icon: Fingerprint,
    title: "UUID Generator",
    description: "Cryptographically random UUID v4 IDs, in bulk.",
    href: "/tools/uuid",
  },
  {
    icon: Hash,
    title: "Hash Generator",
    description: "SHA-1/256/384/512 checksums via Web Crypto.",
    href: "/tools/hash",
  },
  {
    icon: Type,
    title: "Lorem Ipsum",
    description: "Placeholder text for mockups, decks, and templates.",
    href: "/tools/lorem",
  },
  {
    icon: Binary,
    title: "Base64 Encoder",
    description: "Encode/decode Base64 — Unicode and URL-safe.",
    href: "/tools/base64",
  },
  {
    icon: Palette,
    title: "Color Converter",
    description: "HEX ⇄ RGB ⇄ HSL with tints and shades.",
    href: "/tools/color",
  },
  {
    icon: Receipt,
    title: "GST Calculator",
    description: "Add or remove GST (5/12/18/28%) with breakdown.",
    href: "/tools/gst",
  },
  {
    icon: HeartPulse,
    title: "BMI Calculator",
    description: "Quick body-mass-index check with categories.",
    href: "/tools/bmi",
  },
  {
    icon: GitCompare,
    title: "Text Diff",
    description: "Compare two texts line by line, git-style + / -.",
    href: "/tools/text-diff",
  },
  {
    icon: Table,
    title: "CSV → Markdown",
    description: "Spreadsheet rows to GitHub/Notion Markdown tables.",
    href: "/tools/markdown-table",
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