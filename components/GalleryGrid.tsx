import Image from "next/image";
import type { GalleryImage } from "@/lib/content";

type GalleryGridProps = {
  images: GalleryImage[];
};

export function GalleryGrid({ images }: GalleryGridProps) {
  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {images.map((image) => (
        <figure key={image.id}>
          <div className="image-frame relative aspect-[4/5]">
            {/* PHOTO: Replace src with real farm gallery image */}
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
          {image.caption && (
            <figcaption className="mt-2 text-sm text-stone">
              {image.caption}
            </figcaption>
          )}
        </figure>
      ))}
    </div>
  );
}
