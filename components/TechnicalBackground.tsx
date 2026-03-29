"use client";

import N8nFlowBackground from "./N8nFlowBackground";

export default function TechnicalBackground() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        pointerEvents: "none",
        overflow: "hidden",
        background: "#000000",
      }}
    >
      {/* Raycast-style colorful aura glows */}
      <div style={{ position: "absolute", top: "-20%", left: "10%", width: "50%", height: "60%", background: "radial-gradient(circle, rgba(147, 51, 234, 0.18) 0%, transparent 60%)", filter: "blur(120px)" }} />
      <div style={{ position: "absolute", bottom: "-10%", right: "10%", width: "60%", height: "60%", background: "radial-gradient(circle, rgba(239, 68, 68, 0.14) 0%, transparent 60%)", filter: "blur(120px)" }} />
      <div style={{ position: "absolute", top: "40%", left: "-10%", width: "40%", height: "50%", background: "radial-gradient(circle, rgba(56, 189, 248, 0.14) 0%, transparent 60%)", filter: "blur(120px)" }} />

      {/* Subtle grid pattern */}
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

      {/* 60fps Canvas-based n8n flow animation */}
      <N8nFlowBackground />
    </div>
  );
}
