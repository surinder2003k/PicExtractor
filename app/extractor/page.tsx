"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
  Play,
  Square,
  Camera,
  FolderArchive,
  CheckSquare,
  Square as SquareIcon,
  AlertTriangle,
  Loader2,
  Info,
  Trash2,
  LayoutGrid,
  Search,
} from "lucide-react";
import { Dropzone, SelectedFileBadge, validationMessage } from "@/components/dropzone";
import { FrameCard } from "@/components/frame-card";
import { Lightbox } from "@/components/lightbox";
import { extractFrames } from "@/lib/extractor";
import {
  captureFrameAtTime,
  estimateFrameCount,
  formatTime,
  isValidVideoFile,
  readVideoInfo,
  timeToSeconds,
} from "@/lib/video";
import { copyFrameToClipboard, downloadFramesZip, downloadSingleFrame } from "@/lib/zip";
import { buildContactSheet, estimateFramesSize, formatBytes } from "@/lib/contact-sheet";
import type { ExtractedFrame, FrameFormat } from "@/lib/types";

const FORMATS: { value: FrameFormat; label: string }[] = [
  { value: "png", label: "PNG" },
  { value: "jpeg", label: "JPEG" },
  { value: "webp", label: "WebP" },
];

const SETTINGS_KEY = "picsnap-settings";

interface SavedSettings {
  intervalMs: number;
  format: FrameFormat;
  quality: number;
  prefix?: string;
  gridCols?: number;
}

const DEFAULT_SETTINGS = { intervalMs: 500, format: "jpeg" as FrameFormat, quality: 85, prefix: "", gridCols: 4 };

