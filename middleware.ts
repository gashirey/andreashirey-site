import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAdminSessionToken } from "@/lib/admin/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const token = request.cookies.get("ggf_admin")?.value;
    if (!(await verifyAdminSessionToken(token))) {
      const login = new URL("/admin/login", request.url);
      login.searchParams.set("next", pathname);
      return NextResponse.redirect(login);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
