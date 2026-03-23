// components/WorkflowAnimation.tsx
// Animated automation workflow — shows nodes flowing data, pure CSS + Framer Motion
"use client";

import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";

const nodes = [
  { id: "trigger", label: "Email received", tag: "TRIGGER", color: "#3b82f6", icon: "✉" },
  { id: "ai",      label: "AI extracts data", tag: "PROCESS",  color: "#8b5cf6", icon: "⚡" },
  { id: "crm",     label: "CRM updated",      tag: "ACTION",   color: "#10b981", icon: "✓" },
  { id: "slack",   label: "Slack notified",   tag: "NOTIFY",   color: "#f59e0b", icon: "→" },
];

function Node({
  node,
  index,
  active,
}: {
  node: typeof nodes[0];
  index: number;
  active: number;
}) {
  const isActive = active === index;
  const isDone = active > index;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.1 * index }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "14px 16px",
        borderRadius: "8px",
        border: `1px solid ${isActive ? node.color + "55" : isDone ? "#2a2a2a" : "#1e1e1e"}`,
        background: isActive ? node.color + "0d" : "var(--bg-card)",
        transition: "border-color 400ms ease, background 400ms ease",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Active shimmer */}
      {isActive && (
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(90deg, transparent, ${node.color}15, transparent)`,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Icon */}
      <div
        style={{
          width: "32px",
          height: "32px",
          borderRadius: "6px",
          background: isDone || isActive ? node.color + "22" : "#1a1a1a",
          border: `1px solid ${isDone || isActive ? node.color + "44" : "#222"}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "14px",
          color: isDone || isActive ? node.color : "var(--text-muted)",
          flexShrink: 0,
          transition: "all 400ms ease",
        }}
      >
        {isDone ? "✓" : node.icon}
      </div>

      {/* Label */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontSize: "12px",
            fontFamily: "var(--font-body)",
            color: isDone || isActive ? "var(--text-primary)" : "var(--text-secondary)",
            margin: 0,
            fontWeight: 500,
            transition: "color 400ms ease",
          }}
        >
          {node.label}
        </p>
      </div>

      {/* Tag */}
      <span
        style={{
          fontSize: "9px",
          letterSpacing: "0.12em",
          fontFamily: "var(--font-body)",
          fontWeight: 600,
          color: isActive ? node.color : "var(--text-muted)",
          background: isActive ? node.color + "15" : "transparent",
          padding: "3px 7px",
          borderRadius: "4px",
          transition: "all 400ms ease",
          flexShrink: 0,
        }}
      >
        {node.tag}
      </span>

      {/* Status dot */}
      <div
        style={{
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          background: isDone ? "#10b981" : isActive ? node.color : "#2a2a2a",
          flexShrink: 0,
          animation: isActive ? "status-pulse 1.5s ease-in-out infinite" : "none",
          transition: "background 400ms ease",
        }}
      />
    </motion.div>
  );
}

function Connector({ active, index }: { active: number; index: number }) {
  const done = active > index;
  const running = active === index + 1;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "2px 16px 2px 28px",
        gap: "0",
        position: "relative",
        height: "20px",
      }}
    >
      {/* Base line */}
      <div
        style={{
          position: "absolute",
          left: "28px",
          top: "50%",
          transform: "translateY(-50%)",
          width: "1px",
          height: "100%",
          background: "#1e1e1e",
        }}
      />
      {/* Filled line */}
      <motion.div
        animate={{ scaleY: done ? 1 : 0 }}
        initial={{ scaleY: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          position: "absolute",
          left: "28px",
          top: "50%",
          transform: "translateY(-50%)",
          width: "1px",
          height: "100%",
          background: "#10b981",
          transformOrigin: "top",
        }}
      />
    </div>
  );
}

export default function WorkflowAnimation() {
  const [active, setActive] = useState(0);
  const [runs, setRuns] = useState(0);
  const [tilt, setTilt] = useState("perspective(1000px) rotateX(0deg) rotateY(0deg)");

  useEffect(() => {
    const interval = setInterval(() => {
      setActive(prev => {
        if (prev >= nodes.length) {
          setRuns(r => r + 1);
          return 0;
        }
        return prev + 1;
      });
    }, 900);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt(`perspective(1000px) rotateX(${-y * 12}deg) rotateY(${x * 12}deg)`);
  };

  return (
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setTilt("perspective(1000px) rotateX(0deg) rotateY(0deg)")}
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border)",
        borderRadius: "12px",
        padding: "20px",
        width: "100%",
        maxWidth: "340px",
        transform: tilt,
        transition: "transform 300ms ease",
        willChange: "transform",
        boxShadow: "0 32px 80px rgba(0,0,0,0.4), 0 0 0 1px rgba(59,130,246,0.06)",
      }}
    >
      {/* Header bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "16px",
          paddingBottom: "12px",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ display: "flex", gap: "5px" }}>
            {["#ff5f57", "#febc2e", "#28c840"].map(c => (
              <div key={c} style={{ width: 8, height: 8, borderRadius: "50%", background: c }} />
            ))}
          </div>
          <span
            style={{
              fontSize: "11px",
              color: "var(--text-muted)",
              fontFamily: "var(--font-body)",
              marginLeft: "4px",
            }}
          >
            n8n workflow
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "#10b981",
              animation: "status-pulse 2s ease-in-out infinite",
            }}
          />
          <span
            style={{
              fontSize: "10px",
              color: "#10b981",
              fontFamily: "var(--font-body)",
              fontWeight: 500,
            }}
          >
            LIVE
          </span>
        </div>
      </div>

      {/* Nodes */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        {nodes.map((node, i) => (
          <div key={node.id}>
            <Node node={node} index={i} active={active} />
            {i < nodes.length - 1 && <Connector active={active} index={i} />}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div
        style={{
          marginTop: "16px",
          paddingTop: "12px",
          borderTop: "1px solid var(--border)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: "10px", color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
          runs today
        </span>
        <span
          style={{
            fontSize: "13px",
            color: "var(--accent)",
            fontFamily: "var(--font-body)",
            fontWeight: 600,
          }}
        >
          {247 + runs}
        </span>
      </div>
    </motion.div>
  );
}
