// components/Navbar.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { SITE } from "@/lib/content";
import { motion, AnimatePresence } from "framer-motion";

const PRODUCTS = [
  { label: "Inbox Autopilot", href: "/#services", description: "Email handled 24/7" },
  { label: "Reputation Manager", href: "/#services", description: "Reviews + complaints" },
];

const NAV_LINKS = [
  { label: "Services", href: "/#services" },
  { label: "How it works", href: "/#how-it-works" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProductsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const closeAll = () => {
    setProductsOpen(false);
    setMobileOpen(false);
  };

  return (
    <>
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
          backgroundColor: scrolled || mobileOpen ? "rgba(10,10,16,0.96)" : "transparent",
          backdropFilter: scrolled || mobileOpen ? "blur(12px)" : "none",
          transition: "border-color 250ms ease, background-color 250ms ease",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 24px",
            height: "60px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            onClick={(e) => {
              if (typeof window !== "undefined" && window.location.pathname === "/") {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
              closeAll();
            }}
            style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}
          >
            <Image
              src="/logo.png"
              alt="Zero Clicks"
              width={36}
              height={36}
              unoptimized
              style={{ borderRadius: "8px" }}
            />
            <span style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.05rem",
              color: "var(--text-primary)",
              whiteSpace: "nowrap",
            }}>
              {SITE.name}
            </span>
          </Link>

          {/* Desktop nav */}
          <nav
            className="desktop-nav"
            style={{ display: "flex", alignItems: "center", gap: "32px" }}
          >
            {NAV_LINKS.map((link) => (
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
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-primary)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-secondary)")}
              >
                {link.label}
              </Link>
            ))}

            {/* Products dropdown */}
            <div ref={dropdownRef} style={{ position: "relative" }}>
              <button
                onClick={() => setProductsOpen((o) => !o)}
                style={{
                  fontSize: "13px",
                  color: productsOpen ? "var(--text-primary)" : "var(--text-secondary)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  letterSpacing: "0.01em",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  padding: 0,
                  transition: "color 200ms ease",
                  fontFamily: "var(--font-body)",
                }}
              >
                Products
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none"
                  style={{ transform: productsOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 200ms ease" }}>
                  <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <AnimatePresence>
                {productsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.18 }}
                    style={{
                      position: "absolute",
                      top: "calc(100% + 12px)",
                      right: 0,              // align to right edge — never overflows
                      background: "var(--bg-card)",
                      border: "1px solid var(--border-mid)",
                      borderRadius: "10px",
                      padding: "8px",
                      minWidth: "220px",
                      boxShadow: "0 16px 40px rgba(0,0,0,0.4)",
                      zIndex: 100,
                    }}
                  >
                    {PRODUCTS.map((product) => (
                      <Link
                        key={product.label}
                        href={product.href}
                        onClick={() => setProductsOpen(false)}
                        style={{
                          display: "block",
                          padding: "10px 14px",
                          borderRadius: "6px",
                          textDecoration: "none",
                          transition: "background 150ms ease",
                        }}
                        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--bg-hover)")}
                        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                      >
                        <p style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-primary)", margin: 0, fontFamily: "var(--font-body)" }}>
                          {product.label}
                        </p>
                        <p style={{ fontSize: "11px", color: "var(--text-muted)", margin: "2px 0 0", fontFamily: "var(--font-body)" }}>
                          {product.description}
                        </p>
                      </Link>
                    ))}
                    <div style={{ height: "1px", background: "var(--border)", margin: "6px 8px" }} />
                    <Link
                      href="/demo"
                      onClick={() => setProductsOpen(false)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "10px 14px",
                        borderRadius: "6px",
                        textDecoration: "none",
                        background: "var(--accent-dim)",
                        border: "1px solid rgba(59,130,246,0.15)",
                        transition: "background 150ms ease",
                      }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(59,130,246,0.12)")}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--accent-dim)")}
                    >
                      <span style={{ fontSize: "14px" }}>🎬</span>
                      <div>
                        <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--accent)", margin: 0, fontFamily: "var(--font-body)" }}>Live Demo</p>
                        <p style={{ fontSize: "11px", color: "var(--text-secondary)", margin: "2px 0 0", fontFamily: "var(--font-body)" }}>See it working right now</p>
                      </div>
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

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
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "var(--accent)";
                el.style.background = "var(--accent-dim)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "var(--border-mid)";
                el.style.background = "var(--bg-card)";
              }}
            >
              Book a free call
            </Link>
          </nav>

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
              padding: "4px",
              color: "var(--text-primary)",
            }}
          >
            <AnimatePresence mode="wait" initial={false}>
              {mobileOpen ? (
                <motion.svg key="close" width="22" height="22" viewBox="0 0 24 24" fill="none"
                  initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}>
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </motion.svg>
              ) : (
                <motion.svg key="menu" width="22" height="22" viewBox="0 0 24 24" fill="none"
                  initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.15 }}>
                  <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </motion.svg>
              )}
            </AnimatePresence>
          </button>
        </div>

        {/* Mobile menu panel */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              style={{
                overflow: "hidden",
                borderTop: "1px solid var(--border)",
                background: "rgba(10,10,16,0.98)",
              }}
            >
              <div style={{ padding: "16px 24px 24px", display: "flex", flexDirection: "column", gap: "4px" }}>
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeAll}
                    style={{
                      fontSize: "15px",
                      color: "var(--text-secondary)",
                      textDecoration: "none",
                      padding: "12px 0",
                      borderBottom: "1px solid var(--border)",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    {link.label}
                  </Link>
                ))}

                {/* Products expanded inline on mobile */}
                <div style={{ padding: "12px 0", borderBottom: "1px solid var(--border)" }}>
                  <p style={{ fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", fontFamily: "var(--font-mono)", margin: "0 0 10px" }}>
                    Products
                  </p>
                  {PRODUCTS.map((product) => (
                    <Link
                      key={product.label}
                      href={product.href}
                      onClick={closeAll}
                      style={{
                        display: "block",
                        padding: "8px 0",
                        textDecoration: "none",
                      }}
                    >
                      <span style={{ fontSize: "14px", color: "var(--text-primary)", fontFamily: "var(--font-body)", fontWeight: 500 }}>
                        {product.label}
                      </span>
                      <span style={{ display: "block", fontSize: "11px", color: "var(--text-muted)", fontFamily: "var(--font-body)", marginTop: "2px" }}>
                        {product.description}
                      </span>
                    </Link>
                  ))}
                  <Link
                    href="/demo"
                    onClick={closeAll}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "10px 12px",
                      marginTop: "8px",
                      borderRadius: "8px",
                      background: "var(--accent-dim)",
                      border: "1px solid rgba(59,130,246,0.15)",
                      textDecoration: "none",
                    }}
                  >
                    <span style={{ fontSize: "14px" }}>🎬</span>
                    <div>
                      <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--accent)", margin: 0, fontFamily: "var(--font-body)" }}>Live Demo</p>
                      <p style={{ fontSize: "11px", color: "var(--text-secondary)", margin: "2px 0 0", fontFamily: "var(--font-body)" }}>See it working right now</p>
                    </div>
                  </Link>
                </div>

                <Link
                  href="/contact"
                  onClick={closeAll}
                  style={{
                    display: "block",
                    marginTop: "12px",
                    padding: "14px",
                    background: "var(--text-primary)",
                    color: "#000",
                    borderRadius: "8px",
                    textDecoration: "none",
                    textAlign: "center",
                    fontSize: "14px",
                    fontWeight: 600,
                    fontFamily: "var(--font-body)",
                  }}
                >
                  Book a free call
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 680px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
}
