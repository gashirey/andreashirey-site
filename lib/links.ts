/**
 * External links — update these when Rooted Farmers / Shopify go live.
 */
export const links = {
  /** Rooted Farmers shop URL — set when live */
  rootedFarmers: "" as string,
  /** Future Shopify store */
  shopify: "" as string,
} as const;

export function getRootedFarmersHref(): string {
  return links.rootedFarmers || "/flowers";
}
