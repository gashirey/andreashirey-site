import type { DesignDirectionId } from "@/lib/design-lab/directions";
import type { HeroFrame } from "@/lib/content";

export type HeroLayout = "standard" | "immersive";

/** Frozen homepage + theme config for team review */
export type SiteSnapshot = {
  id: string;
  label: string;
  createdAt: string;
  directionId: DesignDirectionId;
  home: {
    heroFrame: HeroFrame;
    heroLayout: HeroLayout;
  };
  notes?: string;
};
