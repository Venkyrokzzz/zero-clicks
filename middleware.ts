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
          const allowedPath = /^\/(admin|dashboard|connect|onboarding|start)(?:\/|$)/.test(destination.pathname);
          const allowedAdmin = !destination.pathname.startsWith("/admin") || isWorkspaceOwner(userId);
          if (destination.origin === req.nextUrl.origin && allowedPath && allowedAdmin) {
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
        "script-src": ["'unsafe-eval'", "https://clerk.0-clicks.uk", "https://*.clerk.accounts.dev", "https://challenges.cloudflare.com", "https://*.protect.clerk.com"],
        "img-src": ["blob:", "data:", "https:"],
        // Preserve app fetch/iframe targets alongside Clerk Protect and Turnstile.
        "connect-src": [
          "https://api.web3forms.com",
          "https://accounts.google.com",
          "https://oauth2.googleapis.com",
          "https://www.googleapis.com",
          "https://clerk.0-clicks.uk",
          "https://*.clerk.accounts.dev",
          "https://clerk.com",
          "https://challenges.cloudflare.com",
          "https://*.protect.clerk.com:*",
        ],
        "frame-src": [
          "https://accounts.google.com",
          "https://clerk.0-clicks.uk",
          "https://*.clerk.accounts.dev",
          "https://challenges.cloudflare.com",
          "https://*.protect.clerk.com",
        ],
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
