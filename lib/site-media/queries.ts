import { createServiceClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { clampFocal } from "@/lib/site-cms/focal";
import { site } from "@/lib/content";
import {
  SITE_MEDIA_SLOTS,
  type SiteMediaSlot,
  type SiteMediaSlotKey,
  type SiteMediaView,
} from "./slots";

/** Local-only placeholders when Supabase is not configured. */
const LOCAL_FALLBACKS: Record<
  SiteMediaSlotKey,
  { image_url: string; alt_text: string }
> = {
  hero: {
    image_url: site.heroImage,
    alt_text: site.heroImageAlt,
  },
  home_feature: {
    image_url: "",
    alt_text: "",
  },
  about: {
    image_url: "",
    alt_text: "",
  },
};

function emptySlot(key: SiteMediaSlotKey): SiteMediaView {
  return {
    imageUrl: "",
    alt: "",
    focalX: 50,
    focalY: 50,
  };
}

export async function getSiteMediaSlots(): Promise<
  Record<SiteMediaSlotKey, SiteMediaView>
> {
  const out = {} as Record<SiteMediaSlotKey, SiteMediaView>;

  if (!isSupabaseConfigured()) {
    for (const key of SITE_MEDIA_SLOTS) {
      out[key] = {
        imageUrl: LOCAL_FALLBACKS[key].image_url,
        alt: LOCAL_FALLBACKS[key].alt_text,
        focalX: 50,
        focalY: 50,
      };
    }
    return out;
  }

  for (const key of SITE_MEDIA_SLOTS) {
    out[key] = emptySlot(key);
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("site_media_slots")
    .select("slot_key, image_url, alt_text, focal_x, focal_y");

  if (error) {
    console.error("[getSiteMediaSlots]", error);
    return out;
  }

  for (const row of (data ?? []) as SiteMediaSlot[]) {
    const key = row.slot_key as SiteMediaSlotKey;
    if (!SITE_MEDIA_SLOTS.includes(key)) continue;
    const url = row.image_url?.trim() ?? "";
    if (!url) continue;
    out[key] = {
      imageUrl: url,
      alt: row.alt_text?.trim() || site.brand,
      focalX: clampFocal(row.focal_x),
      focalY: clampFocal(row.focal_y),
    };
  }

  return out;
}

export async function getSiteMediaSlotsRaw(): Promise<SiteMediaSlot[]> {
  if (!isSupabaseConfigured()) {
    return SITE_MEDIA_SLOTS.map((slot_key) => ({
      slot_key,
      image_url: LOCAL_FALLBACKS[slot_key].image_url,
      alt_text: LOCAL_FALLBACKS[slot_key].alt_text,
      focal_x: 50,
      focal_y: 50,
      updated_at: new Date().toISOString(),
    }));
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("site_media_slots")
    .select("*")
    .in("slot_key", [...SITE_MEDIA_SLOTS]);

  if (error) {
    console.error("[getSiteMediaSlotsRaw]", error);
    return SITE_MEDIA_SLOTS.map((slot_key) => ({
      slot_key,
      image_url: "",
      alt_text: null,
      focal_x: 50,
      focal_y: 50,
      updated_at: new Date().toISOString(),
    }));
  }

  const byKey = new Map(
    ((data ?? []) as SiteMediaSlot[]).map((r) => [r.slot_key, r]),
  );

  return SITE_MEDIA_SLOTS.map((slot_key) => {
    const row = byKey.get(slot_key);
    if (!row) {
      return {
        slot_key,
        image_url: "",
        alt_text: null,
        focal_x: 50,
        focal_y: 50,
        updated_at: new Date().toISOString(),
      };
    }
    return row;
  });
}
