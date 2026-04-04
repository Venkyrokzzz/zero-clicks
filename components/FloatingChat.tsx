"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function FloatingChat() {
  const [bubbleVisible, setBubbleVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Show bubble after 6 seconds
  useEffect(() => {
    const t = setTimeout(() => setBubbleVisible(true), 6000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        zIndex: 40,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: "10px",
      }}
    >
      {/* Bubble message */}
      <AnimatePresence>
        {bubbleVisible && !dismissed && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-mid)",
              borderRadius: "12px",
              padding: "12px 14px",
              maxWidth: "220px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
              backdropFilter: "blur(12px)",
              position: "relative",
            }}
          >
            {/* Dismiss */}
            <button
              onClick={() => setDismissed(true)}
              style={{
                position: "absolute",
                top: "6px",
                right: "8px",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--text-muted)",
                fontSize: "14px",
                lineHeight: 1,
                padding: "2px",
              }}
            >
              ×
            </button>
            <p style={{
              fontSize: "13px",
              color: "var(--text-primary)",
              fontFamily: "var(--font-body)",
              fontWeight: 500,
              margin: "0 0 4px",
              paddingRight: "14px",
            }}>
              Not sure where to start?
            </p>
            <p style={{
              fontSize: "12px",
              color: "var(--text-muted)",
              fontFamily: "var(--font-body)",
              margin: "0 0 10px",
            }}>
              Tell us what you&apos;re trying to automate — we&apos;ll figure out the rest.
            </p>
            <a
              href="mailto:zeroclicks.hq@gmail.com?subject=Quick question about automation"
              style={{
                fontSize: "12px",
                fontWeight: 600,
                color: "var(--accent)",
                fontFamily: "var(--font-body)",
                textDecoration: "none",
              }}
            >
              Email us →
            </a>
            {/* Triangle pointer */}
            <div style={{
              position: "absolute",
              bottom: "-6px",
              right: "22px",
              width: "10px",
              height: "10px",
              background: "var(--bg-card)",
              border: "1px solid var(--border-mid)",
              borderTop: "none",
              borderLeft: "none",
              transform: "rotate(45deg)",
            }} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat button */}
      <motion.a
        href="mailto:zeroclicks.hq@gmail.com?subject=Quick question about automation"
        aria-label="Contact us"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => setBubbleVisible(false)}
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "14px",
          background: "var(--text-primary)",
          color: "#000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
          textDecoration: "none",
          position: "relative",
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        </svg>

        {/* Pulse ring */}
        <motion.span
          animate={{ scale: [1, 1.6], opacity: [0.4, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "14px",
            border: "2px solid var(--text-primary)",
            pointerEvents: "none",
          }}
        />
      </motion.a>
    </div>
  );
}
