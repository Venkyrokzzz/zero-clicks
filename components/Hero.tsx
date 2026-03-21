// components/Hero.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { HERO } from "@/lib/content";

const ease = [0.25, 0.1, 0.25, 1.0] as const;

export default function Hero() {
  return (
    <section
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        padding: "0 24px",
      }}
    >
      {/* Blueprint grid lines */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
        }}
      >
        {/* Horizontal line at 65% */}
        <div
          style={{
            position: "absolute",
            top: "65%",
            left: 0,
            right: 0,
            height: "1px",
            backgroundColor: "var(--border)",
            opacity: 0.4,
          }}
        />
        {/* Vertical line at 15% */}
        <div
          style={{
            position: "absolute",
            left: "15%",
            top: 0,
            bottom: 0,
            width: "1px",
            backgroundColor: "var(--border)",
            opacity: 0.4,
          }}
        />
      </div>

      {/* Content */}
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          width: "100%",
          paddingTop: "80px",
        }}
      >
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          style={{
            fontSize: "11px",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "var(--accent)",
            marginBottom: "32px",
            fontFamily: "var(--font-body)",
            fontWeight: 500,
          }}
        >
          AI Automation Consultancy
        </motion.p>

        {/* Headline — two lines, each animates separately */}
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 400,
            fontSize: "clamp(3rem, 7vw, 6rem)",
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            color: "var(--text-primary)",
            margin: "0 0 32px 0",
          }}
        >
          <motion.span
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0 }}
            style={{ display: "block" }}
          >
            Stop doing it
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.15 }}
            style={{ display: "block" }}
          >
            manually.
          </motion.span>
        </h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.35 }}
          style={{
            maxWidth: "480px",
            fontSize: "1rem",
            color: "var(--text-secondary)",
            lineHeight: 1.7,
            marginBottom: "48px",
            fontFamily: "var(--font-body)",
            fontWeight: 400,
          }}
        >
          {HERO.subtext}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.5 }}
          style={{ display: "flex", alignItems: "center", gap: "32px", flexWrap: "wrap" }}
        >
          <Link
            href={HERO.ctaPrimary.href}
            style={{
              fontSize: "13px",
              color: "var(--accent)",
              border: "1px solid var(--accent)",
              padding: "12px 24px",
              textDecoration: "none",
              letterSpacing: "0.05em",
              borderRadius: 0,
              backgroundColor: "transparent",
              transition: "background-color 200ms ease",
              fontFamily: "var(--font-body)",
              fontWeight: 500,
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = "var(--accent-dim)")}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            {HERO.ctaPrimary.label}
          </Link>
          <Link
            href={HERO.ctaSecondary.href}
            style={{
              fontSize: "13px",
              color: "var(--text-secondary)",
              textDecoration: "none",
              textUnderlineOffset: "4px",
              fontFamily: "var(--font-body)",
              fontWeight: 400,
              transition: "color 200ms ease",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = "var(--text-primary)";
              e.currentTarget.style.textDecoration = "underline";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = "var(--text-secondary)";
              e.currentTarget.style.textDecoration = "none";
            }}
          >
            {HERO.ctaSecondary.label}
          </Link>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "120px",
          background: "linear-gradient(to bottom, transparent, var(--bg))",
          pointerEvents: "none",
        }}
      />
    </section>
  );
}
