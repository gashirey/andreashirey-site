"use client";

import { useCallback, useEffect, useState } from "react";
import type { GalleryImage } from "@/lib/content";

type ClientGalleryLightboxProps = {
  images: GalleryImage[];
  index: number | null;
  selectedIds: Set<string>;
  selectionEnabled: boolean;
  atLimit: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
  onToggleSelect: (imageId: string) => void;
};

export function ClientGalleryLightbox({
  images,
  index,
  selectedIds,
  selectionEnabled,
  atLimit,
  onClose,
  onNavigate,
  onToggleSelect,
}: ClientGalleryLightboxProps) {
  const open = index !== null && images[index];
  const current = open ? images[index] : null;
  const isSelected = current ? selectedIds.has(current.id) : false;

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
      if (event.key === " " || event.key === "Enter") {
        if (selectionEnabled && current && (isSelected || !atLimit)) {
          event.preventDefault();
          onToggleSelect(current.id);
        }
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [
    atLimit,
    current,
    goNext,
    goPrev,
    isSelected,
    onClose,
    onToggleSelect,
    open,
    selectionEnabled,
  ]);

  if (!open || !current) return null;

  const canToggle = selectionEnabled && (isSelected || !atLimit);

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
          {isSelected ? " · Selected" : ""}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          {selectionEnabled ? (
            <button
              type="button"
              disabled={!canToggle}
              onClick={() => onToggleSelect(current.id)}
              className="rounded-sm border border-cream/30 px-3 py-1.5 text-sm text-cream hover:border-cream hover:bg-cream/10 disabled:opacity-40"
            >
              {isSelected ? "Remove from order" : "Add to order"}
            </button>
          ) : null}
          <button
            type="button"
            onClick={onClose}
            className="rounded-sm border border-cream/30 px-3 py-1.5 text-sm text-cream hover:border-cream hover:bg-cream/10"
          >
            Close
          </button>
        </div>
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
    </div>
  );
}
