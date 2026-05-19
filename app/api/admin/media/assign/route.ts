import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/require";
import { createServiceClient } from "@/lib/supabase/server";
import {
  SITE_MEDIA_SLOTS,
  type SiteMediaSlotKey,
} from "@/lib/site-media/slots";

export async function POST(request: Request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const body = (await request.json()) as {
    asset_id?: string;
    target?: "site_slot" | "product";
    slot_key?: string;
    product_id?: string;
    is_primary?: boolean;
  };

  if (!body.asset_id) {
    return NextResponse.json({ error: "asset_id is required." }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { data: asset, error: assetError } = await supabase
    .from("media_assets")
    .select("*")
    .eq("id", body.asset_id)
    .maybeSingle();

  if (assetError || !asset) {
    return NextResponse.json({ error: "Asset not found." }, { status: 404 });
  }

  if (body.target === "site_slot") {
    const slotKey = body.slot_key as SiteMediaSlotKey | undefined;
    if (!slotKey || !SITE_MEDIA_SLOTS.includes(slotKey)) {
      return NextResponse.json({ error: "Invalid slot_key." }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("site_media_slots")
      .upsert({
        slot_key: slotKey,
        image_url: asset.public_url,
        alt_text: asset.alt_text ?? asset.filename,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      message: `Set as ${slotKey}.`,
      slot: data,
    });
  }

  if (body.target === "product") {
    if (!body.product_id) {
      return NextResponse.json({ error: "product_id is required." }, { status: 400 });
    }

    const { data: product } = await supabase
      .from("farm_products")
      .select("id, name")
      .eq("id", body.product_id)
      .maybeSingle();

    if (!product) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    const isPrimary = body.is_primary ?? false;

    if (isPrimary) {
      await supabase
        .from("farm_product_photos")
        .update({ is_primary: false })
        .eq("product_id", body.product_id)
        .is("availability_id", null);
    }

    const { count } = await supabase
      .from("farm_product_photos")
      .select("id", { count: "exact", head: true })
      .eq("product_id", body.product_id)
      .is("availability_id", null);

    const { data: photo, error } = await supabase
      .from("farm_product_photos")
      .insert({
        product_id: body.product_id,
        image_url: asset.public_url,
        alt_text: asset.alt_text ?? product.name,
        is_primary: isPrimary || !count,
        display_order: 10,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      message: `Added to ${product.name}.`,
      photo,
    });
  }

  return NextResponse.json({ error: "Invalid target." }, { status: 400 });
}
