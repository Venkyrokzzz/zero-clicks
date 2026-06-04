// app/api/subscription/route.ts — returns plan + trial status for current user
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const { data, error } = await supabase
    .from("profiles")
    .select("plan, trial_ends_at, subscription_status")
    .eq("clerk_user_id", userId)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  const now = new Date();
  const trialEnd = data.trial_ends_at ? new Date(data.trial_ends_at) : null;
  const daysLeft = trialEnd ? Math.max(0, Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))) : 0;
  const isTrialActive = data.plan === "trial" && daysLeft > 0;
  const isTrialExpired = data.plan === "trial" && daysLeft <= 0;
  const isPaid = ["starter", "standard", "pro"].includes(data.plan);
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
    hasAccess: isTrialActive || isPaid,
  });
}
