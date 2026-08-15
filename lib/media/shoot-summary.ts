import type { MediaShoot } from "@/lib/media/types";

export type MediaShootSummary = MediaShoot & {
  asset_count: number;
  in_gallery_count: number;
  client_gallery_count: number;
};
