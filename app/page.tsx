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
  Search,
  MousePointer2,
  Package,
} from "lucide-react";

const stats = [
  { value: "36+", label: "Free tools" },
  { value: "0₹", label: "Forever cost" },
  { value: "0", label: "Uploads — runs on your device" },
  { value: "5", label: "Searchable cheat sheets" },
];

const worlds = [
  {
    icon: Clapperboard,
    title: "Video Frame Extractor",
    description: "Pull every frame out of any video — PNG/JPEG/WebP, time ranges, ZIP export.",
    href: "/extractor",
    cta: "Open extractor",
  },
  {
    icon: Wrench,
    title: "36-in-1 Toolkit",
    description: "Currency, weather, QR, invoices, converters, calculators — all in one hub.",
    href: "/tools",
    cta: "Browse tools",
  },
  {
    icon: BookOpen,
    title: "Cheat Sheets",
    description: "Git, Regex, HTTP codes, Markdown & Excel — searchable quick reference.",
    href: "/cheatsheets",
    cta: "Study up",
  },
];

const steps = [
  {
    icon: MousePointer2,
    title: "1 · Drop your file",
    description: "Drag a video, image, CSV or text into any tool. Nothing is uploaded anywhere.",
  },
  {
    icon: Gauge,
    title: "2 · It processes locally",
    description: "Your browser does the heavy lifting with web workers — fast and private.",
  },
  {
    icon: Package,
    title: "3 · Download results",
    description: "Grab frames, ZIPs, invoices or converted files instantly. Done in seconds.",
  },
];

const faqs = [
  {
    q: "Is PicExtractor really free?",
    a: "Yes — every tool, every feature, no account, no paywall, no watermarks. It runs entirely in your browser, so there are no server costs to pass on to you.",
  },
  {
    q: "Are my files uploaded to a server?",
    a: "No. Videos, images and text never leave your device. Everything is processed locally using modern browser APIs like Canvas, Web Workers and Web Crypto.",
  },
  {
    q: "Which video formats are supported?",
    a: "Anything your browser can play — MP4, WebM, MOV, MKV and more. Frames export as PNG, JPEG or WebP.",
  },
  {
    q: "Does it work offline?",
    a: "Most tools do, once the page is loaded. Only live-data tools (currency, weather, holidays, dictionary) need internet.",
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
    description: "Select individual frames, capture the playhead instantly, copy to clipboard.",
  },
  {
    icon: Film,
    title: "All Formats",
    description: "Works with MP4, WebM, MOV, AVI, and all modern video formats.",
  },
  {
    icon: Download,
    title: "Easy Download",
    description: "Download single frames or the whole set with timestamps and frame numbers.",
  },
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
            No uploads · No server · 100% private
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
            Extract every frame from your videos{" "}
            <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
              instantly
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            The upgraded video screenshot extractor. PNG, JPEG & WebP export, precise time ranges,
            instant single-frame capture, and batch ZIP downloads — all running in your browser.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/extractor"
              className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-6 text-base font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              <Zap className="h-5 w-5" />
              Start Extracting
            </Link>
            <a
              href="#features"
              className="inline-flex h-11 items-center rounded-lg border border-border bg-card px-6 text-base font-medium transition-colors hover:bg-secondary"
            >
              See Features
            </a>
          </div>
        </div>
      </section>

      <section className="border-y border-border/60 bg-card/50">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 text-center sm:grid-cols-4 sm:px-6">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
                {s.value}
              </p>
              <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-b border-border/60">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              More than a frame extractor
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Three tools, one site</h2>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
            {worlds.map((w) => (
              <Link
                key={w.title}
                href={w.href}
                className="group rounded-xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/60 hover:shadow-lg"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <w.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold">{w.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{w.description}</p>
                <p className="mt-4 text-sm font-medium text-primary transition-transform group-hover:translate-x-1">
                  {w.cta} →
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="border-b border-border/60">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
          <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">Powerful Features</h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-muted-foreground">
            Everything the original does, upgraded — plus a whole lot more.
          </p>
          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/50"
              >
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border/60">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">How it works</h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-muted-foreground">
            Three steps. No sign-up. No waiting rooms.
          </p>
          <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
            {steps.map((s) => (
              <div key={s.title} className="rounded-xl border border-border bg-card p-6 text-center">
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
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">FAQ</h2>
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

      <section className="border-t-0">
        <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 sm:py-20">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Ready to extract?</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Upload your video and extract every frame in seconds. Everything stays on your device.
          </p>
          <Link
            href="/extractor"
            className="mt-8 inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-8 text-base font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Clapperboard className="h-5 w-5" />
            Open Extractor
          </Link>
        </div>
      </section>
    </div>
  );
}
