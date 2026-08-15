import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/require";
import type { ClientGalleryOrderStatus } from "@/lib/client-gallery/order-types";
import { createServiceClient } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{ id: string }>;
};

const STATUSES: ClientGalleryOrderStatus[] = [
  "submitted",
  "confirmed",
  "fulfilled",
  "cancelled",
];

export async function PATCH(request: Request, context: RouteContext) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const { id } = await context.params;
  const body = (await request.json()) as { status?: string };
  const status = body.status?.trim() as ClientGalleryOrderStatus | undefined;

  if (!status || !STATUSES.includes(status)) {
    return NextResponse.json(
      { error: "status must be submitted, confirmed, fulfilled, or cancelled." },
      { status: 400 },
    );
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("client_gallery_orders")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select(
      "id, gallery_id, package_id, package_label, photo_count, price_cents, asset_ids, client_name, client_email, notes, status, created_at, updated_at",
    )
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  if (!data) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  return NextResponse.json({ order: data });
}
