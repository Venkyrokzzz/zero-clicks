// components/FeaturedProject.tsx
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
        padding: "120px 48px",
        position: "relative",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease }}
          style={{ marginBottom: "64px" }}
        >
          <p style={{
            fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase",
            color: "var(--accent)", marginBottom: "12px", fontFamily: "var(--font-body)", fontWeight: 600,
          }}>
            {FEATURED_PROJECT.label}
          </p>
          <h2 style={{
            fontFamily: "var(--font-display)", fontWeight: 400,
            fontSize: "clamp(1.8rem, 3vw, 2.6rem)", color: "var(--text-primary)",
            margin: 0, lineHeight: 1.15,
          }}>
            {FEATURED_PROJECT.title}
          </h2>
        </motion.div>

        {/* Main card */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease, delay: 0.1 }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            background: "var(--bg-card)",
            border: `1px solid ${hovered ? "var(--accent)" : "var(--border-mid)"}`,
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: hovered ? "0 0 24px rgba(59, 130, 246, 0.25)" : "none",
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
                color: "var(--text-secondary)", lineHeight: 1.85, margin: 0,
              }}>
                {FEATURED_PROJECT.description}
              </p>

              <div style={{ marginTop: "40px", display: "flex", flexDirection: "column", gap: "16px", alignItems: "flex-start" }}>
                <a
                  href="/#live-demo"
                  style={{
                    display: "inline-block",
                    padding: "12px 24px",
                    background: "-webkit-linear-gradient(180deg, var(--accent), #8b5cf6)",
                    color: "#fff",
                    borderRadius: "8px",
                    textDecoration: "none",
                    fontFamily: "var(--font-body)",
                    fontWeight: 600,
                    fontSize: "14px",
                    textAlign: "center",
                    boxShadow: "0 4px 14px rgba(59,130,246,0.25)",
                    transition: "transform 200ms ease, box-shadow 200ms ease",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 20px rgba(59,130,246,0.4)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 14px rgba(59,130,246,0.25)";
                  }}
                >
                  See how it works →
                </a>
                <a
                  href="/contact?service=Gmail+AI+Assistant"
                  style={{
                    display: "inline-block",
                    padding: "8px 12px",
                    color: "var(--text-secondary)",
                    textDecoration: "none",
                    fontFamily: "var(--font-body)",
                    fontWeight: 500,
                    fontSize: "13px",
                    textAlign: "center",
                    transition: "color 200ms ease",
                  }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "var(--text-primary)")}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "var(--text-secondary)")}
                >
                  Get this built for your business →
                </a>
              </div>
            </div>
            <div style={{ padding: "48px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <p style={{
                fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase",
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
                    fontSize: "11px", fontFamily: "var(--font-body)", fontWeight: 500,
                    letterSpacing: "0.06em", textTransform: "uppercase",
                    color: "var(--accent)", background: "var(--accent-dim)",
                    border: "1px solid var(--accent)", padding: "4px 10px",
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
            style={{ borderBottom: "1px solid var(--border)" }}
          >
            {[
              { label: "The Problem", icon: "⚠", text: FEATURED_PROJECT.story.problem, color: "#f59e0b" },
              { label: "The Solution", icon: "⚡", text: FEATURED_PROJECT.story.solution, color: "#3b82f6" },
              { label: "The Result", icon: "✓", text: FEATURED_PROJECT.story.result, color: "#10b981" },
            ].map((s, i) => (
              <div
                key={s.label}
                style={{
                  padding: "36px 40px",
                  borderRight: i < 2 ? "1px solid var(--border)" : "none",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: "6px",
                    background: `${s.color}18`,
                    border: `1px solid ${s.color}33`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "12px", color: s.color, flexShrink: 0,
                  }}>
                    {s.icon}
                  </div>
                  <p style={{
                    fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase",
                    color: s.color, fontFamily: "var(--font-body)", fontWeight: 700, margin: 0,
                  }}>
                    {s.label}
                  </p>
                </div>
                <p style={{
                  fontSize: "0.875rem", fontFamily: "var(--font-body)", fontWeight: 400,
                  color: "var(--text-secondary)", lineHeight: 1.8, margin: 0,
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
                  fontFamily: "var(--font-display)", fontSize: "2.2rem", fontWeight: 400,
                  color: "var(--text-primary)", margin: "0 0 6px", lineHeight: 1,
                  letterSpacing: "-0.02em",
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
