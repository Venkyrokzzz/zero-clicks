// middleware.ts — Clerk auth + CVE-2025-29927 mitigation
// NOTE: middleware is NOT a security boundary on its own.
// All API routes have their own auth checks (defence in depth).
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isWorkspaceOwner, workspaceHome } from "@/lib/workspaceAccess";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/onboarding(.*)",
  "/connect(.*)",
  "/admin(.*)",
  "/workspace",
  "/start",
]);

const isAuthEntry = createRouteMatcher(["/sign-in", "/sign-up"]);

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

    if (isAdminRoute(req)) {
      const { userId } = await auth();
      if (!isWorkspaceOwner(userId)) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    if (isAuthEntry(req)) {
      const { userId } = await auth();
      if (!userId) return;
      const requested = req.nextUrl.searchParams.get("redirect_url");
      if (requested) {
        try {
          const destination = new URL(requested, req.url);
          if (
            destination.origin === req.nextUrl.origin &&
            /^\/(dashboard|connect|onboarding|start)(?:\/|$)/.test(destination.pathname)
          ) {
            return NextResponse.redirect(destination);
          }
        } catch {
          // Ignore malformed or external destinations.
        }
      }
      return NextResponse.redirect(new URL(workspaceHome(userId), req.url));
    }
  },
  {
    contentSecurityPolicy: {
      directives: {
        // Clerk Protect is used during sign-in and can use ports other than 443.
        "connect-src": ["https://*.protect.clerk.com:*"],
        "frame-src": ["https://*.protect.clerk.com"],
      },
    },
  }
);

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
