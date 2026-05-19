import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  createAdminSessionToken,
  isAdminConfigured,
  verifyAdminPassword,
} from "@/lib/admin/auth";

export async function POST(request: Request) {
  if (!isAdminConfigured()) {
    return NextResponse.json(
      { error: "Admin is not configured. Set ADMIN_PASSWORD." },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const password =
    typeof (body as Record<string, unknown>).password === "string"
      ? (body as Record<string, unknown>).password
      : "";

  if (!verifyAdminPassword(password as string)) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, await createAdminSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
  return response;
}
