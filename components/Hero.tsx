"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { HERO } from "@/lib/content";
import dynamic from "next/dynamic";
import MagneticButton from "./MagneticButton";

const N8nSciFiBackground = dynamic(() => import("./N8nSciFiBackground"), {
  ssr: false,
});

const ease = [0.25, 0.1, 0.25, 1.0] as const;

export default function Hero() {
  return (
    <section
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        padding: "160px 48px 80px",
        background: "transparent",
        isolation: "isolate",
      }}
    >
      <N8nSciFiBackground />
      <div
        style={{
          maxWidth: "960px",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          zIndex: 10,
          position: "relative",
        }}
      >
        {/* Eyebrow */}
        <motion.div
           animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "32px",
            padding: "6px 16px",
            border: "1px solid var(--border-mid)",
            borderRadius: "24px",
            background: "rgba(255,255,255,0.03)",
            backdropFilter: "blur(8px)",
          }}
        >
          <div
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "var(--accent)",
              boxShadow: "0 0 10px var(--accent)",
            }}
          />
          <span
            style={{
              fontSize: "12px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--text-secondary)",
              fontFamily: "var(--font-body)",
              fontWeight: 500,
            }}
          >
            n8n · Claude AI · Built for UK SMEs
          </span>
        </motion.div>

        {/* Headline */}
        <h1
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontWeight: 700,
            fontSize: "clamp(3rem, 7vw, 6rem)",
            lineHeight: 1.05,
            letterSpacing: "-0.04em",
            margin: "0 0 24px",
            background: "linear-gradient(to bottom, #ffffff, #ffffff 60%, #71717a)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          <motion.span
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.05 }}
            style={{ display: "block" }}
          >
            You run the business.
          </motion.span>
          <motion.span
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.15 }}
            style={{ display: "block" }}
          >
            AI runs everything else.
          </motion.span>
        </h1>

        {/* Subtext */}
        <motion.p
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.25 }}
          style={{
            fontSize: "1.15rem",
            color: "#A1A1AA",
            lineHeight: 1.7,
            marginBottom: "48px",
            fontFamily: "Inter, system-ui, sans-serif",
            fontWeight: 400,
            maxWidth: "600px",
          }}
        >
          {HERO.subtext}
        </motion.p>

        {/* CTAs */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease, delay: 0.35 }}
          style={{ display: "flex", alignItems: "center", gap: "24px", flexWrap: "wrap", justifyContent: "center" }}
        >
          <Link href={HERO.ctaPrimary.href} style={{ textDecoration: "none" }}>
            <MagneticButton>
              <span>{HERO.ctaPrimary.label}</span>
            </MagneticButton>
          </Link>

          <Link
            href="/demo"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              fontSize: "14px",
              fontFamily: "var(--font-body)",
              fontWeight: 500,
              color: "var(--text-primary)",
              textDecoration: "none",
              padding: "12px 20px 12px 24px",
              borderRadius: "8px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid var(--border-mid)",
              transition: "all 200ms ease",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)";
            }}
          >
            <span>See the demo</span>
            <kbd style={{ 
              background: "rgba(255,255,255,0.1)", 
              color: "var(--text-muted)",
              padding: "2px 6px", 
              borderRadius: "4px",
              fontSize: "12px",
              fontFamily: "var(--font-mono)",
            }}>⌘K</kbd>
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