function loadSettings(): SavedSettings {
  if (typeof window === "undefined") return { ...DEFAULT_SETTINGS };
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    const parsed = JSON.parse(raw) as Partial<SavedSettings>;
    return {
      intervalMs: typeof parsed.intervalMs === "number" ? parsed.intervalMs : DEFAULT_SETTINGS.intervalMs,
      format: (FORMATS.some((f) => f.value === parsed.format) ? parsed.format : DEFAULT_SETTINGS.format) as FrameFormat,
      quality: typeof parsed.quality === "number" ? parsed.quality : DEFAULT_SETTINGS.quality,
      prefix: typeof parsed.prefix === "string" ? parsed.prefix : "",
      gridCols: typeof parsed.gridCols === "number" ? parsed.gridCols : DEFAULT_SETTINGS.gridCols,
    };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

interface ContextMenuState {
  x: number;
  y: number;
  frame: ExtractedFrame;
}

export default function Extractor() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const videoUrlRef = useRef<string | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [videoWidth, setVideoWidth] = useState(0);
  const [videoHeight, setVideoHeight] = useState(0);

  const [intervalMs, setIntervalMs] = useState(loadSettings().intervalMs);
  const [format, setFormat] = useState<FrameFormat>(loadSettings().format);
  const [quality, setQuality] = useState(loadSettings().quality);
  const [prefix, setPrefix] = useState<string>(loadSettings().prefix ?? "");
  const [gridCols, setGridCols] = useState<number>(loadSettings().gridCols ?? DEFAULT_SETTINGS.gridCols);
  const [frameFilter, setFrameFilter] = useState("");
  const [sheetBusy, setSheetBusy] = useState(false);
  const [startStr, setStartStr] = useState("00:00:00.000");
  const [endStr, setEndStr] = useState("");

  const [extracting, setExtracting] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0, elapsedMs: 0 });
  const [frames, setFrames] = useState<ExtractedFrame[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
  const [zipping, setZipping] = useState(false);
  const [zipProgress, setZipProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const loadVideo = useCallback(
    async (newFile: File) => {
      abortRef.current?.abort();
      if (videoUrlRef.current) URL.revokeObjectURL(videoUrlRef.current);
      const url = URL.createObjectURL(newFile);
      videoUrlRef.current = url;
      setFile(newFile);
      setVideoUrl(url);
      setFrames([]);
      setSelected(new Set());
      setViewerIndex(null);
      setProgress({ done: 0, total: 0, elapsedMs: 0 });
      setError(null);
      try {
        const info = await readVideoInfo(newFile);
        setDuration(info.duration);
        setVideoWidth(info.width);
        setVideoHeight(info.height);
        setEndStr(formatTime(info.duration));
      } catch {
        toast.error("Failed to read video metadata. The file may be corrupted or unsupported.");
      }
    },
    []
  );

  const clearVideo = useCallback(() => {
    abortRef.current?.abort();
    if (videoUrlRef.current) {
      URL.revokeObjectURL(videoUrlRef.current);
      videoUrlRef.current = null;
    }
    setFile(null);
    setVideoUrl(null);
    setDuration(0);
    setVideoWidth(0);
    setVideoHeight(0);
    setFrames([]);
    setSelected(new Set());
    setViewerIndex(null);
    setProgress({ done: 0, total: 0, elapsedMs: 0 });
    setError(null);
  }, []);

  const handleFile = (f: File) => {
    if (!isValidVideoFile(f)) {
      validationMessage(f);
      return;
    }
    loadVideo(f);
  };

  useEffect(() => {
    const onDragOver = (e: DragEvent) => {
      if (e.dataTransfer?.types.includes("Files")) {
        e.preventDefault();
      }
    };
    const onDrop = (e: DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer?.files?.[0];
      if (file && isValidVideoFile(file)) {
        loadVideo(file);
      }
    };
    window.addEventListener("dragover", onDragOver);
    window.addEventListener("drop", onDrop);
    return () => {
      window.removeEventListener("dragover", onDragOver);
      window.removeEventListener("drop", onDrop);
    };
  }, [loadVideo]);

  useEffect(() => {
    return () => {
      if (videoUrlRef.current) URL.revokeObjectURL(videoUrlRef.current);
    };
  }, []);

  const startTime = useMemo(() => timeToSeconds(startStr) ?? 0, [startStr]);
  const endTime = useMemo(() => (endStr ? timeToSeconds(endStr) ?? duration : duration), [endStr, duration]);
  const estimated = useMemo(
    () => estimateFrameCount(duration, intervalMs, startTime, endTime),
    [duration, intervalMs, startTime, endTime]
  );
  const heavyLoad = useMemo(() => estimated > 1200, [estimated]);

  const formatDurationShort = (ms: number) => {
    if (ms < 1000) return `${Math.round(ms)}ms`;
    const s = ms / 1000;
    if (s < 60) return `${s.toFixed(1)}s`;
    const m = Math.floor(s / 60);
    return `${m}m ${Math.round(s % 60)}s`;
  };

  const etaMs = useMemo(() => {
    if (progress.done === 0 || progress.elapsedMs === 0) return 0;
    const perFrame = progress.elapsedMs / progress.done;
    return perFrame * (progress.total - progress.done);
  }, [progress.done, progress.elapsedMs, progress.total]);

  const handleExtract = async () => {
    if (!videoUrl || !file) return;
    const controller = new AbortController();
    abortRef.current = controller;
    setExtracting(true);
    setFrames([]);
    setSelected(new Set());
    setProgress({ done: 0, total: 0, elapsedMs: 0 });
    setError(null);
    setViewerIndex(null);
    try {
      const result = await extractFrames({
        src: videoUrl,
        intervalMs,
        format,
        quality: quality / 100,
        startTime,
        endTime,
        width: videoWidth,
        height: videoHeight,
        duration,
        signal: controller.signal,
        onProgress: (p) => setProgress({ done: p.done, total: p.total, elapsedMs: p.elapsedMs }),
      });
      setFrames(result.frames);
      setSelected(new Set(result.frames.map((f) => f.id)));
      if (result.aborted) {
        toast.info(
          result.frames.length > 0
            ? `Extraction cancelled. Kept ${result.frames.length} extracted frame${result.frames.length > 1 ? "s" : ""}.`
            : "Extraction cancelled."
        );
        return;
      }
      if (result.frames.length === 0) {
        setError("No frames matched the selected time range.");
      } else {
        toast.success(
          `Extracted ${result.frames.length} frame${result.frames.length > 1 ? "s" : ""} in ${formatDurationShort(
            progress.elapsedMs
          )}.`
        );
      }
    } catch (err) {
      toast.error("Failed to extract frames. Please try again.");
      console.error(err);
    } finally {
      setExtracting(false);
      abortRef.current = null;
    }
  };

  const handleCancel = () => {
    abortRef.current?.abort();
  };

  const handleCapture = () => {
    const video = videoRef.current;
    if (!video || !duration) return;
    const dataUrl = captureFrameAtTime(video, format, quality / 100);
    if (!dataUrl) {
      toast.error("Could not capture the current frame.");
      return;
    }
    const timestamp = video.currentTime;
    const frame: ExtractedFrame = {
      id: frames.length,
      timestamp,
      formattedTime: formatTime(timestamp),
      dataUrl,
      width: videoWidth,
      height: videoHeight,
    };
    setFrames((prev) => [...prev, frame]);
    setSelected((prev) => new Set(prev).add(frame.id));
    toast.success("Frame captured.");
  };

  const toggleFrame = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const openViewer = (frame: ExtractedFrame) => {
    const idx = frames.findIndex((f) => f.id === frame.id);
    setViewerIndex(idx >= 0 ? idx : 0);
  };

  const stepViewer = (dir: 1 | -1) => {
    setViewerIndex((prev) => {
      if (prev === null) return prev;
      const next = prev + dir;
      if (next < 0 || next >= frames.length) return prev;
      return next;
    });
  };

  const selectAll = () => setSelected(new Set(frames.map((f) => f.id)));
  const selectNone = () => setSelected(new Set());
  const selectedCount = selected.size;

  // Filename base: a user-supplied prefix wins over the video name.
  const baseName = prefix.trim() || file?.name || "video";

  // Frames filtered by the search box (matches timestamp / frame #).
  const visibleFrames = useMemo(() => {
    const q = frameFilter.trim().toLowerCase();
    if (!q) return frames;
    return frames.filter((f) => {
      const idStr = `#${String(f.id + 1).padStart(5, "0")}`;
      return (
        f.formattedTime.toLowerCase().includes(q) ||
        f.timestamp.toFixed(3).includes(q.replace(/:/g, ".")) ||
        idStr.toLowerCase().includes(q.replace("#", ""))
      );
    });
  }, [frames, frameFilter]);

  const selectedFramesSize = useMemo(() => estimateFramesSize(frames.filter((f) => selected.has(f.id))), [frames, selected]);

  const handleZip = async () => {
    const chosen = frames.filter((f) => selected.has(f.id));
    if (chosen.length === 0) {
      toast.error("Select at least one frame to download.");
      return;
    }
    setZipping(true);
    setZipProgress(0);
    try {
      await downloadFramesZip(chosen, baseName, setZipProgress);
      toast.success(`Downloaded ${chosen.length} frame${chosen.length > 1 ? "s" : ""} as ZIP.`);
    } catch {
      toast.error("Failed to create ZIP.");
    } finally {
      setZipping(false);
    }
  };

  const handleContactSheet = async () => {
    const chosen = frames.filter((f) => selected.has(f.id));
    if (chosen.length === 0) {
      toast.error("Select at least one frame to build a contact sheet.");
      return;
    }
    setSheetBusy(true);
    try {
      const sheet = await buildContactSheet(chosen, { columns: gridCols });
      if (!sheet) {
        toast.error("Could not build the contact sheet.");
        return;
      }
      const a = document.createElement("a");
      a.href = sheet.dataUrl;
      a.download = `${baseName.replace(/\\.[^.]+$/, "") || "contact-sheet"}-contact-sheet.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast.success(`Contact sheet saved (${chosen.length} frames, ${sheet.width}×${sheet.height}).`);
    } catch {
      toast.error("Failed to build the contact sheet.");
    } finally {
      setSheetBusy(false);
    }
  };

  const toggleVideoPlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play();
    else video.pause();
  };

  const openContextMenu = (e: React.MouseEvent, frame: ExtractedFrame) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, frame });
  };

  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify({ intervalMs, format, quality, prefix, gridCols }));
    } catch {
      // ignore storage failures (private mode etc.)
    }
  }, [intervalMs, format, quality, prefix, gridCols]);

  // Global keyboard shortcuts: Space = play/pause, C = capture current frame,
  // [ / ] select previous/next frame.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Ignore when typing into a text field / textarea / select.
      const el = e.target as HTMLElement | null;
      if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.tagName === "SELECT")) return;
      if (!videoRef.current || extracting) return;
      if (e.key === " ") {
        e.preventDefault();
        toggleVideoPlay();
      } else if (e.key.toLowerCase() === "c") {
        handleCapture();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [extracting, toggleVideoPlay, handleCapture]);

  useEffect(() => {
    const close = () => setContextMenu(null);
    window.addEventListener("click", close);
    window.addEventListener("scroll", close, true);
    return () => {
      window.removeEventListener("click", close);
      window.removeEventListener("scroll", close, true);
    };
  }, []);

  const progressPercent = progress.total > 0 ? Math.round((progress.done / progress.total) * 100) : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="mb-1 text-4xl font-bold">Video Screenshot Extractor</h1>
      <p className="mb-8 text-muted-foreground">
        Extract frames from your video with full control over interval, format, and time range.
      </p>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* LEFT PANEL */}
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-6">
            <Dropzone onFile={handleFile} />
            {file && (
              <div className="mt-3 flex items-center justify-between gap-2">
                <SelectedFileBadge file={file} />
                <button
                  type="button"
                  onClick={clearVideo}
                  disabled={extracting}
                  className="inline-flex shrink-0 items-center gap-1 rounded-md border border-border px-2 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-destructive disabled:opacity-50"
                  aria-label="Remove video"
                  title="Remove video"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Remove
                </button>
              </div>
            )}
          </div>

          {duration > 0 && (
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="mb-4 font-semibold">Video Info</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Duration</p>
                  <p className="font-medium">{formatTime(duration)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Resolution</p>
                  <p className="font-medium">
                    {videoWidth} × {videoHeight}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">File</p>
                  <p className="font-medium">
                    {file?.name ?? ""}
                    <span className="text-muted-foreground"> · {file ? formatBytes(file.size) : ""}</span>
                  </p>
                </div>
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-muted-foreground">Extraction Interval</span>
                    <span className="font-medium">
                      {intervalMs}ms · ~{estimated} frames
                    </span>
                  </div>
                  <input
                    type="range"
                    min={50}
                    max={2000}
                    step={50}
                    value={intervalMs}
                    onChange={(e) => setIntervalMs(Number(e.target.value))}
                    disabled={extracting}
                    className="w-full cursor-pointer accent-primary disabled:opacity-50"
                    aria-label="Extraction interval slider"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>50ms (20fps)</span>
                    <span>2000ms (0.5fps)</span>
                  </div>
                  {heavyLoad && (
                    <p className="mt-2 flex items-start gap-1.5 text-xs text-amber-500">
                      <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" />
                      {estimated.toLocaleString()} frames will use a lot of memory. Increase the interval or narrow the
                      time range.
                    </p>
                  )}
                </div>
                <div>
                  <p className="mb-1 text-muted-foreground">Output Format</p>
                  <div className="flex gap-1 rounded-lg border border-border p-1">
                    {FORMATS.map((f) => (
                      <button
                        key={f.value}
                        type="button"
                        onClick={() => setFormat(f.value)}
                        className={`flex-1 rounded-md px-2 py-1.5 text-xs font-medium transition-colors ${
                          format === f.value ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"
                        }`}
                        aria-pressed={format === f.value}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>
                {format !== "png" && (
                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-muted-foreground">Quality</span>
                      <span className="font-medium">{quality}%</span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={100}
                      step={5}
                      value={quality}
                      onChange={(e) => setQuality(Number(e.target.value))}
                      disabled={extracting}
                      className="w-full cursor-pointer accent-primary disabled:opacity-50"
                      aria-label="Quality slider"
                    />
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <p className="mb-1 text-muted-foreground">Start Time</p>
                    <input
                      value={startStr}
                      onChange={(e) => setStartStr(e.target.value)}
                      disabled={extracting}
                      className="w-full rounded-md border border-input bg-background px-2 py-1.5 font-mono text-xs outline-none focus:ring-2 focus:ring-ring"
                      aria-label="Start time"
                      placeholder="00:00:00.000"
                    />
                  </div>
                  <div>
                    <p className="mb-1 text-muted-foreground">End Time</p>
                    <input
                      value={endStr}
                      onChange={(e) => setEndStr(e.target.value)}
                      disabled={extracting}
                      className="w-full rounded-md border border-input bg-background px-2 py-1.5 font-mono text-xs outline-none focus:ring-2 focus:ring-ring"
                      aria-label="End time"
                      placeholder="HH:MM:SS.mmm"
                    />
                  </div>
                </div>
                <div className="pt-1">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-muted-foreground">File Name Prefix</span>
                    <span className="font-medium">{prefix.trim() ? `…_${prefix}${prefix ? "_" : ""}frame-00001.${format}` : "use video name"}</span>
                  </div>
                  <input
                    value={prefix}
                    onChange={(e) => setPrefix(e.target.value)}
                    placeholder="Optional custom prefix (e.g. project-a)"
                    aria-label="File name prefix"
                    className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-xs outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>
            </div>
          )}

          {duration > 0 && (
            <div className="space-y-2">
              <button
                type="button"
                onClick={handleExtract}
                disabled={extracting}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {extracting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                {extracting ? `Extracting ${progress.done}/${progress.total}...` : "Extract All Frames"}
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleCapture}
                  disabled={extracting}
                  className="flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium transition-colors hover:bg-secondary disabled:opacity-60"
                >
                  <Camera className="h-4 w-4" />
                  Capture Frame
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={!extracting}
                  className="flex items-center justify-center gap-2 rounded-lg border border-destructive/50 bg-card px-4 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-40"
                >
                  <Square className="h-4 w-4" />
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT PANEL */}
        <div className="space-y-6 lg:col-span-2">
          {videoUrl && (
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="mb-4 font-semibold">Video Preview</h3>
              <video
                ref={videoRef}
                src={videoUrl}
                controls
                preload="metadata"
                className="w-full rounded-lg bg-black"
                aria-label="Video preview player"
                onDoubleClick={handleCapture}
                title="Double-click to capture this frame"
              />
              <p className="mt-2 text-xs text-muted-foreground">
                Shortcuts: <kbd className="rounded border border-border px-1.5">Space</kbd> play/pause ·{" "}
                <kbd className="rounded border border-border px-1.5">C</kbd> capture frame · double-click video to capture
              </p>
            </div>
          )}

          {extracting && (
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-6">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="flex items-center gap-2 font-semibold">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Extraction Progress
                </h3>
                <span className="text-sm font-medium text-primary">{progressPercent}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Extracting at {intervalMs}ms intervals: {progress.done} of {progress.total} frames ·{" "}
                {formatDurationShort(progress.elapsedMs)} elapsed · ETA {formatDurationShort(etaMs)}
              </p>
            </div>
          )}

          {error && (
            <div className="flex items-start gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          {frames.length > 0 && (
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <h3 className="font-semibold">
                  Frames ({visibleFrames.length}
                  {frameFilter.trim() ? ` / ${frames.length}` : ""})
                </h3>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                    <input
                      value={frameFilter}
                      onChange={(e) => setFrameFilter(e.target.value)}
                      placeholder="Filter by time or #"
                      aria-label="Filter frames"
                      className="w-40 rounded-md border border-input bg-background py-1 pl-7 pr-2 text-xs outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <span className="text-muted-foreground">
                    {selectedCount} of {frames.length} selected
                    {selectedCount > 0 ? ` (~${formatBytes(selectedFramesSize)})` : ""}
                  </span>
                  <label className="flex items-center gap-1.5 text-muted-foreground">
                    Grid
                    <select
                      value={gridCols}
                      onChange={(e) => setGridCols(Number(e.target.value))}
                      aria-label="Grid columns"
                      className="rounded-md border border-border bg-card px-1.5 py-1 text-xs outline-none"
                    >
                      {[2, 3, 4, 5, 6, 8].map((n) => (
                        <option key={n} value={n}>
                          {n} cols
                        </option>
                      ))}
                    </select>
                  </label>
                  <button
                    type="button"
                    onClick={selectAll}
                    className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 transition-colors hover:bg-secondary"
                  >
                    <CheckSquare className="h-3.5 w-3.5" /> All
                  </button>
                  <button
                    type="button"
                    onClick={selectNone}
                    className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 transition-colors hover:bg-secondary"
                  >
                    <SquareIcon className="h-3.5 w-3.5" /> None
                  </button>
                  <button
                    type="button"
                    onClick={handleContactSheet}
                    disabled={sheetBusy || selectedCount === 0}
                    className="inline-flex items-center gap-1.5 rounded-md border border-primary/50 bg-primary/10 px-3 py-1 font-medium text-primary transition-colors hover:bg-primary/20 disabled:opacity-50"
                    title="Merge selected frames into one grid image"
                  >
                    {sheetBusy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <LayoutGrid className="h-3.5 w-3.5" />}
                    {sheetBusy ? "Building…" : "Contact Sheet"}
                  </button>
                  <button
                    type="button"
                    onClick={handleZip}
                    disabled={zipping || selectedCount === 0}
                    className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1 font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
                  >
                    {zipping ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <FolderArchive className="h-3.5 w-3.5" />}
                    {zipping ? `ZIP ${zipProgress}%` : `Download ZIP (${selectedCount})`}
                  </button>
                </div>
              </div>
              <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }}>
                {visibleFrames.map((frame) => (
                  <FrameCard
                    key={frame.id}
                    frame={frame}
                    selected={selected.has(frame.id)}
                    onToggle={() => toggleFrame(frame.id)}
                    onOpen={() => openViewer(frame)}
                    onDownload={() => {
                      downloadSingleFrame(frame, baseName);
                      toast.success("Frame downloaded.");
                    }}
                    onCopy={async () => {
                      try {
                        await copyFrameToClipboard(frame);
                        toast.success("Frame copied to clipboard.");
                      } catch {
                        toast.error("Could not copy image to clipboard.");
                      }
                    }}
                    onContextMenu={(e) => openContextMenu(e, frame)}
                  />
                ))}
              </div>
            </div>
          )}

          {!videoUrl && (
            <div className="flex flex-col items-center rounded-xl border-2 border-dashed border-border bg-card p-12 text-center">
              <Info className="mb-4 h-12 w-12 text-muted-foreground/50" />
              <p className="text-muted-foreground">Upload a video to get started</p>
            </div>
          )}
        </div>
      </div>

      {viewerIndex !== null && frames[viewerIndex] && (
        <Lightbox
          frames={frames}
          index={viewerIndex}
          onClose={() => setViewerIndex(null)}
          onPrev={() => stepViewer(-1)}
          onNext={() => stepViewer(1)}
          onDownload={(frame) => {
            downloadSingleFrame(frame, baseName);
            toast.success("Frame downloaded.");
          }}
          onCopy={async (frame) => {
            try {
              await copyFrameToClipboard(frame);
              toast.success("Frame copied to clipboard.");
            } catch {
              toast.error("Could not copy image to clipboard.");
            }
          }}
        />
      )}

      {contextMenu && (
        <div
          className="fixed z-50 min-w-56 overflow-hidden rounded-lg border border-border bg-card py-1 shadow-xl"
          style={{
            top: Math.min(contextMenu.y, window.innerHeight - 200),
            left: Math.min(contextMenu.x, window.innerWidth - 250),
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className="block w-full px-4 py-2 text-left text-sm transition-colors hover:bg-secondary"
            onClick={() => {
              window.open(contextMenu.frame.dataUrl, "_blank");
              setContextMenu(null);
            }}
          >
            Open in New Tab
          </button>
          <button
            type="button"
            className="block w-full px-4 py-2 text-left text-sm transition-colors hover:bg-secondary"
            onClick={() => {
              downloadSingleFrame(contextMenu.frame, baseName);
              setContextMenu(null);
            }}
          >
            Save Image As…
          </button>
          <button
            type="button"
            className="block w-full px-4 py-2 text-left text-sm transition-colors hover:bg-secondary"
            onClick={async () => {
              try {
                await copyFrameToClipboard(contextMenu.frame);
                toast.success("Frame copied to clipboard.");
              } catch {
                toast.error("Could not copy image to clipboard.");
              }
              setContextMenu(null);
            }}
          >
            Copy Image
          </button>
        </div>
      )}
    </div>
  );
}
