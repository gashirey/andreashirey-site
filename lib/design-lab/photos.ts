import { currentAvailability, site } from "@/lib/content";

/** Real farm photos used in design lab — synced with lib/content.ts */
export const labPhotos = {
  hero: {
    src: site.heroImage,
    alt: site.heroImageAlt,
  },
  bouquet: {
    src: currentAvailability[0].image,
    alt: currentAvailability[0].imageAlt,
  },
} as const;
