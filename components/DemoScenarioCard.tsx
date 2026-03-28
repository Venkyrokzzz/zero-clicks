// components/DemoScenarioCard.tsx
"use client";

import { motion } from "framer-motion";
import { DemoScenario } from "@/lib/content";

const SOURCE_COLOURS: Record<string, string> = {
  EMAIL: "rgba(139,92,246,0.15)",
  GOOGLE: "rgba(234,179,8,0.12)",
  TRIPADVISOR: "rgba(16,185,129,0.12)",
};

const SOURCE_TEXT_COLOURS: Record<string, string> = {
  EMAIL: "#a78bfa",
  GOOGLE: "#fbbf24",
  TRIPADVISOR: "#34d399",
};

interface Props {
  scenario: DemoScenario;
  isActive: boolean;
  onClick: () => void;
  index: number;
}

export default function DemoScenarioCard({ scenario, isActive, onClick, index }: Props) {
  return (
    <motion.button
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      onClick={onClick}
      style={{
        width: "100%",
        background: isActive ? "var(--bg-hover)" : "var(--bg-card)",
        border: isActive
          ? "1px solid rgba(59,130,246,0.3)"
          : "1px solid var(--border)",
        borderRadius: "10px",
        padding: "16px",
        cursor: "pointer",
        textAlign: "left",
        transition: "all 200ms ease",
        outline: "none",
        borderLeft: isActive
          ? "3px solid var(--accent)"
          : "3px solid transparent",
      }}
      onMouseEnter={(e) => {
        if (!isActive)
          (e.currentTarget as HTMLElement).style.borderColor = "var(--border-mid)";
      }}
      onMouseLeave={(e) => {
        if (!isActive)
          (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
      }}
    >
      {/* Top row */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
        <span
          style={{
            fontSize: "9px",
            fontWeight: 700,
            letterSpacing: "0.1em",
            padding: "3px 7px",
            borderRadius: "4px",
            background: SOURCE_COLOURS[scenario.source],
            color: SOURCE_TEXT_COLOURS[scenario.source],
            fontFamily: "var(--font-body)",
          }}
        >
          {scenario.source}
        </span>

        <span
          style={{
            fontSize: "9px",
            fontWeight: 700,
            letterSpacing: "0.1em",
            padding: "3px 7px",
            borderRadius: "4px",
            background:
              scenario.priority === "HIGH"
                ? "rgba(239,68,68,0.1)"
                : "rgba(16,185,129,0.1)",
            color: scenario.priority === "HIGH" ? "#f87171" : "#34d399",
            fontFamily: "var(--font-body)",
          }}
        >
          {scenario.priority}
        </span>

        <span
          style={{
            marginLeft: "auto",
            fontSize: "10px",
            color: "var(--text-muted)",
            fontFamily: "var(--font-body)",
          }}
        >
          {scenario.timestamp}
        </span>
      </div>

      <p
        style={{
          fontSize: "12px",
          fontWeight: 600,
          color: "var(--text-primary)",
          margin: "0 0 4px",
          fontFamily: "var(--font-body)",
        }}
      >
        {scenario.sender}
      </p>

      <p
        style={{
          fontSize: "12px",
          color: "var(--text-muted)",
          margin: 0,
          fontFamily: "var(--font-body)",
          lineHeight: 1.5,
          overflow: "hidden",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
        }}
      >
        {scenario.preview}
      </p>
    </motion.button>
  );
}
