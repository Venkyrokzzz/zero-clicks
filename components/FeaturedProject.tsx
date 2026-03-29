"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { FEATURED_PROJECT } from "@/lib/content";

const ease = [0.25, 0.1, 0.25, 1.0] as const;

export default function FeaturedProject() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [hovered, setHovered] = useState(false);

  return (
    <section
      id="work"
      style={{
        borderTop: "1px solid var(--border)",
        padding: "140px 48px",
        position: "relative",
      }}
    >
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease }}
          style={{ marginBottom: "64px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}
        >
          <div>
            <h2 style={{
              fontFamily: "var(--font-display)", fontWeight: 600, letterSpacing: "-0.03em",
              fontSize: "clamp(2rem, 4vw, 3rem)", color: "var(--text-primary)",
              margin: 0, lineHeight: 1.1,
            }}>
              {FEATURED_PROJECT.title}
            </h2>
          </div>
          <div style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)", fontSize: "13px", paddingBottom: "6px" }}>
            // 03 Case Study
          </div>
        </motion.div>

        {/* Main card */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease, delay: 0.1 }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            background: "var(--bg-surface)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: hovered ? "0 24px 48px rgba(0,0,0,0.5)" : "none",
            transform: hovered ? "translateY(-4px)" : "none",
            transition: "all 300ms ease",
          }}
        >
          {/* Top: description + outcome */}
          <div
            className="grid grid-cols-1 md:grid-cols-2"
            style={{ borderBottom: "1px solid var(--border)" }}
          >
            <div style={{ padding: "48px", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <p style={{
                fontFamily: "var(--font-body)", fontSize: "1rem",
                color: "var(--text-secondary)", lineHeight: 1.7, margin: 0,
              }}>
                {FEATURED_PROJECT.description}
              </p>

              <div style={{ marginTop: "40px", display: "flex", flexDirection: "column", gap: "16px", alignItems: "flex-start" }}>
                <a
                  href="/#live-demo"
                  style={{
                    display: "inline-block",
                    padding: "12px 24px",
                    background: "var(--text-primary)",
                    color: "#000",
                    borderRadius: "6px",
                    textDecoration: "none",
                    fontFamily: "var(--font-body)",
                    fontWeight: 600,
                    fontSize: "13px",
                    textAlign: "center",
                    transition: "opacity 200ms ease, transform 200ms ease",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.opacity = "0.9";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.opacity = "1";
                  }}
                >
                  See how it works <span style={{ fontFamily: "var(--font-mono)", opacity: 0.5 }}>⌘K</span>
                </a>
              </div>
            </div>
            <div style={{ padding: "48px", display: "flex", flexDirection: "column", justifyContent: "center", background: "rgba(255,255,255,0.02)" }}>
              <p style={{
                fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase",
                color: "var(--text-muted)", fontFamily: "var(--font-body)", fontWeight: 600,
                marginBottom: "16px",
              }}>
                Outcome
              </p>
              <p style={{
                fontFamily: "var(--font-display)", fontSize: "clamp(1.2rem, 2vw, 1.6rem)",
                color: "var(--text-primary)", lineHeight: 1.3, margin: "0 0 32px",
              }}>
                "{FEATURED_PROJECT.outcome}"
              </p>

              {/* Tech stack */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {FEATURED_PROJECT.tech.map(t => (
                  <span key={t} style={{
                    fontSize: "11px", fontFamily: "var(--font-mono)", fontWeight: 500,
                    color: "var(--text-secondary)", background: "rgba(255,255,255,0.05)",
                    border: "1px solid var(--border)", padding: "4px 8px",
                    borderRadius: "4px",
                  }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Middle: The story — Problem → Solution → Result */}
          <div
            className="grid grid-cols-1 md:grid-cols-3"
            style={{ borderBottom: "1px solid var(--border)", background: "var(--bg-surface)" }}
          >
            {[
              { label: "The Problem", text: FEATURED_PROJECT.story.problem },
              { label: "The Solution", text: FEATURED_PROJECT.story.solution },
              { label: "The Result", text: FEATURED_PROJECT.story.result },
            ].map((s, i) => (
              <div
                key={s.label}
                style={{
                  padding: "36px 40px",
                  borderRight: i < 2 ? "1px solid var(--border)" : "none",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                  <p style={{
                    fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase",
                    color: "var(--text-secondary)", fontFamily: "var(--font-mono)", fontWeight: 600, margin: 0,
                  }}>
                    // {s.label}
                  </p>
                </div>
                <p style={{
                  fontSize: "0.875rem", fontFamily: "var(--font-body)", fontWeight: 400,
                  color: "var(--text-secondary)", lineHeight: 1.7, margin: 0,
                }}>
                  {s.text}
                </p>
              </div>
            ))}
          </div>

          {/* Bottom: stats */}
          <div style={{
            display: "grid",
            gridTemplateColumns: `repeat(${FEATURED_PROJECT.stats.length}, 1fr)`,
            background: "rgba(255,255,255,0.02)"
          }}>
            {FEATURED_PROJECT.stats.map((s, i) => (
              <div
                key={s.label}
                style={{
                  padding: "36px 48px",
                  borderRight: i < FEATURED_PROJECT.stats.length - 1 ? "1px solid var(--border)" : "none",
                }}
              >
                <p style={{
                  fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 600,
                  color: "var(--text-primary)", margin: "0 0 6px", lineHeight: 1,
                  letterSpacing: "-0.04em",
                }}>
                  {s.val}
                </p>
                <p style={{
                  fontFamily: "var(--font-body)", fontSize: "11px",
                  letterSpacing: "0.08em", textTransform: "uppercase",
                  color: "var(--text-muted)", margin: 0, fontWeight: 500,
                }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
