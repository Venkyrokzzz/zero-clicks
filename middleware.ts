// middleware.ts — protects /dashboard from public access
// NOTE: middleware is NOT a security boundary on its own.
// All API routes have their own auth checks (defence in depth).
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  // CVE-2025-29927 mitigation — strip the internal Next.js subrequest header
  // if it arrives from outside. Attackers used this header to bypass middleware.
  const subrequest = req.headers.get("x-middleware-subrequest");
  if (subrequest) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { pathname } = req.nextUrl;

  // Protect the dashboard UI — redirect to home if no valid cookie
  if (pathname.startsWith("/dashboard")) {
    const auth = req.cookies.get("dashboard-auth")?.value;
    if (!process.env.DASHBOARD_SECRET || auth !== process.env.DASHBOARD_SECRET) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/((?!_next/static|_next/image|favicon.ico).*)"],
};
