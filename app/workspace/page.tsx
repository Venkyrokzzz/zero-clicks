import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { workspaceHome } from "@/lib/workspaceAccess";

export default async function WorkspaceHome() {
  const { userId } = await auth();
  redirect(userId ? workspaceHome(userId) : "/sign-in");
}
