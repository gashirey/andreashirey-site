import { currentAvailability, site } from "@/lib/content";

/** Real farm photos — synced with lib/content.ts */
export const labPhotos = {
  hero: {
    src: site.heroImage,
    alt: site.heroImageAlt,
  },
  bouquet: {
    src: currentAvailability[0].image,
    alt: currentAvailability[0].imageAlt,
  },
  gardenRow: {
    src: "/images/garden_row.jpg",
    alt: "Cutting garden rows at Grey Gables Farm",
  },
} as const;

/** Home gallery strip: hero, bouquet, garden row */
export const labHomeGallery = [
  labPhotos.hero,
  labPhotos.bouquet,
  labPhotos.gardenRow,
] as const;
