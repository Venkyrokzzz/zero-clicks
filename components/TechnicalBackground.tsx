"use client";

import RisingFlowBackground from "./RisingFlowBackground";
import RisingAura from "./RisingAura";

export default function TechnicalBackground() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
        background: "transparent",
      }}
    >

      {/* Grid pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
          maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.05) 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.05) 100%)",
        }}
      />

      {/* Rising light streaks + motes */}
      <RisingAura />

      {/* Bright cyan rising particles */}
      <RisingFlowBackground />
    </div>
  );
}
