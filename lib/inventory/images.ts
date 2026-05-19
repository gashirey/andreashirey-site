import type { FarmProductPhoto } from "./types";

const PLACEHOLDER = "/images/placeholders/bouquet.svg";

export function resolveProductImage(
  productId: string,
  availabilityId: string,
  productName: string,
  photos: FarmProductPhoto[],
): { imageUrl: string; imageAlt: string } {
  const forAvailability = photos.filter((p) => p.availability_id === availabilityId);
  const forProduct = photos.filter(
    (p) => p.product_id === productId && !p.availability_id,
  );

  const availabilityPrimary = forAvailability.find((p) => p.is_primary);
  if (availabilityPrimary) {
    return {
      imageUrl: availabilityPrimary.image_url,
      imageAlt: availabilityPrimary.alt_text ?? productName,
    };
  }

  const productPrimary = forProduct.find((p) => p.is_primary);
  if (productPrimary) {
    return {
      imageUrl: productPrimary.image_url,
      imageAlt: productPrimary.alt_text ?? productName,
    };
  }

  const firstProduct = [...forProduct].sort(
    (a, b) => a.display_order - b.display_order,
  )[0];
  if (firstProduct) {
    return {
      imageUrl: firstProduct.image_url,
      imageAlt: firstProduct.alt_text ?? productName,
    };
  }

  const firstAny = [...forAvailability].sort(
    (a, b) => a.display_order - b.display_order,
  )[0];
  if (firstAny) {
    return {
      imageUrl: firstAny.image_url,
      imageAlt: firstAny.alt_text ?? productName,
    };
  }

  return { imageUrl: PLACEHOLDER, imageAlt: productName };
}

export { PLACEHOLDER as INVENTORY_IMAGE_PLACEHOLDER };
