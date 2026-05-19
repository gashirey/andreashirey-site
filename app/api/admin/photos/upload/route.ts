import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/require";
import { uploadImageToStorage } from "@/lib/admin/storage-upload";

export async function POST(request: Request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
  }

  const productId = formData.get("product_id");
  const prefix = `${productId ?? "misc"}`;
  const uploaded = await uploadImageToStorage(file, prefix);

  if ("error" in uploaded) {
    return NextResponse.json({ error: uploaded.error }, { status: 400 });
  }

  return NextResponse.json({
    path: uploaded.path,
    imageUrl: uploaded.imageUrl,
    width: uploaded.width,
    height: uploaded.height,
    optimized: {
      bytesIn: uploaded.bytesIn,
      bytesOut: uploaded.bytesOut,
    },
  });
}
