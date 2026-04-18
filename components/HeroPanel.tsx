// components/HeroPanel.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const REVIEWS = [
  {
    name: "James T.",
    rating: 2,
    time: "2 weeks ago",
    text: "Service was really slow and the bar staff seemed disinterested. Food took 40 minutes for a simple burger. Won't be returning.",
    reply: "Hi James — thank you for the honest feedback, we're sorry your visit didn't hit the mark. A 40-minute wait for a burger is not what we're about, and we'll be speaking to the team about it. If you'd like to give us another chance, please reach out directly — we'd love to make it right.",
    stars: "★★☆☆☆",
  },
  {
    name: "Sarah M.",
    rating: 4,
    time: "3 days ago",
    text: "Great atmosphere and lovely staff. The Sunday roast was brilliant. Knocked off a star because the car park was full and we had to circle twice.",
    reply: "Thank you Sarah, really glad the roast hit the spot — our kitchen team will love hearing that! Totally fair point on the car park, Sunday afternoons do get busy. We've got a side street right around the corner that's usually free — we'll get that on our Google listing. Hope to see you again soon.",
    stars: "★★★★☆",
  },
  {
    name: "Priya K.",
    rating: 5,
    time: "1 day ago",
    text: "Absolutely brilliant evening. Staff were welcoming, the cocktails were perfect and the live music was a lovely touch. Already planning our next visit!",
    reply: "Priya, this made our whole team smile — thank you! So glad the cocktails and live music made the evening. We've got more live sessions coming up next month, we'll post on here when dates are confirmed. Can't wait to see you back.",
    stars: "★★★★★",
  },
];

