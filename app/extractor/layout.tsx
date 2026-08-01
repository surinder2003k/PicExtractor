import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Extractor",
  description:
    "Upload a video and extract every frame right in your browser. PNG, JPEG & WebP export, precise time ranges, single-frame capture, and batch ZIP downloads.",
};

export default function ExtractorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
