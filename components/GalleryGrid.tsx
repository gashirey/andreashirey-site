import Image from "next/image";
import type { GalleryImage } from "@/lib/content";

type GalleryGridProps = {
  images: GalleryImage[];
};

export function GalleryGrid({ images }: GalleryGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {images.map((image) => (
        <figure
          key={image.id}
          className="group relative aspect-[4/5] overflow-hidden rounded-lg bg-parchment"
        >
          {/* PHOTO: Replace src with real farm gallery image */}
          <Image
            src={image.src}
            alt={image.alt}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          {image.caption && (
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-bark/80 to-transparent px-4 pb-4 pt-12 text-sm text-white opacity-0 transition-opacity group-hover:opacity-100">
              {image.caption}
            </figcaption>
          )}
        </figure>
      ))}
    </div>
  );
}
