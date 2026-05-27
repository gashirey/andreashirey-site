export const HOME_HERO_SLIDE_INTERVAL_DEFAULT_MS = 7_000;
export const HOME_HERO_SLIDE_INTERVAL_MIN_MS = 5_000;
export const HOME_HERO_SLIDE_INTERVAL_MAX_MS = 20_000;

export function clampHeroSlideIntervalMs(value: unknown): number {
  const numericValue =
    typeof value === "number" ? value : Number.parseFloat(String(value));

  if (!Number.isFinite(numericValue)) {
    return HOME_HERO_SLIDE_INTERVAL_DEFAULT_MS;
  }

  return Math.min(
    HOME_HERO_SLIDE_INTERVAL_MAX_MS,
    Math.max(HOME_HERO_SLIDE_INTERVAL_MIN_MS, Math.round(numericValue)),
  );
}
