"use client";

import type { GalleryImage } from "@/lib/content";
import { galleryRevealCssVars } from "@/lib/gallery/reveal-config";
import { ClientGalleryItem } from "./ClientGalleryItem";

type ClientGalleryGridProps = {
  images: GalleryImage[];
  selectedIds: string[];
  selectionEnabled: boolean;
  onImageOpen: (index: number) => void;
  onToggleSelect: (imageId: string) => void;
};

export function ClientGalleryGrid({
  images,
  selectedIds,
  selectionEnabled,
  onImageOpen,
  onToggleSelect,
}: ClientGalleryGridProps) {
  if (!images.length) return null;

  const orderIndex = new Map(selectedIds.map((id, i) => [id, i + 1]));

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
          selected={orderIndex.has(image.id)}
          selectionEnabled={selectionEnabled}
          selectionNumber={orderIndex.get(image.id) ?? null}
          onOpen={() => onImageOpen(index)}
          onToggleSelect={() => onToggleSelect(image.id)}
        />
      ))}
    </div>
  );
}
