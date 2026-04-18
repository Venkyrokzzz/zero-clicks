// components/ProductPageShell.tsx — shared layout for all product pages
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ReactNode } from "react";

interface Props {
  eyebrow: string;          // e.g. "PRODUCT · REPUTATION MANAGER"
  headline: ReactNode;      // main h1
  subtext: string;          // one-line description
  status?: "live" | "beta" | "soon";
  accentColor: string;      // e.g. "#60a5fa"
  children: ReactNode;      // body content
}

export default function ProductPageShell({
  eyebrow, headline, subtext, status = "live", accentColor, children,
}: Props) {
  const statusLabel =
    status === "live" ? "LIVE" :
    status === "beta" ? "BETA" : "COMING SOON";
  const statusColor =
    status === "live" ? "#10b981" :
    status === "beta" ? "#f59e0b" : "#a78bfa";

  return (
    <main
      style={{
        minHeight: "100vh",
        position: "relative",
        paddingTop: "120px",
        paddingBottom: "80px",
        background: "var(--bg)",
        overflow: "hidden",
      }}
    >
      {/* ── Decorative gradient glow ── */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "-200px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "900px",
          height: "600px",
          background: `radial-gradient(ellipse at center, ${accentColor}22 0%, transparent 60%)`,
          filter: "blur(60px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "1120px",
          margin: "0 auto",
          padding: "0 24px",
        }}
      >
        {/* Eyebrow + status */}
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "20px",
          }}
        >
          <span style={{
            fontSize: "11px", letterSpacing: "0.12em",
            color: "rgba(255,255,255,0.45)",
            fontFamily: "var(--font-mono)",
            textTransform: "uppercase",
          }}>
            {eyebrow}
          </span>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: "5px",
            padding: "3px 8px", borderRadius: "9999px",
            background: `${statusColor}14`,
            border: `1px solid ${statusColor}30`,
          }}>
            <motion.div
              animate={{ opacity: [1, 0.35, 1] }}
              transition={{ duration: 1.8, repeat: Infinity }}
              style={{ width: "5px", height: "5px", borderRadius: "50%", background: statusColor }}
            />
            <span style={{
              fontSize: "9px", fontWeight: 700, letterSpacing: "0.1em",
              color: statusColor, fontFamily: "var(--font-mono)",
            }}>
              {statusLabel}
            </span>
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{
            fontSize: "clamp(2.4rem, 6vw, 4.2rem)",
            fontWeight: 800,
            letterSpacing: "-0.04em",
            lineHeight: 1.05,
            margin: "0 0 20px",
            maxWidth: "820px",
            color: "var(--text-primary)",
          }}
        >
          {headline}
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            fontSize: "clamp(1rem, 1.6vw, 1.15rem)",
            color: "var(--text-secondary)",
            lineHeight: 1.65,
            maxWidth: "640px",
            margin: "0 0 36px",
            fontFamily: "var(--font-body)",
          }}
        >
          {subtext}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "60px" }}
        >
          <Link
            href="/contact"
            style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              padding: "12px 22px",
              background: "#fff",
              color: "#0a0c14",
              fontSize: "14px", fontWeight: 700,
              textDecoration: "none", borderRadius: "10px",
              fontFamily: "var(--font-body)",
              transition: "transform 150ms ease",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.transform = "translateY(-1px)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.transform = "translateY(0)")}
          >
            Book a free 30-min call
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
          <Link
            href="/demo"
            style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              padding: "12px 20px",
              background: "transparent",
              color: "rgba(255,255,255,0.7)",
              fontSize: "14px", fontWeight: 500,
              textDecoration: "none", borderRadius: "10px",
              border: "1px solid rgba(255,255,255,0.12)",
              fontFamily: "var(--font-body)",
              transition: "color 150ms ease, border-color 150ms ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color = "#fff";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.25)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.7)";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.12)";
            }}
          >
            See the demo →
          </Link>
        </motion.div>

        {/* Body content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          {children}
        </motion.div>
      </div>
    </main>
  );
}
