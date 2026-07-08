import type { GalleryImage } from "@/lib/content";
import { isClientGalleryUnlocked } from "@/lib/client-gallery/auth";
import type {
  ClientGallery,
  ClientGalleryPageState,
  ClientGalleryView,
} from "@/lib/client-gallery/types";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServiceClient } from "@/lib/supabase/server";

type ClientGalleryRow = {
  id: string;
  shoot_id: string;
  contact_id: string | null;
  title: string;
  share_token: string;
  is_published: boolean;
  expires_at: string | null;
  created_at: string;
  password_hash: string | null;
  media_shoots:
    | { name: string; shot_on: string | null }
    | { name: string; shot_on: string | null }[]
    | null;
};

type MediaAssetRow = {
  id: string;
  public_url: string;
  filename: string;
  alt_text: string | null;
};

const GALLERY_SELECT =
  "id, shoot_id, contact_id, title, share_token, is_published, expires_at, created_at, password_hash, media_shoots (name, shot_on)";

function readShootMeta(
  value: ClientGalleryRow["media_shoots"],
): { name: string; shot_on: string | null } | null {
  if (!value) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

function toClientGallery(row: ClientGalleryRow): ClientGallery {
  return {
    id: row.id,
    shoot_id: row.shoot_id,
    contact_id: row.contact_id,
    title: row.title,
    share_token: row.share_token,
    is_published: row.is_published,
    expires_at: row.expires_at,
    created_at: row.created_at,
    has_password: Boolean(row.password_hash),
  };
}

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

async function fetchGalleryImages(shootId: string): Promise<GalleryImage[]> {
  const supabase = createServiceClient();
  const { data: assets, error: assetsError } = await supabase
    .from("media_assets")
    .select("id, public_url, filename, alt_text")
    .eq("shoot_id", shootId)
    .order("created_at", { ascending: true });

  if (assetsError) {
    console.error("[fetchGalleryImages]", assetsError);
    return [];
  }

  return ((assets ?? []) as MediaAssetRow[])
    .filter((asset) => asset.public_url)
    .map(assetToGalleryImage);
}

async function fetchGalleryRow(token: string): Promise<ClientGalleryRow | null> {
  if (!token.trim() || !isSupabaseConfigured()) return null;

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("client_galleries")
    .select(GALLERY_SELECT)
    .eq("share_token", token.trim())
    .maybeSingle();

  if (error) {
    console.error("[fetchGalleryRow]", error);
    return null;
  }

  return (data as ClientGalleryRow | null) ?? null;
}

export async function getClientGalleryPageState(
  token: string,
): Promise<ClientGalleryPageState> {
  const row = await fetchGalleryRow(token);
  if (!row) return { status: "not_found" };

  const gallery = toClientGallery(row);
  if (!isGalleryAccessible(gallery)) return { status: "not_found" };

  const shootMeta = readShootMeta(row.media_shoots);
  const shootName = shootMeta?.name ?? gallery.title;

  if (gallery.has_password && !(await isClientGalleryUnlocked(gallery.share_token))) {
    return {
      status: "locked",
      view: { gallery, shootName },
    };
  }

  const images = await fetchGalleryImages(gallery.shoot_id);

  return {
    status: "ready",
    view: {
      gallery,
      shootName,
      shotOn: shootMeta?.shot_on ?? null,
      images,
    },
  };
}

export async function getClientGalleryView(
  token: string,
): Promise<ClientGalleryView | null> {
  const state = await getClientGalleryPageState(token);
  return state.status === "ready" ? state.view : null;
}

export async function getClientGalleryForUnlock(
  token: string,
): Promise<{ id: string; share_token: string; password_hash: string | null } | null> {
  const row = await fetchGalleryRow(token);
  if (!row) return null;

  const gallery = toClientGallery(row);
  if (!isGalleryAccessible(gallery)) return null;

  return {
    id: row.id,
    share_token: row.share_token,
    password_hash: row.password_hash,
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
      "id, shoot_id, contact_id, title, share_token, is_published, expires_at, created_at, password_hash",
    )
    .eq("shoot_id", shootId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[listClientGalleriesForShoot]", error);
    return [];
  }

  return ((data ?? []) as Omit<ClientGalleryRow, "media_shoots">[]).map((row) =>
    toClientGallery({ ...row, media_shoots: null }),
  );
}
