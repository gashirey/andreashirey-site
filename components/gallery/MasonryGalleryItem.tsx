"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import type { GalleryImage } from "@/lib/content";
import {
  galleryRevealConfig,
  staggerDelayForIndex,
} from "@/lib/gallery/reveal-config";

type MasonryGalleryItemProps = {
  image: GalleryImage;
  index: number;
  priority?: boolean;
  sizes: string;
};

export function MasonryGalleryItem({
  image,
  index,
  priority = false,
  sizes,
}: MasonryGalleryItemProps) {
  const ref = useRef<HTMLElement>(null);
  const [revealed, setRevealed] = useState(false);
  const staggerDelay = staggerDelayForIndex(index);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion) {
      setRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setRevealed(true);
          if (galleryRevealConfig.once) observer.disconnect();
        }
      },
      { threshold: galleryRevealConfig.viewportAmount },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <figure
      ref={ref}
      className={`masonry-gallery__item ${revealed ? "is-revealed" : ""}`}
      style={{ "--reveal-delay": staggerDelay } as CSSProperties}
      role="listitem"
    >
      <div className="masonry-gallery__frame">
        {image.width && image.height ? (
          <Image
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            sizes={sizes}
            priority={priority}
            loading={priority ? undefined : "lazy"}
            decoding="async"
            className="masonry-gallery__image"
            unoptimized={image.src.startsWith("http")}
          />
        ) : (
          // Uploaded gallery assets come from the media library; the browser
          // preserves their natural aspect ratio before dimensions are stored.
          <img
            src={image.src}
            alt={image.alt}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            fetchPriority={priority ? "high" : "auto"}
            className="masonry-gallery__image"
          />
        )}
      </div>
      {image.caption ? (
        <figcaption className="masonry-gallery__caption">{image.caption}</figcaption>
      ) : null}
    </figure>
  );
}
