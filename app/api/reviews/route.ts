import { serviceAccess } from '@/lib/requireService';
import { hasServiceAccess } from '@/lib/entitlements';
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { checkRateLimit } from "@/lib/rateLimit";
import { supabase } from "@/lib/supabase";
import { reviewPublishingEnabled } from "@/lib/reviewPublishing";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const { allowed } = checkRateLimit(`reviews:read:${userId}`, 60);
  if (!allowed) return NextResponse.json({ error: "Too many requests." }, { status: 429 });

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("business_name,plan,trial_ends_at,trial_paused,subscription_status")
    .eq("clerk_user_id", userId)
    .maybeSingle();

  if (profileError) return NextResponse.json({ error: "Could not verify venue access." }, { status: 503 });
  if (!profile?.business_name?.trim()) {
    return NextResponse.json({ error: "Finish setting up your venue first.", code: "ONBOARDING_REQUIRED" }, { status: 409 });
  }
  if (!hasServiceAccess(profile)) return NextResponse.json({ error: 'Subscription inactive', code: 'TRIAL_EXPIRED' }, { status: 403 });

  const { data: reviews, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("clerk_user_id", userId)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: "Could not load reviews." }, { status: 500 });

  const metrics = {
    totalReviews: reviews.length,
    negativeCount: reviews.filter((r) => r.sentiment === "NEGATIVE").length,
    pendingCount: reviews.filter((r) => r.status === "pending").length,
    sentCount: reviews.filter((r) => r.status === "sent" && r.posted_to_google_at && r.google_reply_state !== "rejected").length,
  };

  return NextResponse.json({ reviews, metrics, publishingEnabled: reviewPublishingEnabled() });
}

export async function PUT(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const { allowed } = checkRateLimit(`reviews:write:${userId}`, 60);
  if (!allowed) return NextResponse.json({ error: "Too many requests." }, { status: 429 });

  if (!(await serviceAccess(userId))) return NextResponse.json({ error: 'Subscription inactive' }, { status: 403 });
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Invalid review update." }, { status: 400 });
  }
  const { id, status, draft_response } = body;
  const publishingEnabled = reviewPublishingEnabled();
  if (status === "approved" && !publishingEnabled) {
    return NextResponse.json({ error: "This pilot prepares drafts for copying. Google publishing is off." }, { status: 409 });
  }

  if (!id || typeof id !== "string" || id.trim() === "") {
    return NextResponse.json({ error: "Invalid or missing review id" }, { status: 400 });
  }

  const update: Record<string, unknown> = {};
  if (draft_response !== undefined && (typeof draft_response !== "string" || Buffer.byteLength(draft_response, 'utf8') > 4096)) {
    return NextResponse.json({ error: "Your reply is too long for Google." }, { status: 400 });
  }
  if (status === "approved" && !draft_response?.trim()) {
    return NextResponse.json({ error: "Enter a reply before approving." }, { status: 400 });
  }

  // Draft-only save (no status change)
  if (draft_response !== undefined && status === undefined) {
    update.draft_response = draft_response;
  } else {
    // Status update (optionally with draft)
    const VALID_STATUSES = ["pending", "approved", "skipped"];
    if (!status || !VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}` }, { status: 400 });
    }
    update.status = status;
    // "sent" is reserved for a reply confirmed by Google. A customer approval
    // enters the queue as "approved" and is published by the scheduler.
    update.sent_at = null;
    if (draft_response !== undefined) update.draft_response = draft_response;
  }

  const query = supabase
    .from("reviews")
    .update(update)
    .eq("id", id)
    .eq("clerk_user_id", userId)
    .in("status", publishingEnabled ? ["pending", "skipped"] : ["pending", "skipped", "approved"])
    .is("posted_to_google_at", null);
  if (status === "approved") query.eq('platform', 'google').not('google_review_resource', 'is', null);

  const { data, error } = await query
    .select("id")
    .maybeSingle();

  if (error) return NextResponse.json({ error: "Could not update review." }, { status: 500 });
  if (!data) return NextResponse.json({ error: "This review is no longer editable or needs a verified Google import." }, { status: 409 });

  return NextResponse.json({ success: true });
}
