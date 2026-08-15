"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import type { GalleryImage } from "@/lib/content";
import {
  galleryRevealConfig,
  staggerDelayForIndex,
} from "@/lib/gallery/reveal-config";

type ClientGalleryItemProps = {
  image: GalleryImage;
  index: number;
  priority?: boolean;
  sizes: string;
  selected: boolean;
  selectionEnabled: boolean;
  selectionNumber?: number | null;
  onOpen: () => void;
  onToggleSelect: () => void;
};

export function ClientGalleryItem({
  image,
  index,
  priority = false,
  sizes,
  selected,
  selectionEnabled,
  selectionNumber,
  onOpen,
  onToggleSelect,
}: ClientGalleryItemProps) {
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
      <div className="relative">
        <button
          type="button"
          onClick={onOpen}
          className="group block w-full cursor-zoom-in text-left"
          aria-label={`View ${image.alt}`}
        >
          <div
            className={`masonry-gallery__frame ${
              selected ? "ring-2 ring-bark ring-offset-2 ring-offset-cream" : ""
            }`}
          >
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
        </button>

        {selectionEnabled ? (
          <button
            type="button"
            onClick={onToggleSelect}
            className={`absolute left-2 top-2 rounded-sm border px-2 py-1 text-xs font-medium ${
              selected
                ? "border-bark bg-bark text-cream"
                : "border-parchment bg-white/95 text-bark"
            }`}
            aria-pressed={selected}
            aria-label={
              selected ? `Remove ${image.alt} from order` : `Add ${image.alt} to order`
            }
          >
            {selected && selectionNumber ? selectionNumber : selected ? "✓" : "+"}
          </button>
        ) : null}
      </div>
      {image.caption ? (
        <figcaption className="masonry-gallery__caption">{image.caption}</figcaption>
      ) : null}
    </figure>
  );
}
