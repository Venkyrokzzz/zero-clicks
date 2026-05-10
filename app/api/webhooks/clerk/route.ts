// app/api/webhooks/clerk/route.ts
// Receives Clerk user.created events → creates profile + settings rows in Supabase
import { Webhook } from "svix";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json({ error: "No webhook secret" }, { status: 500 });
  }

  // Verify the Svix signature
  const headersList = headers();
  const svix_id = headersList.get("svix-id");
  const svix_timestamp = headersList.get("svix-timestamp");
  const svix_signature = headersList.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json({ error: "Missing svix headers" }, { status: 400 });
  }

  const body = await req.text();
  const wh = new Webhook(webhookSecret);

  let evt: { type: string; data: { id: string; email_addresses: { email_address: string }[]; } };
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as typeof evt;
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (evt.type !== "user.created") {
    return NextResponse.json({ message: "Ignored" });
  }

  const { id: clerk_user_id, email_addresses } = evt.data;
  const email = email_addresses[0]?.email_address ?? "";
  const trial_ends_at = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days

  // Upsert profile
  const { error: profileError } = await supabase.from("profiles").upsert({
    clerk_user_id,
    email,
    trial_ends_at,
    updated_at: new Date().toISOString(),
  }, { onConflict: "clerk_user_id" });

  if (profileError) {
    console.error("Profile upsert error:", profileError);
    return NextResponse.json({ error: "Profile creation failed" }, { status: 500 });
  }

  // Upsert settings with defaults
  const { error: settingsError } = await supabase.from("settings").upsert({
    clerk_user_id,
    tone: "warm-professional",
    auto_send_positive: false,
    flag_negative: true,
  }, { onConflict: "clerk_user_id" });

  if (settingsError) {
    console.error("Settings upsert error:", settingsError);
    return NextResponse.json({ error: "Settings creation failed" }, { status: 500 });
  }

  return NextResponse.json({ message: "User created successfully" });
}
