// middleware.ts — protects /dashboard and /api/reviews from public access
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
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
  matcher: ["/dashboard/:path*"],
};
