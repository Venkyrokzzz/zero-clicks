"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { DEMO_PAGE } from "@/lib/content";

const ease = [0.25, 0.1, 0.25, 1.0] as const;

export default function DemoCTA() {
  return (
    <section
      style={{
        padding: "80px 48px 120px",
        borderTop: "1px solid var(--border)",
        textAlign: "center",
      }}
    >
      <div style={{ maxWidth: "560px", margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
        >
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 400,
              fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
              color: "var(--text-primary)",
              margin: "0 0 16px",
              lineHeight: 1.2,
            }}
          >
            {DEMO_PAGE.cta.headline}
          </h2>

          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "1rem",
              color: "var(--text-secondary)",
              lineHeight: 1.75,
              margin: "0 0 32px",
            }}
          >
            {DEMO_PAGE.cta.subtext}
          </p>

          <Link
            href={DEMO_PAGE.cta.buttonHref}
            style={{
              display: "inline-block",
              padding: "14px 32px",
              borderRadius: "8px",
              background: "var(--accent)",
              color: "#fff",
              fontSize: "14px",
              fontWeight: 600,
              textDecoration: "none",
              fontFamily: "var(--font-body)",
              transition: "opacity 200ms ease, transform 200ms ease",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.opacity = "0.88";
              el.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.opacity = "1";
              el.style.transform = "translateY(0)";
            }}
          >
            {DEMO_PAGE.cta.buttonLabel}
          </Link>

          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "12px",
              color: "var(--text-muted)",
              margin: "20px 0 0",
            }}
          >
            {DEMO_PAGE.cta.proof}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
