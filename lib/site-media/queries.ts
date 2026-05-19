import { createServiceClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { site } from "@/lib/content";
import {
  SITE_MEDIA_SLOTS,
  type SiteMediaSlot,
  type SiteMediaSlotKey,
} from "./slots";

const FALLBACKS: Record<
  SiteMediaSlotKey,
  { image_url: string; alt_text: string }
> = {
  hero: {
    image_url: site.heroImage,
    alt_text: site.heroImageAlt,
  },
  home_feature: {
    image_url: "/images/bb.jpg",
    alt_text: "Seasonal cut flowers from Grey Gables Farm",
  },
  about: {
    image_url: "/images/garden_row.jpg",
    alt_text: "Cutting garden at Grey Gables Farm",
  },
};

export async function getSiteMediaSlots(): Promise<
  Record<SiteMediaSlotKey, { imageUrl: string; alt: string }>
> {
  const out = {} as Record<SiteMediaSlotKey, { imageUrl: string; alt: string }>;

  for (const key of SITE_MEDIA_SLOTS) {
    out[key] = {
      imageUrl: FALLBACKS[key].image_url,
      alt: FALLBACKS[key].alt_text,
    };
  }

  if (!isSupabaseConfigured()) return out;

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("site_media_slots")
    .select("slot_key, image_url, alt_text");

  if (error) {
    console.error("[getSiteMediaSlots]", error);
    return out;
  }

  for (const row of (data ?? []) as SiteMediaSlot[]) {
    const key = row.slot_key as SiteMediaSlotKey;
    if (!SITE_MEDIA_SLOTS.includes(key)) continue;
    if (!row.image_url) continue;
    out[key] = {
      imageUrl: row.image_url,
      alt: row.alt_text ?? FALLBACKS[key].alt_text,
    };
  }

  return out;
}

export async function getSiteMediaSlotsRaw(): Promise<SiteMediaSlot[]> {
  if (!isSupabaseConfigured()) {
    return SITE_MEDIA_SLOTS.map((slot_key) => ({
      slot_key,
      image_url: FALLBACKS[slot_key].image_url,
      alt_text: FALLBACKS[slot_key].alt_text,
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
      image_url: FALLBACKS[slot_key].image_url,
      alt_text: FALLBACKS[slot_key].alt_text,
      updated_at: new Date().toISOString(),
    }));
  }

  const byKey = new Map(
    ((data ?? []) as SiteMediaSlot[]).map((r) => [r.slot_key, r]),
  );

  return SITE_MEDIA_SLOTS.map((slot_key) => {
    const row = byKey.get(slot_key);
    return (
      row ?? {
        slot_key,
        image_url: FALLBACKS[slot_key].image_url,
        alt_text: FALLBACKS[slot_key].alt_text,
        updated_at: new Date().toISOString(),
      }
    );
  });
}
