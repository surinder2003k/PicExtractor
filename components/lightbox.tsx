"use client";

import { useCallback, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, X, Download, Copy } from "lucide-react";
import type { ExtractedFrame } from "@/lib/types";

interface LightboxProps {
  frames: ExtractedFrame[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onDownload: (frame: ExtractedFrame) => void;
  onCopy: (frame: ExtractedFrame) => void;
}

export function Lightbox({ frames, index, onClose, onPrev, onNext, onDownload, onCopy }: LightboxProps) {
  const frame = frames[index];
  const hasPrev = index > 0;
  const hasNext = index < frames.length - 1;
  const touchStartX = useRef<number | null>(null);

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowLeft" && index > 0) {
        e.preventDefault();
        onPrev();
      } else if (e.key === "ArrowRight" && index < frames.length - 1) {
        e.preventDefault();
        onNext();
      }
    },
    [onClose, onPrev, onNext, index, frames.length]
  );

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [onKeyDown]);

  if (!frame) return null;

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) > 50) {
      if (dx < 0 && hasNext) onNext();
      else if (dx > 0 && hasPrev) onPrev();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-sm"
      onClick={onClose}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      role="dialog"
      aria-modal="true"
      aria-label={`Frame ${index + 1} of ${frames.length}`}
    >
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <span className="text-sm font-medium text-white">
          #{String(frame.id + 1).padStart(5, "0")} · <span className="font-mono">{frame.formattedTime}</span>
        </span>
        <span className="text-xs text-white/60">
          {index + 1} / {frames.length}
        </span>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-white/80 transition-colors hover:bg-white/10 hover:text-white"
          aria-label="Close viewer"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center">
        {hasPrev && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
            aria-label="Previous frame"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        )}

        <div
          className="flex h-full w-full items-center justify-center p-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- data-URL frames from canvas; next/image can't optimize these */}
          <img
            src={frame.dataUrl}
            alt={`Viewing frame at ${frame.formattedTime}`}
            className="max-h-full max-w-full rounded-lg object-contain"
          />
        </div>

        {hasNext && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
            aria-label="Next frame"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        )}
      </div>

      <div className="flex items-center justify-center gap-3 border-t border-white/10 px-4 py-3">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDownload(frame);
          }}
          className="inline-flex h-9 items-center gap-1.5 rounded-md bg-white/10 px-4 text-sm font-medium text-white transition-colors hover:bg-white/20"
          aria-label="Download frame from viewer"
        >
          <Download className="h-4 w-4" />
          Download
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onCopy(frame);
          }}
          className="inline-flex h-9 items-center gap-1.5 rounded-md bg-white/10 px-4 text-sm font-medium text-white transition-colors hover:bg-white/20"
          aria-label="Copy frame from viewer"
        >
          <Copy className="h-4 w-4" />
          Copy
        </button>
      </div>
    </div>
  );
}
