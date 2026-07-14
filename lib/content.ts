/**
 * Site copy — edit here to update pages without touching components.
 */

import { reviewGalleryImages } from "./gallery-review.generated";

export const site = {
  name: "Andrea Shirey",
  brand: "Andrea Shirey Photography",
  domain: "andreashirey.com",
  tagline: "Editorial photography",
  description: "Observational work in light, place, and quiet detail.",
  email: "andrea@andreashirey.com",
  address: {
    street: "",
    city: "",
    state: "Virginia",
  },
  location: "Virginia",
  locationShort: "Virginia",
  locationRegion: "Virginia",
  visitNote: "",
  /** Text wordmark used in header/footer for this pass */
  logo: "",
  logoAlt: "Andrea Shirey Photography",
  heroImage: "/images/hero.jpg",
  heroImageAlt: "Editorial photograph by Andrea Shirey",
} as const;

export const heroHome = {
  title: "Andrea Shirey",
  subtitle: "Editorial photography for considered sessions.",
  primaryCta: { label: "Inquire About a Session", href: "/inquire" },
  secondaryCta: {
    label: "View work",
    href: "/gallery",
  },
} as const;

export const heroHomeSlide = {
  src: site.heroImage,
  alt: site.heroImageAlt,
} as const;

export const heroSlides = [
  heroHomeSlide,
  {
    src: "/images/bb.jpg",
    alt: "Editorial photograph by Andrea Shirey",
  },
  {
    src: "/images/garden_row.jpg",
    alt: "Landscape study by Andrea Shirey",
  },
] as const;

export const homeAbout = [
  "Photographs made slowly — attention to light, distance, and the ordinary. Andrea works with a limited number of clients each season so every session can be planned with care.",
] as const;

export const aboutPage = {
  eyebrow: "Virginia",
  title: "About",
  paragraphs: [
    "Andrea Shirey makes editorial photographs with patience for light, place, and the quiet details that give a moment its weight.",
    "Her work favors observation over staging — natural light, unhurried pacing, and images that feel true long after the day has passed. Sessions are intentionally limited so each client experience can be personal and fully considered.",
    "Based in Virginia, Andrea photographs weddings, portraits, families, and branding work for clients who value craft, atmosphere, and a calm creative process.",
  ],
} as const;

export const homeSections = {
  selectedWork: {
    title: "Selected work",
    description: "",
  },
  featuredGallery: {
    title: "From the archive",
    description: "",
  },
} as const;

export const homeCta = {
  note: "Andrea accepts a limited number of sessions each season. Begin with an inquiry to see if the timing and vision align.",
  contact: "Inquire About a Session",
} as const;

export type HeroFrame = "bleed" | "inset";

/** @deprecated Prefer lib/site-theme.ts activeHeroFrame */
export const homeHeroFrame: HeroFrame = "bleed";

export const announcement = {
  enabled: false,
  message: "",
} as const;

export const subscribe = {
  heading: "Updates",
  description: "Occasional notes when new work is published.",
  firstNameLabel: "First name",
  lastNameLabel: "Last name",
  firstNamePlaceholder: "Jane",
  lastNamePlaceholder: "Doe",
  emailLabel: "Email",
  emailPlaceholder: "you@example.com",
  phoneLabel: "Phone",
  phonePlaceholder: "(540) 555-1234",
  submitButton: "Subscribe",
  success: "You're on the list.",
  emailOptIn: "Email me when new work is posted.",
  smsOptIn: "Text me updates. Reply STOP to opt out.",
  optInRequired: "Choose email or text updates (or both).",
  notConfigured: "Sign-ups are almost ready.",
} as const;

export const social = {
  instagram: "" as string,
} as const;

export const nav = [
  { label: "Work", href: "/gallery" },
  { label: "Sessions", href: "/sessions" },
  { label: "About", href: "/about" },
  { label: "Inquire", href: "/inquire" },
] as const;

export type GalleryImage = {
  id: string;
  src: string;
  alt: string;
  caption?: string;
  /** Intrinsic dimensions — optional for uploaded remote images. */
  width?: number;
  height?: number;
};

/** Core portfolio placeholders — review/test shots appended from gallery-review.generated.ts */
const galleryImagesBase: GalleryImage[] = [
  {
    id: "work-1",
    src: "/images/hero.jpg",
    alt: "Editorial photograph by Andrea Shirey",
    width: 1600,
    height: 1067,
  },
  {
    id: "work-2",
    src: "/images/bb.jpg",
    alt: "Editorial photograph by Andrea Shirey",
    width: 1200,
    height: 1800,
  },
  {
    id: "work-3",
    src: "/images/garden_row.jpg",
    alt: "Landscape photograph by Andrea Shirey",
    width: 1800,
    height: 1200,
  },
  {
    id: "work-4",
    src: "/images/bb.jpg",
    alt: "Editorial photograph by Andrea Shirey",
    width: 1400,
    height: 933,
  },
  {
    id: "work-5",
    src: "/images/hero.jpg",
    alt: "Editorial photograph by Andrea Shirey",
    width: 1200,
    height: 1500,
  },
  {
    id: "work-6",
    src: "/images/garden_row.jpg",
    alt: "Landscape photograph by Andrea Shirey",
    width: 1600,
    height: 900,
  },
  {
    id: "work-7",
    src: "/images/hero.jpg",
    alt: "Editorial photograph by Andrea Shirey",
    width: 1200,
    height: 1600,
  },
  {
    id: "work-8",
    src: "/images/bb.jpg",
    alt: "Editorial photograph by Andrea Shirey",
    width: 1800,
    height: 1350,
  },
  {
    id: "work-9",
    src: "/images/garden_row.jpg",
    alt: "Landscape photograph by Andrea Shirey",
    width: 1200,
    height: 800,
  },
];

export const galleryImages: GalleryImage[] = [
  ...galleryImagesBase,
  ...reviewGalleryImages,
];

/** @deprecated Farm inventory — kept for admin compatibility only */
export type AvailabilityItem = {
  id: string;
  name: string;
  description: string;
  status: "available" | "limited" | "seasonal";
  image: string;
  imageAlt: string;
};

export const currentAvailability: AvailabilityItem[] = [];
