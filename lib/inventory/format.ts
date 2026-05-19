import type { AvailabilityStatus } from "./types";
import { todayFarmDate } from "./date";

export function formatPricePerBunch(price: number): string {
  return `$${price.toFixed(price % 1 === 0 ? 0 : 2)} / bunch`;
}

export function formatStemsPerBunch(stems: number): string {
  return `${stems} stem${stems === 1 ? "" : "s"} per bunch`;
}

export function formatBunchesAvailable(count: number): string {
  if (count === 0) return "Sold out";
  return `${count} bunch${count === 1 ? "" : "es"} available`;
}

export function formatHarvestLabel(harvestDate: string | null): string | null {
  if (!harvestDate) return null;
  if (harvestDate === todayFarmDate()) return "Fresh cut today";
  return `Harvested ${harvestDate}`;
}

export const statusLabels: Record<AvailabilityStatus, string> = {
  available: "Available now",
  limited: "Limited availability",
  sold_out: "Sold out",
  hidden: "Hidden",
};

export const statusChipStyles: Record<
  "available" | "limited",
  string
> = {
  available: "bg-salmon-light text-salmon-dark",
  limited: "bg-parchment text-bark",
};
