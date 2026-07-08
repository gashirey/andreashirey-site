import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/require";
import { clientGalleryPath } from "@/lib/client-gallery/token";
import { createServiceClient } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const { id } = await context.params;
  const body = (await request.json()) as {
    title?: string;
    is_published?: boolean;
    expires_at?: string | null;
  };

  const updates: Record<string, string | boolean | null> = {};

  if (typeof body.title === "string") {
    const title = body.title.trim();
    if (!title) {
      return NextResponse.json({ error: "title cannot be empty." }, { status: 400 });
    }
    updates.title = title;
  }

  if (typeof body.is_published === "boolean") {
    updates.is_published = body.is_published;
  }

  if (body.expires_at !== undefined) {
    updates.expires_at = body.expires_at;
  }

  if (!Object.keys(updates).length) {
    return NextResponse.json({ error: "No updates provided." }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("client_galleries")
    .update(updates)
    .eq("id", id)
    .select(
      "id, shoot_id, contact_id, title, share_token, is_published, expires_at, created_at",
    )
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  if (!data) {
    return NextResponse.json({ error: "Gallery not found." }, { status: 404 });
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
