import type { CSSProperties } from "react";
import type { DesignDirectionId } from "@/lib/design-lab/directions";
import { getDirection } from "@/lib/design-lab/directions";
import type { HeroFrame } from "@/lib/content";

/** Active production visual direction — change when pivoting homepage look */
export const activeDirectionId: DesignDirectionId = "b";

export const activeDirection = getDirection(activeDirectionId)!;

/** Production homepage hero — matches direction B (immersive full bleed) */
export const activeHeroLayout = "immersive" as const;
export const activeHeroFrame: HeroFrame = "bleed";

export function directionToSiteCssVars(
  d: NonNullable<ReturnType<typeof getDirection>>,
): CSSProperties {
  return {
    "--site-bg": d.colors.bg,
    "--site-surface": d.colors.surface,
    "--site-text": d.colors.text,
    "--site-muted": d.colors.muted,
    "--site-accent": d.colors.accent,
    "--site-accent-hover": d.colors.accentHover,
    "--site-green": d.colors.green,
    "--site-green-muted": d.colors.greenMuted,
    "--site-border": d.colors.border,
    "--site-scrim": d.colors.scrim,
    "--site-chip": d.colors.chip,
    "--site-chip-text": d.colors.chipText,
    "--font-serif": d.serifVar,
    "--font-sans": d.sansVar,
    "--site-section-y": d.spacing.sectionY,
  } as CSSProperties;
}

export const siteThemeStyle = directionToSiteCssVars(activeDirection);
