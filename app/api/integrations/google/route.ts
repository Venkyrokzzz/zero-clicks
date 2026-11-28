import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getGoogleAccess, GOOGLE_CONNECTION_FIELDS } from "@/lib/googleAccess";
import { googleConnectionStatus } from "@/lib/googleConnectionStatus";
import { listGoogleBusinessLocations } from "@/lib/googleBusiness";

export async function GET() {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const { data, error } = await supabase
    .from("google_connections")
    .select(
      "id, google_email, connected_at, account_id, location_id, needs_reconnect, refresh_token, last_synced_at",
    )
    .eq("clerk_user_id", userId)
    .maybeSingle();
  if (error)
    return NextResponse.json(
      { error: "Could not load your Google connection." },
      { status: 503 },
    );

  const status = googleConnectionStatus(data);
  return NextResponse.json({
    status,
    lastSyncedAt: data?.last_synced_at ?? null,
    connected: status === "connected",
    needs_reconnect: status === "reconnect",
    authorization: !!data,
    connection: data
      ? {
          id: data.id,
          google_email: data.google_email,
          connected_at: data.connected_at,
        }
      : null,
  }, { headers: { "Cache-Control": "private, no-store" } });
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const listing = body?.action === "list";
  if (
    !listing &&
    (typeof body?.accountId !== "string" || typeof body?.locationId !== "string")
  ) {
    return NextResponse.json(
      { error: "Choose a Google Business Profile location." },
      { status: 400 },
    );
  }

  const { data: connection, error: loadError } = await supabase
    .from("google_connections")
    .select(GOOGLE_CONNECTION_FIELDS)
    .eq("clerk_user_id", userId)
    .maybeSingle();
  if (loadError)
    return NextResponse.json({ error: "Could not load your Google connection." }, { status: 503 });
  if (!connection)
    return NextResponse.json({ error: "Connect Google first." }, { status: 409 });

  try {
    const access = await getGoogleAccess(connection);
    if (!access.token)
      return NextResponse.json({ error: "Reconnect Google to choose a venue." }, { status: 409 });

    const locations = await listGoogleBusinessLocations(access.token);
    if (listing) return NextResponse.json({ locations }, { headers: { "Cache-Control": "private, no-store" } });

    const selected = locations.find(
      (location) =>
        location.accountId === body.accountId &&
        location.locationId === body.locationId,
    );
    if (!selected)
      return NextResponse.json(
        { error: "That location is not available to this Google account." },
        { status: 403 },
      );
    const { data: saved, error } = await supabase
      .from("google_connections")
      .update({
        account_id: selected.accountId,
        location_id: selected.locationId,
      })
      .eq("clerk_user_id", userId)
      .eq("access_token", access.token)
      .select("clerk_user_id")
      .maybeSingle();
    if (error)
      return NextResponse.json({ error: "Could not save Google location." }, { status: 500 });
    if (!saved)
      return NextResponse.json({ error: "Google connection changed. Check again." }, { status: 409 });
    return NextResponse.json({ success: true, location: selected });
  } catch (error) {
    console.error("[integrations/google POST]", error instanceof Error ? error.message : "");
    return NextResponse.json(
      { error: "Unable to select Google location." },
      { status: 502 },
    );
  }
}

export async function DELETE() {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const { error } = await supabase
    .from("google_connections")
    .delete()
    .eq("clerk_user_id", userId);

  if (error)
    return NextResponse.json({ error: "Could not disconnect Google." }, { status: 500 });
  return NextResponse.json({ success: true });
}
