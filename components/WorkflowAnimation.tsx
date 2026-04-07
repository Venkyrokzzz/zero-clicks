// components/WorkflowAnimation.tsx
// Zero Clicks autopilot — shows real hospitality scenarios cycling through the workflow
"use client";

import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";

const SCENARIOS = [
  {
    label: "1-star Google review",
    preview: "\"Waited 45 mins, no apology...\"",
    color: "#ef4444",
    icon: "⭐",
    tag: "REVIEW",
  },
  {
    label: "Booking enquiry",
    preview: "\"Table for 8, Saturday 7pm...\"",
    color: "#3b82f6",
    icon: "📅",
    tag: "ENQUIRY",
  },
  {
    label: "Unanswered complaint",
    preview: "\"Emailed 3 days ago, no reply...\"",
    color: "#f59e0b",
    icon: "✉️",
    tag: "COMPLAINT",
  },
  {
    label: "TripAdvisor review",
    preview: "\"Best Sunday roast we've had!\"",
    color: "#10b981",
    icon: "🏆",
    tag: "REVIEW",
  },
];

const STEPS = [
  { id: "receive",  label: "Message received",   tag: "TRIGGER",  baseColor: "#3b82f6" },
  { id: "classify", label: "Intent classified",   tag: "AI",       baseColor: "#8b5cf6" },
  { id: "draft",    label: "Reply drafted",       tag: "GENERATE", baseColor: "#8b5cf6" },
  { id: "send",     label: "Sent & logged",       tag: "ACTION",   baseColor: "#10b981" },
  { id: "notify",   label: "Owner notified",      tag: "NOTIFY",   baseColor: "#f59e0b" },
];

function Node({ step, index, active, scenarioColor }: {
  step: typeof STEPS[0];
  index: number;
  active: number;
  scenarioColor: string;
}) {
  const isActive = active === index;
  const isDone   = active > index;
  const color    = isActive ? scenarioColor : step.baseColor;

  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.05 * index }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "11px 14px",
        borderRadius: "8px",
        border: `1px solid ${isActive ? color + "55" : isDone ? color + "22" : "var(--border)"}`,
        background: isActive ? color + "0d" : isDone ? color + "07" : "var(--bg-card)",
        transition: "all 350ms ease",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Shimmer on active */}
      {isActive && (
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: "150%" }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(90deg, transparent, ${color}18, transparent)`,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Icon dot */}
      <div style={{
        width: "28px", height: "28px", borderRadius: "6px", flexShrink: 0,
        background: isDone || isActive ? color + "22" : "var(--bg-surface)",
        border: `1px solid ${isDone || isActive ? color + "44" : "var(--border)"}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "all 350ms ease",
      }}>
        {isDone ? (
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <div style={{
            width: "6px", height: "6px", borderRadius: "50%",
            background: isActive ? color : "var(--text-muted)",
            animation: isActive ? "status-pulse 1.2s ease-in-out infinite" : "none",
            transition: "background 350ms ease",
          }} />
        )}
      </div>

      {/* Label */}
      <p style={{
        flex: 1, margin: 0,
        fontSize: "12px", fontFamily: "var(--font-body)", fontWeight: 500,
        color: isDone || isActive ? "var(--text-primary)" : "var(--text-secondary)",
        transition: "color 350ms ease",
      }}>
        {step.label}
      </p>

      {/* Tag */}
      <span style={{
        fontSize: "9px", letterSpacing: "0.1em",
        fontFamily: "var(--font-body)", fontWeight: 600, flexShrink: 0,
        color: isActive ? color : isDone ? color + "99" : "var(--text-muted)",
        background: isActive ? color + "15" : "transparent",
        padding: "2px 6px", borderRadius: "4px",
        transition: "all 350ms ease",
      }}>
        {step.tag}
      </span>
    </motion.div>
  );
}

function Connector({ active, index, scenarioColor }: { active: number; index: number; scenarioColor: string }) {
  const done = active > index;
  return (
    <div style={{ position: "relative", height: "16px", paddingLeft: "27px" }}>
      <div style={{
        position: "absolute", left: "27px", top: 0, bottom: 0, width: "1px",
        background: "var(--border)",
      }} />
      <motion.div
        animate={{ scaleY: done ? 1 : 0 }}
        initial={{ scaleY: 0 }}
        transition={{ duration: 0.25 }}
        style={{
          position: "absolute", left: "27px", top: 0, bottom: 0, width: "1px",
          background: scenarioColor,
          transformOrigin: "top",
          opacity: 0.6,
        }}
      />
    </div>
  );
}

