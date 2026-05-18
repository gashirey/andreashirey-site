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

export const designDirections: DesignDirection[] = [
  {
    id: "a",
    name: "Quiet Editorial",
    essence:
      "Airy, restrained, magazine-inspired — typography and whitespace lead.",
    serifVar: "var(--font-lab-cormorant)",
    sansVar: "var(--font-lab-dm)",
    colors: {
      bg: "#faf9f6",
      surface: "#ffffff",
      text: "#2a2826",
      muted: "#6f6a63",
      accent: "#5a6b52",
      accentHover: "#455240",
      border: "#e8e4dc",
      scrim: "rgba(42, 40, 38, 0.36)",
      chip: "#eef1eb",
      chipText: "#455240",
    },
    spacing: { sectionY: "7rem", blockY: "2rem", gutter: "1.5rem" },
    hero: "split",
  },
  {
    id: "b",
    name: "Romantic Botanical",
    essence:
      "Softer, warmer, immersive — artistic florals with emotional lushness.",
    serifVar: "var(--font-lab-fraunces)",
    sansVar: "var(--font-lab-karla)",
    colors: {
      bg: "#f7f3ef",
      surface: "#fffcfa",
      text: "#3d3430",
      muted: "#7a6f6a",
      accent: "#8b6e62",
      accentHover: "#735a50",
      border: "#ebe3dc",
      scrim: "rgba(61, 52, 48, 0.4)",
      chip: "#f3ebe6",
      chipText: "#5c4a42",
    },
    spacing: { sectionY: "6rem", blockY: "1.75rem", gutter: "1.25rem" },
    hero: "immersive",
  },
  {
    id: "c",
    name: "Refined Countryside",
    essence:
      "Grounded, tactile, understated luxury — authentic without rustic cliché.",
    serifVar: "var(--font-lab-libre)",
    sansVar: "var(--font-lab-work)",
    colors: {
      bg: "#f4f1eb",
      surface: "#f9f7f2",
      text: "#353129",
      muted: "#6b6358",
      accent: "#4f5d48",
      accentHover: "#3e4a38",
      border: "#ddd6ca",
      scrim: "rgba(53, 49, 41, 0.44)",
      chip: "#e8e6df",
      chipText: "#3e4a38",
    },
    spacing: { sectionY: "6.5rem", blockY: "2rem", gutter: "1.5rem" },
    hero: "grounded",
  },
];

export const labCopy = {
  farmName: "Grey Gables Farm",
  location: "Hudson Valley, New York",
  tagline: "Seasonal flowers, grown with care",
  product: {
    name: "Mixed Seasonal Bouquet",
    status: "Available this week",
    description:
      "Hand-tied stems gathered at peak — for the table, the porch, or someone you love.",
  },
  quote: {
    text: "The bouquets felt like they had just been carried in from the garden — unhurried, fragrant, and completely ours.",
    attribution: "Sarah M., Hudson Valley",
  },
};
