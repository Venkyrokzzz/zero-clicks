import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { isWorkspaceOwner } from "@/lib/workspaceAccess";

const privateResponse = { headers: { "Cache-Control": "private, no-store" } };

export async function GET() {
  const { userId } = await auth();
  if (!isWorkspaceOwner(userId)) return NextResponse.json({ error: "Forbidden" }, { ...privateResponse, status: 403 });

  const { data, error } = await supabase.from("contact_enquiries")
    .select("id,created_at,name,email,company,budget,message,email_status")
    .order("created_at", { ascending: false }).limit(50);
  if (error) return NextResponse.json({ error: "Could not load enquiries." }, { ...privateResponse, status: 503 });
  return NextResponse.json({ enquiries: data }, privateResponse);
}
