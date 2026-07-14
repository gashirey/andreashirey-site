export type MediaShoot = {
  id: string;
  name: string;
  shot_on: string | null;
  created_at: string;
};

export type MediaAsset = {
  id: string;
  shoot_id: string | null;
  storage_path: string;
  public_url: string;
  filename: string;
  alt_text: string | null;
  in_gallery: boolean;
  created_at: string;
};
