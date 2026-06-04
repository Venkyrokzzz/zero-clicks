// app/api/webhooks/n8n/save-location/route.ts
// n8n calls this after Magic Lookup to store account_id + location_id
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { verifyToken } from "@/lib/verifyToken";

export async function POST(req: Request) {
  const token = req.headers.get("x-zeroclicks-token");
  if (!verifyToken(token, process.env.N8N_WEBHOOK_TOKEN)) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const body = await req.json();
  const { clerk_user_id, account_id, location_id, google_reviews_url } = body;

  if (!clerk_user_id || !account_id || !location_id) {
    return NextResponse.json({ error: "Missing clerk_user_id, account_id or location_id" }, { status: 400 });
  }

  const { error } = await supabase
    .from("google_connections")
    .update({
      account_id,
      location_id,
      ...(google_reviews_url && { google_reviews_url }),
    })
    .eq("clerk_user_id", clerk_user_id);

  if (error) {
    console.error("[save-location] error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  console.log(`[save-location] Saved account_id=${account_id} location_id=${location_id} for ${clerk_user_id}`);
  return NextResponse.json({ success: true });
}
