// components/About.tsx
"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ABOUT, SITE } from "@/lib/content";

const ease = [0.25, 0.1, 0.25, 1.0] as const;

export default function About() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <section
      style={{
        borderTop: "1px solid var(--border)",
        padding: "80px 48px",
        background: "transparent",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        {/* Section label row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease }}
          style={{ marginBottom: "64px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}
        >
          <h2 style={{
            fontFamily: "var(--font-display)", fontWeight: 600, letterSpacing: "-0.03em",
            fontSize: "clamp(2rem, 4vw, 3rem)", color: "var(--text-primary)", margin: 0, lineHeight: 1.1,
          }}>
            Who builds this.
          </h2>
          <div style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)", fontSize: "13px", paddingBottom: "6px" }}>
            // 06 About
          </div>
        </motion.div>
      </div>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease }}
        style={{ maxWidth: "1100px", margin: "0 auto" }}
        className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-start"
      >
        {/* Left */}
        <div>
          <h3 style={{
            fontFamily: "var(--font-display)", fontWeight: 500,
            fontSize: "clamp(1.6rem, 3vw, 2.2rem)", color: "var(--text-primary)",
            margin: 0, lineHeight: 1.2, letterSpacing: "-0.02em",
          }}>
            {ABOUT.heading}
          </h3>
        </div>

        {/* Right */}
        <div>
          <p style={{
            fontFamily: "var(--font-body)", fontWeight: 400,
            fontSize: "1rem", color: "var(--text-secondary)",
            lineHeight: 1.8, marginBottom: "40px", margin: "0 0 40px",
          }}>
            {ABOUT.body}
          </p>
          <div style={{ borderTop: "1px solid var(--border)", paddingTop: "24px", display: "flex", alignItems: "center", gap: "16px" }}>
            {/* Avatar */}
            <a href={SITE.linkedin} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", flexShrink: 0 }}>
              <div style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                background: "var(--bg-surface)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "15px",
                fontFamily: "var(--font-body)",
                fontWeight: 700,
                color: "var(--text-primary)",
                letterSpacing: "0.04em",
                border: "1px solid var(--border-strong)",
                transition: "border-color 200ms ease",
              }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--text-primary)"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--border-strong)"}
              >
                VS
              </div>
            </a>
            <div>
              <p style={{
                fontFamily: "var(--font-display)", fontSize: "1.05rem",
                color: "var(--text-primary)", marginBottom: "2px",
              }}>
                {SITE.founder.fullName}
              </p>
              <p style={{
                fontFamily: "var(--font-body)", fontWeight: 400,
                fontSize: "0.85rem", color: "var(--text-muted)", margin: 0,
              }}>
                {ABOUT.label}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
