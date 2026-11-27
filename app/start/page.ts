import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { googleConnectionStatus } from "@/lib/googleConnectionStatus";
import { supabase } from "@/lib/supabase";

export default async function StartGoogleSetup() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in?redirect_url=%2Fstart");

  const [profile, connection] = await Promise.all([
    supabase.from("profiles").select("business_name").eq("clerk_user_id", userId).maybeSingle(),
    supabase.from("google_connections")
      .select("account_id, location_id, needs_reconnect, refresh_token")
      .eq("clerk_user_id", userId).maybeSingle(),
  ]);
  if (profile.error || connection.error) redirect("/connect?error=db_error");

  const status = googleConnectionStatus(connection.data);
  if (status === "connected") redirect("/dashboard");
  if (!profile.data?.business_name?.trim()) redirect("/onboarding");
  if (status === "pick_venue") redirect("/connect/success?location=select");
  redirect("/connect");
}
