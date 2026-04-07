"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PAIRS = [
  { pain: "Your inbox is overflowing...",      fix: "Handled." },
  { pain: "A 1-star review just dropped...",   fix: "Replied." },
  { pain: "A lead came in at 2am...",          fix: "Captured." },
  { pain: "A supplier needs chasing...",       fix: "Done." },
  { pain: "Bookings logged by hand...",        fix: "Automated." },
  { pain: "You're drowning in admin...",       fix: "Not anymore." },
];

const TYPE_SPEED   = 38;   // ms per character
const DELETE_SPEED = 18;   // ms per character
const PAUSE_FULL   = 1600; // ms — hold after fully typed
const PAUSE_FIX    = 1200; // ms — hold after fix appears

type Phase = "typing-pain" | "pause-pain" | "deleting-pain" | "show-fix" | "pause-fix";

export default function TypewriterHero() {
  const [index,   setIndex]   = useState(0);
  const [phase,   setPhase]   = useState<Phase>("typing-pain");
  const [display, setDisplay] = useState("");
  const [showFix, setShowFix] = useState(false);

  useEffect(() => {
    const pair = PAIRS[index];

    if (phase === "typing-pain") {
      if (display.length < pair.pain.length) {
        const t = setTimeout(() => setDisplay(pair.pain.slice(0, display.length + 1)), TYPE_SPEED);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setPhase("pause-pain"), PAUSE_FULL);
        return () => clearTimeout(t);
      }
    }

    if (phase === "pause-pain") {
      setShowFix(false);
      const t = setTimeout(() => setPhase("deleting-pain"), 400);
      return () => clearTimeout(t);
    }

    if (phase === "deleting-pain") {
      if (display.length > 0) {
        const t = setTimeout(() => setDisplay(d => d.slice(0, -1)), DELETE_SPEED);
        return () => clearTimeout(t);
      } else {
        setShowFix(true);
        setPhase("show-fix");
      }
    }

    if (phase === "show-fix") {
      const t = setTimeout(() => setPhase("pause-fix"), PAUSE_FIX);
      return () => clearTimeout(t);
    }

    if (phase === "pause-fix") {
      const t = setTimeout(() => {
        setShowFix(false);
        setIndex(i => (i + 1) % PAIRS.length);
        setDisplay("");
        setPhase("typing-pain");
      }, 400);
      return () => clearTimeout(t);
    }
  }, [phase, display, index]);

  const pair = PAIRS[index];

  return (
    <div style={{ minHeight: "72px", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <AnimatePresence mode="wait">
        {!showFix ? (
          <motion.p
            key="pain"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            style={{
              fontSize: "clamp(1rem, 2.2vw, 1.2rem)",
              color: "#71717a",
              fontFamily: "var(--font-body)",
              fontWeight: 300,
              textAlign: "center",
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            {display}
            <span
              style={{
                display: "inline-block",
                width: "2px",
                height: "1.1em",
                background: "var(--accent)",
                marginLeft: "2px",
                verticalAlign: "text-bottom",
                animation: "blink 1s step-end infinite",
                opacity: phase === "deleting-pain" || phase === "typing-pain" ? 1 : 0,
              }}
            />
          </motion.p>
        ) : (
          <motion.p
            key="fix"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            style={{
              fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)",
              color: "#ffffff",
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              textAlign: "center",
              letterSpacing: "-0.02em",
              margin: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
            }}
          >
            <motion.span
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.1 }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "22px",
                height: "22px",
                borderRadius: "50%",
                background: "var(--accent)",
                flexShrink: 0,
              }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 13l4 4L19 7" />
              </svg>
            </motion.span>
            {pair.fix}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
