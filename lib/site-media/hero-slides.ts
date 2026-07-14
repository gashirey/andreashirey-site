import { createServiceClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { clampFocal } from "@/lib/site-cms/focal";
import { site } from "@/lib/content";

export type HeroSlideRecord = {
  id: string;
  image_url: string;
  alt_text: string | null;
  display_order: number;
  focal_x?: number;
  focal_y?: number;
  created_at: string;
};

export type HeroSlideView = {
  src: string;
  alt: string;
  id?: string;
  focalX?: number;
  focalY?: number;
};

const FALLBACK: HeroSlideView[] = [
  { src: site.heroImage, alt: site.heroImageAlt },
];

export async function getHeroSlides(): Promise<HeroSlideView[]> {
  if (!isSupabaseConfigured()) return FALLBACK;

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("site_hero_slides")
    .select("id, image_url, alt_text, display_order")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("[getHeroSlides]", error);
    return FALLBACK;
  }

  const rows = (data ?? []) as HeroSlideRecord[];
  if (!rows.length) return [];

  return rows.map((row) => ({
    id: row.id,
    src: row.image_url,
    alt: row.alt_text ?? site.brand,
    focalX: clampFocal(row.focal_x),
    focalY: clampFocal(row.focal_y),
  }));
}

/**
 * Homepage hero is driven only by `site_hero_slides`.
 * Empty list = text-only hero (no leftover single-slot / static image).
 * When Supabase is not configured, `getHeroSlides` still returns the local fallback.
 */
export async function resolveHomeHeroSlides(
  _fallbackHero?: HeroSlideView,
): Promise<HeroSlideView[]> {
  return getHeroSlides();
}
