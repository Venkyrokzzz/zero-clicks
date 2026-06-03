// app/api/admin/client/route.ts — admin actions: toggle trial_paused, change plan, add notes
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

async function requireAdmin() {
  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as Record<string, string> | undefined)?.role;
  if (role !== "admin") return false;
  return true;
}

// GET /api/admin/client?id=clerk_user_id — fetch one client's full profile
export async function GET(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const [{ data: profile }, { data: connection }, { count }] = await Promise.all([
    supabase.from("profiles").select("*").eq("clerk_user_id", id).single(),
    supabase.from("google_connections").select("*").eq("clerk_user_id", id).maybeSingle(),
    supabase.from("reviews").select("*", { count: "exact", head: true }).eq("clerk_user_id", id),
  ]);

  return NextResponse.json({ profile, connection, reviews_count: count ?? 0 });
}

// PATCH /api/admin/client — update trial_paused, plan, or notes
export async function PATCH(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const { clerk_user_id, trial_paused, plan, notes } = body;

  if (!clerk_user_id) {
    return NextResponse.json({ error: "Missing clerk_user_id" }, { status: 400 });
  }

  const VALID_PLANS = ['trial', 'founding', 'standard', 'pro', 'cancelled'];
  const update: Record<string, unknown> = {};
  if (trial_paused !== undefined) update.trial_paused = trial_paused;
  if (plan !== undefined) {
    if (!VALID_PLANS.includes(plan)) {
      return NextResponse.json({ error: `Invalid plan. Must be one of: ${VALID_PLANS.join(', ')}` }, { status: 400 });
    }
    update.plan = plan;
  }
  if (notes !== undefined) update.notes = notes;

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  const { error } = await supabase
    .from("profiles")
    .update(update)
    .eq("clerk_user_id", clerk_user_id);

  if (error) {
    console.error("[admin/client PATCH] error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
