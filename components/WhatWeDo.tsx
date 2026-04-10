"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const ease = [0.25, 0.1, 0.25, 1.0] as const;

const pillars = [
  {
    number: "01",
    title: "Reputation Manager",
    problem: "2,000 Google reviews. Almost none replied to.",
    solution: "AI replies to every review in your voice — warm, personal, on-brand. Every guest feels heard.",
    accent: "rgba(74, 222, 128, 0.8)",
  },
  {
    number: "02",
    title: "Inbox Autopilot",
    problem: "90 minutes every morning just sorting emails.",
    solution: "AI reads, classifies, and drafts replies to every email. You check in twice a day. Nothing gets missed.",
    accent: "rgba(96, 165, 250, 0.8)",
  },
  {
    number: "03",
    title: "Lead Capture",
    problem: "Booking enquiries going cold before anyone replies.",
    solution: "AI catches every enquiry, drafts a response instantly, and logs it. Zero leads dropped.",
    accent: "rgba(192, 132, 252, 0.8)",
  },
];

export default function WhatWeDo() {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-80px" });
  const bodyRef = useRef<HTMLDivElement>(null);
  const bodyInView = useInView(bodyRef, { once: true, margin: "-80px" });

  return (
    <section
      style={{
        borderTop: "1px solid var(--border)",
        padding: "140px 48px",
        background: "transparent",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

        {/* Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease }}
          style={{ marginBottom: "72px" }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "20px" }}>
            <h2 style={{
              fontFamily: "var(--font-display)", fontWeight: 600, letterSpacing: "-0.03em",
              fontSize: "clamp(2rem, 4vw, 3rem)", color: "var(--text-primary)", margin: 0, lineHeight: 1.1,
            }}>
              The gap we fill.
            </h2>
            <div style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)", fontSize: "13px", paddingBottom: "6px" }}>
              // 02 What we do
            </div>
          </div>

          {/* Positioning statement */}
          <p style={{
            fontSize: "1.1rem", color: "var(--text-secondary)", lineHeight: 1.7,
            fontFamily: "var(--font-body)", fontWeight: 400, maxWidth: "680px", margin: "0 0 28px",
          }}>
            UK hospitality businesses lose hours every day to repetitive admin — emails, reviews, missed bookings. Existing tools are expensive, built for large chains, and never reply to anything automatically. Zero Clicks was built to fix exactly that.
          </p>

          {/* Gap pills */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {[
              "No tool built for UK pubs",
              "Other tools charge £80–470/month",
              "None reply to reviews automatically",
              "Hidden pricing everywhere",
              "Too complex for one-person operations",
            ].map((gap) => (
              <div
                key={gap}
                style={{
                  display: "inline-flex", alignItems: "center", gap: "8px",
                  padding: "6px 14px", borderRadius: "9999px",
                  background: "rgba(239,68,68,0.06)",
                  border: "1px solid rgba(239,68,68,0.15)",
                  fontSize: "12px", color: "var(--text-secondary)",
                  fontFamily: "var(--font-body)",
                }}
              >
                <span style={{ color: "#ef4444", fontSize: "10px" }}>✕</span>
                {gap}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Pillars */}
        <motion.div
          ref={bodyRef}
          initial={{ opacity: 0 }}
          animate={bodyInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4 }}
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}
          className="what-we-do-grid"
        >
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.number}
              initial={{ opacity: 0, y: 24 }}
              animate={bodyInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.12, ease }}
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border)",
                borderRadius: "16px",
                padding: "36px 32px",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              }}
            >
              {/* Number + accent line */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{
                  fontFamily: "var(--font-mono)", fontSize: "11px",
                  color: "var(--text-muted)", letterSpacing: "0.1em",
                }}>
                  {pillar.number}
                </span>
                <div style={{ height: "1px", flex: 1, background: `linear-gradient(90deg, ${pillar.accent}, transparent)` }} />
              </div>

              <h3 style={{
                fontFamily: "var(--font-display)", fontWeight: 600,
                fontSize: "1.2rem", color: "var(--text-primary)", margin: 0, letterSpacing: "-0.02em",
              }}>
                {pillar.title}
              </h3>

              {/* Problem */}
              <div style={{
                padding: "12px 16px",
                background: "rgba(239,68,68,0.05)",
                border: "1px solid rgba(239,68,68,0.1)",
                borderRadius: "8px",
              }}>
                <p style={{
                  margin: 0, fontSize: "13px", color: "#fca5a5",
                  fontFamily: "var(--font-body)", lineHeight: 1.5,
                }}>
                  {pillar.problem}
                </p>
              </div>

              {/* Solution */}
              <div style={{
                padding: "12px 16px",
                background: "rgba(74,222,128,0.04)",
                border: "1px solid rgba(74,222,128,0.1)",
                borderRadius: "8px",
                marginTop: "auto",
              }}>
                <p style={{
                  margin: 0, fontSize: "13px", color: "var(--text-secondary)",
                  fontFamily: "var(--font-body)", lineHeight: 1.6,
                }}>
                  {pillar.solution}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom tagline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={bodyInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          style={{ marginTop: "48px", textAlign: "center" }}
        >
          <p style={{
            fontFamily: "var(--font-display)", fontSize: "1.1rem",
            color: "var(--text-muted)", fontStyle: "italic", margin: 0,
            letterSpacing: "-0.01em",
          }}>
            Your pub. Your voice. Zero admin.
          </p>
        </motion.div>

      </div>

      <style>{`
        @media (max-width: 768px) {
          .what-we-do-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
