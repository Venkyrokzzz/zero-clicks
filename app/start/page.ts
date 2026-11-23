import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default async function StartGoogleSetup() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in?redirect_url=%2Fstart");

  const [profile, connection] = await Promise.all([
    supabase.from("profiles").select("business_name").eq("clerk_user_id", userId).maybeSingle(),
    supabase.from("google_connections")
      .select("account_id, location_id, needs_reconnect")
      .eq("clerk_user_id", userId).maybeSingle(),
  ]);
  if (profile.error || connection.error) redirect("/connect?error=db_error");

  const grant = connection.data;
  if (grant?.account_id && grant.location_id && !grant.needs_reconnect)
    redirect("/dashboard");
  if (!profile.data?.business_name?.trim()) redirect("/onboarding");
  if (grant && !grant.needs_reconnect) redirect("/connect/success?location=select");
  redirect("/connect");
}
