import { hasServiceAccess } from '@/lib/entitlements';
// app/api/subscription/route.ts — returns plan + trial status for current user
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const privateHeaders = { "Cache-Control": "private, no-store" };

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorised" }, { status: 401, headers: privateHeaders });

  const { data, error } = await supabase
    .from("profiles")
    .select("plan, trial_ends_at, subscription_status, trial_paused")
    .eq("clerk_user_id", userId)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: "Could not load subscription." }, { status: 500, headers: privateHeaders });
  }
  if (!data) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404, headers: privateHeaders });
  }

  const now = new Date();
  const trialEnd = data.trial_ends_at ? new Date(data.trial_ends_at) : null;
  const daysLeft = trialEnd ? Math.max(0, Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))) : 0;
  const isTrialActive = data.plan === "trial" && !data.trial_paused && daysLeft > 0;
  const isTrialExpired = data.plan === "trial" && daysLeft <= 0;
  const isPaid = ["founding", "starter", "standard", "pro"].includes(data.plan) && ["active", "trialing"].includes(data.subscription_status ?? "");
  const isPastDue = data.subscription_status === "past_due";

  return NextResponse.json({
    plan: data.plan,
    trialEndsAt: data.trial_ends_at,
    subscriptionStatus: data.subscription_status,
    daysLeft,
    isTrialActive,
    isTrialExpired,
    isPaid,
    isPastDue,
    hasAccess: hasServiceAccess(data),
  }, { headers: privateHeaders });
}
