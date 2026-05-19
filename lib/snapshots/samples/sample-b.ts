import type { SiteSnapshot } from "../types";

/** First production baseline — direction B adopted for live homepage */
export const sampleB: SiteSnapshot = {
  id: "sample-b",
  label: "Blush Botanica — production baseline",
  createdAt: "2026-05-18",
  directionId: "b",
  home: {
    heroFrame: "bleed",
    heroLayout: "immersive",
  },
  notes:
    "Salmon-blush page wash, Fraunces + Karla, immersive full-bleed hero slider, direction B.",
};
