// components/common/FileUploadPanel.tsx
import { useState, useRef, useCallback, useEffect } from "react";
import { X, Upload, FileText, AlertCircle, CheckCircle } from "lucide-react";

const MAX_FILE_SIZE_MB = 5;
const MAX_FILES = 3;
const ALLOWED_TYPES = [".txt", "text/plain", ".pdf", "application/pdf"];
const EXTRACTION_API_URL = import.meta.env.VITE_EXTRACTION_API_URL;

const EXTRACTION_ENDPOINTS: Record<string, string> = {
  jd: "/hiring/extract-jd",
  cv: "/hiring/extract-cv",
};

const EXTRACTION_FIELD_NAMES: Record<string, string> = {
  jd: "file",
  cv: "pdf_file",
};

// ── Progress simulation steps ─────────────────────────────────────────────────
const PROGRESS_STEPS = [
  { pct: 10, status: "Analyzing document...", sub: "Reading file structure" },
  { pct: 30, status: "Extracting content...", sub: "Identifying key sections" },
  {
    pct: 55,
    status: "Processing skills...",
    sub: "Mapping technical requirements",
  },
  {
    pct: 75,
    status: "Extracting metadata...",
    sub: "Job title, location, experience",
  },
  { pct: 90, status: "Finalizing...", sub: "Building structured output" },
];

interface FileUploadPanelProps {
  uploadExpect: string;
  onClose: () => void;
  onExtracted: (data: unknown, fileName: string) => void;
}

