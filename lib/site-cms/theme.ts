import type { CSSProperties } from "react";
import {
  getDirection,
  type DesignDirection,
  type DesignDirectionId,
} from "@/lib/design-lab/directions";
import { directionToSiteCssVars } from "@/lib/site-theme";
import type { SiteColorOverrides } from "./types";

export function buildSiteThemeStyle(
  directionId: DesignDirectionId,
  colorOverrides: SiteColorOverrides = {},
): CSSProperties {
  const base = getDirection(directionId) ?? getDirection("b")!;
  const merged: DesignDirection = {
    ...base,
    colors: { ...base.colors, ...colorOverrides },
  };
  return directionToSiteCssVars(merged);
}
