"use client";

import {
  DIGITAL_PACKAGES,
  formatPackagePrice,
  getDigitalPackage,
  isSelectionComplete,
  requiredSelectionCount,
  type DigitalPackageId,
} from "@/lib/client-gallery/packages";

type ClientGalleryOrderBarProps = {
  galleryImageCount: number;
  packageId: DigitalPackageId | null;
  selectedCount: number;
  onPackageChange: (id: DigitalPackageId) => void;
  onContinue: () => void;
  disabled?: boolean;
};

export function ClientGalleryOrderBar({
  galleryImageCount,
  packageId,
  selectedCount,
  onPackageChange,
  onContinue,
  disabled,
}: ClientGalleryOrderBarProps) {
  const pkg = getDigitalPackage(packageId);
  const required = pkg
    ? requiredSelectionCount(pkg, galleryImageCount)
    : null;
  const complete = pkg
    ? isSelectionComplete(pkg, selectedCount, galleryImageCount)
    : false;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-parchment bg-white">
      <div className="mx-auto max-w-[88rem] px-4 py-4 sm:px-6 lg:px-12">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-xs uppercase tracking-[0.12em] text-stone">
              Digital files
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {DIGITAL_PACKAGES.map((option) => {
                const selected = option.id === packageId;
                const countLabel =
                  option.photoCount === null
                    ? `${galleryImageCount || "all"}`
                    : String(option.photoCount);
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => onPackageChange(option.id)}
                    className={`rounded-sm border px-3 py-2 text-left text-sm transition-colors ${
                      selected
                        ? "border-bark bg-bark text-cream"
                        : "border-parchment bg-cream text-bark hover:border-bark"
                    }`}
                  >
                    <span className="block font-medium">{option.label}</span>
                    <span
                      className={`mt-0.5 block text-xs ${
                        selected ? "text-cream/80" : "text-stone"
                      }`}
                    >
                      {countLabel} · {formatPackagePrice(option.priceCents)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <p className="text-sm text-stone">
              {pkg && required !== null ? (
                <>
                  <span className="font-medium text-bark">
                    {selectedCount}/{required}
                  </span>{" "}
                  selected
                  {complete ? " — ready" : ""}
                </>
              ) : (
                "Choose a package, then select photos"
              )}
            </p>
            <button
              type="button"
              disabled={!complete || disabled}
              onClick={onContinue}
              className="btn border-salmon-dark bg-salmon-dark text-white hover:bg-salmon disabled:cursor-not-allowed disabled:opacity-40"
            >
              Review order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
