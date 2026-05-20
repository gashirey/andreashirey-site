export function clampFocal(value: number | null | undefined): number {
  if (value == null || Number.isNaN(value)) return 50;
  return Math.min(100, Math.max(0, value));
}

export function focalObjectPosition(
  focalX?: number | null,
  focalY?: number | null,
): string {
  const x = clampFocal(focalX);
  const y = clampFocal(focalY);
  return `${x}% ${y}%`;
}
