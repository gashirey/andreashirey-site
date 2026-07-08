"use client";

import type { GalleryImage } from "@/lib/content";
import { galleryRevealCssVars } from "@/lib/gallery/reveal-config";
import { ClientGalleryItem } from "./ClientGalleryItem";

type ClientGalleryGridProps = {
  images: GalleryImage[];
  onImageClick: (index: number) => void;
};

export function ClientGalleryGrid({
  images,
  onImageClick,
}: ClientGalleryGridProps) {
  if (!images.length) return null;

  return (
    <div
      className="masonry-gallery columns-1 md:columns-2"
      style={galleryRevealCssVars()}
      role="list"
    >
      {images.map((image, index) => (
        <ClientGalleryItem
          key={image.id}
          image={image}
          index={index}
          priority={index < 2}
          sizes="(max-width: 768px) 100vw, 50vw"
          onClick={() => onImageClick(index)}
        />
      ))}
    </div>
  );
}
