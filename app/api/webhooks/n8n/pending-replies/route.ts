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

  // Step 1: get sent reviews not yet posted
  const { data: reviews, error } = await supabase
    .from("reviews")
    .select("id, clerk_user_id, external_id, draft_response")
    .eq("status", "sent")
    .is("posted_to_google_at", null)
    .limit(50);

  if (error) {
    console.error("[pending-replies] reviews error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!reviews?.length) return NextResponse.json({ replies: [] });

  // Step 2: fetch google_connections for those user IDs
  const userIds = [...new Set(reviews.map(r => r.clerk_user_id))];
  const { data: connections, error: connErr } = await supabase
    .from("google_connections")
    .select("clerk_user_id, access_token, refresh_token, access_token_expires_at, account_id, location_id")
    .in("clerk_user_id", userIds)
    .not("account_id", "is", null);

  if (connErr) {
    console.error("[pending-replies] connections error:", connErr);
    return NextResponse.json({ error: connErr.message }, { status: 500 });
  }

  const connMap = Object.fromEntries((connections ?? []).map(c => [c.clerk_user_id, c]));

  const replies = reviews
    .map(r => {
      const gc = connMap[r.clerk_user_id];
      if (!gc) return null;
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
    })
    .filter(Boolean);

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
