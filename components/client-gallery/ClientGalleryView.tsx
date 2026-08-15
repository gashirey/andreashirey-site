"use client";

import { useMemo, useState } from "react";
import type { ClientGalleryView } from "@/lib/client-gallery/types";
import {
  getDigitalPackage,
  requiredSelectionCount,
  type DigitalPackageId,
} from "@/lib/client-gallery/packages";
import { ClientGalleryGrid } from "./ClientGalleryGrid";
import { ClientGalleryHeader } from "./ClientGalleryHeader";
import { ClientGalleryLightbox } from "./ClientGalleryLightbox";
import { ClientGalleryOrderBar } from "./ClientGalleryOrderBar";
import { ClientGalleryOrderForm } from "./ClientGalleryOrderForm";

type ClientGalleryViewProps = {
  view: ClientGalleryView;
};

export function ClientGalleryView({ view }: ClientGalleryViewProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [packageId, setPackageId] = useState<DigitalPackageId | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const imageIds = useMemo(
    () => view.images.map((image) => image.id),
    [view.images],
  );

  const pkg = getDigitalPackage(packageId);
  const required = pkg
    ? requiredSelectionCount(pkg, view.images.length)
    : null;
  const selectionEnabled = Boolean(packageId) && !submitted;
  const lightboxImageId =
    lightboxIndex !== null ? view.images[lightboxIndex]?.id : undefined;
  const atLimit =
    required !== null &&
    selectedIds.length >= required &&
    !(lightboxImageId && selectedIds.includes(lightboxImageId));

  function handlePackageChange(id: DigitalPackageId) {
    setPackageId(id);
    setShowOrderForm(false);
    const next = getDigitalPackage(id);
    if (!next) return;

    if (next.photoCount === null) {
      setSelectedIds(imageIds);
      return;
    }

    setSelectedIds((current) => current.slice(0, next.photoCount ?? 0));
  }

  function toggleSelect(imageId: string) {
    if (!packageId || submitted) return;
    const currentPkg = getDigitalPackage(packageId);
    if (!currentPkg) return;

    if (currentPkg.photoCount === null) {
      setSelectedIds(imageIds);
      return;
    }

    setSelectedIds((current) => {
      if (current.includes(imageId)) {
        return current.filter((id) => id !== imageId);
      }
      if (current.length >= currentPkg.photoCount!) return current;
      return [...current, imageId];
    });
  }

  return (
    <>
      <ClientGalleryHeader
        title={view.gallery.title}
        shootName={view.shootName}
        shotOn={view.shotOn}
        imageCount={view.images.length}
      />

      <section className="pb-36 pt-2 md:pb-40 md:pt-4">
        <div className="mx-auto max-w-[88rem] px-6 lg:px-12">
          {submitted ? (
            <div className="card max-w-lg p-6">
              <p className="text-xs uppercase tracking-[0.12em] text-stone">
                Order received
              </p>
              <h2 className="mt-2 font-serif text-2xl text-bark">
                Thank you
              </h2>
              <p className="type-page-body mt-3 text-stone leading-relaxed">
                Your digital selection was sent to Andrea. She’ll follow up by
                email with confirmation and payment details.
              </p>
            </div>
          ) : null}

          {view.images.length ? (
            <>
              {!submitted ? (
                <p className="type-page-body mb-8 max-w-xl text-stone">
                  Choose a digital package below, then select your photos. Tap a
                  photo to view it larger, or use + to add it to your order.
                </p>
              ) : null}
              <ClientGalleryGrid
                images={view.images}
                selectedIds={selectedIds}
                selectionEnabled={selectionEnabled}
                onImageOpen={setLightboxIndex}
                onToggleSelect={toggleSelect}
              />
            </>
          ) : (
            <p className="type-page-body max-w-md py-12 text-stone leading-relaxed">
              Your gallery is being prepared. Check back soon.
            </p>
          )}
        </div>
      </section>

      {!submitted && view.images.length ? (
        <ClientGalleryOrderBar
          galleryImageCount={view.images.length}
          packageId={packageId}
          selectedCount={selectedIds.length}
          onPackageChange={handlePackageChange}
          onContinue={() => setShowOrderForm(true)}
        />
      ) : null}

      <ClientGalleryLightbox
        images={view.images}
        index={lightboxIndex}
        selectedIds={new Set(selectedIds)}
        selectionEnabled={selectionEnabled}
        atLimit={atLimit}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
        onToggleSelect={toggleSelect}
      />

      {showOrderForm && packageId ? (
        <ClientGalleryOrderForm
          token={view.gallery.share_token}
          packageId={packageId}
          assetIds={selectedIds}
          onClose={() => setShowOrderForm(false)}
          onSubmitted={() => {
            setShowOrderForm(false);
            setSubmitted(true);
          }}
        />
      ) : null}
    </>
  );
}
