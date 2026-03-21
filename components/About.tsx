// components/About.tsx
"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ABOUT, SITE } from "@/lib/content";

const ease = [0.25, 0.1, 0.25, 1.0] as const;

export default function About() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "128px 48px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Prismatic background light */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          width: "600px",
          height: "600px",
          background:
            "radial-gradient(circle, rgba(249,168,212,0.07) 0%, rgba(196,181,253,0.05) 40%, transparent 70%)",
          top: "-100px",
          right: "-100px",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />

      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease }}
        style={{ maxWidth: "1200px", margin: "0 auto", position: "relative" }}
        className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-start"
      >
        {/* Left decorative side */}
        <div>
          <div
            aria-hidden
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "7rem",
              lineHeight: 1,
              background: "linear-gradient(135deg, rgba(196,181,253,0.3), rgba(168,216,255,0.15))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              marginBottom: "20px",
              userSelect: "none",
            }}
          >
            &ldquo;
          </div>
          <p
            style={{
              fontSize: "11px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--text-secondary)",
              fontFamily: "var(--font-body)",
              fontWeight: 500,
            }}
          >
            About
          </p>
        </div>

        {/* Right text */}
        <div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 400,
              fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
              color: "var(--text-primary)",
              marginBottom: "24px",
              lineHeight: 1.2,
            }}
          >
            {ABOUT.heading}
          </h2>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 400,
              fontSize: "1rem",
              color: "var(--text-secondary)",
              lineHeight: 1.8,
              marginBottom: "40px",
            }}
          >
            {ABOUT.body}
          </p>
          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,0.08)",
              paddingTop: "24px",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.1rem",
                color: "var(--text-primary)",
                marginBottom: "4px",
              }}
            >
              {SITE.founder.fullName}
            </p>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontWeight: 400,
                fontSize: "0.85rem",
                color: "var(--text-muted)",
              }}
            >
              {ABOUT.label}
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
