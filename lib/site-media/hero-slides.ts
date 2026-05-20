import { createServiceClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { site } from "@/lib/content";

export type HeroSlideRecord = {
  id: string;
  image_url: string;
  alt_text: string | null;
  display_order: number;
  created_at: string;
};

export type HeroSlideView = { src: string; alt: string; id?: string };

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
    alt: row.alt_text ?? "Grey Gables Farm",
  }));
}

/** Slides for homepage: carousel if 2+, else fallback single hero slot. */
export async function resolveHomeHeroSlides(
  fallbackHero: HeroSlideView,
): Promise<HeroSlideView[]> {
  const slides = await getHeroSlides();
  if (slides.length >= 2) return slides;
  if (slides.length === 1) return slides;
  return [fallbackHero];
}
