import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/require";
import { createServiceClient } from "@/lib/supabase/server";

const BUCKET = "product-photos";

export async function POST(request: Request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
  }

  const productId = formData.get("product_id");
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const safeExt = ["jpg", "jpeg", "png", "webp", "gif"].includes(ext)
    ? ext
    : "jpg";
  const path = `${productId ?? "misc"}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${safeExt}`;

  const supabase = createServiceClient();
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabase.storage.from(BUCKET).upload(path, buffer, {
    contentType: file.type || `image/${safeExt}`,
    upsert: false,
  });

  if (error) {
    console.error("[photo upload]", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const { data: publicUrl } = supabase.storage.from(BUCKET).getPublicUrl(path);

  return NextResponse.json({
    path,
    imageUrl: publicUrl.publicUrl,
  });
}
