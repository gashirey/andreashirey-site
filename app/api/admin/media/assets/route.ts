import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/require";
import { PORTFOLIO_GALLERY_STORAGE_PREFIX } from "@/lib/gallery/queries";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const { searchParams } = new URL(request.url);
  const shootId = searchParams.get("shoot_id");
  const portfolioOnly = searchParams.get("portfolio") === "1";

  const supabase = createServiceClient();
  let query = supabase
    .from("media_assets")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);

  if (shootId) {
    query = query.eq("shoot_id", shootId);
  }

  if (portfolioOnly) {
    query = query.like(
      "storage_path",
      `${PORTFOLIO_GALLERY_STORAGE_PREFIX}/%`,
    );
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ assets: data ?? [] });
}
