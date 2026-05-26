import type { GalleryImage } from "@/lib/content";
import {
  MasonryGallery,
  type MasonryGalleryDensity,
} from "@/components/gallery/MasonryGallery";

type GalleryGridProps = {
  images: GalleryImage[];
  priorityCount?: number;
  density?: MasonryGalleryDensity;
};

/** Editorial masonry gallery — preserves natural image proportions */
export function GalleryGrid({
  images,
  priorityCount = 0,
  density = "full",
}: GalleryGridProps) {
  return (
    <MasonryGallery
      images={images}
      priorityCount={priorityCount}
      density={density}
    />
  );
}
