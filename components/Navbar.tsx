// components/Navbar.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SITE } from "@/lib/content";
import { motion } from "framer-motion";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
        backgroundColor: scrolled ? "rgba(8,8,8,0.9)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        transition: "border-color 250ms ease, background-color 250ms ease",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 48px",
          height: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link
          href="/"
          onClick={(e) => {
            if (typeof window !== "undefined" && window.location.pathname === "/") {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.05rem",
            color: "var(--text-primary)",
            textDecoration: "none",
            whiteSpace: "nowrap",
          }}
        >
          {SITE.name}
        </Link>

        <nav style={{ display: "flex", alignItems: "center", gap: "32px" }}>
          {[
            { label: "Services", href: "/#services" },
            { label: "How it works", href: "/#how-it-works" },
            { label: "Work", href: "/#work" },
          ].map(link => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                fontSize: "13px",
                color: "var(--text-secondary)",
                textDecoration: "none",
                letterSpacing: "0.01em",
                transition: "color 200ms ease",
              }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "var(--text-primary)")}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "var(--text-secondary)")}
            >
              {link.label}
            </Link>
          ))}

          <Link
            href="/contact"
            style={{
              fontSize: "13px",
              color: "var(--text-primary)",
              background: "var(--bg-card)",
              border: "1px solid var(--border-mid)",
              padding: "7px 16px",
              borderRadius: "6px",
              textDecoration: "none",
              transition: "border-color 200ms ease, background 200ms ease",
              fontFamily: "var(--font-body)",
              fontWeight: 500,
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = "var(--accent)";
              el.style.background = "var(--accent-dim)";
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = "var(--border-mid)";
              el.style.background = "var(--bg-card)";
            }}
          >
            Get in touch
          </Link>
        </nav>
      </div>
    </motion.header>
  );
}
