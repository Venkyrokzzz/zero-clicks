// app/api/webhooks/n8n/pending-replies/route.ts
// n8n polls this every 5 mins to get approved replies waiting to be posted to Google
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { verifyToken } from "@/lib/verifyToken";

export async function GET(req: Request) {
  const token = req.headers.get("x-zeroclicks-token");
  if (!verifyToken(token, process.env.N8N_WEBHOOK_TOKEN)) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  // Get all sent reviews that haven't been posted to Google yet
  const { data, error } = await supabase
    .from("reviews")
    .select(`
      id,
      clerk_user_id,
      external_id,
      draft_response,
      google_connections!inner(
        access_token,
        refresh_token,
        access_token_expires_at,
        account_id,
        location_id
      )
    `)
    .eq("status", "sent")
    .is("posted_to_google_at", null)
    .not("google_connections.account_id", "is", null)
    .limit(50);

  if (error) {
    console.error("[pending-replies] error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const replies = (data ?? []).map((r: Record<string, unknown>) => {
    const gc = r.google_connections as Record<string, unknown>;
    return {
      review_id:               r.id,
      clerk_user_id:           r.clerk_user_id,
      external_id:             r.external_id,
      reply_text:              r.draft_response,
      access_token:            gc.access_token,
      refresh_token:           gc.refresh_token,
      access_token_expires_at: gc.access_token_expires_at,
      account_id:              gc.account_id,
      location_id:             gc.location_id,
    };
  });

  return NextResponse.json({ replies });
}

export async function POST(req: Request) {
  // n8n calls this after successfully posting to Google
  const token = req.headers.get("x-zeroclicks-token");
  if (!verifyToken(token, process.env.N8N_WEBHOOK_TOKEN)) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const body = await req.json();
  const { review_id, success, error_message } = body;

  if (!review_id) {
    return NextResponse.json({ error: "Missing review_id" }, { status: 400 });
  }

  if (success) {
    const { error } = await supabase
      .from("reviews")
      .update({ posted_to_google_at: new Date().toISOString() })
      .eq("id", review_id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    console.log(`[pending-replies] Posted review ${review_id} to Google`);
  } else {
    console.error(`[pending-replies] Failed to post review ${review_id}:`, error_message);
  }

  return NextResponse.json({ success: true });
}
