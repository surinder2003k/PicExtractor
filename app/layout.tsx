import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { Toaster } from "sonner";
import { Clapperboard } from "lucide-react";
import "./globals.css";
import { ThemeToggle } from "@/components/theme-toggle";

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
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Clapperboard className="h-4 w-4" />
              </span>
              <span>
                PicExtractor <span className="hidden text-muted-foreground sm:inline">· Video Screenshot Extractor</span>
              </span>
            </Link>
            <div className="flex items-center gap-2">
              <Link
                href="/tools"
                className="inline-flex h-9 items-center rounded-lg border border-border px-4 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                Tools
              </Link>
              <Link
                href="/extractor"
                className="inline-flex h-9 items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                Open Extractor
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-border/60 py-6">
          <p className="text-center text-sm text-muted-foreground">
            PicExtractor — everything runs locally in your browser. Your videos never leave your device.
          </p>
        </footer>
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
