import { brand } from "@/lib/brand";

export type DesignDirectionId = "a" | "b" | "c" | "d" | "e";

export type DesignDirection = {
  id: DesignDirectionId;
  name: string;
  essence: string;
  serifVar: string;
  sansVar: string;
  colors: {
    bg: string;
    surface: string;
    text: string;
    muted: string;
    /** Warm accent — primary buttons, links */
    accent: string;
    accentHover: string;
    /** Garden accent — eyebrows, labels, chips, quote rules */
    green: string;
    greenMuted: string;
    border: string;
    scrim: string;
    chip: string;
    chipText: string;
  };
  spacing: {
    sectionY: string;
    blockY: string;
    gutter: string;
  };
  hero: "split" | "immersive" | "grounded";
};

/**
 * Five directions — each pairs light salmon/blush warmth with meadow sage.
 * B & E lean blush on the page; D leads with green; A & C stay editorial linen.
 */
export const designDirections: DesignDirection[] = [
  {
    id: "a",
    name: "Meadow Editorial",
    essence:
      "Pale meadow cream and sage structure — salmon for warmth, green for quiet hierarchy. Typography leads.",
    serifVar: "var(--font-lab-cormorant)",
    sansVar: "var(--font-lab-dm)",
    colors: {
      bg: brand.cream,
      surface: brand.white,
      text: brand.bark,
      muted: "#75726c",
      accent: brand.salmon,
      accentHover: brand.salmonDark,
      green: brand.moss,
      greenMuted: brand.mossLight,
      border: brand.parchment,
      scrim: "rgba(58, 56, 52, 0.32)",
      chip: brand.mossLight,
      chipText: brand.mossDark,
    },
    spacing: { sectionY: "7rem", blockY: "2rem", gutter: "1.5rem" },
    hero: "split",
  },
  {
    id: "b",
    name: "Blush Botanica",
    essence:
      "Salmon-blush page wash with stem-green labels — romantic, field-grown, never saccharine.",
    serifVar: "var(--font-lab-fraunces)",
    sansVar: "var(--font-lab-karla)",
    colors: {
      bg: brand.meadowBlush,
      surface: "#fff7f4",
      text: "#3f3836",
      muted: "#857a75",
      accent: "#e8c4b8",
      accentHover: brand.salmonDark,
      green: "#7f9a85",
      greenMuted: "#e5efe7",
      border: "#e8ddd6",
      scrim: "rgba(62, 54, 50, 0.36)",
      chip: "#e8f0ea",
      chipText: brand.mossDark,
    },
    spacing: { sectionY: "6rem", blockY: "1.75rem", gutter: "1.25rem" },
    hero: "immersive",
  },
  {
    id: "c",
    name: "Linen & Laurel",
    essence:
      "Warm linen ground, laurel borders, dusty rose CTAs — countryside restraint with garden undertones.",
    serifVar: "var(--font-lab-libre)",
    sansVar: "var(--font-lab-work)",
    colors: {
      bg: brand.linen,
      surface: "#fbfaf7",
      text: brand.bark,
      muted: "#736e68",
      accent: "#e0b5aa",
      accentHover: brand.salmonDark,
      green: brand.moss,
      greenMuted: brand.mossMuted,
      border: "#e4e8e2",
      scrim: "rgba(54, 52, 48, 0.4)",
      chip: "#e6ede8",
      chipText: brand.mossDark,
    },
    spacing: { sectionY: "6.5rem", blockY: "2rem", gutter: "1.5rem" },
    hero: "grounded",
  },
  {
    id: "d",
    name: "Sage Proportion",
    essence:
      "Meadow-forward — sage leads buttons and borders, salmon softens chips and secondary warmth.",
    serifVar: "var(--font-lab-lora)",
    sansVar: "var(--font-lab-source)",
    colors: {
      bg: brand.meadow,
      surface: "#fafcf9",
      text: "#353834",
      muted: "#6b726c",
      accent: brand.moss,
      accentHover: brand.mossDark,
      green: brand.salmon,
      greenMuted: brand.salmonLight,
      border: brand.mossMuted,
      scrim: "rgba(48, 58, 52, 0.38)",
      chip: brand.salmonLight,
      chipText: "#a87d70",
    },
    spacing: { sectionY: "6.5rem", blockY: "2rem", gutter: "1.5rem" },
    hero: "split",
  },
  {
    id: "e",
    name: "Rose & Stem",
    essence:
      "Blush-rose fields behind every section — stem green on labels, salmon on action, editorial glow.",
    serifVar: "var(--font-lab-playfair)",
    sansVar: "var(--font-lab-nunito)",
    colors: {
      bg: brand.blushBg,
      surface: "#fdf7f4",
      text: "#403836",
      muted: "#857874",
      accent: "#ecc9be",
      accentHover: brand.salmon,
      green: "#7d9683",
      greenMuted: "#e6efe8",
      border: "#e6ddd6",
      scrim: "rgba(62, 54, 52, 0.35)",
      chip: "#e5efe7",
      chipText: brand.mossDark,
    },
    spacing: { sectionY: "6rem", blockY: "1.75rem", gutter: "1.25rem" },
    hero: "immersive",
  },
];

export const labCopy = {
  farmName: "Andrea Shirey",
  location: "Virginia",
  locationShort: "Virginia",
  tagline: "Editorial photography",
  product: {
    name: "Selected work",
    status: "Portfolio",
    description: "Observational images in light and place.",
  },
  quote: {
    text: "Quiet attention to the ordinary — distance, weather, and what remains in frame.",
    attribution: "Editorial note",
  },
};

export function isValidDirectionId(id: string): id is DesignDirectionId {
  return designDirections.some((d) => d.id === id);
}

export function getDirection(id: string): DesignDirection | undefined {
  return designDirections.find((d) => d.id === id);
}
