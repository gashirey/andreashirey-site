import { site } from "@/lib/content";

const SITE_URL = `https://${site.domain}`;

export const SOCIAL_CAPTION_TEMPLATES = [
  {
    id: "weekly",
    label: "This week",
    text: `Fresh from the field at ${site.name} — see what’s available this week.\n\n${SITE_URL}/available-now`,
  },
  {
    id: "seasonal",
    label: "Seasonal",
    text: `Seasonal cut flowers from ${site.locationShort}.\n\n${SITE_URL}`,
  },
  {
    id: "short",
    label: "Short + link",
    text: `${site.name} · link in bio\n${SITE_URL}/available-now`,
  },
] as const;
