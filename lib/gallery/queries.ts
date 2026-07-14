import type { GalleryImage } from "@/lib/content";
import { galleryImages as fallbackGalleryImages } from "@/lib/content";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServiceClient } from "@/lib/supabase/server";

export const PORTFOLIO_GALLERY_STORAGE_PREFIX = "andrea-gallery";

type MediaAssetRow = {
  id: string;
  storage_path: string;
  public_url: string;
  filename: string;
  alt_text: string | null;
  in_gallery?: boolean;
};

export async function getPortfolioGalleryImages(): Promise<GalleryImage[]> {
  if (!isSupabaseConfigured()) return fallbackGalleryImages;

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("media_assets")
    .select("id, storage_path, public_url, filename, alt_text, in_gallery")
    .eq("in_gallery", true)
    .order("created_at", { ascending: false })
    .limit(500);

  if (error) {
    // Older DBs without in_gallery: fall back to andrea-gallery prefix.
    if (error.message?.includes("in_gallery") || error.code === "PGRST204") {
      console.warn(
        "[getPortfolioGalleryImages] in_gallery missing; run migration 015_media_in_gallery.sql",
      );
      const legacy = await supabase
        .from("media_assets")
        .select("id, storage_path, public_url, filename, alt_text")
        .like("storage_path", `${PORTFOLIO_GALLERY_STORAGE_PREFIX}/%`)
        .order("created_at", { ascending: false })
        .limit(500);
      if (legacy.error) {
        console.error("[getPortfolioGalleryImages]", legacy.error);
        return fallbackGalleryImages;
      }
      return mapAssets((legacy.data ?? []) as MediaAssetRow[]);
    }
    console.error("[getPortfolioGalleryImages]", error);
    return fallbackGalleryImages;
  }

  return mapAssets((data ?? []) as MediaAssetRow[]);
}

function mapAssets(rows: MediaAssetRow[]): GalleryImage[] {
  return rows
    .filter((asset) => asset.public_url)
    .map((asset) => ({
      id: `media-${asset.id}`,
      src: asset.public_url,
      alt:
        asset.alt_text?.trim() ||
        asset.filename.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "),
    }));
}
