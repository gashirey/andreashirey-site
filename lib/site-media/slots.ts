/** Keys for marketing images on the public site */
export const SITE_MEDIA_SLOTS = ["hero", "home_feature", "about"] as const;

export type SiteMediaSlotKey = (typeof SITE_MEDIA_SLOTS)[number];

export const SITE_MEDIA_SLOT_LABELS: Record<SiteMediaSlotKey, string> = {
  hero: "Homepage hero",
  home_feature: "Homepage full-width photo",
  about: "About page photo",
};

export type SiteMediaSlot = {
  slot_key: SiteMediaSlotKey;
  image_url: string;
  alt_text: string | null;
  updated_at: string;
};
