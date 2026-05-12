// app/api/profile/route.ts — GET + PUT current user's profile
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("clerk_user_id", userId)
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch (e: unknown) {
    console.error("[api/profile GET] thrown:", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { userId } = await auth();
    console.log("[api/profile PUT] userId:", userId);
    if (!userId) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

    const body = await req.json();
    console.log("[api/profile PUT] body:", JSON.stringify(body));
    const { business_name, business_type, manager_name, location, postcode, phone } = body;

    const update: Record<string, string | undefined> = {};
    if (business_name !== undefined) update.business_name = business_name;
    if (business_type !== undefined) update.business_type = business_type;
    if (manager_name !== undefined) update.manager_name = manager_name;
    if (location !== undefined) update.location = location;
    if (postcode !== undefined) update.postcode = postcode;
    if (phone !== undefined) update.phone = phone;

    const { error } = await supabase
      .from("profiles")
      .update(update)
      .eq("clerk_user_id", userId);

    if (error) {
      console.error("[api/profile PUT] supabase error:", error.message, error.details, error.hint);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log("[api/profile PUT] success for", userId);
    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    console.error("[api/profile PUT] thrown:", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
