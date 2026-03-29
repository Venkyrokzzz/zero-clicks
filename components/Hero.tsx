"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { HERO } from "@/lib/content";
import dynamic from "next/dynamic";

const N8NFlowBackground = dynamic(() => import("./N8NFlowBackground"), {
  ssr: false,
});
const N8NWorkflowDemo = dynamic(() => import("./N8NWorkflowDemo"), {
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
      }}
    >
      <N8NFlowBackground />
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
            Automation Command Center
          </span>
        </motion.div>

        {/* Headline */}
        <h1
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontWeight: 600,
            fontSize: "clamp(3rem, 7vw, 6rem)",
            lineHeight: 1.05,
            letterSpacing: "-0.04em",
            color: "#FFFFFF",
            margin: "0 0 24px",
          }}
        >
          <motion.span
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.05 }}
            style={{ display: "block" }}
          >
            Your inbox, handled.
          </motion.span>
          <motion.span
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.15 }}
            style={{
              display: "block",
              color: "#A1A1AA",
            }}
          >
            Everything else? Handled.
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
          <Link
            href={HERO.ctaPrimary.href}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              fontSize: "14px",
              fontFamily: "var(--font-body)",
              fontWeight: 600,
              color: "#000000",
              background: "#ffffff",
              padding: "12px 20px 12px 24px",
              borderRadius: "8px",
              textDecoration: "none",
              transition: "opacity 200ms ease, transform 200ms ease",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.opacity = "0.9";
              (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.opacity = "1";
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
            }}
          >
            <span>{HERO.ctaPrimary.label}</span>
            <kbd style={{ 
              background: "rgba(0,0,0,0.1)", 
              padding: "2px 6px", 
              borderRadius: "4px",
              fontSize: "12px",
              fontFamily: "var(--font-mono)",
            }}>↵</kbd>
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

        {/* Raycast-style UI Mockup with Flow Automation Inside */}
        <motion.div
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease, delay: 0.5 }}
          style={{
            marginTop: "80px",
            width: "100%",
            height: "520px",
            background: "rgba(18, 18, 20, 0.7)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid var(--border-strong)",
            borderRadius: "16px",
            boxShadow: "0 32px 64px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {/* Faux OS Toolbar */}
          <div style={{
            display: "flex", alignItems: "center", gap: "8px", padding: "16px 24px", borderBottom: "1px solid var(--border)"
          }}>
            <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#ff5f56" }} />
            <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#ffbd2e" }} />
            <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#27c93f" }} />
            
            <div style={{ marginLeft: "12px", flex: 1, display: "flex", alignItems: "center", color: "var(--text-muted)", fontFamily: "var(--font-mono)", fontSize: "13px" }}>
              <span style={{ color: "var(--accent)" }}>~</span> /workflows/handle-inquiry.ts
            </div>
          </div>

          {/* n8n Flow Demo */}
          <N8NWorkflowDemo />
        </motion.div>
      </div>
    </section>
  );
}
