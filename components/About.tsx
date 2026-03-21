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
        backgroundColor: "var(--bg-surface)",
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
        padding: "128px 24px",
      }}
    >
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease }}
        style={{ maxWidth: "1100px", margin: "0 auto" }}
        className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-start"
      >
        {/* Left: decorative quotation mark */}
        <div>
          <div
            aria-hidden="true"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "6rem",
              lineHeight: 1,
              color: "var(--text-muted)",
              marginBottom: "16px",
              userSelect: "none",
            }}
          >
            &ldquo;
          </div>
          <p
            style={{
              fontSize: "11px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "var(--accent)",
              fontFamily: "var(--font-body)",
              fontWeight: 500,
            }}
          >
            About
          </p>
        </div>

        {/* Right: text */}
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
              lineHeight: 1.7,
              marginBottom: "40px",
            }}
          >
            {ABOUT.body}
          </p>
          <div
            style={{
              borderTop: "1px solid var(--border)",
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
