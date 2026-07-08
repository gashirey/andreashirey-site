import { NextResponse } from "next/server";
import {
  buildGalleryUnlockCookieValue,
  CLIENT_GALLERY_COOKIE,
  clientGalleryCookiePath,
  createGalleryUnlockToken,
  verifyGalleryPassword,
} from "@/lib/client-gallery/auth";
import { getClientGalleryForUnlock } from "@/lib/client-gallery/queries";

type RouteContext = {
  params: Promise<{ token: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  const { token } = await context.params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const password =
    typeof (body as Record<string, unknown>).password === "string"
      ? ((body as Record<string, unknown>).password as string)
      : "";

  if (!password.trim()) {
    return NextResponse.json({ error: "Password is required." }, { status: 400 });
  }

  const gallery = await getClientGalleryForUnlock(token);
  if (!gallery) {
    return NextResponse.json({ error: "Gallery unavailable." }, { status: 404 });
  }

  if (!gallery.password_hash) {
    return NextResponse.json({ ok: true });
  }

  if (!verifyGalleryPassword(gallery.id, password, gallery.password_hash)) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  const signature = await createGalleryUnlockToken(gallery.share_token);
  if (!signature) {
    return NextResponse.json(
      { error: "Gallery unlock is not configured." },
      { status: 503 },
    );
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(
    CLIENT_GALLERY_COOKIE,
    buildGalleryUnlockCookieValue(gallery.share_token, signature),
    {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: clientGalleryCookiePath(gallery.share_token),
      maxAge: 60 * 60 * 24 * 30,
    },
  );

  return response;
}
