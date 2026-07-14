import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/require";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const { searchParams } = new URL(request.url);
  const shootId = searchParams.get("shoot_id");
  const inGallery = searchParams.get("in_gallery");

  const supabase = createServiceClient();
  let query = supabase
    .from("media_assets")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);

  if (shootId) {
    query = query.eq("shoot_id", shootId);
  }

  if (inGallery === "1") {
    query = query.eq("in_gallery", true);
  } else if (inGallery === "0") {
    query = query.eq("in_gallery", false);
  }

  const { data, error } = await query;

  if (error) {
    const hint =
      error.message?.includes("in_gallery") || error.code === "PGRST204"
        ? " Run migration 015_media_in_gallery.sql in Supabase."
        : "";
    return NextResponse.json(
      { error: `${error.message}${hint}` },
      { status: 400 },
    );
  }

  return NextResponse.json({ assets: data ?? [] });
}
