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
  Cake,
  Percent,
  Landmark,
  MonitorSmartphone,
  Radio,
  Shuffle,
  Timer,
  ScrollText,
  Brush,
  Link2,
  Dices,
  FileArchive,
  Utensils,
  FileText,
  CalendarCheck,
  Pipette,
  SpellCheck,
  Eraser,
  Keyboard,
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
  {
    icon: Cake,
    title: "Age Calculator",
    description: "Exact age in years, months, and days from DOB.",
    href: "/tools/age",
  },
  {
    icon: Percent,
    title: "Percentage Calculator",
    description: "% of a number, % share, and % change — instantly.",
    href: "/tools/percentage",
  },
  {
    icon: Landmark,
    title: "EMI Calculator",
    description: "Loan EMI, total interest, and total payment.",
    href: "/tools/emi",
  },
  {
    icon: MonitorSmartphone,
    title: "Aspect Ratio",
    description: "Simplify ratios and resize media without distortion.",
    href: "/tools/aspect-ratio",
  },
  {
    icon: Radio,
    title: "Morse Code",
    description: "Translate text ⇄ Morse code for fun and puzzles.",
    href: "/tools/morse",
  },
  {
    icon: Binary,
    title: "Number Base",
    description: "Binary, octal, decimal, hex — all at once.",
    href: "/tools/number-base",
  },
  {
    icon: Shuffle,
    title: "Team Picker",
    description: "Fairly split people into random teams.",
    href: "/tools/team-picker",
  },
  {
    icon: Timer,
    title: "Pomodoro Timer",
    description: "25-minute focus sprints with breaks.",
    href: "/tools/pomodoro",
  },
  {
    icon: ScrollText,
    title: "Roman Numerals",
    description: "Numbers ⇄ Roman numerals, both directions.",
    href: "/tools/roman",
  },
  {
    icon: Brush,
    title: "Gradient Generator",
    description: "CSS linear gradients with live preview and copy.",
    href: "/tools/gradient",
  },
  {
    icon: Link2,
    title: "URL Encoder",
    description: "Encode/decode query params and URLs safely.",
    href: "/tools/url-encode",
  },
  {
    icon: Dices,
    title: "Randomizer",
    description: "Lucky numbers, coin flips, and dice rolls.",
    href: "/tools/randomizer",
  },
  {
    icon: FileArchive,
    title: "Image Compressor",
    description: "Shrink images locally with a quality slider.",
    href: "/tools/image-compressor",
  },
  {
    icon: Utensils,
    title: "Tip Splitter",
    description: "Split restaurant bills with tip, per person.",
    href: "/tools/tip-splitter",
  },
  {
    icon: Utensils,
    title: "Recipe Scaler",
    description: "Scale ingredient quantities up or down instantly.",
    href: "/tools/recipe-scaler",
  },
  {
    icon: FileText,
    title: "Invoice Generator",
    description: "Create GST invoices and print or save as PDF.",
    href: "/tools/invoice",
  },
  {
    icon: CalendarCheck,
    title: "Habit Tracker",
    description: "Weekly habit grid, saved in your browser.",
    href: "/tools/habits",
  },
  {
    icon: Timer,
    title: "Stopwatch",
    description: "Precision stopwatch with laps for tasks and workouts.",
    href: "/tools/stopwatch",
  },
  {
    icon: Pipette,
    title: "Palette Extractor",
    description: "Pull dominant HEX colors from any image.",
    href: "/tools/palette",
  },
  {
    icon: SpellCheck,
    title: "Number to Words",
    description: "Amounts in words (lakh/crore) for cheques.",
    href: "/tools/number-to-words",
  },
  {
    icon: Eraser,
    title: "Text Cleaner",
    description: "13 one-click fixes: trim, dedupe, sort, escape.",
    href: "/tools/text-cleaner",
  },
  {
    icon: Keyboard,
    title: "Typing Speed Test",
    description: "Measure your WPM and accuracy live.",
    href: "/tools/typing",
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