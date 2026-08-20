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
      "id, gallery_id, package_id, package_label, photo_count, price_cents, asset_ids, filenames, client_name, client_email, notes, status, created_at, updated_at, client_galleries (title, share_token)",
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
          error.message.includes("client_gallery_orders") ||
          error.message.includes("filenames")
            ? "Run migrations 017–019 in Supabase."
            : error.message,
      },
      { status: 400 },
    );
  }

  const orders = (data ?? []) as Array<{
    asset_ids: string[];
    filenames?: string[] | null;
    [key: string]: unknown;
  }>;

  const missingIds = [
    ...new Set(
      orders.flatMap((order) =>
        order.filenames?.length ? [] : order.asset_ids ?? [],
      ),
    ),
  ];

  let namesById = new Map<string, string>();
  if (missingIds.length) {
    const { data: assets } = await supabase
      .from("media_assets")
      .select("id, filename")
      .in("id", missingIds);
    namesById = new Map(
      ((assets ?? []) as { id: string; filename: string }[]).map((row) => [
        row.id,
        row.filename,
      ]),
    );
  }

  return NextResponse.json({
    orders: orders.map((order) => ({
      ...order,
      filenames:
        order.filenames?.length
          ? order.filenames
          : (order.asset_ids ?? []).map((id) => namesById.get(id) ?? id),
    })),
  });
}
