"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  {
    href: "/dashboard",
    label: "Reviews",
    exact: true,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ),
  },
  {
    href: "/dashboard/settings",
    label: "Settings",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
      </svg>
    ),
  },
  {
    href: "/dashboard/billing",
    label: "Billing",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
        <line x1="1" y1="10" x2="23" y2="10"/>
      </svg>
    ),
  },
  {
    href: "/dashboard/integrations",
    label: "Integrations",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
        <polyline points="15 3 21 3 21 9"/>
        <line x1="10" y1="14" x2="21" y2="3"/>
      </svg>
    ),
  },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isActive = (item: typeof NAV[number]) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0a0a0a 0%,#111 100%)" }}>

      {/* ── Top bar (replaces per-page padding hack) */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, height: "60px", zIndex: 40,
        background: "rgba(10,10,10,0.9)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 24px",
      }}>
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Zero Clicks" style={{ width: 24, height: 24, borderRadius: 6 }} />
          <span style={{ color: "#fff", fontWeight: 700, fontSize: "15px", letterSpacing: "0.01em" }}>Zero Clicks</span>
        </Link>

        {/* Desktop tab nav — centred */}
        <nav className="dash-tabs" style={{ display: "flex", alignItems: "center", gap: "2px" }}>
          {NAV.map((item) => {
            const active = isActive(item);
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: "flex", alignItems: "center", gap: "7px",
                  padding: "7px 14px", borderRadius: "8px",
                  fontSize: "13px", fontWeight: active ? 600 : 400,
                  color: active ? "#fff" : "rgba(255,255,255,0.4)",
                  background: active ? "rgba(255,255,255,0.08)" : "transparent",
                  border: active ? "1px solid rgba(255,255,255,0.1)" : "1px solid transparent",
                  textDecoration: "none",
                  transition: "all 150ms ease",
                }}
              >
                <span style={{ opacity: active ? 1 : 0.6 }}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: back to site */}
        <Link href="/" style={{
          fontSize: "12px", color: "rgba(255,255,255,0.3)", textDecoration: "none",
          display: "flex", alignItems: "center", gap: "5px",
          transition: "color 150ms ease",
        }}
          onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
          onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.3)")}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back to site
        </Link>
      </div>

      {/* ── Page content */}
      <div style={{ paddingTop: "60px" }}>
        {children}
      </div>

      {/* ── Mobile bottom tab bar */}
      <nav className="dash-mobile-tabs" style={{
        display: "none", position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 40,
        background: "rgba(10,10,10,0.95)", backdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(255,255,255,0.07)",
        padding: "8px 16px 20px",
        justifyContent: "space-around",
      }}>
        {NAV.map((item) => {
          const active = isActive(item);
          return (
            <Link key={item.href} href={item.href} style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: "4px",
              textDecoration: "none", padding: "6px 12px", borderRadius: "8px",
              color: active ? "#fff" : "rgba(255,255,255,0.35)",
              transition: "color 150ms ease",
            }}>
              <span style={{ opacity: active ? 1 : 0.5 }}>{item.icon}</span>
              <span style={{ fontSize: "10px", fontWeight: active ? 600 : 400, letterSpacing: "0.04em" }}>
                {item.label}
              </span>
              {active && (
                <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#f59e0b", marginTop: 1 }} />
              )}
            </Link>
          );
        })}
      </nav>

      <style>{`
        @media (max-width: 640px) {
          .dash-tabs { display: none !important; }
          .dash-mobile-tabs { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
