import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { listGoogleBusinessLocations } from "@/lib/googleBusiness";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const { data } = await supabase
    .from("google_connections")
    .select("id, google_email, connected_at, access_token, account_id, location_id")
    .eq("clerk_user_id", userId)
    .single();

  return NextResponse.json({
    connected: !!(data?.account_id && data?.location_id),
    authorization: !!data,
    connection: data ? { id: data.id, google_email: data.google_email, connected_at: data.connected_at } : null,
  });
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const { data: connection } = await supabase
    .from("google_connections")
    .select("access_token")
    .eq("clerk_user_id", userId)
    .single();
  if (!connection?.access_token) return NextResponse.json({ error: "Connect Google first." }, { status: 409 });

  const body = await req.json().catch(() => ({}));
  if (body.action === 'list') {
    try {
      return NextResponse.json({ locations: await listGoogleBusinessLocations(connection.access_token) });
    } catch (error) {
      return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to load Google locations.' }, { status: 502 });
    }
  }

  if (typeof body.accountId !== 'string' || typeof body.locationId !== 'string') {
    return NextResponse.json({ error: "Choose a Google Business Profile location." }, { status: 400 });
  }

  try {
    const locations = await listGoogleBusinessLocations(connection.access_token)
    const selected = locations.find(location => location.accountId === body.accountId && location.locationId === body.locationId)
    if (!selected) return NextResponse.json({ error: "That location is not available to this Google account." }, { status: 403 });
    const { error } = await supabase.from("google_connections")
      .update({ account_id: selected.accountId, location_id: selected.locationId })
      .eq("clerk_user_id", userId)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, location: selected });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to select Google location.' }, { status: 502 });
  }
}

export async function DELETE() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const { error } = await supabase
    .from("google_connections")
    .delete()
    .eq("clerk_user_id", userId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
