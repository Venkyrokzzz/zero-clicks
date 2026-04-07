// components/HeroPanel.tsx
"use client";

import { motion } from "framer-motion";

/* ── Animated connector ─────────────────────────────── */
function Connector({ color, delay = 0 }: { color: string; delay?: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", flexShrink: 0, padding: "0 6px" }}>
      <div style={{ position: "relative", width: "48px", height: "2px", background: "rgba(255,255,255,0.07)", borderRadius: "1px" }}>
        <motion.div
          animate={{ left: ["-8px", "52px"] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "linear", delay }}
          style={{
            position: "absolute", top: "50%", transform: "translateY(-50%)",
            width: "8px", height: "8px", borderRadius: "50%",
            background: color, boxShadow: `0 0 10px ${color}, 0 0 20px ${color}55`,
          }}
        />
      </div>
    </div>
  );
}

/* ── Small node ─────────────────────────────────────── */
function Node({ icon, label, color, large = false }: {
  icon: React.ReactNode; label: string; color: string; large?: boolean;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", flexShrink: 0 }}>
      <div style={{
        padding: large ? "12px 20px" : undefined,
        width: large ? undefined : "58px",
        height: large ? undefined : "58px",
        borderRadius: "13px",
        background: large ? `${color}0f` : `${color}14`,
        border: `1px solid ${color}${large ? "55" : "30"}`,
        boxShadow: large ? `0 0 32px ${color}22, 0 0 80px ${color}0a, inset 0 1px 0 rgba(255,255,255,0.06)` : "none",
        display: "flex", alignItems: "center", justifyContent: "center",
        gap: large ? "10px" : undefined,
      }}>
        {icon}
      </div>
      <span style={{
        fontSize: "8px", fontWeight: 700, letterSpacing: "0.1em",
        color: large ? color : "rgba(255,255,255,0.38)",
        fontFamily: "var(--font-mono)", textAlign: "center", lineHeight: 1.4, maxWidth: "90px",
      }}>
        {label}
      </span>
    </div>
  );
}

export default function HeroPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
      style={{
        position: "relative", zIndex: 10,
        width: "100%", maxWidth: "920px", marginBottom: "40px",
        borderRadius: "18px",
        border: "1px solid rgba(255,255,255,0.07)",
        background: "rgba(7, 9, 20, 0.88)",
        backdropFilter: "blur(28px)",
        boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(6,182,212,0.04)",
        overflow: "hidden",
        padding: "32px 48px 28px",
      }}
    >
      {/* ── Pipeline nodes ──────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "center", gap: 0, marginBottom: "28px" }}>

        {/* Task Input */}
        <Node
          label="TASK INPUT"
          color="#818cf8"
          icon={
            <div style={{ display: "flex", gap: "5px" }}>
              <div style={{ width: "24px", height: "24px", borderRadius: "6px", background: "rgba(129,140,248,0.2)", border: "1px solid rgba(129,140,248,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 8l10 6 10-6"/>
                </svg>
              </div>
              <div style={{ width: "24px", height: "24px", borderRadius: "6px", background: "rgba(129,140,248,0.12)", border: "1px solid rgba(129,140,248,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/>
                </svg>
              </div>
            </div>
          }
        />

        <div style={{ marginTop: "16px" }}><Connector color="#818cf8" delay={0} /></div>

        {/* AI Workflow Engine — dominant */}
        <Node
          label="AI WORKFLOW ENGINE"
          color="#06b6d4"
          large
          icon={
            <>
              {/* Claude brain */}
              <div style={{ width: "36px", height: "36px", borderRadius: "9px", background: "rgba(6,182,212,0.18)", border: "1px solid rgba(6,182,212,0.35)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
                  <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" stroke="#06b6d4" strokeWidth="1.5" fill="rgba(6,182,212,0.12)"/>
                  <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" stroke="#06b6d4" strokeWidth="1.5" fill="rgba(6,182,212,0.08)"/>
                </svg>
              </div>
              <span style={{ fontSize: "13px", color: "rgba(6,182,212,0.45)", fontWeight: 300 }}>+</span>
              {/* n8n */}
              <span style={{ fontSize: "22px", fontWeight: 900, letterSpacing: "-0.06em", lineHeight: 1, background: "linear-gradient(135deg, #ff6d5a, #ff4500)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontFamily: "var(--font-display)" }}>
                n8n
              </span>
              <span style={{ fontSize: "13px", color: "rgba(6,182,212,0.45)", fontWeight: 300 }}>+</span>
              {/* n8n node mark */}
              <div style={{ width: "30px", height: "30px", borderRadius: "7px", background: "rgba(255,109,90,0.12)", border: "1px solid rgba(255,109,90,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <circle cx="5" cy="12" r="3" fill="#ff6d5a"/>
                  <circle cx="19" cy="12" r="3" fill="#ff6d5a" opacity="0.8"/>
                  <path d="M8 12 Q12 5 16 12" stroke="#ff6d5a" strokeWidth="1.6" fill="none"/>
                  <path d="M8 12 Q12 19 16 12" stroke="#ff6d5a" strokeWidth="1.6" fill="none" opacity="0.55"/>
                </svg>
              </div>
            </>
          }
        />

        <div style={{ marginTop: "16px" }}><Connector color="#ef4444" delay={0.45} /></div>

        {/* Email Triage */}
        <Node
          label="EMAIL TRIAGE"
          color="#ef4444"
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 8l10 6 10-6"/>
            </svg>
          }
        />

        <div style={{ marginTop: "16px" }}><Connector color="#10b981" delay={0.9} /></div>

        {/* Lead Routing */}
        <Node
          label="LEAD ROUTING"
          color="#10b981"
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
          }
        />

        <div style={{ marginTop: "16px" }}><Connector color="#3b82f6" delay={1.35} /></div>

        {/* Review Reply */}
        <Node
          label={"REVIEW REPLY\nDRAFTING"}
          color="#3b82f6"
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          }
        />
      </div>

      {/* ── Stats row ────────────────────────────────────── */}
      <div style={{
        display: "flex", justifyContent: "center", gap: "72px",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        paddingTop: "20px",
      }}>
        {[
          { val: "45 min", label: "SAVED DAILY"  },
          { val: "24/7",   label: "ALWAYS ON"    },
          { val: "48 hrs", label: "TO GO LIVE"   },
        ].map(s => (
          <div key={s.val} style={{ textAlign: "center" }}>
            <div style={{ fontSize: "1.7rem", fontWeight: 700, color: "#fff", letterSpacing: "-0.04em", lineHeight: 1 }}>
              {s.val}
            </div>
            <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.25)", letterSpacing: "0.14em", marginTop: "5px", fontFamily: "var(--font-mono)" }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
