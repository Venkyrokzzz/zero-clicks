// components/N8nCanvas.tsx
// Compact pub email workflow — fits in view, no scroll needed
"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";

const ease = [0.25, 0.1, 0.25, 1.0] as const;

const NODE_W = 158;
const NODE_H = 60;
const STEP   = 182; // NODE_W + 24px gap

type NodeDef = {
  id: string;
  x: number;
  y: number;
  label: string;
  type: string;
  color: string;
  icon: string;
  desc: string;
};

// 2-row layout — canvas ~1110 × 310px
const R1Y = 52;
const R2Y = 196;
const nodes: NodeDef[] = [
  // Row 1 (y: R1Y)
  { id: "gmail",    x: 16,           y: R1Y, label: "Gmail Trigger",  type: "TRIGGER", color: "#ea4335", icon: "✉", desc: "New email lands in pub inbox" },
  { id: "validate", x: 16 + STEP,    y: R1Y, label: "AI Validate",    type: "PROCESS", color: "#3b82f6", icon: "⚡", desc: "Checks sender, subject, metadata" },
  { id: "classify", x: 16 + STEP*2,  y: R1Y, label: "AI Classify",    type: "AI",      color: "#8b5cf6", icon: "✦", desc: "Claude Haiku: priority / action / general" },
  { id: "route",    x: 16 + STEP*3,  y: R1Y, label: "Route",          type: "LOGIC",   color: "#f59e0b", icon: "⋈", desc: "Branches by classification result" },
  { id: "telegram", x: 16 + STEP*4,  y: R1Y, label: "Telegram Alert", type: "ACTION",  color: "#229ed9", icon: "→", desc: "Instant ping for priority emails" },
  { id: "sheets",   x: 16 + STEP*5,  y: R1Y, label: "Log to Sheets",  type: "ACTION",  color: "#10b981", icon: "◎", desc: "Every email logged automatically" },
  // Row 2 (y: R2Y) — draft branch
  { id: "draft",    x: 16 + STEP*3,  y: R2Y, label: "AI Draft",       type: "AI",      color: "#8b5cf6", icon: "✦", desc: "Claude Sonnet writes reply in your tone" },
  { id: "prepare",  x: 16 + STEP*4,  y: R2Y, label: "Prepare Draft",  type: "PROCESS", color: "#3b82f6", icon: "⚡", desc: "Formats & adds subject line" },
  { id: "gmail2",   x: 16 + STEP*5,  y: R2Y, label: "Create Draft",   type: "ACTION",  color: "#ea4335", icon: "✉", desc: "Saves to Gmail Drafts — ready to send" },
];

const nodeMap: Record<string, NodeDef> = Object.fromEntries(nodes.map(n => [n.id, n]));

// Connection helpers
const rc  = (n: NodeDef) => ({ x: n.x + NODE_W,       y: n.y + NODE_H / 2 });
const lc  = (n: NodeDef) => ({ x: n.x,                y: n.y + NODE_H / 2 });
const bc  = (n: NodeDef) => ({ x: n.x + NODE_W / 2,   y: n.y + NODE_H });
const tc  = (n: NodeDef) => ({ x: n.x + NODE_W / 2,   y: n.y });

type EdgeDef = { id: string; from: string; to: string; color: string; dir?: "down" | "up" };

const edges: EdgeDef[] = [
  { id: "e1", from: "gmail",    to: "validate", color: "#3b82f6" },
  { id: "e2", from: "validate", to: "classify", color: "#8b5cf6" },
  { id: "e3", from: "classify", to: "route",    color: "#f59e0b" },
  { id: "e4", from: "route",    to: "telegram", color: "#229ed9" },
  { id: "e5", from: "telegram", to: "sheets",   color: "#10b981" },
  { id: "e6", from: "route",    to: "draft",    color: "#8b5cf6", dir: "down" },
  { id: "e7", from: "draft",    to: "prepare",  color: "#3b82f6" },
  { id: "e8", from: "prepare",  to: "gmail2",   color: "#ea4335" },
  { id: "e9", from: "gmail2",   to: "sheets",   color: "#10b981", dir: "up" },
];

