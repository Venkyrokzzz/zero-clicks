"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import s from "@/components/workspace/Workspace.module.css";

const links = [
  ["/dashboard", "Reviews"],
  ["/dashboard/billing", "Billing"],
  ["/dashboard/integrations", "Integrations"],
  ["/dashboard/settings", "Settings"],
];

export default function DashboardNav({ owner }: { owner: boolean }) {
  const pathname = usePathname();
  return (
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
      {owner && (
        <Link href="/admin" className={s.primary}>Owner admin</Link>
      )}
    </header>
  );
}
