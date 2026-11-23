import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import DashboardNav from "@/components/workspace/DashboardNav";
import { isWorkspaceOwner } from "@/lib/workspaceAccess";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <div>
      <DashboardNav owner={isWorkspaceOwner(userId)} />
      {children}
    </div>
  );
}