export function FileUploadPanel({
  uploadExpect,
  onClose,
  onExtracted,
}: FileUploadPanelProps) {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [extracting, setExtracting] = useState(false);

  // ── Progress state ──────────────────────────────────────────────────────────
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("");
  const [subText, setSubText] = useState("");
  const [done, setDone] = useState(false);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  // cleanup on unmount
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current)
        clearInterval(progressIntervalRef.current);
    };
  }, []);

  const startProgressSimulation = () => {
    let stepIndex = 0;
    setProgress(0);
    setDone(false);
    setStatusText(PROGRESS_STEPS[0].status);
    setSubText(PROGRESS_STEPS[0].sub);

    progressIntervalRef.current = setInterval(() => {
      if (stepIndex >= PROGRESS_STEPS.length) {
        if (progressIntervalRef.current)
          clearInterval(progressIntervalRef.current);
        return;
      }
      const step = PROGRESS_STEPS[stepIndex];
      setProgress(step.pct);
      setStatusText(step.status);
      setSubText(step.sub);
      stepIndex++;
    }, 800);
  };

  const stopProgressSimulation = (success: boolean) => {
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    if (success) {
      setProgress(100);
      setStatusText("Extraction complete!");
      setSubText("Forwarding to chat...");
      setDone(true);
    }
  };

  const validateFile = (file: File): string | null => {
    if (
      !ALLOWED_TYPES.includes(file.type) &&
      !file.name.endsWith(".txt") &&
      !file.name.endsWith(".pdf")
    ) {
      return "Only .txt and .pdf files are allowed.";
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      return `File size must be under ${MAX_FILE_SIZE_MB}MB.`;
    }
    return null;
  };

  const handleFile = useCallback((files: File[]) => {
    const validFiles: File[] = [];
    let errorMsg: string | null = null;

    for (const file of files) {
      const err = validateFile(file);
      if (err) {
        errorMsg = err;
        continue;
      }
      validFiles.push(file);
    }

    setSelectedFiles((prev) => {
      const merged = [...prev, ...validFiles];
      if (merged.length > MAX_FILES) {
        setError(`Max ${MAX_FILES} files allowed.`);
        return prev;
      }
      return merged;
    });

    if (errorMsg) setError(errorMsg);
    else setError(null);
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length) handleFile(files);
  };

  const handleBrowse = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length) handleFile(files);
  };

  const handleAttach = async () => {
    if (selectedFiles.length === 0) return;

    const endpoint = EXTRACTION_ENDPOINTS[uploadExpect];
    const fieldName = EXTRACTION_FIELD_NAMES[uploadExpect];

    if (!endpoint || !fieldName) {
      setError(`No extraction config for type: ${uploadExpect}`);
      return;
    }

    setExtracting(true);
    setError(null);
    startProgressSimulation(); // ← start animation

    try {
      const formData = new FormData();

      if (selectedFiles.length === 1) {
        formData.append(fieldName, selectedFiles[0]);
      } else {
        selectedFiles.forEach((file) => {
          formData.append(`${fieldName}[]`, file);
        });
      }

      const response = await fetch(`${EXTRACTION_API_URL}${endpoint}`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok)
        throw new Error(`Extraction failed: ${response.status}`);

      const result = await response.json();
      if (!result.success)
        throw new Error("Extraction returned unsuccessful response.");

      stopProgressSimulation(true); // ← complete animation

      const fileNames = selectedFiles.map((f) => f.name).join(", ");

      // small delay to show 100% before closing
      setTimeout(() => {
        onExtracted(result.data, fileNames);
        onClose();
      }, 800);
    } catch (err) {
      stopProgressSimulation(false);
      setExtracting(false);
      setProgress(0);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to extract file. Please try again.",
      );
    }
  };

  const formatSize = (bytes: number) =>
    bytes < 1024
      ? `${bytes} B`
      : bytes < 1024 * 1024
        ? `${(bytes / 1024).toFixed(1)} KB`
        : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

  return (
    <div
      className="absolute bottom-full mb-2 left-0 right-0 z-50
                    rounded-2xl border border-white/10 bg-gradient-to-b
                    from-[hsl(220_40%_4%)] to-[hsl(220_45%_3%)]
                    shadow-[0_10px_30px_rgba(0,0,0,0.4)] p-4 animate-slide-up"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-widest text-white/40">
          Attach {uploadExpect === "jd" ? "Job Description" : "Resume"}
        </span>
        <button
          onClick={onClose}
          disabled={extracting}
          className="text-muted-foreground hover:text-foreground transition disabled:opacity-40"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !extracting && fileInputRef.current?.click()}
        className={`flex flex-col items-center justify-center gap-2
                    border-2 border-dashed rounded-xl p-6 transition-all duration-200
                    ${
                      extracting
                        ? "border-white/5 cursor-not-allowed opacity-40"
                        : dragOver
                          ? "border-primary/60 bg-primary/10 cursor-pointer"
                          : "border-cyan-500/40 hover:border-cyan-500/70 hover:bg-cyan-500/5 cursor-pointer"
                    }`}
      >
        <Upload
          className={`w-7 h-7 ${dragOver ? "text-primary" : "text-white/20"}`}
        />
        <p className="text-sm text-white/50">
          Drag & drop or{" "}
          <span className="text-primary font-medium">browse</span>
        </p>
        <p className="text-[10px] text-white/25">
          .txt and .pdf only · Max {MAX_FILE_SIZE_MB}MB
          {uploadExpect === "cv" && ` · Up to ${MAX_FILES} files`}
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,.pdf,text/plain,application/pdf"
          multiple={uploadExpect === "cv"}
          className="hidden"
          onChange={handleBrowse}
          disabled={extracting}
        />
      </div>

      {/* Error */}
      {error && (
        <div
          className="flex items-center gap-2 mt-3 px-3 py-2 rounded-lg
                        bg-destructive/10 border border-destructive/30"
        >
          <AlertCircle className="w-3.5 h-3.5 text-destructive shrink-0" />
          <p className="text-xs text-destructive">{error}</p>
        </div>
      )}

      {/* Selected files list */}
      {selectedFiles.length > 0 && (
        <div className="flex flex-col gap-2 mt-3">
          {selectedFiles.map((file, i) => (
            <div
              key={i}
              className="flex items-center justify-between px-3 py-2.5
                                    rounded-lg bg-primary/10 border border-primary/20"
            >
              <div className="flex items-center gap-2 min-w-0">
                <FileText className="w-4 h-4 text-primary shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">
                    {file.name}
                  </p>
                  <p className="text-[10px] text-white/30">
                    {formatSize(file.size)}
                  </p>
                </div>
              </div>
              {!extracting && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFiles((prev) =>
                      prev.filter((_, idx) => idx !== i),
                    );
                  }}
                  className="text-white/30 hover:text-white/60 transition ml-2"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── Progress bar — shown during extraction ── */}
      {extracting && (
        <div className="mt-3 px-3 py-3 rounded-xl bg-white/[0.03] border border-white/10">
          {/* Status row */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {done ? (
                <CheckCircle className="w-4 h-4 text-primary shrink-0" />
              ) : (
                <svg
                  className="w-4 h-4 text-primary shrink-0 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="3"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
              )}
              <span className="text-xs font-medium text-foreground">
                {statusText}
              </span>
            </div>
            <span className="text-xs font-semibold text-primary">
              {progress}%
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Sub text */}
          <p className="text-[10px] text-white/30 mt-1.5">{subText}</p>
        </div>
      )}

      {/* Attach button — hidden during extraction */}
      {selectedFiles.length > 0 && !extracting && (
        <button
          onClick={handleAttach}
          className="w-full mt-3 py-2 rounded-xl bg-primary text-white
                     text-sm font-semibold transition-all hover:bg-primary/80
                     flex items-center justify-center gap-2"
        >
          Attach File
        </button>
      )}
    </div>
  );
}
