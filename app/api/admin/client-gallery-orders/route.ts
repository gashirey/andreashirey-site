import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/require";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ orders: [] });
  }

  const { searchParams } = new URL(request.url);
  const galleryId = searchParams.get("gallery_id")?.trim();
  const status = searchParams.get("status")?.trim();

  const supabase = createServiceClient();
  let query = supabase
    .from("client_gallery_orders")
    .select(
      "id, gallery_id, package_id, package_label, photo_count, price_cents, asset_ids, client_name, client_email, notes, status, created_at, updated_at, client_galleries (title, share_token)",
    )
    .order("created_at", { ascending: false })
    .limit(100);

  if (galleryId) query = query.eq("gallery_id", galleryId);
  if (status) query = query.eq("status", status);

  const { data, error } = await query;
  if (error) {
    return NextResponse.json(
      {
        error:
          error.message.includes("client_gallery_orders")
            ? "Run migration 017_client_gallery_orders.sql in Supabase."
            : error.message,
      },
      { status: 400 },
    );
  }

  return NextResponse.json({ orders: data ?? [] });
}
