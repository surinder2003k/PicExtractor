"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Award,
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
  ShieldQuestion,
  FileUser,
  TrendingUp,
  Accessibility,
  Brain,
  BarChart3,
  Scale,
  PenLine,
  Hourglass,
  Image,
  Music,
  Divide,
  FileCode2,
  Globe2,
  Eye,
  Wallet,
  Network,
  Lightbulb,
  Sparkles,
  Columns3,
  FileOutput,
  Tag,
  Highlighter,
  Filter,
  Sigma,
  CalendarClock,
  Smile,
  Circle,
  Languages,
  PiggyBank,
  GraduationCap,
  Scissors,
  Search,
  LayoutGrid,
} from "lucide-react";

const CATS = ["All", "Developer", "Design", "Text", "Calculators", "Money", "Time", "Utilities", "Live"] as const;

const catOf: Record<string, string> = {
  "/tools/csv-json": "Developer", "/tools/json-formatter": "Developer", "/tools/json-to-ts": "Developer",
  "/tools/base64": "Developer", "/tools/hash": "Developer", "/tools/uuid": "Developer",
  "/tools/jwt": "Developer", "/tools/regex": "Developer", "/tools/url-encode": "Developer",
  "/tools/number-base": "Developer", "/tools/text-diff": "Developer", "/tools/subnet": "Developer",
  "/tools/my-ip": "Developer", "/tools/csv-cleaner": "Developer", "/tools/markdown-table": "Developer",
  "/tools/image-converter": "Design", "/tools/image-compressor": "Design", "/tools/qr-code": "Design",
  "/tools/placeholder": "Design", "/tools/color": "Design", "/tools/contrast": "Design",
  "/tools/shadows": "Design", "/tools/border-radius": "Design", "/tools/gradient": "Design",
  "/tools/gradient-text": "Design", "/tools/palette": "Design",
  "/tools/case-converter": "Text", "/tools/word-count": "Text", "/tools/word-frequency": "Text",
  "/tools/lorem": "Text", "/tools/titles": "Text", "/tools/text-cleaner": "Text",
  "/tools/markdown-preview": "Text", "/tools/emoji": "Text", "/tools/morse": "Text",
  "/tools/caesar": "Text", "/tools/number-to-words": "Text",
  "/tools/timestamp": "Time", "/tools/date-math": "Time", "/tools/duration": "Time",
  "/tools/age": "Time", "/tools/holidays": "Time", "/tools/countdown": "Time",
  "/tools/stopwatch": "Time", "/tools/pomodoro": "Time", "/tools/timesheet": "Time", "/tools/metronome": "Time",
  "/tools/currency": "Money", "/tools/gst": "Money", "/tools/discount": "Money", "/tools/emi": "Money",
  "/tools/interest": "Money", "/tools/invoice": "Money", "/tools/bills": "Money",
  "/tools/savings": "Money", "/tools/tip-splitter": "Money",
  "/tools/unit-converter": "Calculators", "/tools/aspect-ratio": "Calculators", "/tools/fractions": "Calculators",
  "/tools/percentage": "Calculators", "/tools/marks": "Calculators", "/tools/cgpa": "Calculators",
  "/tools/roman": "Calculators", "/tools/bmi": "Calculators", "/tools/ideal-weight": "Calculators",
  "/tools/password": "Utilities", "/tools/strength": "Utilities", "/tools/typing": "Utilities",
  "/tools/memory": "Utilities", "/tools/randomizer": "Utilities", "/tools/team-picker": "Utilities",
  "/tools/chart": "Utilities", "/tools/kanban": "Utilities", "/tools/resume": "Utilities",
  "/tools/text-pdf": "Utilities", "/tools/url-cleaner": "Utilities", "/tools/habits": "Utilities",
  "/tools/weather": "Live", "/tools/country": "Live", "/tools/dictionary": "Live", "/tools/advice": "Live",
};

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
    description: "Classic, dots, or 3D tree styled QR codes.",
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
    icon: GraduationCap,
    title: "CGPA Calculator",
    description: "Add SGPA per semester → credit-weighted CGPA instantly.",
    href: "/tools/cgpa",
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
  {
    icon: ShieldQuestion,
    title: "Password Strength",
    description: "Entropy, crack time, and best-practice checks.",
    href: "/tools/strength",
  },
  {
    icon: FileUser,
    title: "Resume Builder",
    description: "Build a clean resume and print to PDF.",
    href: "/tools/resume",
  },
  {
    icon: TrendingUp,
    title: "Compound Interest",
    description: "Lump sum + SIP growth with compounding.",
    href: "/tools/interest",
  },
  {
    icon: Accessibility,
    title: "Contrast Checker",
    description: "WCAG AA/AAA checks for color pairs.",
    href: "/tools/contrast",
  },
  {
    icon: CalendarDays,
    title: "Date Add / Subtract",
    description: "Days from today, deadlines, due dates.",
    href: "/tools/date-math",
  },
  {
    icon: Brain,
    title: "Memory Match",
    description: "Fun brain-break game — find all pairs.",
    href: "/tools/memory",
  },
  {
    icon: BarChart3,
    title: "Bar Chart Maker",
    description: "Paste data, get a PNG chart for slides.",
    href: "/tools/chart",
  },
  {
    icon: Scale,
    title: "Ideal Weight",
    description: "Robinson & Devine formulas + BMI band.",
    href: "/tools/ideal-weight",
  },
  {
    icon: PenLine,
    title: "Blog Title Generator",
    description: "Proven headline patterns for any topic.",
    href: "/tools/titles",
  },
  {
    icon: Hourglass,
    title: "Countdown Timer",
    description: "Meetings, sprints, and breaks — beep on zero.",
    href: "/tools/countdown",
  },
  {
    icon: KeyRound,
    title: "JWT Decoder",
    description: "Inspect token header & payload locally.",
    href: "/tools/jwt",
  },
  {
    icon: Image,
    title: "SVG Placeholder",
    description: "Mockup images for layouts — instant SVG.",
    href: "/tools/placeholder",
  },
  {
    icon: Music,
    title: "Metronome",
    description: "Click track with accented first beat.",
    href: "/tools/metronome",
  },
  {
    icon: Divide,
    title: "Fraction Calculator",
    description: "Add, subtract, multiply, divide fractions.",
    href: "/tools/fractions",
  },
  {
    icon: FileCode2,
    title: "JSON → TypeScript",
    description: "Generate TS interfaces from JSON samples.",
    href: "/tools/json-to-ts",
  },
  {
    icon: Globe2,
    title: "Country Info",
    description: "Flag, capital, currency, population — instant.",
    href: "/tools/country",
  },
  {
    icon: Eye,
    title: "Markdown Preview",
    description: "Live-rendered markdown as you type.",
    href: "/tools/markdown-preview",
  },
  {
    icon: Wallet,
    title: "Bill Reminder",
    description: "Track due bills locally, spot overdue ones.",
    href: "/tools/bills",
  },
  {
    icon: Network,
    title: "Subnet Calculator",
    description: "CIDR → mask, network, broadcast, hosts.",
    href: "/tools/subnet",
  },
  {
    icon: Lightbulb,
    title: "Random Advice",
    description: "A nugget of wisdom on demand.",
    href: "/tools/advice",
  },
  {
    icon: Sparkles,
    title: "Box Shadow Generator",
    description: "Tune sliders, copy production CSS.",
    href: "/tools/shadows",
  },
  {
    icon: Columns3,
    title: "Mini Kanban",
    description: "Three-column task board on your device.",
    href: "/tools/kanban",
  },
  {
    icon: FileOutput,
    title: "Text → PDF",
    description: "Clean printable PDFs from plain text.",
    href: "/tools/text-pdf",
  },
  {
    icon: Tag,
    title: "Discount Calculator",
    description: "Stacked coupons, real final price.",
    href: "/tools/discount",
  },
  {
    icon: Braces,
    title: "Regex Tester",
    description: "Live match highlighting and match list.",
    href: "/tools/regex",
  },
  {
    icon: Highlighter,
    title: "Gradient Text",
    description: "Gradient headlines with copy-paste CSS.",
    href: "/tools/gradient-text",
  },
  {
    icon: Filter,
    title: "CSV Cleaner",
    description: "Trim, dedupe, and drop empty rows.",
    href: "/tools/csv-cleaner",
  },
  {
    icon: Sigma,
    title: "Word Frequency",
    description: "Spot overused words in your writing.",
    href: "/tools/word-frequency",
  },
  {
    icon: CalendarClock,
    title: "Timesheet Calculator",
    description: "Multiple shifts minus breaks, per day.",
    href: "/tools/timesheet",
  },
  {
    icon: Smile,
    title: "Emoji Copier",
    description: "Click-to-copy emoji for chats and docs.",
    href: "/tools/emoji",
  },
  {
    icon: Circle,
    title: "Border Radius",
    description: "Per-corner rounding with live preview.",
    href: "/tools/border-radius",
  },
  {
    icon: Languages,
    title: "Caesar Cipher",
    description: "Shift encode, decode, and auto-crack.",
    href: "/tools/caesar",
  },
  {
    icon: PiggyBank,
    title: "Savings Goal",
    description: "Track progress and ETA to your target.",
    href: "/tools/savings",
  },
  {
    icon: GraduationCap,
    title: "Marks Percentage",
    description: "Marks to %, grade, and approx CGPA.",
    href: "/tools/marks",
  },
  {
    icon: Scissors,
    title: "URL Cleaner",
    description: "Strip utm/gclid/fbclid tracking params.",
    href: "/tools/url-cleaner",
  },
  {
    icon: Award,
    title: "CGPA Calculator",
    description: "SGPA + credits → credit-weighted CGPA.",
    href: "/tools/cgpa",
  },
];

