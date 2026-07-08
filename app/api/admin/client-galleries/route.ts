import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/require";
import { listClientGalleriesForShoot } from "@/lib/client-gallery/queries";
import { clientGalleryPath, createShareToken } from "@/lib/client-gallery/token";
import { createServiceClient } from "@/lib/supabase/server";

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
    galleries: galleries.map((gallery) => ({
      ...gallery,
      share_path: clientGalleryPath(gallery.share_token),
      share_url: `${origin}${clientGalleryPath(gallery.share_token)}`,
    })),
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
  };

  const shootId = body.shoot_id?.trim();
  const title = body.title?.trim();

  if (!shootId) {
    return NextResponse.json({ error: "shoot_id is required." }, { status: 400 });
  }
  if (!title) {
    return NextResponse.json({ error: "title is required." }, { status: 400 });
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
  const { data, error } = await supabase
    .from("client_galleries")
    .insert({
      shoot_id: shootId,
      contact_id: body.contact_id ?? null,
      title,
      share_token: shareToken,
      is_published: body.is_published ?? true,
    })
    .select(
      "id, shoot_id, contact_id, title, share_token, is_published, expires_at, created_at",
    )
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const origin = new URL(request.url).origin;
  const sharePath = clientGalleryPath(data.share_token);

  return NextResponse.json({
    gallery: {
      ...data,
      share_path: sharePath,
      share_url: `${origin}${sharePath}`,
    },
  });
}
