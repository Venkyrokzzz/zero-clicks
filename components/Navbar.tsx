// components/Navbar.tsx — Raycast-inspired floating pill nav
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SITE } from "@/lib/content";
import ThemeToggle from "./ThemeToggle";

const NAV_ITEMS = [
  { label: "Reputation", href: "/products/reputation-manager" },
  { label: "Inbox",      href: "/products/inbox-autopilot" },
  { label: "Footfall",   href: "/products/footfall-engine" },
  { label: "Demo",       href: "/demo" },
  { label: "Pricing",    href: "/#pricing" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  useEffect(() => {
    setMobileOpen(false); // close on navigation
  }, [pathname]);

  const isActive = (href: string) => {
    if (href.startsWith("/#")) return false;
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* ── Floating pill nav ───────────────────────────── */}
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        style={{
          position: "fixed",
          top: "16px",
          left: 0,
          right: 0,
          zIndex: 50,
          display: "flex",
          justifyContent: "center",
          padding: "0 16px",
          pointerEvents: "none",
        }}
      >
        <nav
          style={{
            width: "100%",
            maxWidth: "1120px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 16px 12px 20px",
            borderRadius: "16px",
            background: "rgba(8,12,28,0.55)",
            backdropFilter: "blur(24px) saturate(160%)",
            WebkitBackdropFilter: "blur(24px) saturate(160%)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 4px 32px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.07)",
            transition: "background 300ms ease, box-shadow 300ms ease",
            pointerEvents: "all",
            position: "relative",
          }}
        >
          {/* Top shimmer line — simulates glass highlight since backdrop-filter can't see canvas */}
          <div aria-hidden style={{
            position: "absolute",
            top: 0, left: "10%", right: "10%", height: "1px",
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.12) 40%, rgba(255,255,255,0.08) 60%, transparent)",
            borderRadius: "1px",
          }} />

          {/* Logo — left anchor */}
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              textDecoration: "none",
              flex: 1,
            }}
          >
            <Image
              src="/logo.png"
              alt="Zero Clicks"
              width={28}
              height={28}
              unoptimized
              style={{ borderRadius: "7px" }}
            />
            <span style={{
              fontFamily: "var(--font-display)",
              fontSize: "17px",
              fontWeight: 700,
              color: "#fff",
              letterSpacing: "0.01em",
              whiteSpace: "nowrap",
            }}>
              {SITE.name}
            </span>
          </Link>

          {/* Desktop nav items — true centre via flex:1 columns */}
          <div
            className="desktop-nav-items"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              flex: 1,
              justifyContent: "center",
            }}
          >
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    position: "relative",
                    padding: "9px 20px",
                    borderRadius: "10px",
                    fontSize: "16px",
                    fontWeight: 500,
                    color: active ? "#e2e8f0" : "rgba(255,255,255,0.45)",
                    textDecoration: "none",
                    letterSpacing: "0.02em",
                    transition: "color 200ms ease, background 200ms ease",
                    fontFamily: "var(--font-body)",
                    whiteSpace: "nowrap",
                    background: active ? "rgba(6,182,212,0.08)" : "transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      (e.currentTarget as HTMLElement).style.color = "#e2e8f0";
                      (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.45)";
                      (e.currentTarget as HTMLElement).style.background = "transparent";
                    }
                  }}
                >
                  {active && (
                    <motion.span
                      layoutId="navActive"
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "rgba(6,182,212,0.08)",
                        borderRadius: "9px",
                        border: "1px solid rgba(6,182,212,0.18)",
                        boxShadow: "inset 0 1px 0 rgba(6,182,212,0.1)",
                        zIndex: -1,
                      }}
                      transition={{ type: "spring", stiffness: 400, damping: 34 }}
                    />
                  )}
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Right side: theme toggle + CTA */}
          <div className="desktop-cta" style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1, justifyContent: "flex-end" }}>
            <ThemeToggle />
            <Link
              href="/contact"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "10px 22px",
                background: "linear-gradient(135deg, rgba(6,182,212,0.18) 0%, rgba(59,130,246,0.18) 100%)",
                color: "#fff",
                fontSize: "15px",
                fontWeight: 600,
                textDecoration: "none",
                borderRadius: "9px",
                letterSpacing: "0.02em",
                fontFamily: "var(--font-body)",
                border: "1px solid rgba(6,182,212,0.45)",
                boxShadow: "0 0 24px rgba(6,182,212,0.15), inset 0 1px 0 rgba(255,255,255,0.12)",
                backdropFilter: "blur(8px)",
                transition: "transform 150ms ease, box-shadow 150ms ease, border-color 150ms ease",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = "translateY(-1px)";
                el.style.boxShadow = "0 0 28px rgba(6,182,212,0.2), inset 0 1px 0 rgba(255,255,255,0.1)";
                el.style.borderColor = "rgba(6,182,212,0.5)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = "translateY(0)";
                el.style.boxShadow = "0 0 20px rgba(6,182,212,0.08), inset 0 1px 0 rgba(255,255,255,0.08)";
                el.style.borderColor = "rgba(6,182,212,0.3)";
              }}
            >
              Book a call
            </Link>
          </div>

          {/* Mobile: hamburger */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
            style={{
              display: "none",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "6px",
              color: "#fff",
            }}
          >
            <AnimatePresence mode="wait" initial={false}>
              {mobileOpen ? (
                <motion.svg key="close" width="20" height="20" viewBox="0 0 24 24" fill="none"
                  initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </motion.svg>
              ) : (
                <motion.svg key="menu" width="20" height="20" viewBox="0 0 24 24" fill="none"
                  initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </motion.svg>
              )}
            </AnimatePresence>
          </button>
        </nav>
      </motion.header>

      {/* ── Mobile menu panel ──────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 45,
              background: "rgba(3, 5, 12, 0.92)",
              backdropFilter: "blur(24px)",
              paddingTop: "80px",
              padding: "80px 24px 40px",
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 }}
              style={{ display: "flex", flexDirection: "column", gap: "4px", maxWidth: "480px", margin: "0 auto" }}
            >
              {NAV_ITEMS.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 + i * 0.04 }}
                >
                  <Link
                    href={item.href}
                    style={{
                      display: "block",
                      fontSize: "22px",
                      fontWeight: 600,
                      color: isActive(item.href) ? "#fff" : "rgba(255,255,255,0.5)",
                      textDecoration: "none",
                      padding: "14px 0",
                      borderBottom: "1px solid rgba(255,255,255,0.06)",
                      fontFamily: "var(--font-display)",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.35 }}
              >
                <Link
                  href="/contact"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    marginTop: "32px",
                    padding: "16px",
                    background: "#fff",
                    color: "#0a0c14",
                    borderRadius: "12px",
                    textDecoration: "none",
                    fontSize: "15px",
                    fontWeight: 700,
                    fontFamily: "var(--font-body)",
                  }}
                >
                  Book a free 15-min call
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Responsive */}
      <style>{`
        @media (max-width: 820px) {
          .desktop-nav-items { display: none !important; }
          .desktop-cta { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
}
