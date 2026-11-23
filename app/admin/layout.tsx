import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { isWorkspaceOwner } from "@/lib/workspaceAccess";
import s from "@/components/workspace/Workspace.module.css";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  if (!isWorkspaceOwner(userId)) redirect("/dashboard");

  return (
    <div>
      <header className={s.workspaceNav}>
        <Link href="/" className={s.brand}>
          <img src="/zero-clicks-mark.svg" alt="" width={30} height={30} />
          Zero Clicks
        </Link>
        <nav aria-label="Admin navigation">
          <Link href="/admin">Client operations</Link>
          <Link href="/dashboard">Client workspace</Link>
        </nav>
      </header>
      {children}
    </div>
  );
}
