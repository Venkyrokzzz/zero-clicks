"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const PAIN_POINTS = [
  {
    time: "Mon 7:14am",
    scenario: "23 unread emails. A complaint from Saturday night. A Christmas party enquiry from three weeks ago you never replied to. Two supplier quotes sitting there. You haven't even unlocked the front door yet.",
    outcome: "Inbox Autopilot triages all of it overnight. You walk in to a sorted inbox and drafted replies.",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
    accent: "rgba(239,68,68,0.7)",
    accentDim: "rgba(239,68,68,0.08)",
  },
  {
    time: "Fri 11:47pm",
    scenario: "Someone left a 1-star Google review while you were doing last orders. By Monday it had 60 views and no response. Everyone who searched your pub saw it sitting there, ignored.",
    outcome: "Reputation Manager drafts a warm, human reply within minutes. You approve with one tap — or it sends automatically.",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ),
    accent: "rgba(251,191,36,0.7)",
    accentDim: "rgba(251,191,36,0.08)",
  },
  {
    time: "Thu 2:31pm",
    scenario: "A corporate events manager emailed about a £3,200 Christmas party for 45 people. Busy service. It got buried. They chased once. No reply. They booked somewhere else. You found the original email two weeks later.",
    outcome: "Lead Capture flags high-value enquiries instantly and drafts a reply in your voice — before anyone else gets a chance.",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    ),
    accent: "rgba(255,109,90,0.7)",
    accentDim: "rgba(255,109,90,0.08)",
  },
];

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section
      ref={sectionRef}
      style={{ borderTop: "1px solid var(--border)", padding: "80px 48px", background: "transparent" }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: "64px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}
        >
          <div>
            <h2 style={{
              fontFamily: "var(--font-display)", fontWeight: 600, letterSpacing: "-0.03em",
              fontSize: "clamp(2rem, 4vw, 3rem)", color: "var(--text-primary)", margin: 0, lineHeight: 1.1,
            }}>
              Sound familiar?
            </h2>
          </div>
          <div style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)", fontSize: "13px", paddingBottom: "6px" }}>
            // 04 The Problem
          </div>
        </motion.div>

        {/* Pain point cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PAIN_POINTS.map((p, i) => (
            <PainCard key={i} item={p} delay={i * 0.12} isInView={isInView} />
          ))}
        </div>

        {/* Bottom line */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          style={{
            fontSize: "13px", color: "var(--text-muted)", fontFamily: "var(--font-body)",
            textAlign: "center", marginTop: 48, marginBottom: 0,
          }}
        >
          Every one of these happens in UK pubs every single week. None of them have to.
        </motion.p>
      </div>
    </section>
  );
}

function PainCard({
  item,
  delay,
  isInView,
}: {
  item: typeof PAIN_POINTS[number];
  delay: number;
  isInView: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border)",
        borderRadius: "16px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {/* Time stamp header */}
      <div style={{
        padding: "14px 20px",
        borderBottom: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        background: item.accentDim,
      }}>
        <div style={{ color: item.accent }}>{item.icon}</div>
        <span style={{
          fontSize: "11px", fontFamily: "var(--font-mono)", fontWeight: 600,
          color: item.accent, letterSpacing: "0.06em",
        }}>
          {item.time}
        </span>
      </div>

      {/* Scenario */}
      <div style={{ padding: "24px 20px", flex: 1 }}>
        <p style={{
          fontSize: "0.875rem", color: "var(--text-secondary)", fontFamily: "var(--font-body)",
          lineHeight: 1.7, margin: 0,
        }}>
          {item.scenario}
        </p>
      </div>

      {/* Outcome */}
      <div style={{
        padding: "16px 20px",
        borderTop: "1px dashed var(--border)",
        display: "flex",
        alignItems: "flex-start",
        gap: "10px",
        background: "rgba(255,255,255,0.015)",
      }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--accent)"
          strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          style={{ marginTop: "2px", flexShrink: 0 }}>
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        <p style={{
          fontSize: "0.8rem", color: "var(--text-secondary)", fontFamily: "var(--font-body)",
          lineHeight: 1.6, margin: 0,
        }}>
          {item.outcome}
        </p>
      </div>
    </motion.div>
  );
}
