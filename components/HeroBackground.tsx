"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";

const HeroBackground = () => {
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      document.documentElement.style.setProperty("--x", `${e.clientX}px`);
      document.documentElement.style.setProperty("--y", `${e.clientY}px`);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        overflow: "hidden",
        backgroundColor: "#09090b",
      }}
    >
      {/* Pulsing radial glow */}
      <div className="radial-glow" />

      {/* Floating Ambient Orbs */}
      <motion.div
        animate={{ x: [0, 100, 0], y: [0, 50, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        style={{
          position: "absolute",
          top: "-80px",
          left: "-80px",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: "rgba(6, 182, 212, 0.12)",
          filter: "blur(120px)",
        }}
      />
      <motion.div
        animate={{ x: [0, -80, 0], y: [0, 120, 0], scale: [1, 1.5, 1] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        style={{
          position: "absolute",
          top: "25%",
          right: "-80px",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: "rgba(168, 85, 247, 0.12)",
          filter: "blur(140px)",
        }}
      />

      {/* Cursor-reactive glow field */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: `radial-gradient(600px circle at var(--x, 50%) var(--y, 50%), rgba(59, 130, 246, 0.06), transparent 40%)`,
        }}
      />

      {/* Pro film grain noise */}
      <div className="hero-noise" />
    </div>
  );
};

export default HeroBackground;
