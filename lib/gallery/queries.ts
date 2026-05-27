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
};

export async function getPortfolioGalleryImages(): Promise<GalleryImage[]> {
  if (!isSupabaseConfigured()) return fallbackGalleryImages;

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("media_assets")
    .select("id, storage_path, public_url, filename, alt_text")
    .like("storage_path", `${PORTFOLIO_GALLERY_STORAGE_PREFIX}/%`)
    .order("created_at", { ascending: false })
    .limit(500);

  if (error) {
    console.error("[getPortfolioGalleryImages]", error);
    return fallbackGalleryImages;
  }

  const uploaded = ((data ?? []) as MediaAssetRow[])
    .filter((asset) => asset.public_url)
    .map((asset): GalleryImage => ({
      id: `media-${asset.id}`,
      src: asset.public_url,
      alt:
        asset.alt_text?.trim() ||
        asset.filename.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "),
    }));

  return uploaded;
}
