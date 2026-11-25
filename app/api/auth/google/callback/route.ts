import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import { supabase } from "@/lib/supabase";
import {
  chooseMatchingLocation,
  listGoogleBusinessLocations,
} from "@/lib/googleBusiness";
import {
  BUSINESS_SCOPE,
  NONCE_COOKIE,
  cookieSettings,
  oauthConfig,
  validGoogleState,
} from "@/lib/googleOAuth";

export async function GET(req: NextRequest) {
  const requestUrl = new URL(req.url);
  const config = oauthConfig();
  const origin = config?.origin ?? requestUrl.origin;
  const failure = (code: string) =>
    NextResponse.redirect(new URL(`/connect?error=${code}`, origin));
  if (!config) return failure("google_config");
  if (requestUrl.origin !== origin) return failure("invalid_state");
  const { searchParams } = requestUrl;
  if (searchParams.has("error")) {
    return failure(
      searchParams.get("error") === "access_denied"
        ? "access_denied"
        : "google_consent",
    );
  }

  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const { userId } = await auth();
  const cookieStore = await cookies();
  const nonce = cookieStore.get(NONCE_COOKIE)?.value;
  if (!userId) return failure("session_expired");
  if (
    !code ||
    !state ||
    !nonce ||
    !validGoogleState(state, nonce, userId, config.stateSecret)
  ) {
    return failure("invalid_state");
  }
  cookieStore.set(NONCE_COOKIE, "", { ...cookieSettings, maxAge: 0 });

  let tokens: {
    error?: unknown;
    access_token?: unknown;
    refresh_token?: unknown;
    expires_in?: unknown;
    scope?: unknown;
  };
  try {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: config.clientId,
        client_secret: config.clientSecret,
        redirect_uri: config.redirectUri,
        grant_type: "authorization_code",
      }),
      signal: AbortSignal.timeout(8_000),
    });
    tokens = await response.json();
    if (!response.ok || tokens?.error) {
      const issue = tokens?.error;
      const rejected =
        issue === "invalid_client" ||
        issue === "unauthorized_client" ||
        issue === "redirect_uri_mismatch";
      console.warn(
        "[google-connect] Token exchange rejected",
        response.status,
        rejected
          ? "client_config"
          : issue === "invalid_grant"
            ? "invalid_grant"
            : "other",
      );
      return failure(
        rejected
          ? "google_client_rejected"
          : issue === "invalid_grant"
            ? "google_code_expired"
            : "google_token_exchange",
      );
    }
  } catch {
    console.warn("[google-connect] Token exchange unavailable");
    return failure("google_token_exchange");
  }

  if (
    typeof tokens?.access_token !== "string" ||
    !tokens.access_token ||
    typeof tokens.expires_in !== "number" ||
    !Number.isFinite(tokens.expires_in) ||
    tokens.expires_in <= 0
  ) {
    return failure("google_token_exchange");
  }
  if (
    typeof tokens.scope === "string" &&
    !tokens.scope.split(/\s+/).includes(BUSINESS_SCOPE)
  ) {
    return failure("google_scope");
  }
  if (typeof tokens.refresh_token !== "string" || !tokens.refresh_token) {
    return failure("google_refresh_missing");
  }

  let googleEmail: string;
  try {
    const response = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
        signal: AbortSignal.timeout(8_000),
      },
    );
    const info = await response.json();
    if (!response.ok || typeof info?.email !== "string" || !info.email)
      return failure("google_identity");
    googleEmail = info.email;
  } catch {
    return failure("google_identity");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("business_name")
    .eq("clerk_user_id", userId)
    .maybeSingle();
  if (profileError) return failure("db_error");
  if (!profile) return failure("profile_required");

  const { error: dbError } = await supabase.from("google_connections").upsert(
    {
      clerk_user_id: userId,
      google_email: googleEmail,
      google_reviews_url: "",
      refresh_token: tokens.refresh_token,
      access_token: tokens.access_token,
      access_token_expires_at: new Date(
        Date.now() + tokens.expires_in * 1000,
      ).toISOString(),
      scopes: typeof tokens.scope === "string" ? tokens.scope : null,
      connected_at: new Date().toISOString(),
      account_id: null,
      location_id: null,
      needs_reconnect: false,
      last_synced_at: null,
    },
    { onConflict: "clerk_user_id" },
  );

  if (dbError) {
    console.error("[google-connect] Could not save consent", dbError.code);
    return failure("db_error");
  }

  let ready = false;
  try {
    const locations = await listGoogleBusinessLocations(tokens.access_token);
    const selected = chooseMatchingLocation(
      locations,
      profile.business_name ?? "",
    );
    if (selected) {
      const { data, error } = await supabase
        .from("google_connections")
        .update({
          account_id: selected.accountId,
          location_id: selected.locationId,
        })
        .eq("clerk_user_id", userId)
        .eq("access_token", tokens.access_token)
        .select("id")
        .maybeSingle();
      ready = !!data && !error;
    }
  } catch {
    console.warn("[google-connect] Consent saved, venue lookup needs retry");
  }

  return NextResponse.redirect(
    new URL(`/connect/success?location=${ready ? "ready" : "select"}`, origin),
  );
}
