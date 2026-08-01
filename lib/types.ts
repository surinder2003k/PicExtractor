export type FrameFormat = "png" | "jpeg" | "webp";

export interface ExtractedFrame {
  id: number;
  timestamp: number;
  formattedTime: string;
  dataUrl: string;
  width: number;
  height: number;
}

export interface VideoInfo {
  duration: number;
  width: number;
  height: number;
}

export interface ExtractSettings {
  intervalMs: number;
  format: FrameFormat;
  quality: number;
  startTime: number;
  endTime: number;
}

export interface ProgressState {
  done: number;
  total: number;
  elapsedMs: number;
}
