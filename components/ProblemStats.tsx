"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const stats = [
  {
    number: "2,000",
    label: "Google reviews",
    sub: "never replied to",
    accent: "rgba(239, 68, 68, 0.7)",
  },
  {
    number: "90 min",
    label: "lost every morning",
    sub: "just sorting emails",
    accent: "rgba(251, 146, 60, 0.7)",
  },
  {
    number: "£0",
    label: "revenue from",
    sub: "unanswered booking leads",
    accent: "rgba(239, 68, 68, 0.7)",
  },
];

export default function ProblemStats() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      style={{
        padding: "0 48px 80px",
        background: "transparent",
      }}
    >
      <div
        ref={ref}
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "1px",
          background: "var(--border)",
          borderRadius: "16px",
          overflow: "hidden",
          border: "1px solid var(--border)",
        }}
        className="problem-stats-grid"
      >
        {stats.map((stat, i) => (
          <motion.div
            key={stat.number}
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
            style={{
              background: "var(--bg-surface)",
              padding: "40px 36px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Subtle top accent line */}
            <div style={{
              position: "absolute",
              top: 0, left: 0, right: 0,
              height: "2px",
              background: `linear-gradient(90deg, ${stat.accent}, transparent)`,
            }} />

            <span style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "clamp(2rem, 4vw, 2.8rem)",
              color: "var(--text-primary)",
              letterSpacing: "-0.04em",
              lineHeight: 1,
            }}>
              {stat.number}
            </span>

            <span style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.95rem",
              color: "var(--text-secondary)",
              lineHeight: 1.4,
            }}>
              {stat.label}
            </span>

            <span style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.8rem",
              color: "var(--text-muted)",
              lineHeight: 1.4,
            }}>
              {stat.sub}
            </span>
          </motion.div>
        ))}
      </div>

      <style>{`
        @media (max-width: 640px) {
          .problem-stats-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
