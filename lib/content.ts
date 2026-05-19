/**
 * Site copy — edit here to update pages without touching components.
 *
 * PHOTO FOLDERS (drop real images here, then update paths below):
 *   public/images/logo.jpg          — header / footer mark
 *   public/images/hero.jpg          — home hero
 *   public/images/bb.jpg            — bouquet (welcome, availability, gallery)
 *   public/images/garden_row.jpg    — garden rows (gallery)
 *   public/images/about.jpg         — about page (optional)
 *   public/images/flowers/{id}.jpg  — availability cards (match item id)
 *   public/images/gallery/01.jpg    — gallery grid
 */

export const site = {
  name: "Grey Gables Farm",
  domain: "greygablesfarm.com",
  tagline: "Seasonal flowers, grown with care",
  description:
    "Grey Gables Farm grows thoughtful, seasonal flowers for everyday bouquets, weddings, and special gatherings in Louisa, Central Virginia.",
  email: "hello@greygablesfarm.com",
  location: "Louisa, Virginia",
  locationRegion: "Central Virginia",
  logo: "/images/logo.jpg",
  logoAlt: "Grey Gables Farm",
  /** Home page hero — update path when you replace the image */
  heroImage: "/images/hero.jpg",
  heroImageAlt: "Grey Gables Farm — seasonal flowers in Louisa, Virginia",
} as const;

/** Home hero slider — add or reorder as you add farm photos */
export const heroSlides = [
  {
    src: site.heroImage,
    alt: site.heroImageAlt,
  },
  {
    src: "/images/bb.jpg",
    alt: "Mixed seasonal bouquet from Grey Gables Farm",
  },
  {
    src: "/images/garden_row.jpg",
    alt: "Cutting garden rows at Grey Gables Farm",
  },
] as const;

/** Home hero layout: full bleed edge-to-edge, or inset with side margins */
export type HeroFrame = "bleed" | "inset";

/** @deprecated Prefer lib/site-theme.ts activeHeroFrame */
export const homeHeroFrame: HeroFrame = "bleed";

/** Set when you refresh listings — shown on Flowers page */
export const availabilityUpdated = "2026-05-19";

export const announcement = {
  enabled: true,
  message:
    "We're refreshing photos and availability listings this week — check back soon or inquire for what's in bloom.",
} as const;

export const subscribe = {
  heading: "Stay in the loop",
  description:
    "Seasonal availability, farm updates, and occasional reminders — no spam, just flowers.",
  firstNameLabel: "First name",
  lastNameLabel: "Last name",
  firstNamePlaceholder: "Jane",
  lastNamePlaceholder: "Doe",
  emailLabel: "Email",
  emailPlaceholder: "you@example.com",
  phoneLabel: "Mobile phone",
  phonePlaceholder: "(540) 555-1234",
  submitButton: "Sign up",
  success: "You're on the list. We'll be in touch from the farm.",
  emailOptIn:
    "Send me farm updates and availability by email.",
  smsOptIn:
    "Send me recurring automated text messages from Grey Gables Farm. Msg & data rates may apply. Reply STOP to opt out.",
  optInRequired: "Please choose email or text updates (or both).",
  notConfigured:
    "Sign-ups are almost ready — we're connecting our list service.",
} as const;

export const social = {
  /** Add Instagram URL when ready, e.g. "https://instagram.com/greygablesfarm" */
  instagram: "" as string,
} as const;

export const ordering = {
  intro:
    "We list seasonal stems and bouquets as they're ready from the field. Availability changes weekly.",
  steps: [
    {
      title: "See what's available",
      text: "Browse this week's offerings on our Flowers page or Rooted Farmers shop when live.",
    },
    {
      title: "Place your order",
      text: "Order online when Rooted Farmers is connected, or email us for pickup and custom requests.",
    },
    {
      title: "Pick up fresh",
      text: "We'll confirm timing and any pickup details by email. Flowers are harvested close to hand-off.",
    },
  ],
  pickupNote:
    "Pickup details shared upon order confirmation. Delivery and event florals available by inquiry.",
} as const;

export const nav = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Flowers", href: "/flowers" },
  { label: "Gallery", href: "/gallery" },
  { label: "Weddings & Events", href: "/weddings" },
  { label: "Contact", href: "/contact" },
] as const;

export type AvailabilityItem = {
  id: string;
  name: string;
  description: string;
  status: "available" | "limited" | "seasonal";
  /** Replace with real farm photo path, e.g. /images/flowers/mixed-bouquets.jpg */
  image: string;
  imageAlt: string;
};

export const currentAvailability: AvailabilityItem[] = [
  {
    id: "mixed-bouquets",
    name: "Mixed Seasonal Bouquets",
    description:
      "Hand-tied bouquets featuring the best of what's in bloom this week — perfect for your table or a thoughtful gift.",
    status: "available",
    image: "/images/bb.jpg",
    imageAlt: "Mixed seasonal bouquet from Grey Gables Farm",
  },
  {
    id: "garden-roses",
    name: "Garden Roses",
    description:
      "Fragrant, romantic blooms with soft petals and garden-gathered charm.",
    status: "limited",
    image: "/images/placeholders/roses.svg",
    imageAlt: "Placeholder — replace with garden roses photo",
  },
  {
    id: "dahlias",
    name: "Dahlias",
    description:
      "Bold, sculptural dahlias in a rotating palette of late-summer and autumn hues.",
    status: "seasonal",
    image: "/images/placeholders/dahlias.svg",
    imageAlt: "Placeholder — replace with dahlia photo",
  },
  {
    id: "foliage-bunches",
    name: "Foliage & Accent Bunches",
    description:
      "Textural greens and accent stems to complement your own arrangements.",
    status: "available",
    image: "/images/placeholders/foliage.svg",
    imageAlt: "Placeholder — replace with foliage bunch photo",
  },
];

export type GalleryImage = {
  id: string;
  src: string;
  alt: string;
  caption?: string;
};

export const galleryImages: GalleryImage[] = [
  {
    id: "g1",
    src: "/images/garden_row.jpg",
    alt: "Cutting garden rows at Grey Gables Farm",
    caption: "Morning light in the cutting garden",
  },
  {
    id: "g2",
    src: "/images/bb.jpg",
    alt: "Mixed seasonal bouquet from Grey Gables Farm",
    caption: "Seasonal bouquet",
  },
  {
    id: "g3",
    src: "/images/placeholders/gallery-3.svg",
    alt: "Placeholder — replace with wedding arrangement photo",
    caption: "Wedding centerpiece",
  },
  {
    id: "g4",
    src: "/images/placeholders/gallery-4.svg",
    alt: "Placeholder — replace with harvest or bucket photo",
    caption: "Fresh from the field",
  },
  {
    id: "g5",
    src: "/images/placeholders/gallery-5.svg",
    alt: "Placeholder — replace with bride or event florals photo",
    caption: "Celebration florals",
  },
  {
    id: "g6",
    src: "/images/placeholders/gallery-6.svg",
    alt: "Placeholder — replace with greenhouse or farm detail photo",
    caption: "Behind the blooms",
  },
];
