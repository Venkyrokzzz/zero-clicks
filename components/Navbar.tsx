// components/Navbar.tsx — Raycast-inspired floating pill nav
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SITE } from "@/lib/content";

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
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 50,
          width: "calc(100% - 32px)",
          maxWidth: "1120px",
        }}
      >
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 14px 10px 18px",
            borderRadius: "14px",
            background: scrolled
              ? "rgba(10, 12, 20, 0.85)"
              : "rgba(10, 12, 20, 0.55)",
            backdropFilter: "blur(20px) saturate(140%)",
            WebkitBackdropFilter: "blur(20px) saturate(140%)",
            border: "1px solid rgba(255,255,255,0.07)",
            boxShadow: scrolled
              ? "0 16px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)"
              : "0 8px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.03)",
            transition: "background 250ms ease, box-shadow 250ms ease",
          }}
        >
          {/* Logo — left anchor */}
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "9px",
              textDecoration: "none",
              flex: "0 0 auto",
              minWidth: "140px",
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
              fontSize: "15px",
              fontWeight: 600,
              color: "#fff",
              letterSpacing: "-0.01em",
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
              gap: "2px",
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
                    padding: "7px 14px",
                    borderRadius: "8px",
                    fontSize: "13px",
                    fontWeight: 500,
                    color: active ? "#fff" : "rgba(255,255,255,0.55)",
                    textDecoration: "none",
                    letterSpacing: "-0.005em",
                    transition: "color 180ms ease, background 180ms ease",
                    fontFamily: "var(--font-body)",
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      (e.currentTarget as HTMLElement).style.color = "#fff";
                      (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.55)";
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
                        background: "rgba(255,255,255,0.06)",
                        borderRadius: "8px",
                        border: "1px solid rgba(255,255,255,0.08)",
                        zIndex: -1,
                      }}
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Right side: primary CTA — right anchor, matches logo min-width */}
          <div className="desktop-cta" style={{ display: "flex", alignItems: "center", gap: "8px", flex: "0 0 auto", minWidth: "140px", justifyContent: "flex-end" }}>
            <Link
              href="/contact"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 16px",
                background: "#fff",
                color: "#0a0c14",
                fontSize: "13px",
                fontWeight: 600,
                textDecoration: "none",
                borderRadius: "8px",
                fontFamily: "var(--font-body)",
                transition: "transform 150ms ease, box-shadow 150ms ease",
                boxShadow: "0 1px 2px rgba(0,0,0,0.15)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 12px rgba(255,255,255,0.12)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 1px 2px rgba(0,0,0,0.15)";
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
