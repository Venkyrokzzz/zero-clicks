// app/api/webhooks/clerk/route.ts
// Receives Clerk lifecycle events → syncs Supabase profiles + settings
// Security: Svix HMAC signature + 5-minute replay window
import { Webhook } from "svix";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const REPLAY_WINDOW_MS = 5 * 60 * 1000; // 5 minutes

type ClerkUserEvent = {
  type: string;
  data: {
    id: string;
    email_addresses: { email_address: string }[];
    primary_email_address_id?: string;
  };
};

export async function POST(req: Request) {
  // ── 1. Env guard ─────────────────────────────────────────────────────────
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("[clerk-webhook] CLERK_WEBHOOK_SECRET not set");
    return NextResponse.json({ error: "Misconfigured" }, { status: 500 });
  }

  // ── 2. Extract Svix headers ───────────────────────────────────────────────
  const headersList = headers();
  const svix_id        = headersList.get("svix-id");
  const svix_timestamp = headersList.get("svix-timestamp");
  const svix_signature = headersList.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json({ error: "Missing svix headers" }, { status: 400 });
  }

  // ── 3. Replay attack protection (5-minute window) ────────────────────────
  const msgTime = parseInt(svix_timestamp, 10) * 1000; // svix sends seconds
  if (Math.abs(Date.now() - msgTime) > REPLAY_WINDOW_MS) {
    console.warn("[clerk-webhook] Stale timestamp, possible replay:", svix_timestamp);
    return NextResponse.json({ error: "Stale request" }, { status: 400 });
  }

  // ── 4. Verify HMAC signature ──────────────────────────────────────────────
  const body = await req.text();
  const wh = new Webhook(webhookSecret);

  let evt: ClerkUserEvent;
  try {
    evt = wh.verify(body, {
      "svix-id":        svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as ClerkUserEvent;
  } catch (err) {
    console.error("[clerk-webhook] Signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // ── 5. Route by event type ────────────────────────────────────────────────
  console.log("[clerk-webhook] Event:", evt.type, "user:", evt.data.id);

  if (evt.type === "user.created") return handleUserCreated(evt.data);
  if (evt.type === "user.deleted") return handleUserDeleted(evt.data);

  // All other events (session.*, user.updated, etc.) — acknowledge and ignore
  return NextResponse.json({ message: "Ignored" });
}

// ── Handlers ──────────────────────────────────────────────────────────────────

async function handleUserCreated(data: ClerkUserEvent["data"]) {
  const { id: clerk_user_id, email_addresses, primary_email_address_id } = data;

  // Prefer primary email; fall back to first in list
  const email =
    email_addresses.find(e => e.email_address === primary_email_address_id)
      ?.email_address ??
    email_addresses[0]?.email_address ??
    "";

  const trial_ends_at = new Date(
    Date.now() + 60 * 24 * 60 * 60 * 1000 // 60 days
  ).toISOString();

  // Upsert profile — idempotent if webhook fires twice
  const { error: profileError } = await supabase.from("profiles").upsert(
    {
      clerk_user_id,
      email,
      trial_ends_at,
      plan: "trial",
      updated_at: new Date().toISOString(),
    },
    { onConflict: "clerk_user_id" }
  );

  if (profileError) {
    console.error("[clerk-webhook] Profile upsert error:", profileError);
    return NextResponse.json({ error: "Profile creation failed" }, { status: 500 });
  }

  // Upsert settings with sensible defaults
  const { error: settingsError } = await supabase.from("settings").upsert(
    {
      clerk_user_id,
      tone: "warm-professional",
      auto_send_positive: false,
      flag_negative: true,
    },
    { onConflict: "clerk_user_id" }
  );

  if (settingsError) {
    console.error("[clerk-webhook] Settings upsert error:", settingsError);
    return NextResponse.json({ error: "Settings creation failed" }, { status: 500 });
  }

  console.log("[clerk-webhook] Created profile + settings for", clerk_user_id);
  return NextResponse.json({ message: "User created" });
}

async function handleUserDeleted(data: ClerkUserEvent["data"]) {
  const { id: clerk_user_id } = data;
  if (!clerk_user_id) return NextResponse.json({ message: "No id, skipped" });

  // CASCADE deletes handle google_connections, settings, reviews automatically
  const { error } = await supabase
    .from("profiles")
    .delete()
    .eq("clerk_user_id", clerk_user_id);

  if (error) {
    console.error("[clerk-webhook] Profile delete error:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }

  console.log("[clerk-webhook] Deleted all data for", clerk_user_id);
  return NextResponse.json({ message: "User deleted" });
}