export default function ToolsPage() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<(typeof CATS)[number]>("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tools.filter((t) => {
      if (cat !== "All" && catOf[t.href] !== cat) return false;
      if (!q) return true;
      return (
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q)
      );
    });
  }, [query, cat]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
          {tools.length} tools · free forever · no sign-up
        </span>
        <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
          The whole{" "}
          <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
            toolbox
          </span>
          , one page
        </h1>
        <p className="mt-3 text-muted-foreground">
          Everything runs in your browser. Pick a category or search for what you need.
        </p>
      </div>

      <div className="sticky top-14 z-30 -mx-4 mt-8 bg-background/85 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 shadow-sm">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${tools.length} tools… (e.g. qr, emi, json)`}
              className="min-w-0 flex-1 bg-transparent py-2.5 text-sm outline-none"
            />
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {CATS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCat(c)}
                className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                  cat === c
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                {c === "All" ? "◈ All" : c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="mt-16 text-center text-muted-foreground">
          Nothing matched &ldquo;{query}&rdquo;. Try another word?
        </p>
      ) : (
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {tools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="group rounded-2xl border border-border bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
          >
            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <tool.icon className="h-5 w-5" />
            </div>
            <h3 className="font-semibold leading-snug">{tool.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{tool.description}</p>
            <span className="mt-3 inline-block text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
              Open →
            </span>
          </Link>
        ))}
      </div>
      )}
    </div>
  );
}