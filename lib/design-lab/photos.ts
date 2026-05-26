import { galleryImages, site } from "@/lib/content";

/** Portfolio placeholders for design lab previews */
export const labPhotos = {
  hero: {
    src: site.heroImage,
    alt: site.heroImageAlt,
  },
  feature: {
    src: galleryImages[1]?.src ?? site.heroImage,
    alt: galleryImages[1]?.alt ?? site.heroImageAlt,
  },
  landscape: {
    src: galleryImages[2]?.src ?? "/images/garden_row.jpg",
    alt: galleryImages[2]?.alt ?? "Photograph by Andrea Shirey",
  },
} as const;

export const labHomeGallery = [
  labPhotos.hero,
  labPhotos.feature,
  labPhotos.landscape,
] as const;