function edgePath(e: EdgeDef): string {
  const f = nodeMap[e.from];
  const t = nodeMap[e.to];

  if (e.dir === "down") {
    // Vertical down: bottom-center of f → top-center of t
    const s = bc(f);
    const d = tc(t);
    const cy = (s.y + d.y) / 2;
    return `M ${s.x} ${s.y} C ${s.x} ${cy} ${d.x} ${cy} ${d.x} ${d.y}`;
  }
  if (e.dir === "up") {
    // Vertical up: top-center of f → bottom-center of t
    const s = tc(f);
    const d = bc(t);
    const cy = (s.y + d.y) / 2;
    return `M ${s.x} ${s.y} C ${s.x} ${cy} ${d.x} ${cy} ${d.x} ${d.y}`;
  }
  // Default: horizontal bezier
  const s = rc(f);
  const d = lc(t);
  const dx = Math.abs(d.x - s.x) * 0.45;
  return `M ${s.x} ${s.y} C ${s.x + dx} ${s.y} ${d.x - dx} ${d.y} ${d.x} ${d.y}`;
}

const execOrder = ["gmail", "validate", "classify", "route", "telegram", "draft", "prepare", "gmail2", "sheets"];

export default function N8nCanvas() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [runs, setRuns] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-40px" });

  useEffect(() => {
    const iv = setInterval(() => {
      setActiveIdx(prev => {
        const next = (prev + 1) % execOrder.length;
        if (next === 0) setRuns(r => r + 1);
        return next;
      });
    }, 750);
    return () => clearInterval(iv);
  }, []);

  const focusId   = hoveredId ?? execOrder[activeIdx];
  const focusNode = nodeMap[focusId];
  const focusIdx  = execOrder.indexOf(focusId);

  const isDone    = (id: string) => execOrder.indexOf(id) < execOrder.indexOf(execOrder[activeIdx]);
  const isCurrent = (id: string) => id === execOrder[activeIdx];
  const isPast    = (id: string) => execOrder.indexOf(id) <= focusIdx;
  const isEdgeActive = (e: EdgeDef) =>
    execOrder.indexOf(e.from) < focusIdx && execOrder.indexOf(e.to) <= focusIdx;

  return (
    <section
      id="live-demo"
      ref={sectionRef}
      style={{ borderTop: "1px solid var(--border)", padding: "100px 48px" }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease }}
          style={{ marginBottom: "40px" }}
        >
          <p style={{
            fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase",
            color: "var(--accent)", marginBottom: "12px", fontFamily: "var(--font-body)", fontWeight: 600,
          }}>
            Live Demo
          </p>
          <h2 style={{
            fontFamily: "var(--font-display)", fontWeight: 400,
            fontSize: "clamp(1.8rem, 3vw, 2.6rem)", color: "var(--text-primary)",
            margin: "0 0 10px", lineHeight: 1.15,
          }}>
            See the pub email workflow run
          </h2>
          <p style={{
            fontFamily: "var(--font-body)", fontSize: "0.875rem",
            color: "var(--text-secondary)", margin: 0,
          }}>
            Hover any node to inspect it. This is the exact automation running for hospitality clients.
          </p>
        </motion.div>

        {/* Canvas card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease, delay: 0.15 }}
          style={{
            background: "var(--bg-surface)",
            border: "1px solid var(--border)",
            borderRadius: "12px",
            overflow: "hidden",
          }}
        >
          {/* Top bar */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "10px 18px",
            borderBottom: "1px solid var(--border)",
            background: "var(--bg-card)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ display: "flex", gap: "5px" }}>
                {["#ff5f57", "#febc2e", "#28c840"].map(c => (
                  <div key={c} style={{ width: 7, height: 7, borderRadius: "50%", background: c }} />
                ))}
              </div>
              <span style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "var(--font-body)", marginLeft: "4px" }}>
                Gmail AI Assistant · Pub Email Automation · n8n
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <span style={{ fontSize: "10px", color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
                {247 + runs} runs today
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", animation: "status-pulse 2s ease-in-out infinite" }} />
                <span style={{ fontSize: "10px", color: "#10b981", fontFamily: "var(--font-body)", fontWeight: 600 }}>LIVE</span>
              </div>
            </div>
          </div>

          {/* Canvas — scrollable on small screens */}
          <div style={{ width: "100%", overflowX: "auto", background: "radial-gradient(ellipse 80% 60% at 55% 40%, rgba(59,130,246,0.04) 0%, transparent 70%)" }}>
            <div style={{ position: "relative", width: "1110px", height: "315px", margin: "0 auto", minWidth: "700px" }}>

              {/* Dot grid */}
              <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
                <defs>
                  <pattern id="n8n-grid" width="22" height="22" patternUnits="userSpaceOnUse">
                    <circle cx="11" cy="11" r="0.6" fill="#1e1e1e" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#n8n-grid)" />
              </svg>

              {/* Row label: top */}
              <span style={{
                position: "absolute", left: 16, top: 28,
                fontSize: "9px", letterSpacing: "0.1em", textTransform: "uppercase",
                color: "#333", fontFamily: "var(--font-body)", fontWeight: 600,
              }}>
                Main flow
              </span>
              {/* Row label: bottom */}
              <span style={{
                position: "absolute", left: 16 + 182*3, top: 168,
                fontSize: "9px", letterSpacing: "0.1em", textTransform: "uppercase",
                color: "#333", fontFamily: "var(--font-body)", fontWeight: 600,
              }}>
                Draft branch
              </span>

              {/* Edges */}
              <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", overflow: "visible", transform: "translateZ(0)" }}>
                {edges.map(e => {
                  const active = isEdgeActive(e);
                  const path = edgePath(e);
                  return (
                    <g key={e.id}>
                      {/* Base track */}
                      <path
                        d={path} fill="none"
                        stroke={active ? e.color : "rgba(255,255,255,0.06)"}
                        strokeWidth={active ? 1.5 : 1}
                        strokeOpacity={active ? 0.3 : 1}
                        style={{ transition: "stroke 300ms ease, stroke-opacity 300ms ease" }}
                      />
                      {active && (
                        <>
                          {/* Ambient glow — wide stroke, no filter, no CPU cost */}
                          <path
                            d={path} fill="none"
                            stroke={e.color} strokeWidth={7}
                            strokeOpacity={0.07}
                            strokeLinecap="round"
                          />
                          {/* Moving packets — clean CSS animation, no will-change */}
                          <path
                            d={path} fill="none"
                            stroke={e.color} strokeWidth={2.5}
                            strokeDasharray="5 20" strokeLinecap="round"
                            style={{ animation: "flow-edge 0.7s linear infinite" }}
                          />
                        </>
                      )}
                    </g>
                  );
                })}
              </svg>

              {/* Nodes */}
              {nodes.map(node => {
                const past    = isPast(node.id);
                const current = isCurrent(node.id);
                const done    = isDone(node.id);
                const hovered = hoveredId === node.id;

                // Glass tint values
                const glowStr = current
                  ? `0 0 28px ${node.color}55, 0 0 56px ${node.color}22, 0 8px 24px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.13)`
                  : hovered
                  ? `0 0 22px ${node.color}44, 0 0 44px ${node.color}18, 0 12px 32px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.11)`
                  : past
                  ? `0 0 12px ${node.color}1a, 0 4px 16px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)`
                  : `0 4px 16px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.04)`;

                const bgGlass = current
                  ? `linear-gradient(135deg, ${node.color}18 0%, ${node.color}08 100%)`
                  : past
                  ? `linear-gradient(135deg, ${node.color}10 0%, ${node.color}05 100%)`
                  : `linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)`;

                const borderColor = current || hovered
                  ? `${node.color}70`
                  : past
                  ? `${node.color}30`
                  : `rgba(255,255,255,0.08)`;

                return (
                  <div
                    key={node.id}
                    onMouseEnter={() => setHoveredId(node.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    style={{
                      position: "absolute",
                      left: node.x, top: node.y,
                      width: NODE_W, height: NODE_H,
                      background: bgGlass,
                      backdropFilter: "blur(20px) saturate(160%)",
                      WebkitBackdropFilter: "blur(20px) saturate(160%)",
                      border: `1px solid ${borderColor}`,
                      borderRadius: "10px",
                      display: "flex", alignItems: "center", gap: "10px",
                      padding: "0 12px",
                      cursor: "pointer",
                      transition: "background 300ms cubic-bezier(0.4,0,0.2,1), border-color 300ms cubic-bezier(0.4,0,0.2,1), box-shadow 300ms cubic-bezier(0.4,0,0.2,1), transform 200ms cubic-bezier(0.34,1.56,0.64,1)",
                      boxShadow: glowStr,
                      transform: hovered ? "scale(1.06) translateZ(0)" : current ? "scale(1.03) translateZ(0)" : "scale(1) translateZ(0)",
                      zIndex: hovered ? 10 : current ? 5 : 2,
                      userSelect: "none",
                      willChange: "transform, box-shadow",
                    }}
                  >
                    {/* Icon — glass pill */}
                    <div style={{
                      width: 34, height: 34, borderRadius: "8px", flexShrink: 0,
                      background: past
                        ? `linear-gradient(135deg, ${node.color}28 0%, ${node.color}12 100%)`
                        : `rgba(255,255,255,0.06)`,
                      backdropFilter: "blur(8px)",
                      WebkitBackdropFilter: "blur(8px)",
                      border: `1px solid ${past ? node.color + "40" : "rgba(255,255,255,0.10)"}`,
                      boxShadow: past ? `0 0 10px ${node.color}20, inset 0 1px 0 rgba(255,255,255,0.12)` : `inset 0 1px 0 rgba(255,255,255,0.08)`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "14px",
                      color: past ? node.color : "rgba(255,255,255,0.3)",
                      transition: "all 300ms cubic-bezier(0.4,0,0.2,1)",
                      willChange: "background, box-shadow",
                    }}>
                      {done ? "✓" : node.icon}
                    </div>

                    {/* Labels */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{
                        fontSize: "11px", fontFamily: "var(--font-body)", fontWeight: 600,
                        color: past ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.28)",
                        margin: 0, lineHeight: 1.25,
                        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                        transition: "color 300ms cubic-bezier(0.4,0,0.2,1)",
                        letterSpacing: "0.01em",
                      }}>
                        {node.label}
                      </p>
                      <p style={{
                        fontSize: "8.5px", fontFamily: "var(--font-body)", fontWeight: 700,
                        color: past ? node.color : "rgba(255,255,255,0.15)",
                        margin: 0, letterSpacing: "0.12em",
                        transition: "color 300ms cubic-bezier(0.4,0,0.2,1)",
                      }}>
                        {node.type}
                      </p>
                    </div>

                    {/* Status dot */}
                    <div style={{
                      width: 6, height: 6, borderRadius: "50%", flexShrink: 0,
                      background: done ? "#10b981" : current ? node.color : "rgba(255,255,255,0.12)",
                      boxShadow: current ? `0 0 8px ${node.color}` : done ? `0 0 6px #10b981` : "none",
                      animation: current ? "status-pulse 1.4s ease-in-out infinite" : "none",
                      transition: "background 300ms cubic-bezier(0.4,0,0.2,1), box-shadow 300ms cubic-bezier(0.4,0,0.2,1)",
                    }} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Info bar */}
          <div style={{
            borderTop: "1px solid var(--border)",
            padding: "10px 18px",
            background: "var(--bg-card)",
            display: "flex", alignItems: "center", gap: "10px",
          }}>
            <div style={{
              width: 6, height: 6, borderRadius: "50%", flexShrink: 0,
              background: focusNode.color,
              animation: "status-pulse 1.5s ease-in-out infinite",
            }} />
            <span style={{ fontSize: "11px", fontFamily: "var(--font-body)", fontWeight: 600, color: focusNode.color }}>
              {focusNode.label}
            </span>
            <span style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
              — {focusNode.desc}
            </span>
            <span style={{ marginLeft: "auto", fontSize: "10px", color: "var(--text-muted)", fontFamily: "var(--font-body)", letterSpacing: "0.06em" }}>
              Hover to inspect
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
