"use client";

import { motion } from "framer-motion";

interface MetricsCardProps {
  label: string;
  value: string | number;
  icon: string;
}

export default function MetricsCard({ label, value, icon }: MetricsCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      style={{
        background: "rgba(20, 20, 25, 0.6)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        borderRadius: "12px",
        padding: "24px",
        transition: "all 0.3s ease",
        cursor: "default",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(255, 109, 90, 0.3)";
        e.currentTarget.style.background = "rgba(20, 20, 25, 0.8)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
        e.currentTarget.style.background = "rgba(20, 20, 25, 0.6)";
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div style={{ flex: 1 }}>
          <p
            style={{
              color: "#a1a1aa",
              fontSize: "0.85rem",
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              margin: "0 0 12px 0",
            }}
          >
            {label}
          </p>
          <h3
            style={{
              fontSize: "2rem",
              fontWeight: 700,
              color: "#ffffff",
              margin: 0,
              lineHeight: 1,
            }}
          >
            {value}
          </h3>
        </div>
        <div style={{ fontSize: "2.5rem" }}>{icon}</div>
      </div>

      {/* Bottom accent line */}
      <div
        style={{
          height: "2px",
          background: "linear-gradient(to right, rgba(255, 109, 90, 0.5), transparent)",
          marginTop: "16px",
          borderRadius: "1px",
        }}
      />
    </motion.div>
  );
}
