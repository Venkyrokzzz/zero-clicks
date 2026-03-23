// components/CTASection.tsx
"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { CTA_SECTION } from "@/lib/content";

const ease = [0.25, 0.1, 0.25, 1.0] as const;

export default function CTASection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <section
      style={{
        borderTop: "1px solid var(--border)",
        padding: "120px 48px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Blue radial glow */}
      <div aria-hidden style={{
        position: "absolute",
        inset: 0,
        background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(59,130,246,0.07) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease }}
        style={{ maxWidth: "640px", margin: "0 auto" }}
      >
        <p style={{
          fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase",
          color: "var(--accent)", marginBottom: "16px", fontFamily: "var(--font-body)", fontWeight: 600,
        }}>
          Get started
        </p>

        <h2 style={{
          fontFamily: "var(--font-display)", fontWeight: 400,
          fontSize: "clamp(2rem, 4vw, 3.2rem)", color: "var(--text-primary)",
          lineHeight: 1.1, margin: "0 0 20px",
        }}>
          {CTA_SECTION.heading}
        </h2>

        <p style={{
          fontFamily: "var(--font-body)", fontWeight: 400,
          fontSize: "1rem", color: "var(--text-secondary)",
          marginBottom: "44px", lineHeight: 1.75,
        }}>
          {CTA_SECTION.subtext}
        </p>

        <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            href={CTA_SECTION.buttonHref}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              fontSize: "14px",
              fontFamily: "var(--font-body)",
              fontWeight: 500,
              textDecoration: "none",
              padding: "13px 32px",
              borderRadius: "6px",
              color: "#fff",
              background: "var(--accent)",
              transition: "opacity 200ms ease, transform 200ms ease",
              letterSpacing: "0.01em",
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.opacity = "0.88";
              el.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.opacity = "1";
              el.style.transform = "translateY(0)";
            }}
          >
            {CTA_SECTION.buttonLabel}
          </Link>
          <Link
            href={CTA_SECTION.secondaryHref}
            style={{
              display: "inline-flex",
              alignItems: "center",
              fontSize: "14px",
              fontFamily: "var(--font-body)",
              fontWeight: 400,
              textDecoration: "none",
              padding: "13px 24px",
              borderRadius: "6px",
              color: "var(--text-secondary)",
              border: "1px solid var(--border-mid)",
              transition: "color 200ms ease, border-color 200ms ease",
              letterSpacing: "0.01em",
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.color = "var(--text-primary)";
              el.style.borderColor = "var(--border-strong)";
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.color = "var(--text-secondary)";
              el.style.borderColor = "var(--border-mid)";
            }}
          >
            {CTA_SECTION.secondaryLabel}
          </Link>
        </div>

        {/* Trust row */}
        <div style={{
          marginTop: "48px",
          display: "flex",
          justifyContent: "center",
          gap: "40px",
          flexWrap: "wrap",
        }}>
          {[
            { icon: "⚡", label: "Response within 24h" },
            { icon: "✓", label: "No hard sell, ever" },
            { icon: "☎", label: "Free 30-min audit call" },
          ].map(t => (
            <div key={t.label} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "13px", color: "var(--accent)" }}>{t.icon}</span>
              <span style={{ fontSize: "12px", color: "var(--text-muted)", fontFamily: "var(--font-body)", letterSpacing: "0.03em" }}>
                {t.label}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
