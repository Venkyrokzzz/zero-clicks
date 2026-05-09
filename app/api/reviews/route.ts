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
  const { id, status } = body;

  // Ensure the review belongs to this user before updating
  const { error } = await supabase
    .from("reviews")
    .update({ status, sent_at: status === "sent" ? new Date().toISOString() : null })
    .eq("id", id)
    .eq("clerk_user_id", userId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
