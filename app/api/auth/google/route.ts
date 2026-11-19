import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import { checkRateLimit } from "@/lib/rateLimit";
import {
  BUSINESS_SCOPE,
  NONCE_COOKIE,
  START_PATH,
  STATE_LIFETIME,
  cookieSettings,
  oauthConfig,
  signGoogleState,
} from "@/lib/googleOAuth";

export async function GET(req: NextRequest) {
  const config = oauthConfig();
  if (!config)
    return NextResponse.redirect(
      new URL("/connect?error=google_config", req.url),
    );
  if (new URL(req.url).origin !== config.origin) {
    return NextResponse.redirect(new URL(START_PATH, config.origin));
  }

  const { userId } = await auth();
  if (!userId) {
    const signIn = new URL("/sign-in", config.origin);
    signIn.searchParams.set(
      "redirect_url",
      new URL("/connect", config.origin).href,
    );
    return NextResponse.redirect(signIn);
  }
  if (!checkRateLimit(`google-connect:${userId}`, 10).allowed) {
    return NextResponse.redirect(
      new URL("/connect?error=too_many_attempts", config.origin),
    );
  }

  const nonce = crypto.randomUUID();
  cookies().set(NONCE_COOKIE, nonce, {
    ...cookieSettings,
    maxAge: STATE_LIFETIME,
  });

  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.search = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: "code",
    scope: [
      BUSINESS_SCOPE,
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" "),
    access_type: "offline",
    prompt: "select_account consent",
    state: signGoogleState(nonce, userId, config.stateSecret),
  }).toString();

  return NextResponse.redirect(url);
}
