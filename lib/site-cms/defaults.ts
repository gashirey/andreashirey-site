import {
  activeDirectionId,
  activeHeroFrame,
  activeHeroLayout,
} from "@/lib/site-theme";
import { HOME_HERO_SLIDE_INTERVAL_DEFAULT_MS } from "./hero-slider";
import type { SiteSettingsRow } from "./types";

export const DEFAULT_SITE_SETTINGS: SiteSettingsRow = {
  id: "default",
  direction_id: activeDirectionId,
  hero_layout: activeHeroLayout,
  hero_frame: activeHeroFrame,
  hero_slide_interval_ms: HOME_HERO_SLIDE_INTERVAL_DEFAULT_MS,
  color_overrides: {},
  content_overrides: {},
  typography_overrides: {},
  updated_at: new Date().toISOString(),
};
