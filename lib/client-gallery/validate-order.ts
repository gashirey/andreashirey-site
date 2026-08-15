import {
  getDigitalPackage,
  isSelectionComplete,
  type DigitalPackageId,
} from "@/lib/client-gallery/packages";
import type { ClientGalleryOrderInput } from "@/lib/client-gallery/order-types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type OrderValidationResult =
  | { ok: true; data: ClientGalleryOrderInput & { packageLabel: string; priceCents: number } }
  | { ok: false; error: string };

export function validateClientGalleryOrder(
  body: unknown,
  galleryAssetIds: string[],
): OrderValidationResult {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Invalid request." };
  }

  const record = body as Record<string, unknown>;
  const packageId =
    typeof record.packageId === "string"
      ? (record.packageId as DigitalPackageId)
      : null;
  const pkg = getDigitalPackage(packageId);
  if (!pkg) {
    return { ok: false, error: "Choose a digital package." };
  }

  const assetIds = Array.isArray(record.assetIds)
    ? record.assetIds.filter((id): id is string => typeof id === "string")
    : [];

  const uniqueIds = [...new Set(assetIds)];
  if (uniqueIds.length !== assetIds.length) {
    return { ok: false, error: "Duplicate photos in selection." };
  }

  const allowed = new Set(galleryAssetIds);
  if (uniqueIds.some((id) => !allowed.has(id))) {
    return { ok: false, error: "One or more selected photos are not in this gallery." };
  }

  if (!isSelectionComplete(pkg, uniqueIds.length, galleryAssetIds.length)) {
    if (pkg.photoCount === null) {
      return {
        ok: false,
        error: "All of them includes every photo in this gallery.",
      };
    }
    return {
      ok: false,
      error: `Select exactly ${pkg.photoCount} photo${pkg.photoCount === 1 ? "" : "s"} for ${pkg.label}.`,
    };
  }

  if (pkg.photoCount === null && uniqueIds.length !== galleryAssetIds.length) {
    return { ok: false, error: "All of them must include every gallery photo." };
  }

  const clientName =
    typeof record.clientName === "string" ? record.clientName.trim() : "";
  const clientEmail =
    typeof record.clientEmail === "string"
      ? record.clientEmail.trim().toLowerCase()
      : "";
  const notes =
    typeof record.notes === "string" ? record.notes.trim() : "";

  if (clientName.length < 2) {
    return { ok: false, error: "Please enter your name." };
  }
  if (!EMAIL_RE.test(clientEmail)) {
    return { ok: false, error: "Please enter a valid email." };
  }

  return {
    ok: true,
    data: {
      packageId: pkg.id,
      assetIds: uniqueIds,
      clientName,
      clientEmail,
      notes: notes || undefined,
      packageLabel: pkg.label,
      priceCents: pkg.priceCents,
    },
  };
}
