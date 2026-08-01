"use client";

import { useRef, useState } from "react";
import { FileVideo, UploadCloud } from "lucide-react";
import { toast } from "sonner";

interface DropzoneProps {
  onFile: (file: File) => void;
  accept?: string;
}

export function Dropzone({ onFile, accept = "video/*" }: DropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFiles = (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    onFile(file);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          inputRef.current?.click();
        }
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragOver(false);
        handleFiles(e.dataTransfer.files);
      }}
      className={`cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
        dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/60"
      }`}
      aria-label="Upload video file"
    >
      <UploadCloud className="mx-auto mb-3 h-12 w-12 text-muted-foreground" />
      <p className="font-semibold">Upload Video</p>
      <p className="mt-1 text-sm text-muted-foreground">Drag and drop or click to select</p>
      <p className="mt-2 text-xs text-muted-foreground">MP4, WebM, MOV, AVI, MKV, etc.</p>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = "";
        }}
        aria-label="Select video file"
      />
    </div>
  );
}

export function SelectedFileBadge({ file }: { file: File }) {
  return (
    <div className="mt-3 flex items-center gap-2 rounded-lg border border-success/30 bg-success/10 px-3 py-2 text-sm font-medium text-success">
      <FileVideo className="h-4 w-4" />
      <span className="min-w-0 truncate">{file.name}</span>
      <span className="ml-auto shrink-0 text-xs text-muted-foreground">
        {(file.size / (1024 * 1024)).toFixed(2)} MB
      </span>
    </div>
  );
}

export function validationMessage(file: File): string | null {
  if (!file.type.startsWith("video/")) {
    toast.error("Invalid file type. Please select a valid video file (MP4, WebM, MOV, etc.).");
    return "Invalid file type";
  }
  return null;
}
