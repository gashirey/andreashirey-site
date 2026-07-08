"use client";

import { useCallback, useEffect } from "react";
import type { GalleryImage } from "@/lib/content";

type ClientGalleryLightboxProps = {
  images: GalleryImage[];
  index: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
};

export function ClientGalleryLightbox({
  images,
  index,
  onClose,
  onNavigate,
}: ClientGalleryLightboxProps) {
  const open = index !== null && images[index];
  const current = open ? images[index] : null;

  const goPrev = useCallback(() => {
    if (index === null || !images.length) return;
    onNavigate((index - 1 + images.length) % images.length);
  }, [images.length, index, onNavigate]);

  const goNext = useCallback(() => {
    if (index === null || !images.length) return;
    onNavigate((index + 1) % images.length);
  }, [images.length, index, onNavigate]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") goPrev();
      if (event.key === "ArrowRight") goNext();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [goNext, goPrev, onClose, open]);

  if (!open || !current) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-bark/95"
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
    >
      <div className="flex items-center justify-between gap-4 px-4 py-3 text-cream sm:px-6">
        <p className="text-sm text-cream/80">
          {index + 1} of {images.length}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="rounded-sm border border-cream/30 px-3 py-1.5 text-sm text-cream hover:border-cream hover:bg-cream/10"
        >
          Close
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-4 sm:px-10">
        {images.length > 1 ? (
          <button
            type="button"
            onClick={goPrev}
            className="absolute left-2 top-1/2 z-10 hidden -translate-y-1/2 rounded-sm border border-cream/30 px-3 py-2 text-sm text-cream hover:border-cream hover:bg-cream/10 sm:left-4 sm:block"
            aria-label="Previous photo"
          >
            Prev
          </button>
        ) : null}

        <img
          src={current.src}
          alt={current.alt}
          className="max-h-[calc(100vh-7rem)] max-w-full object-contain"
        />

        {images.length > 1 ? (
          <button
            type="button"
            onClick={goNext}
            className="absolute right-2 top-1/2 z-10 hidden -translate-y-1/2 rounded-sm border border-cream/30 px-3 py-2 text-sm text-cream hover:border-cream hover:bg-cream/10 sm:right-4 sm:block"
            aria-label="Next photo"
          >
            Next
          </button>
        ) : null}
      </div>

      <button
        type="button"
        className="absolute inset-0 -z-10"
        aria-label="Close photo viewer"
        onClick={onClose}
      />
    </div>
  );
}
