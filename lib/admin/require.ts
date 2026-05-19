import { NextResponse } from "next/server";
import { verifyAdminSessionToken } from "./auth";

function readAdminCookie(request: Request): string | undefined {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return undefined;
  const match = cookieHeader.match(/(?:^|;\s*)ggf_admin=([^;]*)/);
  return match?.[1] ? decodeURIComponent(match[1]) : undefined;
}

export async function requireAdmin(
  request: Request,
): Promise<NextResponse | null> {
  const token = readAdminCookie(request);
  if (!(await verifyAdminSessionToken(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
