import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/require";
import { createServiceClient } from "@/lib/supabase/server";

export type SocialImageItem = {
  id: string;
  kind: "media" | "product";
  imageUrl: string;
  label: string;
  createdAt: string;
};

export async function GET(request: Request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const { searchParams } = new URL(request.url);
  const shootId = searchParams.get("shoot_id");
  const source = searchParams.get("source") ?? "all";

  const supabase = createServiceClient();
  const items: SocialImageItem[] = [];

  if (source === "all" || source === "library") {
    let query = supabase
      .from("media_assets")
      .select("id, public_url, filename, alt_text, created_at")
      .order("created_at", { ascending: false })
      .limit(200);

    if (shootId) {
      query = query.eq("shoot_id", shootId);
    }

    const { data, error } = await query;
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    for (const row of data ?? []) {
      items.push({
        id: row.id,
        kind: "media",
        imageUrl: row.public_url,
        label: row.alt_text?.trim() || row.filename,
        createdAt: row.created_at,
      });
    }
  }

  if (source === "all" || source === "products") {
    const { data: photos, error } = await supabase
      .from("farm_product_photos")
      .select("id, image_url, alt_text, product_id, created_at")
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const productIds = [
      ...new Set((photos ?? []).map((p) => p.product_id).filter(Boolean)),
    ];
    const nameById = new Map<string, string>();

    if (productIds.length) {
      const { data: products } = await supabase
        .from("farm_products")
        .select("id, name")
        .in("id", productIds);

      for (const p of products ?? []) {
        nameById.set(p.id, p.name);
      }
    }

    for (const row of photos ?? []) {
      if (!row.image_url) continue;
      items.push({
        id: row.id,
        kind: "product",
        imageUrl: row.image_url,
        label:
          row.alt_text?.trim() ||
          nameById.get(row.product_id) ||
          "Product photo",
        createdAt: row.created_at ?? new Date().toISOString(),
      });
    }
  }

  items.sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return NextResponse.json({ images: items });
}
