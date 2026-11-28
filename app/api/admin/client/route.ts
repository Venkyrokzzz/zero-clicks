// app/api/admin/client/route.ts — admin actions: toggle trial_paused, change plan, add notes
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

import { googleConnectionStatus } from "@/lib/googleConnectionStatus";
import { isWorkspaceOwner } from "@/lib/workspaceAccess";

const privateHeaders = { "Cache-Control": "private, no-store" };

async function requireAdmin() {
  const { userId } = await auth();
  return isWorkspaceOwner(userId);
}

// GET /api/admin/client?id=clerk_user_id — fetch one client's full profile
export async function GET(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403, headers: privateHeaders });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400, headers: privateHeaders });

  const [
    { data: profile, error: profileError },
    { data: connection, error: connectionError },
    { count, error: countError },
    { data: settings, error: settingsError },
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select(
        "email,business_name,business_type,manager_name,location,phone,plan,trial_paused,trial_ends_at,notes,stripe_customer_id,subscription_status",
      )
      .eq("clerk_user_id", id)
      .maybeSingle(),
    supabase
      .from("google_connections")
      .select("account_id,location_id,last_synced_at,needs_reconnect,refresh_token")
      .eq("clerk_user_id", id)
      .maybeSingle(),
    supabase
      .from("reviews")
      .select("*", { count: "exact", head: true })
      .eq("clerk_user_id", id),
    supabase
      .from("settings")
      .select("tone,auto_send_positive")
      .eq("clerk_user_id", id)
      .maybeSingle(),
  ]);

  if (profileError || connectionError || countError || settingsError)
    return NextResponse.json(
      { error: "Could not load venue data." },
      { status: 503, headers: privateHeaders },
    );
  if (!profile)
    return NextResponse.json({ error: "Venue not found." }, { status: 404, headers: privateHeaders });
  const { stripe_customer_id, ...profileFields } = profile;
  return NextResponse.json({
    profile: { ...profileFields, has_stripe_customer: !!stripe_customer_id },
    connection: connection ? { status: googleConnectionStatus(connection), last_synced_at: connection.last_synced_at } : null,
    settings,
    reviews_count: count ?? 0,
  }, { headers: privateHeaders });
}

// PATCH /api/admin/client — update trial_paused, plan, or notes
export async function PATCH(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const { clerk_user_id, trial_paused, plan, notes } = body ?? {};
  if (typeof clerk_user_id !== "string" || !clerk_user_id) {
    return NextResponse.json({ error: "Missing client ID." }, { status: 400 });
  }
  const update: Record<string, unknown> = {};
  if (trial_paused !== undefined) {
    if (typeof trial_paused !== "boolean")
      return NextResponse.json(
        { error: "Invalid access setting." },
        { status: 400 },
      );
    update.trial_paused = trial_paused;
  }
  if (plan !== undefined) {
    if (
      ![
        "trial",
        "founding",
        "standard",
        "pro",
        "demo",
        "admin",
        "cancelled",
      ].includes(plan)
    ) {
      return NextResponse.json({ error: "Invalid plan." }, { status: 400 });
    }
    update.plan = plan;
  }
  if (notes !== undefined) {
    if (typeof notes !== "string" || notes.length > 5000)
      return NextResponse.json(
        { error: "Notes must be at most 5,000 characters." },
        { status: 400 },
      );
    update.notes = notes;
  }
  if (!Object.keys(update).length)
    return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
  const query = supabase
    .from("profiles")
    .update(update)
    .eq("clerk_user_id", clerk_user_id);
  if (plan !== undefined)
    query.is("stripe_customer_id", null).is("subscription_status", null);
  const { data, error } = await query.select("clerk_user_id").maybeSingle();
  if (error)
    return NextResponse.json(
      { error: "Could not save client settings." },
      { status: 503 },
    );
  if (!data)
    return NextResponse.json(
      {
        error:
          plan === undefined
            ? "Client not found."
            : "Stripe controls this client’s subscription plan, or the client no longer exists.",
      },
      { status: 409 },
    );

  return NextResponse.json({ success: true });
}
