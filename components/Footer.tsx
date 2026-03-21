// components/Footer.tsx
"use client";
import Link from "next/link";
import { SITE, FOOTER } from "@/lib/content";

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "var(--bg-surface)",
        borderTop: "1px solid var(--border)",
        padding: "32px 24px",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1rem",
            color: "var(--text-primary)",
            textDecoration: "none",
          }}
        >
          {SITE.name}
        </Link>

        {/* Nav links */}
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          {[
            { label: "Instagram", href: SITE.instagram },
            { label: "LinkedIn", href: SITE.linkedin },
            { label: "Email", href: `mailto:${SITE.email}` },
          ].map(link => (
            <Link
              key={link.label}
              href={link.href}
              target={link.href.startsWith("mailto") ? undefined : "_blank"}
              rel={link.href.startsWith("mailto") ? undefined : "noopener noreferrer"}
              style={{
                fontSize: "12px",
                color: "var(--text-muted)",
                textDecoration: "none",
                letterSpacing: "0.03em",
                fontFamily: "var(--font-body)",
                fontWeight: 400,
                transition: "color 200ms ease",
              }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--text-primary)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Copyright */}
        <p
          style={{
            fontSize: "11px",
            color: "var(--text-muted)",
            fontFamily: "var(--font-body)",
            fontWeight: 400,
            margin: 0,
          }}
        >
          {FOOTER.copyright}
        </p>
      </div>
    </footer>
  );
}
