"use client";

import type { ExtractedFrame } from "@/lib/types";

interface FrameCardProps {
  frame: ExtractedFrame;
  selected: boolean;
  onToggle: () => void;
  onOpen: () => void;
  onDownload: () => void;
  onCopy: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
}

export function FrameCard({ frame, selected, onToggle, onOpen, onDownload, onCopy, onContextMenu }: FrameCardProps) {
  return (
    <div
      className="group relative overflow-hidden rounded-lg border border-border bg-muted transition-colors hover:border-primary"
      onContextMenu={onContextMenu}
    >
      <button type="button" onClick={onOpen} className="block w-full cursor-pointer" aria-label={`Open frame at ${frame.formattedTime}`}>
        {/* eslint-disable-next-line @next/next/no-img-element -- data-URL frames from canvas; next/image can't optimize these */}
        <img
          src={frame.dataUrl}
          alt={`Frame at ${frame.formattedTime}`}
          loading="lazy"
          className={`h-auto w-full object-contain transition-opacity ${selected ? "" : "opacity-60"}`}
        />
      </button>

      <label
        className="absolute left-2 top-2 z-10 flex h-6 w-6 cursor-pointer items-center justify-center rounded-md border border-border bg-background/80 backdrop-blur-sm"
        aria-label={`Select frame ${frame.formattedTime}`}
      >
        <input
          type="checkbox"
          checked={selected}
          onChange={onToggle}
          className="h-4 w-4 cursor-pointer accent-primary"
        />
      </label>

      <div className="absolute right-2 top-2 z-10 flex flex-col gap-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100 pointer-coarse:opacity-100">
        <button
          type="button"
          onClick={onDownload}
          className="flex h-7 w-7 items-center justify-center rounded-md bg-background/80 text-xs backdrop-blur-sm transition-colors hover:bg-primary hover:text-primary-foreground"
          title="Download frame"
          aria-label={`Download frame ${frame.formattedTime}`}
        >
          ⬇
        </button>
        <button
          type="button"
          onClick={onCopy}
          className="flex h-7 w-7 items-center justify-center rounded-md bg-background/80 text-xs backdrop-blur-sm transition-colors hover:bg-primary hover:text-primary-foreground"
          title="Copy to clipboard"
          aria-label={`Copy frame ${frame.formattedTime}`}
        >
          ⧉
        </button>
      </div>

      <div className="flex items-center justify-between bg-black/60 px-2 py-1 text-[10px] font-semibold text-white">
        <span>#{String(frame.id + 1).padStart(5, "0")}</span>
        <span className="font-mono">{frame.formattedTime}</span>
      </div>
    </div>
  );
}
