import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { checkRateLimit } from "@/lib/rateLimit";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";
  const { allowed } = checkRateLimit(ip, 60);
  if (!allowed) return NextResponse.json({ error: "Too many requests." }, { status: 429 });

  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  // Check access — block expired trials
  const { data: profile } = await supabase
    .from("profiles")
    .select("plan, trial_ends_at")
    .eq("clerk_user_id", userId)
    .single();

  if (profile) {
    const isPaid = ["starter", "standard", "pro"].includes(profile.plan);
    const trialEnd = profile.trial_ends_at ? new Date(profile.trial_ends_at) : null;
    const trialExpired = profile.plan === "trial" && trialEnd && trialEnd < new Date();
    if (!isPaid && trialExpired) {
      return NextResponse.json({ error: "Trial expired", code: "TRIAL_EXPIRED" }, { status: 403 });
    }
  }

  const { data: reviews, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("clerk_user_id", userId)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const metrics = {
    totalReviews: reviews.length,
    negativeCount: reviews.filter((r) => r.sentiment === "NEGATIVE").length,
    pendingCount: reviews.filter((r) => r.status === "pending").length,
    sentCount: reviews.filter((r) => r.status === "sent").length,
  };

  return NextResponse.json({ reviews, metrics });
}

export async function PUT(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";
  const { allowed } = checkRateLimit(ip, 60);
  if (!allowed) return NextResponse.json({ error: "Too many requests." }, { status: 429 });

  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const body = await request.json();
  const { id, status, draft_response } = body;

  if (!id || typeof id !== "string" || id.trim() === "") {
    return NextResponse.json({ error: "Invalid or missing review id" }, { status: 400 });
  }

  const update: Record<string, unknown> = {};

  // Draft-only save (no status change)
  if (draft_response !== undefined && status === undefined) {
    if (typeof draft_response !== "string") {
      return NextResponse.json({ error: "draft_response must be a string" }, { status: 400 });
    }
    update.draft_response = draft_response;
  } else {
    // Status update (optionally with draft)
    const VALID_STATUSES = ["pending", "approved", "sent", "skipped"];
    if (!status || !VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}` }, { status: 400 });
    }
    update.status = status;
    update.sent_at = status === "sent" ? new Date().toISOString() : null;
    if (draft_response !== undefined) update.draft_response = draft_response;
  }

  const { error } = await supabase
    .from("reviews")
    .update(update)
    .eq("id", id)
    .eq("clerk_user_id", userId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
