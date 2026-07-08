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
  has_password: boolean;
};

export type ClientGalleryView = {
  gallery: ClientGallery;
  shootName: string;
  shotOn: string | null;
  images: GalleryImage[];
};

export type ClientGalleryLockedView = {
  gallery: ClientGallery;
  shootName: string;
};

export type ClientGalleryPageState =
  | { status: "not_found" }
  | { status: "locked"; view: ClientGalleryLockedView }
  | { status: "ready"; view: ClientGalleryView };
