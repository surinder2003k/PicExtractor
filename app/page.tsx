import Link from "next/link";
import {
  Zap,
  Clapperboard,
  Download,
  Image as ImageIcon,
  FolderArchive,
  SlidersHorizontal,
  MousePointerClick,
  Film,
  Wrench,
  BookOpen,
  ShieldCheck,
  Sparkles,
  Gauge,
  MousePointer2,
  Package,
  GraduationCap,
  Heart,
  Star,
} from "lucide-react";
import { AnimatedCounter } from "@/components/animated-counter";
import FavoritesGrid from "@/components/favorites-grid";

const stats = [
  { value: "83+", label: "Free tools" },
  { value: "0â‚¹", label: "Forever cost" },
  { value: "0", label: "Uploads â€” runs on your device" },
  { value: "6", label: "Searchable cheat sheets" },
];

const worlds = [
  {
    icon: Clapperboard,
    title: "Video Frame Extractor",
    description: "Pull every frame out of any video â€” PNG/JPEG/WebP, time ranges, ZIP export. Perfect for creators, reviewers, and anyone who needs that one perfect frame.",
    href: "/extractor",
    cta: "Open extractor",
  },
  {
    icon: Wrench,
    title: "83-in-1 Toolkit",
    description: "Currency, weather, QR codes, invoices, converters, calculators, dev tools â€” all in one hub. No apps to install, no accounts to create.",
    href: "/tools",
    cta: "Browse tools",
  },
  {
    icon: BookOpen,
    title: "Cheat Sheets",
    description: "Git, Regex, HTTP codes, Markdown, Excel, and more â€” searchable quick reference that actually helps you get things done.",
    href: "/cheatsheets",
    cta: "Study up",
  },
];

const steps = [
  {
    icon: MousePointer2,
    title: "1 Â· Drop your file",
    description: "Drag a video, image, CSV, or text into any tool. Nothing is uploaded anywhere â€” your files stay on your device.",
  },
  {
    icon: Gauge,
    title: "2 Â· It processes locally",
    description: "Your browser does the heavy lifting with web workers â€” fast, private, and works even offline.",
  },
  {
    icon: Package,
    title: "3 Â· Download results",
    description: "Grab frames, ZIPs, invoices, or converted files instantly. Done in seconds, not minutes.",
  },
];

const faqs = [
  {
    q: "Is PicExtractor really free?",
    a: "Yes â€” every tool, every feature, no account, no paywall, no watermarks. It runs entirely in your browser, so there are no server costs to pass on to you.",
  },
  {
    q: "Are my files uploaded to a server?",
    a: "No. Videos, images, and text never leave your device. Everything is processed locally using modern browser APIs like Canvas, Web Workers, and Web Crypto.",
  },
  {
    q: "Which video formats are supported?",
    a: "Anything your browser can play â€” MP4, WebM, MOV, MKV, and more. Frames export as PNG, JPEG, or WebP with full quality control.",
  },
  {
    q: "Does it work offline?",
    a: "Most tools do, once the page is loaded. Only live-data tools (currency, weather, holidays, dictionary) need an internet connection.",
  },
];

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Parallel frame extraction with a smart seek pool. No waiting on sequential seeks.",
  },
  {
    icon: Clapperboard,
    title: "Every Frame",
    description: "Capture every single frame from your video at millisecond precision.",
  },
  {
    icon: ImageIcon,
    title: "Multiple Formats",
    description: "Export as PNG, JPEG, or WebP with full control over compression quality.",
  },
  {
    icon: SlidersHorizontal,
    title: "Time Range Control",
    description: "Extract only the section you need with precise start and end timestamps.",
  },
  {
    icon: FolderArchive,
    title: "ZIP Batch Download",
    description: "Grab all selected frames at once as a single, neatly named ZIP archive.",
  },
  {
    icon: MousePointerClick,
    title: "Pick & Choose",
    description: "Select individual frames, preview them fullscreen, and download only what you want.",
  },
];

