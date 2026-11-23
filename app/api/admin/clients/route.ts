import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { checkRateLimit } from "@/lib/rateLimit";
import { isWorkspaceOwner } from "@/lib/workspaceAccess";

export async function GET() {
  const { userId } = await auth();
  if (!userId || !isWorkspaceOwner(userId))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (!checkRateLimit(`admin:clients:${userId}`, 30).allowed)
    return NextResponse.json({ error: "Try again later." }, { status: 429 });
  const [
    { data: profiles, error },
    { data: connections, error: connectionError },
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select(
        "clerk_user_id,email,business_name,location,plan,trial_ends_at,trial_paused,stripe_customer_id,subscription_status",
      )
      .order("created_at", { ascending: false }),
    supabase
      .from("google_connections")
      .select(
        "clerk_user_id,last_synced_at,account_id,location_id,needs_reconnect",
      ),
  ]);
  if (error || connectionError)
    return NextResponse.json(
      { error: "Could not load clients and connections." },
      { status: 503 },
    );

  const connectionFor = new Map(connections.map((c) => [c.clerk_user_id, c]));
  const clients = [];
  for (let i = 0; i < profiles.length; i += 12) {
    const batch = await Promise.all(
      profiles
        .slice(i, i + 12)
        .map(async ({ stripe_customer_id, ...profile }) => {
          const connection = connectionFor.get(profile.clerk_user_id);
          const counts = await supabase
            .from("reviews")
            .select("id", { count: "exact", head: true })
            .eq("clerk_user_id", profile.clerk_user_id);
          return {
            ...profile,
            has_stripe_customer: !!stripe_customer_id,
            google_connected: !!(
              connection?.account_id &&
              connection.location_id &&
              !connection.needs_reconnect
            ),
            google_needs_reconnect: !!connection?.needs_reconnect,
            reviews_count: counts.error ? null : counts.count,
            last_synced_at: connection?.last_synced_at ?? null,
          };
        }),
    );
    clients.push(...batch);
  }

  return NextResponse.json(
    { clients },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
