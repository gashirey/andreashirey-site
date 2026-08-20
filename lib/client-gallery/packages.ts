/**
 * Digital file packages for client gallery ordering.
 * Prices from Andrea’s current digital delivery menu.
 */

export type DigitalPackageId = "single" | "five" | "top12" | "all";

export type DigitalPackage = {
  id: DigitalPackageId;
  label: string;
  /** Exact photo count required; null means every image in the gallery */
  photoCount: number | null;
  priceCents: number;
};

export const DIGITAL_PACKAGES: DigitalPackage[] = [
  {
    id: "single",
    label: "Single Shot",
    photoCount: 1,
    priceCents: 275_00,
  },
  {
    id: "five",
    label: "Five favorites",
    photoCount: 5,
    priceCents: 625_00,
  },
  {
    id: "top12",
    label: "Top 12",
    photoCount: 12,
    priceCents: 900_00,
  },
  {
    id: "all",
    label: "All of them",
    photoCount: null,
    priceCents: 1325_00,
  },
];

export function getDigitalPackage(
  id: string | null | undefined,
): DigitalPackage | null {
  if (!id) return null;
  return DIGITAL_PACKAGES.find((pkg) => pkg.id === id) ?? null;
}

export function requiredSelectionCount(
  pkg: DigitalPackage,
  galleryImageCount: number,
): number {
  if (pkg.photoCount === null) return galleryImageCount;
  return pkg.photoCount;
}

export function formatPackagePrice(priceCents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(priceCents / 100);
}

export function isSelectionComplete(
  pkg: DigitalPackage,
  selectedCount: number,
  galleryImageCount: number,
): boolean {
  const required = requiredSelectionCount(pkg, galleryImageCount);
  if (required <= 0) return false;
  return selectedCount === required;
}
