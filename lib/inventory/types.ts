export type AvailabilityStatus =
  | "available"
  | "limited"
  | "sold_out"
  | "hidden";

export type FarmProduct = {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string | null;
  variety: string | null;
  color: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type FarmProductAvailability = {
  id: string;
  product_id: string;
  available_date: string;
  status: AvailabilityStatus;
  bunch_price: number;
  stems_per_bunch: number;
  bunches_available: number;
  harvest_date: string | null;
  notes: string | null;
  display_order: number;
  show_on_website: boolean;
  created_at: string;
  updated_at: string;
};

export type FarmProductPhoto = {
  id: string;
  product_id: string;
  availability_id: string | null;
  image_url: string;
  alt_text: string | null;
  is_primary: boolean;
  display_order: number;
  created_at: string;
};

export type AvailableNowItem = {
  availabilityId: string;
  productId: string;
  name: string;
  slug: string;
  category: string;
  description: string | null;
  variety: string | null;
  color: string | null;
  status: AvailabilityStatus;
  bunchPrice: number;
  stemsPerBunch: number;
  bunchesAvailable: number;
  harvestDate: string | null;
  notes: string | null;
  displayOrder: number;
  imageUrl: string;
  imageAlt: string;
};

export type AvailabilityWithProduct = FarmProductAvailability & {
  product: FarmProduct;
};
