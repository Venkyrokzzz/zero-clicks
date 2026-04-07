// components/HeroPanel.tsx
// Hero showcase — pixel-matched to the reference screenshot
"use client";

import { motion } from "framer-motion";

/* ── Dotted connector with animated travelling squares ── */
function DottedConnector({ color = "#ffffff", delay = 0 }: { color?: string; delay?: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", padding: "0 2px", flexShrink: 0 }}>
      <div style={{ position: "relative", width: "52px", height: "12px", display: "flex", alignItems: "center", gap: "4px" }}>
        {/* Static dots */}
        {[0, 1, 2, 3].map(i => (
          <div key={i} style={{
            width: "6px", height: "6px", borderRadius: "2px",
            background: "rgba(255,255,255,0.12)",
            flexShrink: 0,
          }} />
        ))}
        {/* Travelling glow dot */}
        <motion.div
          animate={{ left: ["-6px", "52px"] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "linear", delay }}
          style={{
            position: "absolute", top: "50%", transform: "translateY(-50%)",
            width: "7px", height: "7px", borderRadius: "2px",
            background: color,
            boxShadow: `0 0 8px ${color}`,
          }}
        />
      </div>
    </div>
  );
}

/* ── Small flanking node card ─────────────────────────── */
function SmallNode({ icon, label, color }: { icon: React.ReactNode; label: string; color: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", flexShrink: 0 }}>
      <div style={{
        width: "54px", height: "54px", borderRadius: "12px",
        background: `${color}18`,
        border: `1px solid ${color}35`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {icon}
      </div>
      <span style={{
        fontSize: "8px", fontWeight: 700, letterSpacing: "0.1em",
        color: "rgba(255,255,255,0.4)", textAlign: "center",
        fontFamily: "var(--font-mono)", lineHeight: 1.3, maxWidth: "72px",
      }}>
        {label}
      </span>
    </div>
  );
}

export default function HeroPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
      style={{
        position: "relative",
        zIndex: 10,
        width: "100%",
        maxWidth: "920px",
        marginBottom: "40px",
        borderRadius: "16px",
        border: "1px solid rgba(255,255,255,0.08)",
        background: "rgba(7, 9, 18, 0.85)",
        backdropFilter: "blur(24px)",
        boxShadow: "0 40px 100px rgba(0,0,0,0.65), 0 0 0 1px rgba(6,182,212,0.04)",
        overflow: "hidden",
      }}
    >
      {/* ── Side feedback-loop lines (decorative SVG) ─────── */}
      <svg style={{ position: "absolute", left: 0, top: 0, width: "28px", height: "100%", pointerEvents: "none", zIndex: 1 }} preserveAspectRatio="none">
        <path d="M14 0 Q4 60 4 140 Q4 220 14 260" stroke="rgba(6,182,212,0.15)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <motion.circle r="3" fill="#06b6d4" fillOpacity="0.6">
          <animateMotion dur="3s" repeatCount="indefinite" path="M14 0 Q4 60 4 140 Q4 220 14 260" />
        </motion.circle>
      </svg>
      <svg style={{ position: "absolute", right: 0, top: 0, width: "28px", height: "100%", pointerEvents: "none", zIndex: 1 }} preserveAspectRatio="none">
        <path d="M14 0 Q24 60 24 140 Q24 220 14 260" stroke="rgba(6,182,212,0.15)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <motion.circle r="3" fill="#06b6d4" fillOpacity="0.6">
          <animateMotion dur="3.4s" repeatCount="indefinite" begin="1s" path="M14 0 Q24 60 24 140 Q24 220 14 260" />
        </motion.circle>
      </svg>

      {/* ── Pipeline nodes row ───────────────────────────── */}
      <div style={{
        padding: "28px 48px 24px",
        display: "flex", alignItems: "flex-start", justifyContent: "center",
        gap: 0, position: "relative", zIndex: 2,
      }}>

        {/* Node 1 — Task Input (two icon boxes) */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", flexShrink: 0 }}>
          <div style={{ display: "flex", gap: "6px" }}>
            <div style={{
              width: "40px", height: "40px", borderRadius: "9px",
              background: "rgba(99,102,241,0.18)", border: "1px solid rgba(99,102,241,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 8l10 6 10-6"/>
              </svg>
            </div>
            <div style={{
              width: "40px", height: "40px", borderRadius: "9px",
              background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/>
              </svg>
            </div>
          </div>
          <span style={{ fontSize: "8px", fontWeight: 700, letterSpacing: "0.1em", color: "rgba(255,255,255,0.35)", fontFamily: "var(--font-mono)" }}>
            TASK INPUT
          </span>
        </div>

        <div style={{ marginTop: "14px" }}>
          <DottedConnector color="#818cf8" delay={0} />
        </div>

        {/* Node 2 — AI Workflow Engine (dominant, glowing) */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", flexShrink: 0 }}>
          <div style={{
            padding: "10px 18px",
            borderRadius: "14px",
            border: "1px solid rgba(6,182,212,0.5)",
            background: "rgba(6,182,212,0.07)",
            boxShadow: "0 0 28px rgba(6,182,212,0.18), 0 0 60px rgba(6,182,212,0.06), inset 0 1px 0 rgba(255,255,255,0.06)",
            display: "flex", alignItems: "center", gap: "8px",
          }}>
            {/* Brain / Claude icon */}
            <div style={{
              width: "38px", height: "38px", borderRadius: "10px",
              background: "rgba(6,182,212,0.2)", border: "1px solid rgba(6,182,212,0.4)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" stroke="#06b6d4" strokeWidth="1.6" fill="rgba(6,182,212,0.15)" strokeLinejoin="round"/>
                <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" stroke="#06b6d4" strokeWidth="1.6" fill="rgba(6,182,212,0.1)" strokeLinejoin="round"/>
              </svg>
            </div>
            {/* Plus */}
            <span style={{ fontSize: "14px", color: "rgba(6,182,212,0.5)", fontWeight: 300 }}>+</span>
            {/* n8n logo text */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
              <span style={{
                fontSize: "20px", fontWeight: 800, letterSpacing: "-0.06em", lineHeight: 1,
                background: "linear-gradient(135deg, #ff6d5a, #ff4500)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                fontFamily: "var(--font-display)",
              }}>
                n8n
              </span>
            </div>
            {/* Plus */}
            <span style={{ fontSize: "14px", color: "rgba(6,182,212,0.5)", fontWeight: 300 }}>+</span>
            {/* n8n brand node icon */}
            <div style={{
              width: "32px", height: "32px", borderRadius: "8px",
              background: "linear-gradient(135deg, #ff6d5a22, #ff450022)",
              border: "1px solid rgba(255,109,90,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="5" cy="12" r="3" fill="#ff6d5a" opacity="0.9"/>
                <circle cx="19" cy="12" r="3" fill="#ff6d5a" opacity="0.9"/>
                <path d="M8 12 Q12 6 16 12" stroke="#ff6d5a" strokeWidth="1.5" fill="none"/>
                <path d="M8 12 Q12 18 16 12" stroke="#ff6d5a" strokeWidth="1.5" fill="none" opacity="0.6"/>
              </svg>
            </div>
          </div>
          <span style={{ fontSize: "8px", fontWeight: 700, letterSpacing: "0.1em", color: "#06b6d4", fontFamily: "var(--font-mono)" }}>
            AI WORKFLOW ENGINE
          </span>
        </div>

        <div style={{ marginTop: "14px" }}>
          <DottedConnector color="#ef4444" delay={0.4} />
        </div>

        {/* Node 3 — Email Triage */}
        <SmallNode
          label="EMAIL TRIAGE"
          color="#ef4444"
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 8l10 6 10-6"/>
            </svg>
          }
        />

        <div style={{ marginTop: "14px" }}>
          <DottedConnector color="#10b981" delay={0.8} />
        </div>

        {/* Node 4 — Lead Routing */}
        <SmallNode
          label="LEAD ROUTING"
          color="#10b981"
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
          }
        />

        <div style={{ marginTop: "14px" }}>
          <DottedConnector color="#3b82f6" delay={1.2} />
        </div>

        {/* Node 5 — Review Reply */}
        <SmallNode
          label={"REVIEW REPLY\nDRAFTING"}
          color="#3b82f6"
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          }
        />
      </div>

      {/* ── Stats row ────────────────────────────────────── */}
      <div style={{
        display: "flex", justifyContent: "center", gap: "64px",
        padding: "0 48px 28px", position: "relative", zIndex: 2,
      }}>
        {[
          { val: "45 min", label: "SAVED DAILY"  },
          { val: "£8/mo",  label: "RUNNING COST" },
          { val: "48 hrs", label: "TO GO LIVE"   },
        ].map(s => (
          <div key={s.val} style={{ textAlign: "center" }}>
            <div style={{ fontSize: "1.6rem", fontWeight: 700, color: "#fff", letterSpacing: "-0.04em", lineHeight: 1 }}>
              {s.val}
            </div>
            <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.28)", letterSpacing: "0.12em", marginTop: "5px", fontFamily: "var(--font-mono)" }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

    </motion.div>
  );
}
