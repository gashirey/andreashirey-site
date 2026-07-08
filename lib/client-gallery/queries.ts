import type { GalleryImage } from "@/lib/content";
import type { ClientGallery, ClientGalleryView } from "@/lib/client-gallery/types";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServiceClient } from "@/lib/supabase/server";

type ClientGalleryRow = ClientGallery & {
  media_shoots:
    | { name: string; shot_on: string | null }
    | { name: string; shot_on: string | null }[]
    | null;
};

function readShootMeta(
  value: ClientGalleryRow["media_shoots"],
): { name: string; shot_on: string | null } | null {
  if (!value) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

type MediaAssetRow = {
  id: string;
  public_url: string;
  filename: string;
  alt_text: string | null;
};

function isGalleryAccessible(gallery: ClientGallery): boolean {
  if (!gallery.is_published) return false;
  if (!gallery.expires_at) return true;
  return new Date(gallery.expires_at).getTime() > Date.now();
}

function assetToGalleryImage(asset: MediaAssetRow): GalleryImage {
  return {
    id: asset.id,
    src: asset.public_url,
    alt:
      asset.alt_text?.trim() ||
      asset.filename.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "),
  };
}

export async function getClientGalleryView(
  token: string,
): Promise<ClientGalleryView | null> {
  const trimmed = token.trim();
  if (!trimmed || !isSupabaseConfigured()) return null;

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("client_galleries")
    .select(
      "id, shoot_id, contact_id, title, share_token, is_published, expires_at, created_at, media_shoots (name, shot_on)",
    )
    .eq("share_token", trimmed)
    .maybeSingle();

  if (error) {
    console.error("[getClientGalleryView]", error);
    return null;
  }

  if (!data) return null;

  const row = data as ClientGalleryRow;
  const shootMeta = readShootMeta(row.media_shoots);
  const gallery: ClientGallery = {
    id: row.id,
    shoot_id: row.shoot_id,
    contact_id: row.contact_id,
    title: row.title,
    share_token: row.share_token,
    is_published: row.is_published,
    expires_at: row.expires_at,
    created_at: row.created_at,
  };

  if (!isGalleryAccessible(gallery)) return null;

  const { data: assets, error: assetsError } = await supabase
    .from("media_assets")
    .select("id, public_url, filename, alt_text")
    .eq("shoot_id", gallery.shoot_id)
    .order("created_at", { ascending: true });

  if (assetsError) {
    console.error("[getClientGalleryView assets]", assetsError);
    return null;
  }

  const images = ((assets ?? []) as MediaAssetRow[])
    .filter((asset) => asset.public_url)
    .map(assetToGalleryImage);

  return {
    gallery,
    shootName: shootMeta?.name ?? gallery.title,
    shotOn: shootMeta?.shot_on ?? null,
    images,
  };
}

export async function listClientGalleriesForShoot(
  shootId: string,
): Promise<ClientGallery[]> {
  if (!shootId || !isSupabaseConfigured()) return [];

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("client_galleries")
    .select(
      "id, shoot_id, contact_id, title, share_token, is_published, expires_at, created_at",
    )
    .eq("shoot_id", shootId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[listClientGalleriesForShoot]", error);
    return [];
  }

  return (data ?? []) as ClientGallery[];
}
