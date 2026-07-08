import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/require";
import { hashGalleryPassword } from "@/lib/client-gallery/auth";
import { listClientGalleriesForShoot } from "@/lib/client-gallery/queries";
import { clientGalleryPath, createShareToken } from "@/lib/client-gallery/token";
import { createServiceClient } from "@/lib/supabase/server";

function normalizePasswordInput(value: unknown): string | null | undefined {
  if (value === undefined) return undefined;
  if (value === null) return null;
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed || null;
}

function validatePassword(value: string | null | undefined): string | null {
  if (value === undefined || value === null) return null;
  if (value.length < 4) {
    return "Password must be at least 4 characters.";
  }
  return null;
}

function serializeGallery(
  gallery: Awaited<ReturnType<typeof listClientGalleriesForShoot>>[number],
  origin: string,
) {
  const sharePath = clientGalleryPath(gallery.share_token);
  return {
    ...gallery,
    share_path: sharePath,
    share_url: `${origin}${sharePath}`,
  };
}

export async function GET(request: Request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const { searchParams } = new URL(request.url);
  const shootId = searchParams.get("shoot_id")?.trim();

  if (!shootId) {
    return NextResponse.json(
      { error: "shoot_id query parameter is required." },
      { status: 400 },
    );
  }

  const galleries = await listClientGalleriesForShoot(shootId);
  const origin = new URL(request.url).origin;

  return NextResponse.json({
    galleries: galleries.map((gallery) => serializeGallery(gallery, origin)),
  });
}

export async function POST(request: Request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const body = (await request.json()) as {
    shoot_id?: string;
    title?: string;
    contact_id?: string | null;
    is_published?: boolean;
    password?: string | null;
  };

  const shootId = body.shoot_id?.trim();
  const title = body.title?.trim();
  const password = normalizePasswordInput(body.password);

  if (!shootId) {
    return NextResponse.json({ error: "shoot_id is required." }, { status: 400 });
  }
  if (!title) {
    return NextResponse.json({ error: "title is required." }, { status: 400 });
  }

  const passwordError = validatePassword(password);
  if (passwordError) {
    return NextResponse.json({ error: passwordError }, { status: 400 });
  }

  const supabase = createServiceClient();

  const { data: shoot, error: shootError } = await supabase
    .from("media_shoots")
    .select("id, name")
    .eq("id", shootId)
    .maybeSingle();

  if (shootError) {
    return NextResponse.json({ error: shootError.message }, { status: 400 });
  }
  if (!shoot) {
    return NextResponse.json({ error: "Shoot not found." }, { status: 404 });
  }

  const shareToken = createShareToken();
  const galleryId = crypto.randomUUID();
  const passwordHash =
    password && hashGalleryPassword(galleryId, password);

  if (password && !passwordHash) {
    return NextResponse.json(
      { error: "Gallery passwords are not configured." },
      { status: 503 },
    );
  }

  const { data, error } = await supabase
    .from("client_galleries")
    .insert({
      id: galleryId,
      shoot_id: shootId,
      contact_id: body.contact_id ?? null,
      title,
      share_token: shareToken,
      is_published: body.is_published ?? true,
      password_hash: passwordHash,
    })
    .select(
      "id, shoot_id, contact_id, title, share_token, is_published, expires_at, created_at, password_hash",
    )
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const origin = new URL(request.url).origin;

  return NextResponse.json({
    gallery: serializeGallery(
      {
        ...data,
        has_password: Boolean(data.password_hash),
      },
      origin,
    ),
  });
}
