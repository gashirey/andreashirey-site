import {
  CLIENT_UPLOAD_MAX_MB,
  WEB_IMAGE_JPEG_QUALITY,
  WEB_IMAGE_MAX_EDGE,
} from "./image-constants";

export type CompressImageResult = {
  file: File;
  compressed: boolean;
  originalBytes: number;
  outputBytes: number;
};

function outputName(originalName: string): string {
  const base = originalName.replace(/\.[^.]+$/, "").trim() || "image";
  return `${base}.jpg`;
}

/**
 * Shrink large files in the browser before POST (Vercel ~4.5MB body limit).
 * Server still runs sharp as a second pass.
 */
export async function compressImageBeforeUpload(
  file: File,
): Promise<CompressImageResult> {
  const originalBytes = file.size;

  if (file.type === "image/gif") {
    return { file, compressed: false, originalBytes, outputBytes: file.size };
  }

  // Small enough for serverless upload without re-encoding
  if (file.size <= CLIENT_UPLOAD_MAX_MB * 1024 * 1024) {
    return { file, compressed: false, originalBytes, outputBytes: file.size };
  }

  const imageCompression = (await import("browser-image-compression"))
    .default;

  const blob = await imageCompression(file, {
    maxSizeMB: CLIENT_UPLOAD_MAX_MB,
    maxWidthOrHeight: WEB_IMAGE_MAX_EDGE,
    useWebWorker: true,
    fileType: "image/jpeg",
    initialQuality: WEB_IMAGE_JPEG_QUALITY / 100,
  });

  const out = new File([blob], outputName(file.name), {
    type: "image/jpeg",
    lastModified: Date.now(),
  });

  return {
    file: out,
    compressed: true,
    originalBytes,
    outputBytes: out.size,
  };
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
