import {
  activeDirectionId,
  activeHeroFrame,
  activeHeroLayout,
} from "@/lib/site-theme";

import type { SiteSnapshot } from "./types";

/** Current production homepage configuration (not frozen) */
export function getLiveSiteConfig(): Omit<SiteSnapshot, "id" | "label" | "createdAt"> {
  return {
    directionId: activeDirectionId,
    home: {
      heroFrame: activeHeroFrame,
      heroLayout: activeHeroLayout,
    },
  };
}