export default function WorkflowAnimation() {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [active, setActive]               = useState(0);
  const [runs, setRuns]                   = useState(0);
  const [tilt, setTilt]                   = useState("perspective(1000px) rotateX(0deg) rotateY(0deg)");

  const scenario = SCENARIOS[scenarioIndex];

  useEffect(() => {
    const tick = setInterval(() => {
      setActive(prev => {
        if (prev >= STEPS.length) {
          // Cycle complete — next scenario
          setRuns(r => r + 1);
          setScenarioIndex(i => (i + 1) % SCENARIOS.length);
          return 0;
        }
        return prev + 1;
      });
    }, 800);
    return () => clearInterval(tick);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt(`perspective(1000px) rotateX(${-y * 10}deg) rotateY(${x * 10}deg)`);
  };

  return (
    <motion.div
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setTilt("perspective(1000px) rotateX(0deg) rotateY(0deg)")}
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border)",
        borderRadius: "12px",
        padding: "18px",
        width: "100%",
        maxWidth: "340px",
        transform: tilt,
        transition: "transform 300ms ease",
        willChange: "transform",
        boxShadow: "0 32px 80px rgba(0,0,0,0.4), 0 0 0 1px rgba(59,130,246,0.06)",
      }}
    >
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: "14px", paddingBottom: "12px", borderBottom: "1px solid var(--border)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ display: "flex", gap: "5px" }}>
            {["#ff5f57", "#febc2e", "#28c840"].map(c => (
              <div key={c} style={{ width: 7, height: 7, borderRadius: "50%", background: c }} />
            ))}
          </div>
          <span style={{ fontSize: "10px", color: "var(--text-muted)", fontFamily: "var(--font-body)", marginLeft: "4px" }}>
            zero-clicks / autopilot.live
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <div style={{
            width: "6px", height: "6px", borderRadius: "50%", background: "#10b981",
            animation: "status-pulse 2s ease-in-out infinite",
          }} />
          <span style={{ fontSize: "9px", color: "#10b981", fontFamily: "var(--font-body)", fontWeight: 600 }}>
            LIVE
          </span>
        </div>
      </div>

      {/* Incoming message pill */}
      <AnimatePresence mode="wait">
        <motion.div
          key={scenarioIndex}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.3 }}
          style={{
            display: "flex", alignItems: "flex-start", gap: "10px",
            padding: "10px 12px", borderRadius: "8px", marginBottom: "14px",
            background: scenario.color + "0d",
            border: `1px solid ${scenario.color}33`,
          }}
        >
          <span style={{ fontSize: "14px", flexShrink: 0, marginTop: "1px" }}>{scenario.icon}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "3px" }}>
              <span style={{
                fontSize: "9px", fontWeight: 700, letterSpacing: "0.1em",
                color: scenario.color, fontFamily: "var(--font-body)",
                background: scenario.color + "20", padding: "1px 5px", borderRadius: "3px",
              }}>
                {scenario.tag}
              </span>
            </div>
            <p style={{
              fontSize: "11px", color: "var(--text-secondary)",
              fontFamily: "var(--font-body)", margin: 0, fontStyle: "italic", lineHeight: 1.4,
            }}>
              {scenario.preview}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Workflow steps */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        {STEPS.map((step, i) => (
          <div key={step.id}>
            <Node step={step} index={i} active={active} scenarioColor={scenario.color} />
            {i < STEPS.length - 1 && <Connector active={active} index={i} scenarioColor={scenario.color} />}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{
        marginTop: "14px", paddingTop: "11px", borderTop: "1px solid var(--border)",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <span style={{ fontSize: "10px", color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
          handled today
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <motion.span
            key={runs}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              fontSize: "13px", color: scenario.color,
              fontFamily: "var(--font-body)", fontWeight: 700,
            }}
          >
            {247 + runs}
          </motion.span>
          <span style={{ fontSize: "9px", color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
            messages
          </span>
        </div>
      </div>
    </motion.div>
  );
}