const favoriteTools = [
  { href: "/tools/qr-code", title: "QR Code Generator", emoji: "ðŸŒ³" },
  { href: "/tools/cgpa", title: "CGPA Calculator", emoji: "ðŸŽ“" },
  { href: "/tools/currency", title: "Currency Converter", emoji: "ðŸ’±" },
  { href: "/tools/image-compressor", title: "Image Compressor", emoji: "ðŸ—œï¸" },
  { href: "/tools/invoice", title: "Invoice Generator", emoji: "ðŸ§¾" },
  { href: "/tools/typing", title: "Typing Test", emoji: "âŒ¨ï¸" },
  { href: "/tools/weather", title: "Weather Check", emoji: "â›…" },
  { href: "/tools/markdown-preview", title: "Markdown Preview", emoji: "ðŸ“" },
];
export default function Home() {
  return (
    <div>
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(60rem 30rem at 50% -10%, color-mix(in oklab, var(--primary) 18%, transparent), transparent 70%)",
          }}
        />
        <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 sm:py-28">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <Heart className="h-3 w-3 text-red-400" /> Made with privacy in mind
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            One site,{" "}
            <span className="bg-gradient-to-r from-primary via-blue-400 to-cyan-400 bg-clip-text text-transparent">
              83 free tools
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Extract frames, convert currencies, build invoices, test typing, check weather, generate QR codes — and a lot more. No sign-up. No uploads. Just works.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/extractor"
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-blue-500 px-7 text-base font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 hover:shadow-xl sm:w-auto"
            >
              <Zap className="h-5 w-5" />
              Extract Frames
            </Link>
            <Link
              href="/tools"
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-border bg-card px-7 text-base font-medium text-foreground transition-colors hover:bg-secondary sm:w-auto"
            >
              <Wrench className="h-5 w-5 text-primary" />
              Explore All Tools
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-border/60 bg-card/50">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-8 text-center sm:grid-cols-4 sm:gap-6 sm:px-6 sm:py-12">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl border border-border/60 bg-background/50 p-4">
              <p className="text-2xl font-bold text-primary sm:text-3xl"><AnimatedCounter value={s.value} /></p>
              <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-b border-border/60">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
          <h2 className="text-center text-2xl font-bold tracking-tight sm:text-3xl">Jump to a favorite</h2>
          <p className="mx-auto mt-2 max-w-lg text-center text-sm text-muted-foreground">
            Most-used tools, one tap away. No digging through menus.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {favoriteTools.map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className="group flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md"
              >
                <span className="text-2xl">{t.emoji}</span>
                <span className="text-sm font-medium leading-snug group-hover:text-primary">{t.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* YOUR FAVORITES */}
      <section className="border-b border-border/60 bg-card/30">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
          <h2 className="text-center text-2xl font-bold tracking-tight sm:text-3xl">
            <Star className="mr-2 inline h-6 w-6 text-yellow-500" /> Your Favorites
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-center text-sm text-muted-foreground">
            Star any tool and it shows up here. Saved on your device — no account needed.
          </p>
          <div className="mt-8">
            <FavoritesGrid />
          </div>
        </div>
      </section>

      {/* THREE WORLDS */}
      <section className="border-b border-border/60">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              More than just one tool
            </span>
            <h2 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">Three hubs, one site</h2>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
            {worlds.map((w) => (
              <Link
                key={w.title}
                href={w.href}
                className="group rounded-2xl border border-border bg-card p-6 transition-all duration-200 hover:-translate-y-1 hover:border-primary/60 hover:shadow-xl hover:shadow-primary/5"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <w.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold">{w.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{w.description}</p>
                <p className="mt-4 text-sm font-medium text-primary transition-transform group-hover:translate-x-1">
                  {w.cta} →
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border/60 bg-card/30">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-20">
          <h2 className="text-center text-2xl font-bold tracking-tight sm:text-3xl">Why people love it</h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-sm text-muted-foreground">
            Built for speed, privacy, and simplicity — every feature serves a purpose.
          </p>
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/50"
              >
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold">{f.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border/60">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-20">
          <h2 className="text-center text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">How it works</h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-muted-foreground">
            Three steps. No sign-up. No waiting rooms.
          </p>
          <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
            {steps.map((s, i) => (
              <div key={s.title} className="relative rounded-xl border border-border bg-card p-6 text-center">
                {i < steps.length - 1 && (
                  <div className="absolute top-1/2 -right-2 hidden h-0.5 w-4 bg-primary/30 md:block" />
                )}
                <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <s.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-primary" />
            Privacy by design — your files never touch a server.
          </div>
        </div>
      </section>

      <section className="border-b border-border/60">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-20">
          <h2 className="text-center text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">FAQ</h2>
          <div className="mt-8 space-y-3">
            {faqs.map((f) => (
              <details key={f.q} className="group rounded-xl border border-border bg-card p-5 open:border-primary/50">
                <summary className="cursor-pointer list-none font-semibold marker:hidden">
                  <span className="mr-2 text-primary group-open:hidden">+</span>
                  <span className="mr-2 hidden text-primary group-open:inline">−</span>
                  {f.q}
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 sm:py-24">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">Ready to get started?</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Pick a tool, drop a file, get results. Takes less than 30 seconds.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/extractor"
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-blue-500 px-8 text-base font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 sm:w-auto"
            >
              <Clapperboard className="h-5 w-5" />
              Open Frame Extractor
            </Link>
            <Link
              href="/tools"
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-border bg-card px-8 text-base font-medium transition-colors hover:bg-secondary sm:w-auto"
            >
              <Wrench className="h-5 w-5 text-primary" />
              Browse 83+ Tools
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
