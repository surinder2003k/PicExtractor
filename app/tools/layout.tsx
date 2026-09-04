import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Business Toolkit",
  description:
    "Free client-side productivity tools: CSV to JSON, JSON formatter, image converter, case converter, word counter, timestamp, password, unit converter, and duration calculator. No uploads, no server.",
};
export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return children;
}