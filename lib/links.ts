/**
 * External links — update when Rooted Farmers goes live.
 */
export const links = {
  rootedFarmers: "" as string,
  shopify: "" as string,
} as const;

export function getRootedFarmersHref(): string {
  return links.rootedFarmers || "/available-now";
}
