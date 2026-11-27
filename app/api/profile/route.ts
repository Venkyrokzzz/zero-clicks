// app/api/profile/route.ts — GET + PUT current user's profile
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

    const { data, error } = await supabase
      .from("profiles")
      .select("clerk_user_id, email, business_name, business_type, manager_name, location, postcode, phone, plan, trial_ends_at, subscription_status")
      .eq("clerk_user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("[api/profile GET] db error:", error.code);
      return NextResponse.json({ error: "Could not load profile." }, { status: 500 });
    }
    if (!data) return NextResponse.json({ error: "Profile not found." }, { status: 404 });
    return NextResponse.json(data);
  } catch (e: unknown) {
    console.error("[api/profile GET] thrown:", e);
    return NextResponse.json({ error: "Could not load profile." }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

    const body = await req.json().catch(() => null);
    const fields = ["business_name", "business_type", "manager_name", "location", "postcode", "phone"] as const;
    const update: Record<string, string> = {};
    for (const field of fields) {
      const value = body?.[field];
      if (value === undefined) continue;
      if (typeof value !== "string") {
        return NextResponse.json({ error: "Enter valid venue details." }, { status: 400 });
      }
      update[field] = value.trim();
    }
    if (!Object.keys(update).length)
      return NextResponse.json({ error: "Enter your venue details." }, { status: 400 });

    const save = () => supabase.from("profiles").update(update)
      .eq("clerk_user_id", userId).select("clerk_user_id").maybeSingle();
    let { data: saved, error } = await save();
    if (error) throw error;

    if (!saved) {
      const user = await currentUser();
      const email = user?.primaryEmailAddress?.emailAddress;
      if (user?.id !== userId || !email)
        return NextResponse.json({ error: "Your account needs a primary email before you can save venue details." }, { status: 409 });

      const { error: createError } = await supabase.from("profiles").upsert({
        clerk_user_id: userId,
        email,
        plan: "trial",
        trial_ends_at: new Date(user.createdAt + 30 * 24 * 60 * 60 * 1000).toISOString(),
      }, { onConflict: "clerk_user_id", ignoreDuplicates: true });
      if (createError) throw createError;

      ({ data: saved, error } = await save());
      if (error || !saved) throw error ?? new Error("Profile disappeared during venue setup");
    }

    const { error: settingsError } = await supabase.from("settings").upsert({
      clerk_user_id: userId, tone: "warm-professional", auto_send_positive: false, flag_negative: true,
    }, { onConflict: "clerk_user_id", ignoreDuplicates: true });
    if (settingsError) throw settingsError;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[api/profile PUT] could not save venue details", error instanceof Error ? error.message : "");
    return NextResponse.json({ error: "Could not save your venue details. Please try again." }, { status: 500 });
  }
}
