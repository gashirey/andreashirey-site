import type { GalleryImage } from "@/lib/content";

export type ClientGallery = {
  id: string;
  shoot_id: string;
  contact_id: string | null;
  title: string;
  share_token: string;
  is_published: boolean;
  expires_at: string | null;
  created_at: string;
};

export type ClientGalleryView = {
  gallery: ClientGallery;
  shootName: string;
  shotOn: string | null;
  images: GalleryImage[];
};
