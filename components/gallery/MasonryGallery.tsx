import type { GalleryImage } from "@/lib/content";
import { galleryRevealCssVars } from "@/lib/gallery/reveal-config";
import { MasonryGalleryItem } from "./MasonryGalleryItem";

export type MasonryGalleryDensity = "full" | "compact";

type MasonryGalleryProps = {
  images: GalleryImage[];
  /** First N images load eagerly (above the fold) */
  priorityCount?: number;
  /** full: 1 col mobile, 2 cols desktop (large tiles) — compact: 1 col */
  density?: MasonryGalleryDensity;
};

const columnClass: Record<MasonryGalleryDensity, string> = {
  full: "columns-1 md:columns-2",
  compact: "columns-1",
};

const sizesByDensity: Record<MasonryGalleryDensity, string> = {
  full: "(max-width: 768px) 100vw, 50vw",
  compact: "100vw",
};

export function MasonryGallery({
  images,
  priorityCount = 0,
  density = "full",
}: MasonryGalleryProps) {
  if (!images.length) return null;

  const sizes = sizesByDensity[density];

  return (
    <div
      className={`masonry-gallery ${columnClass[density]}`}
      style={galleryRevealCssVars()}
      role="list"
    >
      {images.map((image, index) => (
        <MasonryGalleryItem
          key={image.id}
          image={image}
          index={index}
          priority={index < priorityCount}
          sizes={sizes}
        />
      ))}
    </div>
  );
}
