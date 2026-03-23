// components/Hero.tsx
"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import { HERO } from "@/lib/content";
import WorkflowAnimation from "./WorkflowAnimation";

const ease = [0.25, 0.1, 0.25, 1.0] as const;

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yContent = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const opacityContent = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={ref}
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        padding: "0 48px",
      }}
    >
      {/* Subtle top-left glow */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          width: "500px",
          height: "500px",
          top: "-100px",
          left: "-100px",
          background: "radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 70%)",
          pointerEvents: "none",
          filter: "blur(40px)",
        }}
      />

      <motion.div
        style={{ y: yContent, opacity: opacityContent, width: "100%" }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr auto",
            alignItems: "center",
            gap: "80px",
            paddingTop: "80px",
          }}
          className="grid-cols-1 md:grid-cols-[1fr_auto]"
        >
          {/* ── Left: copy ─────────────────────────────────────── */}
          <div style={{ maxWidth: "580px" }}>
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "32px",
                padding: "5px 12px",
                border: "1px solid var(--border-mid)",
                borderRadius: "20px",
                background: "var(--bg-surface)",
              }}
            >
              <div
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: "var(--accent)",
                  animation: "status-pulse 2s ease-in-out infinite",
                }}
              />
              <span
                style={{
                  fontSize: "11px",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--text-secondary)",
                  fontFamily: "var(--font-body)",
                  fontWeight: 500,
                }}
              >
                AI Automation · UK
              </span>
            </motion.div>

            {/* Headline */}
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 400,
                fontSize: "clamp(2.8rem, 5.5vw, 5rem)",
                lineHeight: 1.05,
                letterSpacing: "-0.025em",
                color: "var(--text-primary)",
                margin: "0 0 28px",
              }}
            >
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease, delay: 0.05 }}
                style={{ display: "block" }}
              >
                Stop doing it
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease, delay: 0.18 }}
                style={{
                  display: "block",
                  color: "var(--accent)",
                }}
              >
                manually.
              </motion.span>
            </h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease, delay: 0.35 }}
              style={{
                fontSize: "1.05rem",
                color: "var(--text-secondary)",
                lineHeight: 1.75,
                marginBottom: "44px",
                fontFamily: "var(--font-body)",
                fontWeight: 400,
                maxWidth: "460px",
              }}
            >
              {HERO.subtext}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease, delay: 0.5 }}
              style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" }}
            >
              <Link
                href={HERO.ctaPrimary.href}
                style={{
                  fontSize: "14px",
                  fontFamily: "var(--font-body)",
                  fontWeight: 500,
                  color: "#fff",
                  background: "var(--accent)",
                  padding: "12px 24px",
                  borderRadius: "6px",
                  textDecoration: "none",
                  letterSpacing: "0.01em",
                  transition: "opacity 200ms ease, transform 200ms ease",
                  display: "inline-block",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.opacity = "0.88";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.opacity = "1";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                }}
              >
                {HERO.ctaPrimary.label}
              </Link>

              <Link
                href={HERO.ctaSecondary.href}
                style={{
                  fontSize: "14px",
                  fontFamily: "var(--font-body)",
                  fontWeight: 400,
                  color: "var(--text-secondary)",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  transition: "color 200ms ease",
                }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "var(--text-primary)")}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "var(--text-secondary)")}
              >
                {HERO.ctaSecondary.label} →
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              style={{
                marginTop: "64px",
                display: "flex",
                gap: "40px",
                paddingTop: "32px",
                borderTop: "1px solid var(--border)",
              }}
            >
              {[
                { val: "5 min", label: "Typical setup" },
                { val: "24/7", label: "Runs non-stop" },
                { val: "Days", label: "Not months" },
              ].map(s => (
                <div key={s.label}>
                  <p
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "1.8rem",
                      color: "var(--text-primary)",
                      margin: "0 0 4px",
                      lineHeight: 1,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {s.val}
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "11px",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "var(--text-muted)",
                      margin: 0,
                      fontWeight: 500,
                    }}
                  >
                    {s.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── Right: n8n workflow animation ──────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.3 }}
            style={{ flexShrink: 0, perspective: "1200px" }}
  
          >
            <WorkflowAnimation />
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom fade */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "80px",
          background: "linear-gradient(to bottom, transparent, var(--bg))",
          pointerEvents: "none",
        }}
      />
    </section>
  );
}
