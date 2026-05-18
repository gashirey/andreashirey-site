/**
 * Site copy — edit here to update pages without touching components.
 */

export const site = {
  name: "Grey Gables Farm",
  domain: "greygablesfarm.com",
  tagline: "Seasonal flowers, grown with care",
  description:
    "Grey Gables Farm grows thoughtful, seasonal flowers for everyday bouquets, weddings, and special gatherings in the Hudson Valley.",
  email: "hello@greygablesfarm.com",
  location: "Hudson Valley, New York",
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
  /** Replace with real farm photo path, e.g. /images/flowers/peonies.jpg */
  image: string;
  imageAlt: string;
};

export const currentAvailability: AvailabilityItem[] = [
  {
    id: "mixed-bouquets",
    name: "Mixed Seasonal Bouquets",
    description:
      "Hand-tied bouquets featuring the best of what’s in bloom this week — perfect for your table or a thoughtful gift.",
    status: "available",
    image: "/images/placeholders/bouquet.svg",
    imageAlt: "Placeholder — replace with mixed bouquet photo",
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
    src: "/images/placeholders/gallery-1.svg",
    alt: "Placeholder — replace with field or farm landscape photo",
    caption: "Morning light in the cutting garden",
  },
  {
    id: "g2",
    src: "/images/placeholders/gallery-2.svg",
    alt: "Placeholder — replace with bouquet detail photo",
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
