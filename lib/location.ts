import { site } from "./content";

export function formatFarmAddress(): string {
  const { street, city, state } = site.address;
  return `${street}, ${city}, ${state}`;
}

export function googleMapsUrl(): string {
  const query = encodeURIComponent(formatFarmAddress());
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}
