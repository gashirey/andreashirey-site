import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/require";
import { hashGalleryPassword } from "@/lib/client-gallery/auth";
import { clientGalleryPath } from "@/lib/client-gallery/token";
import { createServiceClient } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{ id: string }>;
};

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

export async function PATCH(request: Request, context: RouteContext) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const { id } = await context.params;
  const body = (await request.json()) as {
    title?: string;
    is_published?: boolean;
    expires_at?: string | null;
    password?: string | null;
  };

  const updates: Record<string, string | boolean | null> = {};
  const password = normalizePasswordInput(body.password);

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

  if (password !== undefined) {
    const passwordError = validatePassword(password);
    if (passwordError) {
      return NextResponse.json({ error: passwordError }, { status: 400 });
    }

    if (password === null) {
      updates.password_hash = null;
    } else {
      const passwordHash = hashGalleryPassword(id, password);
      if (!passwordHash) {
        return NextResponse.json(
          { error: "Gallery passwords are not configured." },
          { status: 503 },
        );
      }
      updates.password_hash = passwordHash;
    }
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
      "id, shoot_id, contact_id, title, share_token, is_published, expires_at, created_at, password_hash",
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
      has_password: Boolean(data.password_hash),
      share_path: sharePath,
      share_url: `${origin}${sharePath}`,
    },
  });
}
