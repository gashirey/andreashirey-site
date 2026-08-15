import type { DigitalPackageId } from "@/lib/client-gallery/packages";

export type ClientGalleryOrderStatus =
  | "submitted"
  | "confirmed"
  | "fulfilled"
  | "cancelled";

export type ClientGalleryOrder = {
  id: string;
  gallery_id: string;
  package_id: DigitalPackageId;
  package_label: string;
  photo_count: number;
  price_cents: number;
  asset_ids: string[];
  client_name: string;
  client_email: string;
  notes: string | null;
  status: ClientGalleryOrderStatus;
  created_at: string;
  updated_at: string;
};

export type ClientGalleryOrderInput = {
  packageId: DigitalPackageId;
  assetIds: string[];
  clientName: string;
  clientEmail: string;
  notes?: string;
};
