// components/HeroPanel.tsx
// Hero showcase panel — wide pipeline overview + live WorkflowAnimation embedded below
"use client";

import { motion } from "framer-motion";
import WorkflowAnimation from "./WorkflowAnimation";

/* ── Dotted connector between nodes ─────────────────── */
function Connector({ color }: { color: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", flexShrink: 0, padding: "0 4px" }}>
      <div style={{ position: "relative", width: "44px", height: "2px" }}>
        {/* Dotted base */}
        <svg width="44" height="2" style={{ position: "absolute", inset: 0 }}>
          <line x1="0" y1="1" x2="44" y2="1" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" strokeDasharray="3 4" />
        </svg>
        {/* Travelling particle */}
        <motion.div
          animate={{ left: ["-6px", "44px"] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
          style={{
            position: "absolute", top: "50%", transform: "translateY(-50%)",
            width: "5px", height: "5px", borderRadius: "50%",
            background: color, boxShadow: `0 0 6px ${color}`,
          }}
        />
      </div>
    </div>
  );
}

/* ── Small flanking node ─────────────────────────────── */
function SmallNode({ icon, label, color }: { icon: string; label: string; color: string }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", gap: "8px",
      flexShrink: 0,
    }}>
      <div style={{
        width: "52px", height: "52px", borderRadius: "12px",
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.1)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "20px",
      }}>
        {icon}
      </div>
      <span style={{
        fontSize: "8px", fontWeight: 700, letterSpacing: "0.08em",
        color: "rgba(255,255,255,0.4)", textAlign: "center",
        fontFamily: "var(--font-mono)", lineHeight: 1.3,
        maxWidth: "70px",
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
        maxWidth: "900px",
        marginBottom: "40px",
        borderRadius: "16px",
        border: "1px solid rgba(255,255,255,0.08)",
        background: "rgba(7, 10, 20, 0.8)",
        backdropFilter: "blur(24px)",
        boxShadow: "0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(6,182,212,0.05)",
        overflow: "hidden",
      }}
    >
      {/* ── Curvy side connector lines (SVG, decorative) ─── */}
      <svg
        style={{ position: "absolute", left: 0, top: 0, bottom: 0, height: "100%", pointerEvents: "none", zIndex: 1 }}
        width="32" height="100%" preserveAspectRatio="none"
      >
        <path d="M16 0 C16 80, 4 120, 4 200 C4 280, 16 320, 16 400" stroke="rgba(6,182,212,0.18)" strokeWidth="1" fill="none" />
      </svg>
      <svg
        style={{ position: "absolute", right: 0, top: 0, bottom: 0, height: "100%", pointerEvents: "none", zIndex: 1 }}
        width="32" height="100%" preserveAspectRatio="none"
      >
        <path d="M16 0 C16 80, 28 120, 28 200 C28 280, 16 320, 16 400" stroke="rgba(6,182,212,0.18)" strokeWidth="1" fill="none" />
      </svg>

      {/* ── Pipeline nodes row ───────────────────────────── */}
      <div style={{
        padding: "28px 36px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 0,
        position: "relative", zIndex: 2,
      }}>
        {/* Node 1 — Task Input */}
        <SmallNode icon="✉" label="TASK INPUT" color="#60a5fa" />

        <Connector color="#60a5fa" />

        {/* Node 2 — AI Workflow Engine (dominant centre) */}
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center", gap: "10px",
          flexShrink: 0,
        }}>
          <div style={{
            padding: "14px 22px",
            borderRadius: "14px",
            border: "1px solid rgba(6,182,212,0.45)",
            background: "rgba(6,182,212,0.08)",
            boxShadow: "0 0 32px rgba(6,182,212,0.2), inset 0 1px 0 rgba(255,255,255,0.06)",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}>
            {/* Brain / Claude icon */}
            <div style={{
              width: "36px", height: "36px", borderRadius: "10px",
              background: "linear-gradient(135deg, #06b6d4, #3b82f6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "18px", boxShadow: "0 4px 12px rgba(6,182,212,0.4)",
            }}>
              🧠
            </div>
            {/* n8n logo text */}
            <div>
              <div style={{
                fontSize: "18px", fontWeight: 800, letterSpacing: "-0.04em",
                color: "#06b6d4", fontFamily: "var(--font-display)", lineHeight: 1,
              }}>
                n8n
              </div>
              <div style={{
                fontSize: "9px", color: "rgba(6,182,212,0.7)", letterSpacing: "0.06em",
                fontFamily: "var(--font-mono)", marginTop: "2px",
              }}>
                + Claude AI
              </div>
            </div>
          </div>
          <span style={{
            fontSize: "8px", fontWeight: 700, letterSpacing: "0.1em",
            color: "#06b6d4", fontFamily: "var(--font-mono)",
          }}>
            AI WORKFLOW ENGINE
          </span>
        </div>

        <Connector color="#ef4444" />

        {/* Node 3 — Email Triage */}
        <SmallNode icon="📨" label="EMAIL TRIAGE" color="#ef4444" />

        <Connector color="#10b981" />

        {/* Node 4 — Lead Routing */}
        <SmallNode icon="⚡" label="LEAD ROUTING" color="#10b981" />

        <Connector color="#3b82f6" />

        {/* Node 5 — Review Reply */}
        <SmallNode icon="💬" label={"REVIEW REPLY\nDRAFTING"} color="#3b82f6" />
      </div>

      {/* ── Stats row ────────────────────────────────────── */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: "56px",
        padding: "4px 36px 24px",
        position: "relative", zIndex: 2,
      }}>
        {[
          { val: "45 min", label: "SAVED DAILY"  },
          { val: "£8/mo",  label: "RUNNING COST" },
          { val: "48 hrs", label: "TO GO LIVE"   },
        ].map(s => (
          <div key={s.val} style={{ textAlign: "center" }}>
            <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#ffffff", letterSpacing: "-0.04em", lineHeight: 1 }}>
              {s.val}
            </div>
            <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.3)", letterSpacing: "0.12em", marginTop: "4px", fontFamily: "var(--font-mono)" }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* ── Divider ──────────────────────────────────────── */}
      <div style={{ height: "1px", background: "rgba(255,255,255,0.05)", margin: "0 28px", position: "relative", zIndex: 2 }} />

      {/* ── WorkflowAnimation embedded below ─────────────── */}
      <div style={{
        padding: "28px 36px 32px",
        display: "flex",
        justifyContent: "center",
        background: "rgba(3, 5, 12, 0.5)",
        position: "relative", zIndex: 2,
      }}>
        <WorkflowAnimation />
      </div>
    </motion.div>
  );
}
