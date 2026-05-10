// middleware.ts — Clerk auth + CVE-2025-29927 mitigation
// NOTE: middleware is NOT a security boundary on its own.
// All API routes have their own auth checks (defence in depth).
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/onboarding(.*)",
  "/connect(.*)",
]);

export default clerkMiddleware(
  async (auth, req: NextRequest) => {
    // CVE-2025-29927 mitigation — strip the internal Next.js subrequest header
    // if it arrives from outside. Attackers used this header to bypass middleware.
    const subrequest = req.headers.get("x-middleware-subrequest");
    if (subrequest) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (isProtectedRoute(req)) {
      await auth.protect();
    }
  },
  { contentSecurityPolicy: {} }
);

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
