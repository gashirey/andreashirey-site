import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/require";
import { createServiceClient } from "@/lib/supabase/server";
import { getSiteMediaSlotsRaw } from "@/lib/site-media/queries";
import {
  SITE_MEDIA_SLOTS,
  type SiteMediaSlotKey,
} from "@/lib/site-media/slots";

export async function GET(request: Request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const slots = await getSiteMediaSlotsRaw();
  return NextResponse.json({ slots });
}

export async function PATCH(request: Request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const body = (await request.json()) as {
    slot_key?: string;
    image_url?: string;
    alt_text?: string | null;
  };

  const slotKey = body.slot_key as SiteMediaSlotKey | undefined;
  if (!slotKey || !SITE_MEDIA_SLOTS.includes(slotKey)) {
    return NextResponse.json({ error: "Invalid slot_key." }, { status: 400 });
  }

  if (!body.image_url?.trim()) {
    return NextResponse.json({ error: "image_url is required." }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("site_media_slots")
    .upsert({
      slot_key: slotKey,
      image_url: body.image_url.trim(),
      alt_text: body.alt_text?.trim() || null,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error("[site-media PATCH]", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  revalidatePath("/");
  revalidatePath("/about");

  return NextResponse.json({ slot: data });
}
