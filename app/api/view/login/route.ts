import { NextResponse } from "next/server";
import {
  buildGalleryUnlockCookieValue,
  CLIENT_GALLERY_COOKIE,
  clientGalleryCookiePath,
  createGalleryUnlockToken,
  verifyGalleryPassword,
} from "@/lib/client-gallery/auth";
import { findPublishedGalleriesWithPassword } from "@/lib/client-gallery/queries";

const GENERIC_ERROR = "Password is incorrect.";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const record = body as Record<string, unknown>;
  const password = typeof record.password === "string" ? record.password : "";

  if (!password.trim()) {
    return NextResponse.json(
      { error: "Enter your password." },
      { status: 400 },
    );
  }

  const galleries = await findPublishedGalleriesWithPassword();
  const matches = galleries.filter((gallery) =>
    verifyGalleryPassword(gallery.id, password, gallery.password_hash),
  );

  if (matches.length !== 1) {
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 401 });
  }

  const match = matches[0]!;

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
