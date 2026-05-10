// app/api/subscription/route.ts — returns plan + trial status for current user
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const { data, error } = await supabase
    .from("profiles")
    .select("plan, trial_ends_at")
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
  const isPaid = data.plan === "starter" || data.plan === "pro";

  return NextResponse.json({
    plan: data.plan,
    trialEndsAt: data.trial_ends_at,
    daysLeft,
    isTrialActive,
    isTrialExpired,
    isPaid,
    hasAccess: isTrialActive || isPaid,
  });
}
