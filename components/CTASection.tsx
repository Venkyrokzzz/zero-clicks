// components/CTASection.tsx
"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { CTA_SECTION } from "@/lib/content";

const ease = [0.25, 0.1, 0.25, 1.0] as const;

export default function CTASection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      style={{
        padding: "160px 48px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Prismatic glow background */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(99,102,241,0.12) 0%, rgba(196,181,253,0.06) 40%, transparent 70%)",
          pointerEvents: "none",
          filter: "blur(20px)",
        }}
      />

      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 32 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease }}
        style={{ position: "relative", zIndex: 1 }}
      >
        {/* Glass card wrapper */}
        <div
          style={{
            display: "inline-block",
            background: "rgba(255,255,255,0.04)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "20px",
            padding: "80px 80px 60px",
            maxWidth: "720px",
            width: "100%",
            boxShadow: "0 0 100px rgba(99,102,241,0.1), inset 0 1px 0 rgba(255,255,255,0.08)",
          }}
        >
          {/* Prismatic top border */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "80px",
              right: "80px",
              height: "1px",
              background:
                "linear-gradient(90deg, transparent, rgba(168,216,255,0.6), rgba(196,181,253,0.8), rgba(249,168,212,0.6), transparent)",
              borderRadius: "1px",
            }}
          />

          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 400,
              fontSize: "clamp(2.2rem, 4.5vw, 3.8rem)",
              color: "var(--text-primary)",
              lineHeight: 1.1,
              margin: "0 0 24px",
            }}
          >
            {CTA_SECTION.heading}
          </h2>

          <p
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 400,
              fontSize: "1rem",
              color: "var(--text-secondary)",
              marginBottom: "48px",
              lineHeight: 1.75,
            }}
          >
            {CTA_SECTION.subtext}
          </p>

          <Link
            href={CTA_SECTION.buttonHref}
            style={{
              display: "inline-block",
              fontSize: "13px",
              letterSpacing: "0.05em",
              fontFamily: "var(--font-body)",
              fontWeight: 500,
              textDecoration: "none",
              padding: "14px 36px",
              borderRadius: "8px",
              color: "#06060e",
              background:
                "linear-gradient(135deg, #a8d8ff 0%, #c4b5fd 50%, #f9a8d4 100%)",
              boxShadow:
                "0 0 40px rgba(196,181,253,0.3), 0 6px 24px rgba(0,0,0,0.4)",
              transition: "transform 200ms ease, box-shadow 200ms ease",
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.transform = "translateY(-3px) scale(1.03)";
              el.style.boxShadow =
                "0 0 60px rgba(196,181,253,0.5), 0 12px 32px rgba(0,0,0,0.5)";
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.transform = "translateY(0) scale(1)";
              el.style.boxShadow =
                "0 0 40px rgba(196,181,253,0.3), 0 6px 24px rgba(0,0,0,0.4)";
            }}
          >
            {CTA_SECTION.buttonLabel}
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
