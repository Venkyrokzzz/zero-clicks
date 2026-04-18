"use client";

import { useTheme } from "./ThemeProvider";
import { motion } from "framer-motion";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === "light";

  return (
    <button
      onClick={toggleTheme}
      aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        padding: "7px 12px",
        borderRadius: "9px",
        border: `1px solid ${isLight ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.1)"}`,
        background: isLight
          ? "rgba(255,255,255,0.9)"
          : "rgba(255,255,255,0.06)",
        cursor: "pointer",
        flexShrink: 0,
        transition: "all 200ms ease",
        backdropFilter: "blur(8px)",
      }}
    >
      {/* Track */}
      <div style={{
        position: "relative",
        width: "32px",
        height: "18px",
        borderRadius: "9px",
        background: isLight
          ? "rgba(0,0,0,0.08)"
          : "rgba(6,182,212,0.2)",
        border: `1px solid ${isLight ? "rgba(0,0,0,0.1)" : "rgba(6,182,212,0.25)"}`,
        transition: "background 200ms ease, border-color 200ms ease",
        flexShrink: 0,
      }}>
        <motion.div
          animate={{ x: isLight ? 16 : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 35 }}
          style={{
            position: "absolute",
            top: "2px",
            left: "2px",
            width: "12px",
            height: "12px",
            borderRadius: "50%",
            background: isLight ? "#f59e0b" : "#06b6d4",
            boxShadow: isLight
              ? "0 0 6px rgba(245,158,11,0.5)"
              : "0 0 6px rgba(6,182,212,0.5)",
          }}
        />
      </div>

      {/* Icon */}
      {isLight ? (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
          stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="5"/>
          <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
        </svg>
      ) : (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
          stroke="rgba(6,182,212,0.8)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      )}
    </button>
  );
}
