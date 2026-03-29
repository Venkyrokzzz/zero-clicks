"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

/* ── Node definitions ─────────────────────────────── */
const NODES = [
  { id: "trigger",  x: 60,  y: 175, label: "Email Trigger", sub: "On new email",      icon: "✉",  color: "#ff6b6b", glow: "rgba(255,107,107,0.3)" },
  { id: "claude",   x: 260, y: 90,  label: "Claude AI",     sub: "Classify intent",    icon: "◆",  color: "#c084fc", glow: "rgba(192,132,252,0.35)" },
  { id: "slack",    x: 480, y: 90,  label: "Slack",          sub: "Notify team",        icon: "◎",  color: "#4ade80", glow: "rgba(74,222,128,0.3)" },
  { id: "db",       x: 260, y: 280, label: "Database",       sub: "Log to Airtable",    icon: "◻",  color: "#60a5fa", glow: "rgba(96,165,250,0.3)" },
  { id: "webhook",  x: 480, y: 280, label: "Webhook",        sub: "CRM update",         icon: "⬡",  color: "#fbbf24", glow: "rgba(251,191,36,0.3)" },
];

/* ── Edge paths (cubic bezier in a ~680×420 viewbox) ─*/
const EDGES = [
  { id: "e1", from: "trigger", to: "claude",  d: "M 140 195 C 185 195, 215 130, 260 130", color: "#c084fc" },
  { id: "e2", from: "claude",  to: "slack",   d: "M 360 130 C 395 130, 435 130, 480 130", color: "#4ade80" },
  { id: "e3", from: "trigger", to: "db",      d: "M 140 215 C 185 215, 215 300, 260 300", color: "#60a5fa" },
  { id: "e4", from: "db",      to: "webhook", d: "M 360 300 C 395 300, 435 300, 480 300", color: "#fbbf24" },
  { id: "e5", from: "claude",  to: "db",      d: "M 310 170 C 310 220, 310 255, 310 280", color: "#a78bfa" },
];

const PROCESS_ORDER = ["trigger", "claude", "slack", "db", "webhook"];

/* ── Single water droplet that rides a path ──────── */
function WaterDrop({ pathId, color, delay, dur }: { pathId: string; color: string; delay: number; dur: number }) {
  return (
    <g>
      <circle r="3.5" fill={color} opacity="0">
        <animate attributeName="opacity" values="0;0.95;0.95;0" keyTimes="0;0.1;0.85;1" dur={`${dur}s`} begin={`${delay}s`} repeatCount="indefinite" />
        <animateMotion dur={`${dur}s`} begin={`${delay}s`} repeatCount="indefinite" calcMode="spline" keySplines="0.25 0.1 0.25 1">
          <mpath href={`#${pathId}`} />
        </animateMotion>
      </circle>
      {/* glow halo */}
      <circle r="6" fill={color} opacity="0" filter="url(#waterGlow)">
        <animate attributeName="opacity" values="0;0.5;0.5;0" keyTimes="0;0.1;0.85;1" dur={`${dur}s`} begin={`${delay}s`} repeatCount="indefinite" />
        <animateMotion dur={`${dur}s`} begin={`${delay}s`} repeatCount="indefinite" calcMode="spline" keySplines="0.25 0.1 0.25 1">
          <mpath href={`#${pathId}`} />
        </animateMotion>
      </circle>
    </g>
  );
}