function Stars({ rating }: { rating: number }) {
  return (
    <div style={{ display: "flex", gap: "2px" }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill={i <= rating ? "#f59e0b" : "rgba(255,255,255,0.12)"}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export default function HeroPanel() {
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<"review" | "typing" | "done">("review");

  useEffect(() => {
    // show review for 2s → typing for 2s → done for 3s → next review
    const t1 = setTimeout(() => setPhase("typing"), 2200);
    const t2 = setTimeout(() => setPhase("done"), 4200);
    const t3 = setTimeout(() => {
      setPhase("review");
      setIdx((i) => (i + 1) % REVIEWS.length);
    }, 7500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [idx]);

  const review = REVIEWS[idx];

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
      style={{
        position: "relative", zIndex: 10,
        width: "100%", maxWidth: "780px", marginBottom: "40px",
      }}
    >
      {/* ── Live badge ── */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "7px",
          padding: "5px 12px", borderRadius: "9999px",
          background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)",
        }}>
          <motion.div
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10b981" }}
          />
          <span style={{ fontSize: "11px", color: "#10b981", fontWeight: 600, letterSpacing: "0.06em", fontFamily: "var(--font-mono)" }}>
            LIVE DEMO — watching your Google listing
          </span>
        </div>
      </div>

      {/* ── Main card ── */}
      <div style={{
        borderRadius: "16px",
        border: "1px solid rgba(255,255,255,0.07)",
        background: "rgba(7, 9, 20, 0.9)",
        backdropFilter: "blur(28px)",
        boxShadow: "0 32px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.03)",
        overflow: "hidden",
      }}>

        {/* Header bar */}
        <div style={{
          padding: "12px 20px",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          display: "flex", alignItems: "center", gap: "10px",
          background: "rgba(255,255,255,0.02)",
        }}>
          <div style={{ display: "flex", gap: "6px" }}>
            {["#ef4444", "#f59e0b", "#10b981"].map((c) => (
              <div key={c} style={{ width: "10px", height: "10px", borderRadius: "50%", background: c, opacity: 0.7 }} />
            ))}
          </div>
          <div style={{
            flex: 1, textAlign: "center",
            fontSize: "11px", color: "rgba(255,255,255,0.25)",
            fontFamily: "var(--font-mono)", letterSpacing: "0.04em",
          }}>
            google.com/maps — New review received
          </div>
        </div>

        <div className="hero-panel-body" style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* ── Incoming review ── */}
          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              style={{
                padding: "16px 18px",
                borderRadius: "10px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                <div style={{
                  width: "32px", height: "32px", borderRadius: "50%",
                  background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "12px", fontWeight: 700, color: "#fff",
                  flexShrink: 0,
                }}>
                  {review.name[0]}
                </div>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.85)", fontFamily: "var(--font-body)" }}>
                    {review.name}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "2px" }}>
                    <Stars rating={review.rating} />
                    <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.28)", fontFamily: "var(--font-body)" }}>
                      {review.time}
                    </span>
                  </div>
                </div>
                <div style={{ marginLeft: "auto" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M21.8 8.001a2.452 2.452 0 00-1.728-1.728C18.254 6 12 6 12 6s-6.254 0-8.072.273A2.452 2.452 0 002.2 8.001C1.927 9.82 1.927 12 1.927 12s0 2.18.273 3.999a2.452 2.452 0 001.728 1.728C5.746 18 12 18 12 18s6.254 0 8.072-.273a2.452 2.452 0 001.728-1.728C22.073 14.18 22.073 12 22.073 12s0-2.18-.273-3.999z" fill="#ef4444" opacity="0.8"/>
                    <path d="M9.75 15.02V8.98l5.5 3.02-5.5 3.02z" fill="white"/>
                  </svg>
                </div>
              </div>
              <p style={{
                fontSize: "13px", color: "rgba(255,255,255,0.55)", lineHeight: 1.6, margin: 0,
                fontFamily: "var(--font-body)",
              }}>
                {review.text}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* ── AI reply section ── */}
          <div style={{
            padding: "16px 18px",
            borderRadius: "10px",
            background: phase === "done"
              ? "rgba(16,185,129,0.05)"
              : "rgba(59,130,246,0.04)",
            border: `1px solid ${phase === "done" ? "rgba(16,185,129,0.2)" : "rgba(59,130,246,0.12)"}`,
            transition: "background 400ms ease, border-color 400ms ease",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
              <div style={{
                width: "22px", height: "22px", borderRadius: "6px",
                background: "rgba(59,130,246,0.15)",
                border: "1px solid rgba(59,130,246,0.25)",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" stroke="#60a5fa" strokeWidth="1.5"/>
                  <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" stroke="#60a5fa" strokeWidth="1.5" opacity="0.5"/>
                </svg>
              </div>
              <span style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.06em", color: "rgba(96,165,250,0.8)", fontFamily: "var(--font-mono)" }}>
                ZERO CLICKS AI
              </span>
              {phase === "typing" && (
                <motion.div style={{ display: "flex", gap: "3px", marginLeft: "4px" }}>
                  {[0, 1, 2].map((i) => (
                    <motion.div key={i}
                      animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                      transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
                      style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#60a5fa" }}
                    />
                  ))}
                </motion.div>
              )}
              {phase === "done" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "5px" }}
                >
                  <div style={{
                    padding: "3px 8px", borderRadius: "9999px",
                    background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.25)",
                    display: "flex", alignItems: "center", gap: "4px",
                  }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5"/>
                    </svg>
                    <span style={{ fontSize: "10px", color: "#10b981", fontWeight: 700, fontFamily: "var(--font-mono)" }}>
                      REPLY READY
                    </span>
                  </div>
                </motion.div>
              )}
            </div>

            <div style={{ minHeight: "60px" }}>
              {phase === "review" && (
                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.2)", margin: 0, fontFamily: "var(--font-body)", fontStyle: "italic" }}>
                  Waiting for new reviews...
                </p>
              )}
              {phase === "typing" && (
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", margin: 0, fontFamily: "var(--font-body)", lineHeight: 1.6 }}>
                  Writing reply in your voice...
                </p>
              )}
              {phase === "done" && (
                <AnimatePresence>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)", margin: 0, fontFamily: "var(--font-body)", lineHeight: 1.6 }}
                  >
                    {review.reply}
                  </motion.p>
                </AnimatePresence>
              )}
            </div>
          </div>

          {/* ── Stats row ── */}
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(3,1fr)",
            gap: "12px", paddingTop: "4px",
          }}>
            {[
              { val: "<4 min", label: "avg reply time" },
              { val: "24/7", label: "always watching" },
              { val: "48 hrs", label: "to go live" },
            ].map((s) => (
              <div key={s.val} style={{
                textAlign: "center", padding: "12px 8px",
                borderRadius: "8px",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.05)",
              }}>
                <div style={{ fontSize: "1.35rem", fontWeight: 700, color: "#fff", letterSpacing: "-0.04em", lineHeight: 1, fontFamily: "var(--font-display)" }}>
                  {s.val}
                </div>
                <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.25)", letterSpacing: "0.12em", marginTop: "4px", fontFamily: "var(--font-mono)", textTransform: "uppercase" }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
      <style>{`
        @media (max-width: 480px) {
          .hero-panel-body { padding: 16px 16px !important; }
        }
      `}</style>
    </motion.div>
  );
}
