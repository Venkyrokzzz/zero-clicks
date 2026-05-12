// app/api/admin/connections/route.ts — n8n fetches all active Google tokens from here
// Called by n8n Review Monitor every 15 mins
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: Request) {
  // Auth: shared secret between n8n and Next.js
  const token = req.headers.get("x-zeroclicks-token");
  if (!token || token !== process.env.N8N_WEBHOOK_TOKEN) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  // Only return connections for non-paused, active clients
  const { data, error } = await supabase
    .from("google_connections")
    .select(`
      clerk_user_id,
      access_token,
      refresh_token,
      access_token_expires_at,
      scopes,
      google_reviews_url,
      last_synced_at,
      profiles!inner(plan, trial_paused, trial_ends_at, business_name)
    `)
    .eq("profiles.trial_paused", false);

  if (error) {
    console.error("[admin/connections GET] error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Filter out expired trials
  const now = new Date();
  const active = (data ?? []).filter((row: Record<string, unknown>) => {
    const profile = row.profiles as Record<string, unknown> | null;
    if (!profile) return false;
    if (profile.plan !== "trial") return true; // paid clients always active
    const trialEnd = profile.trial_ends_at as string | null;
    if (!trialEnd) return false;
    return new Date(trialEnd) > now;
  });

  return NextResponse.json({ connections: active });
}
