// app/onboarding/page.tsx
// Animated onboarding sequence + business details form
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const BUSINESS_TYPES = [
  { value: "pub", label: "🍺 Pub" },
  { value: "restaurant", label: "🍽️ Restaurant" },
  { value: "cafe", label: "☕ Café" },
  { value: "hotel", label: "🏨 Hotel" },
];

const AMBER = "#f59e0b";

// ── Beer Mug SVG ──────────────────────────────────────────────────────────────
function BeerMug({ fillProgress }: { fillProgress: number }) {
  // fillProgress 0→1: liquid fill level
  // Mug viewBox is 0 0 120 160
  const mugHeight = 120; // interior height of liquid area
  const liquidY = 30 + mugHeight * (1 - fillProgress); // top of liquid (starts at bottom)
  const liquidHeight = mugHeight * fillProgress;
  const foamOpacity = fillProgress > 0.85 ? (fillProgress - 0.85) / 0.15 : 0;

  return (
    <svg
      viewBox="0 0 120 175"
      width="160"
      height="200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <clipPath id="liquidClip">
          <rect x="10" y={liquidY} width="80" height={liquidHeight + 10} />
        </clipPath>
      </defs>

      {/* Liquid fill */}
      <rect
        x="12"
        y={liquidY}
        width="76"
        height={liquidHeight}
        fill={AMBER}
        opacity="0.85"
        clipPath="url(#liquidClip)"
        rx="2"
      />

      {/* Foam head */}
      {foamOpacity > 0 && (
        <g opacity={foamOpacity}>
          <ellipse cx="50" cy="30" rx="38" ry="10" fill="white" opacity="0.9" />
          <ellipse cx="30" cy="28" rx="12" ry="7" fill="white" opacity="0.8" />
          <ellipse cx="60" cy="27" rx="16" ry="8" fill="white" opacity="0.85" />
          <ellipse cx="72" cy="29" rx="10" ry="6" fill="white" opacity="0.75" />
        </g>
      )}

      {/* Mug body outline */}
      <path
        d="M10 30 L10 150 Q10 165 25 165 L75 165 Q90 165 90 150 L90 30 Z"
        stroke="white"
        strokeWidth="3"
        fill="none"
        strokeLinejoin="round"
      />

      {/* Mug rim */}
      <rect x="8" y="22" width="84" height="12" rx="6" stroke="white" strokeWidth="3" fill="none" />

      {/* Handle */}
      <path
        d="M90 60 Q120 60 120 95 Q120 130 90 130"
        stroke="white"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />

      {/* Handle liquid fill when mug is filling */}
      {fillProgress > 0.5 && (
        <path
          d="M90 66 Q112 66 112 95 Q112 124 90 124"
          stroke={AMBER}
          strokeWidth="2"
          opacity={Math.min(1, (fillProgress - 0.5) * 2 * 0.7)}
          fill="none"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

// ── Stat cards ────────────────────────────────────────────────────────────────
const STATS = [
  {
    icon: "🕐",
    value: "8 seconds",
    label: "Average reply time vs 3.2 day industry average",
  },
  {
    icon: "🤖",
    value: "Fully automated",
    label: "Reviews detected, drafted and posted while you sleep",
  },
  {
    icon: "📈",
    value: "15% more visibility",
    label: "Review signals drive Google local SEO ranking",
  },
];

// ── Main component ────────────────────────────────────────────────────────────
export default function OnboardingPage() {
  const router = useRouter();

  // Animation state
  const [animStep, setAnimStep] = useState<0 | 1 | 2 | 3 | 4>(0);
  // 0 = beer mug filling, 1 = welcome text, 2 = cards, 3 = CTA, 4 = form
  const [fillProgress, setFillProgress] = useState(0);
  const [showAnimation, setShowAnimation] = useState(true);

  // Form state
  const [form, setForm] = useState({
    business_name: "",
    business_type: "",
    manager_name: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Drive the animation sequence
  useEffect(() => {
    if (!showAnimation) return;

    // Step 0: fill beer mug over 3 seconds
    const startTime = Date.now();
    const fillDuration = 3000;
    let rafId: number;

    function tick() {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / fillDuration, 1);
      setFillProgress(progress);
      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        // Mug full → move to step 1 (welcome text)
        setTimeout(() => setAnimStep(1), 300);
      }
    }
    rafId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafId);
  }, [showAnimation]);

  useEffect(() => {
    if (!showAnimation) return;
    if (animStep === 1) {
      // After 1s show cards
      const t = setTimeout(() => setAnimStep(2), 1200);
      return () => clearTimeout(t);
    }
    if (animStep === 2) {
      // After 2s (stagger finishes) show CTA
      const t = setTimeout(() => setAnimStep(3), 2400);
      return () => clearTimeout(t);
    }
  }, [animStep, showAnimation]);

  function handleStartSetup() {
    setShowAnimation(false);
    setAnimStep(4);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.business_name || !form.business_type || !form.manager_name) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setError("");

    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <AnimatePresence mode="wait">
      {showAnimation ? (
        <motion.main
          key="animation"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            background: "#0a0a0a",
            color: "white",
            fontFamily: "Inter, system-ui, sans-serif",
            padding: "2rem",
            textAlign: "center",
            overflow: "hidden",
          }}
        >
          {/* Step 0 — Beer mug */}
          <AnimatePresence>
            {animStep === 0 && (
              <motion.div
                key="mug"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 0.4 }}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}
              >
                <BeerMug fillProgress={fillProgress} />
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  transition={{ delay: 0.5 }}
                  style={{ color: "#888", fontSize: "0.9rem", letterSpacing: "0.05em" }}
                >
                  Setting things up…
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Step 1 — Welcome text */}
          <AnimatePresence>
            {animStep >= 1 && animStep < 4 && (
              <motion.div
                key="welcome"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6 }}
                style={{ width: "100%", maxWidth: "640px" }}
              >
                <motion.h1
                  style={{
                    fontSize: "clamp(2rem, 5vw, 3rem)",
                    fontWeight: 800,
                    marginBottom: "0.5rem",
                    letterSpacing: "-0.02em",
                  }}
                >
                  Welcome to{" "}
                  <span style={{ color: AMBER }}>Zero Clicks</span>
                </motion.h1>
                <motion.p
                  style={{ color: "#999", fontSize: "1.1rem", marginBottom: "3rem" }}
                >
                  AI automation for UK hospitality
                </motion.p>

                {/* Step 2 — Stat cards */}
                <AnimatePresence>
                  {animStep >= 2 && (
                    <motion.div
                      key="cards"
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                        gap: "1rem",
                        marginBottom: "3rem",
                      }}
                    >
                      {STATS.map((stat, i) => (
                        <motion.div
                          key={stat.value}
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.2, duration: 0.5 }}
                          style={{
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: "12px",
                            padding: "1.25rem",
                            textAlign: "left",
                            backdropFilter: "blur(8px)",
                          }}
                        >
                          <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
                            {stat.icon}
                          </div>
                          <div
                            style={{
                              fontWeight: 700,
                              fontSize: "1rem",
                              color: AMBER,
                              marginBottom: "0.3rem",
                            }}
                          >
                            {stat.value}
                          </div>
                          <div style={{ color: "#888", fontSize: "0.8rem", lineHeight: 1.4 }}>
                            {stat.label}
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Step 3 — CTA */}
                <AnimatePresence>
                  {animStep >= 3 && (
                    <motion.div
                      key="cta"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                    >
                      <p
                        style={{
                          fontSize: "1.1rem",
                          fontWeight: 600,
                          marginBottom: "1.25rem",
                          color: "#ddd",
                        }}
                      >
                        Your 30-day free trial starts now
                      </p>
                      <button
                        onClick={handleStartSetup}
                        style={{
                          padding: "0.9rem 2rem",
                          borderRadius: "10px",
                          background: AMBER,
                          color: "#000",
                          fontWeight: 700,
                          fontSize: "1rem",
                          border: "none",
                          cursor: "pointer",
                          letterSpacing: "0.01em",
                          transition: "transform 0.15s ease, opacity 0.15s ease",
                        }}
                        onMouseEnter={e => {
                          (e.currentTarget as HTMLButtonElement).style.opacity = "0.9";
                          (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.03)";
                        }}
                        onMouseLeave={e => {
                          (e.currentTarget as HTMLButtonElement).style.opacity = "1";
                          (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
                        }}
                      >
                        Let&apos;s set up your account →
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.main>
      ) : (
        // ── Business details form ──────────────────────────────────────────────
        <motion.main
          key="form"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            padding: "2rem",
          }}
        >
          <div style={{ width: "100%", maxWidth: "480px" }}>
            <h1 style={{ fontSize: "1.8rem", fontWeight: 700, marginBottom: "0.5rem" }}>
              Tell us about your business
            </h1>
            <p style={{ color: "var(--text-muted, #888)", marginBottom: "2rem" }}>
              Just a few details and you&apos;re in.
            </p>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div>
                <label style={{ display: "block", marginBottom: "0.4rem", fontWeight: 500 }}>
                  Business name
                </label>
                <input
                  type="text"
                  placeholder="e.g. The Old Fountain"
                  value={form.business_name}
                  onChange={e => setForm(f => ({ ...f, business_name: e.target.value }))}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "0.4rem", fontWeight: 500 }}>
                  Business type
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                  {BUSINESS_TYPES.map(type => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, business_type: type.value }))}
                      style={{
                        padding: "0.75rem",
                        borderRadius: "8px",
                        border: form.business_type === type.value
                          ? "2px solid var(--accent, #f59e0b)"
                          : "2px solid var(--border, #333)",
                        background: form.business_type === type.value
                          ? "var(--accent-subtle, rgba(245,158,11,0.1))"
                          : "transparent",
                        cursor: "pointer",
                        fontWeight: 500,
                        fontSize: "0.95rem",
                        color: "inherit",
                      }}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "0.4rem", fontWeight: 500 }}>
                  Your name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sarah"
                  value={form.manager_name}
                  onChange={e => setForm(f => ({ ...f, manager_name: e.target.value }))}
                  style={inputStyle}
                />
              </div>

              {error && (
                <p style={{ color: "#ef4444", fontSize: "0.9rem" }}>{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: "0.85rem",
                  borderRadius: "8px",
                  background: "var(--accent, #f59e0b)",
                  color: "#000",
                  fontWeight: 700,
                  fontSize: "1rem",
                  border: "none",
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? "Saving…" : "Let's go →"}
              </button>
            </form>
          </div>
        </motion.main>
      )}
    </AnimatePresence>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.75rem 1rem",
  borderRadius: "8px",
  border: "1px solid var(--border, #333)",
  background: "var(--input-bg, #1a1a1a)",
  fontSize: "1rem",
  boxSizing: "border-box",
  color: "inherit",
};
