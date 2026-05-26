import { site } from "./content";

export function formatLocationLine(): string {
  const { city, state } = site.address;
  if (city && state) return `${city}, ${state}`;
  if (state) return state;
  return site.location;
}

export function googleMapsUrl(): string | null {
  const { street, city, state } = site.address;
  if (!street?.trim()) return null;
  const query = encodeURIComponent(`${street}, ${city}, ${state}`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

/** @deprecated Use formatLocationLine */
export function formatFarmAddress(): string {
  return formatLocationLine();
}
