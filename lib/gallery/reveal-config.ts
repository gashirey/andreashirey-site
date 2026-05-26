/**
 * Masonry gallery scroll-reveal — tune pacing here.
 *
 * durationMs / staggerMs: higher = slower, more editorial
 * translateY: initial upward offset (px)
 * viewportAmount: how much of the tile must enter view (0–1)
 */
import type { CSSProperties } from "react";

export const galleryRevealConfig = {
  viewportAmount: 0.15,
  once: true,
  translateY: 24,
  durationMs: 1100,
  staggerMs: 110,
  staggerCycle: 8,
  easing: "cubic-bezier(0.22, 1, 0.36, 1)",
} as const;

export type GalleryRevealConfig = typeof galleryRevealConfig;

export function staggerDelayForIndex(
  index: number,
  config: GalleryRevealConfig = galleryRevealConfig,
) {
  return `${(index % config.staggerCycle) * config.staggerMs}ms`;
}

export function galleryRevealCssVars(
  config: GalleryRevealConfig = galleryRevealConfig,
): CSSProperties {
  return {
    "--gallery-reveal-y": `${config.translateY}px`,
    "--gallery-reveal-duration": `${config.durationMs}ms`,
    "--gallery-reveal-easing": config.easing,
  } as CSSProperties;
}
