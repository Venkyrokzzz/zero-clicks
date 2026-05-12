// app/api/admin/connections/route.ts — n8n fetches all active Google tokens from here
// Called by n8n Review Monitor every 30 mins
// Returns everything n8n needs to fetch reviews + build Claude prompt
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: Request) {
  // Auth: shared secret between n8n and Next.js
  const token = req.headers.get("x-zeroclicks-token");
  if (!token || token !== process.env.N8N_WEBHOOK_TOKEN) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  // Query 1: google_connections joined to profiles (direct FK exists)
  const { data, error } = await supabase
    .from("google_connections")
    .select(`
      clerk_user_id,
      access_token,
      refresh_token,
      access_token_expires_at,
      account_id,
      location_id,
      google_reviews_url,
      last_synced_at,
      profiles!inner(
        plan,
        trial_paused,
        trial_ends_at,
        business_name,
        business_type,
        manager_name,
        location
      )
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
    if (profile.plan !== "trial") return true;
    const trialEnd = profile.trial_ends_at as string | null;
    if (!trialEnd) return false;
    return new Date(trialEnd) > now;
  });

  // Query 2: fetch settings for all active users in one shot
  const userIds = active.map((r: Record<string, unknown>) => r.clerk_user_id as string);
  const settingsMap: Record<string, Record<string, unknown>> = {};
  if (userIds.length > 0) {
    const { data: settingsRows } = await supabase
      .from("settings")
      .select("clerk_user_id, tone, flag_negative")
      .in("clerk_user_id", userIds);
    for (const s of settingsRows ?? []) {
      settingsMap[s.clerk_user_id] = s;
    }
  }

  // Flatten for easy n8n consumption
  const connections = active.map((row: Record<string, unknown>) => {
    const profile = row.profiles as Record<string, unknown>;
    const settings = settingsMap[row.clerk_user_id as string] ?? null;
    return {
      clerk_user_id:           row.clerk_user_id,
      access_token:            row.access_token,
      refresh_token:           row.refresh_token,
      access_token_expires_at: row.access_token_expires_at,
      account_id:              row.account_id ?? null,
      location_id:             row.location_id ?? null,
      google_reviews_url:      row.google_reviews_url ?? null,
      last_synced_at:          row.last_synced_at ?? null,
      // Profile
      business_name:           profile.business_name ?? null,
      business_type:           profile.business_type ?? null,
      manager_name:            profile.manager_name ?? null,
      location:                profile.location ?? null,
      plan:                    profile.plan,
      // Settings
      tone:                    settings?.tone ?? "warm-professional",
      flag_negative:           settings?.flag_negative ?? true,
    };
  });

  return NextResponse.json({ connections });
}
