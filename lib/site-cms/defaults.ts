import {
  activeDirectionId,
  activeHeroFrame,
  activeHeroLayout,
} from "@/lib/site-theme";
import type { SiteSettingsRow } from "./types";

export const DEFAULT_SITE_SETTINGS: SiteSettingsRow = {
  id: "default",
  direction_id: activeDirectionId,
  hero_layout: activeHeroLayout,
  hero_frame: activeHeroFrame,
  color_overrides: {},
  content_overrides: {},
  typography_overrides: {},
  updated_at: new Date().toISOString(),
};
