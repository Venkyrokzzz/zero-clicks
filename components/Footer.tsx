// components/Footer.tsx
"use client";

import Link from "next/link";
import { SITE, FOOTER } from "@/lib/content";

export default function Footer() {
  return (
    <footer
      style={{
        background: "rgba(255,255,255,0.02)",
        backdropFilter: "blur(12px)",
        borderTop: "1px solid rgba(255,255,255,0.07)",
        padding: "36px 48px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
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

        <div style={{ display: "flex", alignItems: "center", gap: "28px" }}>
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
                letterSpacing: "0.04em",
                fontFamily: "var(--font-body)",
                fontWeight: 400,
                transition: "color 200ms ease",
              }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "var(--text-primary)")}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "var(--text-muted)")}
            >
              {link.label}
            </Link>
          ))}
        </div>

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
