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
  "/admin(.*)",
]);

const isAuthRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

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

    // Admin routes: require role === 'admin' in Clerk publicMetadata
    if (isAdminRoute(req)) {
      const { sessionClaims } = await auth();
      const role = (sessionClaims?.metadata as Record<string, string> | undefined)?.role;
      if (role !== 'admin') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    }

    // Smart post-login routing: after sign-in/sign-up, send admin to /admin, clients to /dashboard
    if (isAuthRoute(req)) {
      const { sessionClaims, userId } = await auth();
      if (userId) {
        const role = (sessionClaims?.metadata as Record<string, string> | undefined)?.role;
        const dest = role === 'admin' ? '/admin' : '/dashboard';
        return NextResponse.redirect(new URL(dest, req.url));
      }
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
