import { NextResponse } from "next/server";
import {
  buildGalleryUnlockCookieValue,
  CLIENT_GALLERY_COOKIE,
  clientGalleryCookiePath,
  createGalleryUnlockToken,
  verifyGalleryPassword,
} from "@/lib/client-gallery/auth";
import { findPublishedGalleriesByName } from "@/lib/client-gallery/queries";

const GENERIC_ERROR = "Gallery name or password is incorrect.";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const record = body as Record<string, unknown>;
  const name = typeof record.name === "string" ? record.name : "";
  const password = typeof record.password === "string" ? record.password : "";

  if (!name.trim() || !password.trim()) {
    return NextResponse.json(
      { error: "Enter your gallery name and password." },
      { status: 400 },
    );
  }

  const galleries = await findPublishedGalleriesByName(name);
  const match = galleries.find(
    (gallery) =>
      Boolean(gallery.password_hash) &&
      verifyGalleryPassword(gallery.id, password, gallery.password_hash),
  );

  if (!match) {
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 401 });
  }

  const signature = await createGalleryUnlockToken(match.share_token);
  if (!signature) {
    return NextResponse.json(
      { error: "Gallery login is not configured." },
      { status: 503 },
    );
  }

  const response = NextResponse.json({
    ok: true,
    share_path: `/view/${match.share_token}`,
  });
  response.cookies.set(
    CLIENT_GALLERY_COOKIE,
    buildGalleryUnlockCookieValue(match.share_token, signature),
    {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: clientGalleryCookiePath(match.share_token),
      maxAge: 60 * 60 * 24 * 30,
    },
  );

  return response;
}
