// components/Navbar.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SITE } from "@/lib/content";
import { motion } from "framer-motion";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
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
        backgroundColor: scrolled ? "rgba(12,12,11,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(8px)" : "none",
        transition: "border-color 300ms ease, background-color 300ms ease",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "0 24px",
          height: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link
          href="/"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.1rem",
            color: "var(--text-primary)",
            textDecoration: "none",
            whiteSpace: "nowrap",
          }}
        >
          {SITE.name}
        </Link>

        <nav style={{ display: "flex", alignItems: "center", gap: "32px" }}>
          <Link
            href="#services"
            style={{
              fontSize: "13px",
              color: "var(--text-secondary)",
              textDecoration: "none",
              letterSpacing: "0.02em",
            }}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--text-primary)")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--text-secondary)")}
          >
            Services
          </Link>
          <Link
            href="#how-it-works"
            style={{
              fontSize: "13px",
              color: "var(--text-secondary)",
              textDecoration: "none",
              letterSpacing: "0.02em",
            }}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--text-primary)")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--text-secondary)")}
          >
            How it works
          </Link>
          <Link
            href="/contact"
            style={{
              fontSize: "13px",
              color: "var(--accent)",
              border: "1px solid var(--accent)",
              padding: "8px 16px",
              textDecoration: "none",
              letterSpacing: "0.05em",
              borderRadius: 0,
              transition: "background-color 200ms ease",
              backgroundColor: "transparent",
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = "var(--accent-dim)")}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            Get in touch
          </Link>
        </nav>
      </div>
    </motion.header>
  );
}
