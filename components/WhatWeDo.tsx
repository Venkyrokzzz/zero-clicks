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
        padding: "80px 48px 0",
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
        {/* Bento grid — Linear inspired */}
        <motion.div
          ref={bodyRef}
          initial={{ opacity: 0 }}
          animate={bodyInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4 }}
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "auto auto", gap: "16px" }}
          className="what-we-do-grid"
        >
          {/* Big card — Reputation Manager */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={bodyInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0, ease }}
            style={{
              gridColumn: "1 / 2",
              gridRow: "1 / 3",
              background: "var(--bg-surface)",
              border: "1px solid var(--border)",
              borderRadius: "20px",
              padding: "40px 36px",
              display: "flex",
              flexDirection: "column",
              gap: "24px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Glow accent */}
            <div style={{
              position: "absolute", top: 0, right: 0,
              width: "200px", height: "200px",
              background: "radial-gradient(circle, rgba(74,222,128,0.08) 0%, transparent 70%)",
              pointerEvents: "none",
            }} />

            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--text-muted)", letterSpacing: "0.1em" }}>01</span>
              <div style={{ height: "1px", flex: 1, background: "linear-gradient(90deg, rgba(74,222,128,0.6), transparent)" }} />
            </div>

            <div>
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.6rem", color: "var(--text-primary)", margin: "0 0 8px", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
                Reputation Manager
              </h3>
              <p style={{ margin: 0, fontSize: "0.95rem", color: "var(--text-secondary)", fontFamily: "var(--font-body)", lineHeight: 1.7 }}>
                2,000 reviews. Almost none replied to. Every unanswered review is a missed chance to bring that guest back.
              </p>
            </div>

            <div style={{ padding: "16px 20px", background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.1)", borderRadius: "10px" }}>
              <p style={{ margin: 0, fontSize: "13px", color: "#fca5a5", fontFamily: "var(--font-body)", lineHeight: 1.6 }}>
                2,000 Google reviews. Almost none replied to.
              </p>
            </div>

            <div style={{ padding: "16px 20px", background: "rgba(74,222,128,0.04)", border: "1px solid rgba(74,222,128,0.12)", borderRadius: "10px", marginTop: "auto" }}>
              <p style={{ margin: 0, fontSize: "14px", color: "var(--text-secondary)", fontFamily: "var(--font-body)", lineHeight: 1.7 }}>
                AI replies to every review in your voice — warm, personal, on-brand. Every guest feels heard.
              </p>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "rgba(74,222,128,0.8)", boxShadow: "0 0 8px rgba(74,222,128,0.5)" }} />
              <span style={{ fontSize: "12px", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>Running 24/7 · Replies in your voice</span>
            </div>
          </motion.div>

          {/* Small card — Inbox */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={bodyInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.12, ease }}
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border)",
              borderRadius: "20px",
              padding: "32px 28px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div style={{ position: "absolute", top: 0, right: 0, width: "150px", height: "150px", background: "radial-gradient(circle, rgba(96,165,250,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />

            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--text-muted)", letterSpacing: "0.1em" }}>02</span>
              <div style={{ height: "1px", flex: 1, background: "linear-gradient(90deg, rgba(96,165,250,0.6), transparent)" }} />
            </div>

            <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.2rem", color: "var(--text-primary)", margin: 0, letterSpacing: "-0.02em" }}>
              Inbox Autopilot
            </h3>
            <p style={{ margin: 0, fontSize: "13px", color: "#fca5a5", fontFamily: "var(--font-body)", lineHeight: 1.5, padding: "10px 14px", background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.1)", borderRadius: "8px" }}>
              90 minutes every morning just sorting emails.
            </p>
            <p style={{ margin: 0, fontSize: "13px", color: "var(--text-secondary)", fontFamily: "var(--font-body)", lineHeight: 1.6, marginTop: "auto" }}>
              AI reads, classifies, and drafts replies. You check in twice a day. Nothing gets missed.
            </p>
          </motion.div>

          {/* Small card — Lead Capture */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={bodyInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.24, ease }}
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border)",
              borderRadius: "20px",
              padding: "32px 28px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div style={{ position: "absolute", top: 0, right: 0, width: "150px", height: "150px", background: "radial-gradient(circle, rgba(192,132,252,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />

            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--text-muted)", letterSpacing: "0.1em" }}>03</span>
              <div style={{ height: "1px", flex: 1, background: "linear-gradient(90deg, rgba(192,132,252,0.6), transparent)" }} />
            </div>

            <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.2rem", color: "var(--text-primary)", margin: 0, letterSpacing: "-0.02em" }}>
              Lead Capture
            </h3>
            <p style={{ margin: 0, fontSize: "13px", color: "#fca5a5", fontFamily: "var(--font-body)", lineHeight: 1.5, padding: "10px 14px", background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.1)", borderRadius: "8px" }}>
              Booking enquiries going cold before anyone replies.
            </p>
            <p style={{ margin: 0, fontSize: "13px", color: "var(--text-secondary)", fontFamily: "var(--font-body)", lineHeight: 1.6, marginTop: "auto" }}>
              AI catches every enquiry and drafts a reply instantly. Zero leads dropped.
            </p>
          </motion.div>
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
          .what-we-do-grid > div:first-child {
            grid-column: 1 !important;
            grid-row: auto !important;
          }
        }
      `}</style>
    </section>
  );
}