/* ── Node card ───────────────────────────────────── */
function NodeCard({ node, active }: { node: typeof NODES[0]; active: boolean }) {
  return (
    <foreignObject x={node.x} y={node.y} width="180" height="72" overflow="visible">
      <div
        style={{
          width: "180px",
          height: "72px",
          borderRadius: "12px",
          background: active
            ? `linear-gradient(135deg, rgba(14,14,18,0.85) 0%, rgba(14,14,18,0.65) 100%)`
            : "rgba(14,14,18,0.65)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          border: `1px solid ${active ? node.color + "70" : "rgba(255,255,255,0.07)"}`,
          boxShadow: active
            ? `0 0 28px ${node.glow}, 0 8px 24px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)`
            : "0 4px 16px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.04)",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "0 16px",
          position: "relative",
          overflow: "hidden",
          transition: "all 0.8s cubic-bezier(0.25, 0.1, 0.25, 1)",
        }}
      >
        {/* water shimmer sweep */}
        {active && (
          <div
            style={{
              position: "absolute",
              top: 0, bottom: 0,
              width: "50%",
              background: `linear-gradient(90deg, transparent, ${node.color}18, transparent)`,
              animation: "shimmerSweep 2s ease-in-out infinite",
            }}
          />
        )}

        {/* icon bubble */}
        <div
          style={{
            width: "38px",
            height: "38px",
            borderRadius: "9px",
            flexShrink: 0,
            background: `${node.color}14`,
            border: `1px solid ${active ? node.color + "55" : node.color + "25"}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "16px",
            color: node.color,
            transition: "border 0.8s ease, box-shadow 0.8s ease",
            boxShadow: active ? `0 0 12px ${node.glow}` : "none",
          }}
        >
          {node.icon}
        </div>

        {/* labels */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2px", flex: 1, minWidth: 0 }}>
          <span style={{
            fontSize: "13px",
            fontFamily: "Inter, sans-serif",
            fontWeight: 600,
            color: "#fff",
            letterSpacing: "-0.01em",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>
            {node.label}
          </span>
          <span style={{
            fontSize: "10px",
            fontFamily: "var(--font-mono, monospace)",
            color: active ? node.color : "rgba(255,255,255,0.35)",
            transition: "color 0.8s ease",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>
            {node.sub}
          </span>
        </div>

        {/* live dot */}
        {active && (
          <div
            style={{
              position: "absolute",
              top: "9px",
              right: "10px",
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: node.color,
              boxShadow: `0 0 6px ${node.color}`,
              animation: "pulse 1.2s ease-in-out infinite",
            }}
          />
        )}
      </div>
    </foreignObject>
  );
}

/* ── Main component ──────────────────────────────── */
export default function N8NWorkflowDemo() {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActiveIdx(i => (i + 1) % PROCESS_ORDER.length), 1800);
    return () => clearInterval(t);
  }, []);

  const activeId = PROCESS_ORDER[activeIdx];

  return (
    <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
      <style>{`
        @keyframes shimmerSweep {
          0%   { left: -60% }
          100% { left: 160% }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.4; transform: scale(0.8); }
        }
      `}</style>

      <svg
        width="100%"
        height="100%"
        viewBox="0 0 680 420"
        preserveAspectRatio="xMidYMid meet"
        style={{ overflow: "visible" }}
      >
        <defs>
          <filter id="waterGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="edgeGlow" x="-20%" y="-200%" width="140%" height="500%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* ── Edge base tracks ─────────────────────── */}
        {EDGES.map(edge => (
          <path
            key={`base-${edge.id}`}
            id={edge.id}
            d={edge.d}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        ))}

        {/* ── Animated edge glow (active) ──────────── */}
        {EDGES.map(edge => {
          const fromNode = NODES.find(n => n.id === edge.from);
          const toNode   = NODES.find(n => n.id === edge.to);
          const isActive = edge.from === activeId || edge.to === activeId;
          return (
            <motion.path
              key={`glow-${edge.id}`}
              d={edge.d}
              stroke={edge.color}
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
              filter="url(#edgeGlow)"
              animate={{ opacity: isActive ? 0.6 : 0.12 }}
              transition={{ duration: 0.9, ease: "easeInOut" }}
            />
          );
        })}

        {/* ── Water droplets per edge ──────────────── */}
        {EDGES.map((edge, ei) => (
          <g key={`drops-${edge.id}`}>
            {[0, 1, 2].map(di => (
              <WaterDrop
                key={di}
                pathId={edge.id}
                color={edge.color}
                dur={2.4 + ei * 0.3}
                delay={di * 0.8 + ei * 0.15}
              />
            ))}
          </g>
        ))}

        {/* ── Connection dots at junctions ─────────── */}
        {EDGES.map(edge => {
          const fromNode = NODES.find(n => n.id === edge.from)!;
          const toNode   = NODES.find(n => n.id === edge.to)!;
          const isActive = edge.from === activeId || edge.to === activeId;
          return (
            <g key={`junc-${edge.id}`}>
              <motion.circle
                cx={fromNode.x + 140}
                cy={fromNode.y + 36}
                r="4"
                fill={fromNode.color}
                animate={{ opacity: isActive ? 0.9 : 0.2, scale: isActive ? 1.3 : 1 }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
              />
            </g>
          );
        })}

        {/* ── Node cards ───────────────────────────── */}
        {NODES.map(node => (
          <NodeCard key={node.id} node={node} active={activeId === node.id} />
        ))}
      </svg>

      {/* ── Status strip ─────────────────────────── */}
      <div style={{
        position: "absolute",
        bottom: "16px",
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        gap: "20px",
        alignItems: "center",
        background: "rgba(14,14,18,0.7)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "100px",
        padding: "6px 18px",
      }}>
        {NODES.map(node => (
          <motion.div
            key={node.id}
            style={{ display: "flex", alignItems: "center", gap: "5px" }}
            animate={{ opacity: activeId === node.id ? 1 : 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <div style={{
              width: "5px", height: "5px", borderRadius: "50%",
              background: node.color,
              boxShadow: activeId === node.id ? `0 0 5px ${node.color}` : "none",
              transition: "box-shadow 0.6s",
            }} />
            <span style={{
              fontSize: "10px",
              fontFamily: "var(--font-mono, monospace)",
              color: activeId === node.id ? node.color : "rgba(255,255,255,0.4)",
              transition: "color 0.6s",
              whiteSpace: "nowrap",
            }}>
              {node.label}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
