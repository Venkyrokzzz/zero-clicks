// app/api/admin/clients/route.ts — returns all clients for admin panel
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

async function requireAdmin() {
  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as Record<string, string> | undefined)?.role;
  return role === "admin";
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Get all profiles with join to google_connections + review count
  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[admin/clients GET] error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Get google_connections for all users
  const { data: connections } = await supabase
    .from("google_connections")
    .select("clerk_user_id, last_synced_at");

  // Get review counts per user
  const { data: reviewCounts } = await supabase
    .from("reviews")
    .select("clerk_user_id");

  const connectionMap = new Map(
    (connections ?? []).map(c => [c.clerk_user_id, c])
  );

  const reviewCountMap = new Map<string, number>();
  for (const r of reviewCounts ?? []) {
    reviewCountMap.set(r.clerk_user_id, (reviewCountMap.get(r.clerk_user_id) ?? 0) + 1);
  }

  const clients = (profiles ?? []).map(p => ({
    clerk_user_id: p.clerk_user_id,
    email: p.email,
    business_name: p.business_name,
    location: p.location,
    postcode: p.postcode,
    phone: p.phone,
    plan: p.plan,
    trial_ends_at: p.trial_ends_at,
    trial_paused: p.trial_paused ?? false,
    notes: p.notes,
    google_connected: connectionMap.has(p.clerk_user_id),
    reviews_count: reviewCountMap.get(p.clerk_user_id) ?? 0,
    last_synced_at: connectionMap.get(p.clerk_user_id)?.last_synced_at ?? null,
  }));

  return NextResponse.json({ clients });
}
