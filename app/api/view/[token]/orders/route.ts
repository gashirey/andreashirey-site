import { NextResponse } from "next/server";
import { isClientGalleryUnlocked } from "@/lib/client-gallery/auth";
import { validateClientGalleryOrder } from "@/lib/client-gallery/validate-order";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServiceClient } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{ token: string }>;
};

async function loadPublishedGallery(token: string) {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("client_galleries")
    .select("id, share_token, is_published, expires_at, password_hash, shoot_id")
    .eq("share_token", token.trim())
    .maybeSingle();

  if (error || !data || !data.is_published) return null;
  if (data.expires_at && new Date(data.expires_at).getTime() <= Date.now()) {
    return null;
  }

  if (data.password_hash) {
    const unlocked = await isClientGalleryUnlocked(data.share_token);
    if (!unlocked) return null;
  }

  return data as {
    id: string;
    share_token: string;
    shoot_id: string;
  };
}

export async function POST(request: Request, context: RouteContext) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Ordering is temporarily unavailable." },
      { status: 503 },
    );
  }

  const { token } = await context.params;
  const gallery = await loadPublishedGallery(token);
  if (!gallery) {
    return NextResponse.json({ error: "Gallery unavailable." }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { data: assets, error: assetsError } = await supabase
    .from("media_assets")
    .select("id")
    .eq("shoot_id", gallery.shoot_id);

  if (assetsError) {
    return NextResponse.json({ error: assetsError.message }, { status: 400 });
  }

  const galleryAssetIds = (assets ?? []).map((row) => row.id as string);
  const validated = validateClientGalleryOrder(body, galleryAssetIds);
  if (!validated.ok) {
    return NextResponse.json({ error: validated.error }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("client_gallery_orders")
    .insert({
      gallery_id: gallery.id,
      package_id: validated.data.packageId,
      package_label: validated.data.packageLabel,
      photo_count: validated.data.assetIds.length,
      price_cents: validated.data.priceCents,
      asset_ids: validated.data.assetIds,
      client_name: validated.data.clientName,
      client_email: validated.data.clientEmail,
      notes: validated.data.notes ?? null,
      status: "submitted",
    })
    .select(
      "id, gallery_id, package_id, package_label, photo_count, price_cents, asset_ids, client_name, client_email, notes, status, created_at, updated_at",
    )
    .single();

  if (error) {
    return NextResponse.json(
      {
        error: error.message.includes("client_gallery_orders")
          ? "Orders are not set up yet. Run migration 017 in Supabase."
          : error.message,
      },
      { status: 400 },
    );
  }

  return NextResponse.json({ order: data });
}
