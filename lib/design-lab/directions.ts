import { brand } from "@/lib/brand";

export type DesignDirectionId = "a" | "b" | "c";

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
    accent: string;
    accentHover: string;
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

/** Salmon-forward palettes — three expressions of the same brand warmth */
export const designDirections: DesignDirection[] = [
  {
    id: "a",
    name: "Quiet Editorial",
    essence:
      "Airy and restrained — pale shell and blush, typography and whitespace lead.",
    serifVar: "var(--font-lab-cormorant)",
    sansVar: "var(--font-lab-dm)",
    colors: {
      bg: "#faf6f4",
      surface: "#fffcfb",
      text: "#3f3834",
      muted: "#7a716c",
      accent: "#d4a094",
      accentHover: "#c08272",
      border: "#efe6e2",
      scrim: "rgba(63, 56, 52, 0.34)",
      chip: "#f5ebe7",
      chipText: "#a06b5c",
    },
    spacing: { sectionY: "7rem", blockY: "2rem", gutter: "1.5rem" },
    hero: "split",
  },
  {
    id: "b",
    name: "Romantic Botanical",
    essence:
      "Softer salmon wash — immersive florals, emotionally lush without sweetness overload.",
    serifVar: "var(--font-lab-fraunces)",
    sansVar: "var(--font-lab-karla)",
    colors: {
      bg: "#f9f0ed",
      surface: "#fff9f7",
      text: "#423936",
      muted: "#8a7872",
      accent: "#d9a89a",
      accentHover: "#c4897a",
      border: "#eddcd6",
      scrim: "rgba(66, 57, 54, 0.38)",
      chip: "#f3e0d9",
      chipText: "#9a6356",
    },
    spacing: { sectionY: "6rem", blockY: "1.75rem", gutter: "1.25rem" },
    hero: "immersive",
  },
  {
    id: "c",
    name: "Refined Countryside",
    essence:
      "Dusty rose and linen — grounded Central Virginia elegance, tactile and authentic.",
    serifVar: "var(--font-lab-libre)",
    sansVar: "var(--font-lab-work)",
    colors: {
      bg: "#f6f1ee",
      surface: "#faf7f5",
      text: "#3a3430",
      muted: "#736a64",
      accent: "#c99588",
      accentHover: "#b07d6f",
      border: "#e5d8d2",
      scrim: "rgba(58, 52, 48, 0.42)",
      chip: "#ede4df",
      chipText: "#8f5f52",
    },
    spacing: { sectionY: "6.5rem", blockY: "2rem", gutter: "1.5rem" },
    hero: "grounded",
  },
];

export const labCopy = {
  farmName: "Grey Gables Farm",
  location: "Louisa, Virginia",
  locationShort: "Central Virginia",
  tagline: "Seasonal flowers, grown with care",
  product: {
    name: "Mixed Seasonal Bouquet",
    status: "Available this week",
    description:
      "Hand-tied stems gathered at peak — for the table, the porch, or someone you love.",
  },
  quote: {
    text: "The bouquets felt like they had just been carried in from the garden — unhurried, fragrant, and completely ours.",
    attribution: "Sarah M., Louisa County",
  },
};

export function isValidDirectionId(id: string): id is DesignDirectionId {
  return id === "a" || id === "b" || id === "c";
}

export function getDirection(id: string): DesignDirection | undefined {
  return designDirections.find((d) => d.id === id);
}
