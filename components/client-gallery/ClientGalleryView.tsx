"use client";

import { useState } from "react";
import type { ClientGalleryView } from "@/lib/client-gallery/types";
import { ClientGalleryGrid } from "./ClientGalleryGrid";
import { ClientGalleryHeader } from "./ClientGalleryHeader";
import { ClientGalleryLightbox } from "./ClientGalleryLightbox";

type ClientGalleryViewProps = {
  view: ClientGalleryView;
};

export function ClientGalleryView({ view }: ClientGalleryViewProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <>
      <ClientGalleryHeader
        title={view.gallery.title}
        shootName={view.shootName}
        shotOn={view.shotOn}
        imageCount={view.images.length}
      />

      <section className="pb-16 pt-2 md:pb-20">
        <div className="mx-auto max-w-[88rem] px-6 lg:px-12">
          {view.images.length ? (
            <>
              <p className="type-page-body mb-8 max-w-lg text-stone">
                Tap any image to view it larger. Use arrow keys to move between
                photos.
              </p>
              <ClientGalleryGrid
                images={view.images}
                onImageClick={setLightboxIndex}
              />
            </>
          ) : (
            <p className="type-page-body max-w-md py-12 text-stone leading-relaxed">
              Your gallery is being prepared. Check back soon.
            </p>
          )}
        </div>
      </section>

      <ClientGalleryLightbox
        images={view.images}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />
    </>
  );
}
