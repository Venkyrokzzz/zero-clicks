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
      initial={{ opacity: 0, y: -14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1.0] }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.07)" : "1px solid transparent",
        backgroundColor: scrolled ? "rgba(6,6,14,0.75)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
        transition: "border-color 300ms ease, background-color 300ms ease",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 48px",
          height: "62px",
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
            letterSpacing: "-0.01em",
          }}
        >
          {SITE.name}
        </Link>

        <nav style={{ display: "flex", alignItems: "center", gap: "32px" }}>
          {["#services", "#how-it-works"].map((href, i) => (
            <Link
              key={href}
              href={href}
              style={{
                fontSize: "13px",
                color: "var(--text-secondary)",
                textDecoration: "none",
                letterSpacing: "0.02em",
                transition: "color 200ms ease",
              }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "var(--text-primary)")}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "var(--text-secondary)")}
            >
              {i === 0 ? "Services" : "How it works"}
            </Link>
          ))}

          <Link
            href="/contact"
            style={{
              fontSize: "13px",
              color: "var(--text-primary)",
              border: "1px solid rgba(255,255,255,0.15)",
              padding: "8px 18px",
              textDecoration: "none",
              letterSpacing: "0.04em",
              borderRadius: "6px",
              transition: "background 200ms ease, border-color 200ms ease",
              backgroundColor: "rgba(255,255,255,0.05)",
              backdropFilter: "blur(8px)",
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.backgroundColor = "rgba(255,255,255,0.1)";
              el.style.borderColor = "rgba(255,255,255,0.3)";
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.backgroundColor = "rgba(255,255,255,0.05)";
              el.style.borderColor = "rgba(255,255,255,0.15)";
            }}
          >
            Get in touch
          </Link>
        </nav>
      </div>
    </motion.header>
  );
}
