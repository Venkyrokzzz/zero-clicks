// app/api/webhooks/n8n/token-refresh/route.ts
// n8n calls this when Google returns 401 — we refresh the token and update Supabase
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { verifyToken } from "@/lib/verifyToken";

export async function POST(req: Request) {
  const token = req.headers.get("x-zeroclicks-token");
  if (!verifyToken(token, process.env.N8N_WEBHOOK_TOKEN)) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const body = await req.json();
  const { clerk_user_id, refresh_token } = body;

  if (!clerk_user_id || !refresh_token) {
    return NextResponse.json({ error: "Missing clerk_user_id or refresh_token" }, { status: 400 });
  }

  // Exchange refresh token with Google
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      refresh_token,
      grant_type: "refresh_token",
    }),
  });

  const tokens = await tokenRes.json();

  if (tokens.error || !tokens.access_token) {
    console.error("[token-refresh] Google error:", tokens.error, tokens.error_description);
    return NextResponse.json(
      { error: tokens.error_description ?? "Google token refresh failed" },
      { status: 502 }
    );
  }

  const expiresAt = tokens.expires_in
    ? new Date(Date.now() + tokens.expires_in * 1000).toISOString()
    : null;

  // Update Supabase with new access token
  const { error: dbError } = await supabase
    .from("google_connections")
    .update({
      access_token: tokens.access_token,
      access_token_expires_at: expiresAt,
    })
    .eq("clerk_user_id", clerk_user_id);

  if (dbError) {
    console.error("[token-refresh] Supabase error:", dbError);
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json({
    access_token: tokens.access_token,
    expires_at: expiresAt,
  });
}
