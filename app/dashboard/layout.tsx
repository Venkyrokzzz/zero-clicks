"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import s from "@/components/workspace/Workspace.module.css";

const links = [
  ["/dashboard", "Reviews"],
  ["/dashboard/billing", "Billing"],
  ["/dashboard/integrations", "Integrations"],
  ["/dashboard/settings", "Settings"],
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user } = useUser();
  return (
    <div>
      <header className={s.workspaceNav}>
        <Link href="/" className={s.brand}>
          <img src="/zero-clicks-mark.svg" width={30} height={30} alt="" />
          Zero Clicks
        </Link>
        <nav aria-label="Client navigation">
          {links.map(([url, label]) => (
            <Link
              key={url}
              href={url}
              aria-current={
                (
                  url === "/dashboard"
                    ? pathname === url
                    : pathname.startsWith(url)
                )
                  ? "page"
                  : undefined
              }
            >
              {label}
            </Link>
          ))}
        </nav>
        {user?.publicMetadata?.role === "admin" && (
          <Link href="/admin">Admin</Link>
        )}
      </header>
      {children}
    </div>
  );
}
