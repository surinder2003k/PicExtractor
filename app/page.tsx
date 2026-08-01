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
} from "lucide-react";

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

      <section id="features" className="border-t border-border/60">
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

      <section className="border-t border-border/60">
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
