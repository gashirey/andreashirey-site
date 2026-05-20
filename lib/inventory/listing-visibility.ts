import { todayFarmDate } from "./date";
import type { AvailabilityWithProduct } from "./types";

/** Why a listing row does not appear on the public Available Now page */
export function publicVisibilityIssue(
  row: AvailabilityWithProduct,
  date: string = todayFarmDate(),
): string | null {
  const product = row.product;
  if (!product) return "Missing product";
  if (!product.is_active) return "Product is inactive in catalog";
  if (row.available_date !== date) return "Different date";
  if (!row.show_on_website) return "“Show on site” is off";
  if (row.status === "hidden") return "Status is hidden";
  if (row.status === "sold_out") return "Status is sold out";
  if (row.status !== "available" && row.status !== "limited") {
    return `Status is ${row.status}`;
  }
  return null;
}

export function isPubliclyVisible(
  row: AvailabilityWithProduct,
  date: string = todayFarmDate(),
): boolean {
  return publicVisibilityIssue(row, date) === null;
}
