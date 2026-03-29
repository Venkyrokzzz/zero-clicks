"use client";

import { motion } from "framer-motion";

export default function N8NFlowBackground() {
  const flowLines = [
    { x: "15%", duration: 12, delay: 0, color: "#c084fc" },
    { x: "35%", duration: 13.5, delay: 0.5, color: "#60a5fa" },
    { x: "50%", duration: 14, delay: 1, color: "#a78bfa" },
    { x: "65%", duration: 15, delay: 1.5, color: "#06b6d4" },
    { x: "85%", duration: 16, delay: 2, color: "#c084fc" },
  ];

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        zIndex: 0,
      }}
    >
      {/* Flowing vertical lines */}
      {flowLines.map((line, idx) => (
        <motion.div
          key={`line-${idx}`}
          style={{
            position: "absolute",
            left: line.x,
            top: "-100%",
            width: "2px",
            height: "200%",
            background: `linear-gradient(to bottom, ${line.color}70, ${line.color}40, ${line.color}00)`,
            filter: "blur(2px)",
            opacity: 0.6,
          }}
          animate={{
            y: ["0%", "100%"],
          }}
          transition={{
            duration: line.duration,
            repeat: Infinity,
            ease: "linear",
            delay: line.delay,
          }}
        />
      ))}

      {/* Horizontal connector lines - subtle */}
      {[0, 1, 2, 3].map((idx) => (
        <motion.div
          key={`connector-${idx}`}
          style={{
            position: "absolute",
            left: "15%",
            top: `${25 + idx * 18}%`,
            width: "70%",
            height: "1px",
            background: `linear-gradient(90deg, transparent, rgba(192,132,252,0.25), transparent)`,
            filter: "blur(0.8px)",
          }}
          animate={{
            opacity: [0.1, 0.4, 0.1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: idx * 0.5,
          }}
        />
      ))}

      {/* Gradient fade - darker at edges */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, transparent 0%, rgba(18, 18, 20, 0.7) 100%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
