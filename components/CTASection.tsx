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
        padding: "160px 24px",
        textAlign: "center",
      }}
    >
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease }}
      >
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 400,
            fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
            color: "var(--text-primary)",
            lineHeight: 1.1,
            margin: "0 0 0 0",
          }}
        >
          {CTA_SECTION.heading}
        </h2>

        {/* Horizontal rule divider */}
        <div
          style={{
            width: "60px",
            height: "1px",
            backgroundColor: "var(--border)",
            margin: "32px auto",
          }}
        />

        <p
          style={{
            fontFamily: "var(--font-body)",
            fontWeight: 400,
            fontSize: "1rem",
            color: "var(--text-secondary)",
            marginBottom: "40px",
            lineHeight: 1.7,
          }}
        >
          {CTA_SECTION.subtext}
        </p>

        <Link
          href={CTA_SECTION.buttonHref}
          style={{
            display: "inline-block",
            fontSize: "13px",
            color: "var(--accent)",
            border: "1px solid var(--accent)",
            padding: "12px 32px",
            textDecoration: "none",
            letterSpacing: "0.05em",
            borderRadius: 0,
            backgroundColor: "transparent",
            fontFamily: "var(--font-body)",
            fontWeight: 500,
            transition: "background-color 200ms ease",
          }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = "var(--accent-dim)")}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
        >
          {CTA_SECTION.buttonLabel}
        </Link>
      </motion.div>
    </section>
  );
}
