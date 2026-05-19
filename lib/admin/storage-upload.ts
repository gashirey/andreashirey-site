import { createServiceClient } from "@/lib/supabase/server";

const BUCKET = "product-photos";
const IMAGE_EXT = new Set(["jpg", "jpeg", "png", "webp", "gif"]);

export function storagePathForUpload(
  prefix: string,
  fileName: string,
): { path: string; safeExt: string } {
  const ext = fileName.split(".").pop()?.toLowerCase() || "jpg";
  const safeExt = IMAGE_EXT.has(ext) ? ext : "jpg";
  const base = fileName.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9_-]+/g, "-");
  const path = `${prefix}/${Date.now()}-${base.slice(0, 40)}-${crypto.randomUUID().slice(0, 8)}.${safeExt}`;
  return { path, safeExt };
}

export async function uploadImageToStorage(
  file: File,
  prefix: string,
): Promise<{ path: string; imageUrl: string } | { error: string }> {
  const { path, safeExt } = storagePathForUpload(prefix, file.name);
  const supabase = createServiceClient();
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabase.storage.from(BUCKET).upload(path, buffer, {
    contentType: file.type || `image/${safeExt}`,
    upsert: false,
  });

  if (error) {
    console.error("[uploadImageToStorage]", error);
    return { error: error.message };
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { path, imageUrl: data.publicUrl };
}
