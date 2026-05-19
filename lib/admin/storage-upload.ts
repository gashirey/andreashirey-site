import { createServiceClient } from "@/lib/supabase/server";
import { processImageForWeb } from "./image-process";

const BUCKET = "product-photos";

export function storagePathForUpload(
  prefix: string,
  fileName: string,
  ext: string,
): string {
  const safeExt = ext === "gif" ? "gif" : "jpg";
  const base = fileName.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9_-]+/g, "-");
  return `${prefix}/${Date.now()}-${base.slice(0, 40)}-${crypto.randomUUID().slice(0, 8)}.${safeExt}`;
}

export type UploadImageResult =
  | {
      path: string;
      imageUrl: string;
      width: number;
      height: number;
      bytesIn: number;
      bytesOut: number;
    }
  | { error: string };

export async function uploadImageToStorage(
  file: File,
  prefix: string,
): Promise<UploadImageResult> {
  try {
    const raw = Buffer.from(await file.arrayBuffer());
    const processed = await processImageForWeb(raw, {
      mimeType: file.type,
      fileName: file.name,
    });

    const path = storagePathForUpload(prefix, file.name, processed.ext);
    const supabase = createServiceClient();

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(path, processed.buffer, {
        contentType: processed.contentType,
        upsert: false,
      });

    if (error) {
      console.error("[uploadImageToStorage]", error);
      return { error: error.message };
    }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return {
      path,
      imageUrl: data.publicUrl,
      width: processed.width,
      height: processed.height,
      bytesIn: processed.bytesIn,
      bytesOut: processed.bytesOut,
    };
  } catch (err) {
    console.error("[uploadImageToStorage] process", err);
    const message = err instanceof Error ? err.message : "Image processing failed.";
    return { error: message };
  }
}
