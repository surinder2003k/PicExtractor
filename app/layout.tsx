import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { Toaster } from "sonner";
import { Clapperboard } from "lucide-react";
import "./globals.css";
import { ThemeToggle } from "@/components/theme-toggle";
import GlobalSearch from "@/components/global-search";
import BackToTop from "@/components/back-to-top";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "PicExtractor — Video Screenshot Extractor",
    template: "%s · PicExtractor",
  },
  description:
    "Extract every frame from your videos right in the browser. PNG/JPEG/WebP, time ranges, ZIP download, and more. No uploads, no server.",
  keywords: [
    "video screenshot",
    "extract frames",
    "frame extractor",
    "video to frames",
    "video screenshot extractor",
    "PNG",
    "WebP",
  ],
  applicationName: "PicExtractor",
  openGraph: {
    title: "PicExtractor — Video Screenshot Extractor",
    description:
      "Extract every frame from your videos right in the browser. PNG/JPEG/WebP, time ranges, ZIP download. No uploads, no server.",
    type: "website",
    siteName: "PicExtractor",
  },
  twitter: {
    card: "summary_large_image",
    title: "PicExtractor — Video Screenshot Extractor",
    description:
      "Extract every frame from your videos right in the browser. PNG/JPEG/WebP, time ranges, ZIP download. No uploads, no server.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
          <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
            <Link href="/" className="flex items-center gap-2.5 font-semibold">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-blue-500 text-primary-foreground shadow-sm">
                <Clapperboard className="h-4 w-4" />
              </span>
              <span className="flex flex-col leading-none">
                PicExtractor
                <span className="mt-0.5 hidden text-[10px] font-normal tracking-wide text-muted-foreground sm:inline">
                  tools that stay on your device
                </span>
              </span>
            </Link>
            <div className="flex items-center gap-2">
              <GlobalSearch />
              <Link
                href="/cheatsheets"
                className="hidden h-9 items-center rounded-lg border border-border px-4 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground md:inline-flex"
              >
                Cheat Sheets
              </Link>
              <Link
                href="/tools"
                className="inline-flex h-9 items-center rounded-lg border border-border bg-card px-4 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                Tools
              </Link>
              <Link
                href="/extractor"
                className="inline-flex h-9 items-center rounded-lg bg-gradient-to-r from-primary to-blue-500 px-4 text-sm font-medium text-primary-foreground shadow-sm transition-shadow hover:shadow-md"
              >
                Extract Video
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <BackToTop />
        <footer className="border-t border-border/60">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-10 sm:grid-cols-4 sm:px-6">
            <div className="col-span-2 sm:col-span-1">
              <p className="flex items-center gap-2 font-semibold">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Clapperboard className="h-3.5 w-3.5" />
                </span>
                PicExtractor
              </p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Free browser-based tools. Everything runs locally — your files never leave your device.
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold">Main</p>
              <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                <li><Link href="/extractor" className="transition-colors hover:text-foreground">Frame Extractor</Link></li>
                <li><Link href="/tools" className="transition-colors hover:text-foreground">All Tools</Link></li>
                <li><Link href="/cheatsheets" className="transition-colors hover:text-foreground">Cheat Sheets</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold">Popular Tools</p>
              <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                <li><Link href="/tools/currency" className="transition-colors hover:text-foreground">Currency Converter</Link></li>
                <li><Link href="/tools/qr-code" className="transition-colors hover:text-foreground">QR Generator</Link></li>
                <li><Link href="/tools/invoice" className="transition-colors hover:text-foreground">Invoice Generator</Link></li>
                <li><Link href="/tools/image-compressor" className="transition-colors hover:text-foreground">Image Compressor</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold">Resources</p>
              <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                <li><Link href="/cheatsheets" className="transition-colors hover:text-foreground">Git Reference</Link></li>
                <li><Link href="/cheatsheets" className="transition-colors hover:text-foreground">Regex Patterns</Link></li>
                <li><Link href="/cheatsheets" className="transition-colors hover:text-foreground">HTTP Codes</Link></li>
                <li><Link href="/cheatsheets" className="transition-colors hover:text-foreground">Excel Shortcuts</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/60 py-4">
            <p className="text-center text-xs text-muted-foreground">
              © {new Date().getFullYear()} PicExtractor — no uploads, no accounts, no limits.
            </p>
          </div>
        </footer>
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
