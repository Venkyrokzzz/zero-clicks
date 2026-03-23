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
        padding: "120px 48px",
      }}
    >
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease }}
        style={{ maxWidth: "1200px", margin: "0 auto" }}
        className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-start"
      >
        {/* Left */}
        <div>
          <p style={{
            fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase",
            color: "var(--accent)", marginBottom: "12px", fontFamily: "var(--font-body)", fontWeight: 600,
          }}>
            About
          </p>
          <h2 style={{
            fontFamily: "var(--font-display)", fontWeight: 400,
            fontSize: "clamp(1.8rem, 3vw, 2.6rem)", color: "var(--text-primary)",
            margin: 0, lineHeight: 1.15,
          }}>
            {ABOUT.heading}
          </h2>
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
                background: "linear-gradient(135deg, var(--accent), #8b5cf6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "15px",
                fontFamily: "var(--font-body)",
                fontWeight: 700,
                color: "#fff",
                letterSpacing: "0.04em",
                border: "2px solid var(--border-mid)",
                transition: "border-color 200ms ease",
              }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--accent)"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--border-mid)"}
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
