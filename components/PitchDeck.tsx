"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const slides = [
  {
    id: 1,
    type: "hook",
  },
  {
    id: 2,
    type: "problem",
  },
  {
    id: 3,
    type: "solution",
  },
  {
    id: 4,
    type: "demo",
  },
  {
    id: 5,
    type: "pricing",
  },
  {
    id: 6,
    type: "cta",
  },
];

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? "-100%" : "100%",
    opacity: 0,
  }),
};

function SlideHook() {
  return (
    <div style={{ textAlign: "center", maxWidth: 760, margin: "0 auto", padding: "0 24px" }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{
          display: "inline-block",
          background: "rgba(59,130,246,0.1)",
          border: "1px solid rgba(59,130,246,0.25)",
          borderRadius: 100,
          padding: "6px 16px",
          fontSize: "0.8rem",
          color: "#3b82f6",
          marginBottom: 32,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        Reputation Manager
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{
          fontSize: "clamp(2rem, 5vw, 3.8rem)",
          fontWeight: 700,
          letterSpacing: "-0.02em",
          lineHeight: 1.1,
          color: "rgba(255,255,255,0.92)",
          marginBottom: 24,
        }}
      >
        Your reviews are{" "}
        <span style={{ color: "#ef4444" }}>losing you customers</span>
        <br />every single day
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        style={{
          fontSize: "1.15rem",
          color: "rgba(255,255,255,0.5)",
          lineHeight: 1.7,
          marginBottom: 48,
        }}
      >
        88% of customers read replies before choosing a pub.
        <br />Most reviews sit unanswered for days — or forever.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 40,
          flexWrap: "wrap",
        }}
      >
        {[
          { number: "94%", label: "read reviews before visiting" },
          { number: "53%", label: "expect a reply within a week" },
          { number: "22x", label: "more customers lost per bad reply" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + i * 0.1 }}
            style={{ textAlign: "center" }}
          >
            <div
              style={{
                fontSize: "2.4rem",
                fontWeight: 700,
                color: "#3b82f6",
                letterSpacing: "-0.02em",
              }}
            >
              {stat.number}
            </div>
            <div
              style={{
                fontSize: "0.85rem",
                color: "rgba(255,255,255,0.4)",
                maxWidth: 120,
                lineHeight: 1.4,
              }}
            >
              {stat.label}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

function SlideProblem() {
  return (
    <div style={{ maxWidth: 820, margin: "0 auto", padding: "0 24px", width: "100%" }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{ textAlign: "center", marginBottom: 48 }}
      >
        <h2
          style={{
            fontSize: "clamp(1.8rem, 4vw, 3rem)",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: "rgba(255,255,255,0.92)",
            marginBottom: 12,
          }}
        >
          You know you should reply.
        </h2>
        <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "1.1rem" }}>
          You just don&apos;t have time — or the right words.
        </p>
      </motion.div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {[
          {
            icon: "⏱",
            title: "It takes too long",
            desc: "A thoughtful reply takes 10–15 minutes. Multiply that by 30 reviews a month.",
          },
          {
            icon: "😬",
            title: "The wrong tone makes it worse",
            desc: "A defensive reply to a 1-star review can go viral for the wrong reasons.",
          },
          {
            icon: "😔",
            title: "Bad reviews sit unanswered for weeks",
            desc: "Every day without a reply, potential customers scroll past and pick somewhere else.",
          },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + i * 0.15 }}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 20,
              background: "rgba(255,255,255,0.03)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 16,
              padding: "24px 28px",
            }}
          >
            <span style={{ fontSize: "1.8rem", flexShrink: 0, marginTop: 2 }}>{item.icon}</span>
            <div>
              <div
                style={{
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.92)",
                  marginBottom: 4,
                  fontSize: "1.05rem",
                }}
              >
                {item.title}
              </div>
              <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.95rem", lineHeight: 1.6 }}>
                {item.desc}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function SlideSolution() {
  return (
    <div style={{ maxWidth: 820, margin: "0 auto", padding: "0 24px", width: "100%", textAlign: "center" }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{ marginBottom: 48 }}
      >
        <h2
          style={{
            fontSize: "clamp(1.8rem, 4vw, 3rem)",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: "rgba(255,255,255,0.92)",
            marginBottom: 12,
          }}
        >
          AI drafts it. You approve it.{" "}
          <span style={{ color: "#3b82f6" }}>Done.</span>
        </h2>
        <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "1.05rem" }}>
          Reputation Manager handles every review — you stay in control.
        </p>
      </motion.div>

      <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
        {[
          {
            step: "01",
            title: "Review comes in",
            desc: "Google detects a new review on your listing",
            color: "#6366f1",
          },
          {
            step: "02",
            title: "AI drafts a reply",
            desc: "In your pub's voice — empathetic, professional, human",
            color: "#3b82f6",
          },
          {
            step: "03",
            title: "You approve",
            desc: "One email, one click. Reply posts to Google instantly.",
            color: "#10b981",
          },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.15 }}
            style={{
              flex: "1 1 220px",
              maxWidth: 240,
              background: "rgba(255,255,255,0.03)",
              backdropFilter: "blur(20px)",
              border: `1px solid ${item.color}30`,
              borderRadius: 16,
              padding: "28px 24px",
              boxShadow: `0 0 28px ${item.color}10`,
            }}
          >
            <div
              style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                color: item.color,
                letterSpacing: "0.1em",
                marginBottom: 12,
              }}
            >
              STEP {item.step}
            </div>
            <div
              style={{
                fontWeight: 600,
                color: "rgba(255,255,255,0.92)",
                marginBottom: 8,
                fontSize: "1.05rem",
              }}
            >
              {item.title}
            </div>
            <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.9rem", lineHeight: 1.6 }}>
              {item.desc}
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        style={{ marginTop: 36, color: "rgba(255,255,255,0.3)", fontSize: "0.9rem" }}
      >
        Average approval time: <span style={{ color: "rgba(255,255,255,0.6)" }}>47 seconds</span>
      </motion.div>
    </div>
  );
}

function SlideDemo() {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px", width: "100%" }}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{ textAlign: "center", marginBottom: 32 }}
      >
        <h2
          style={{
            fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: "rgba(255,255,255,0.92)",
            marginBottom: 8,
          }}
        >
          Here&apos;s what it looks like
        </h2>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.95rem" }}>
          Real AI output — The Red Lion, Shoreditch
        </p>
      </motion.div>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        {/* Input */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            flex: "1 1 300px",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(239,68,68,0.2)",
            borderRadius: 16,
            padding: "24px 28px",
          }}
        >
          <div
            style={{
              fontSize: "0.75rem",
              fontWeight: 700,
              color: "#ef4444",
              letterSpacing: "0.08em",
              marginBottom: 16,
            }}
          >
            INCOMING REVIEW
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "rgba(239,68,68,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.85rem",
                fontWeight: 700,
                color: "#ef4444",
              }}
            >
              J
            </div>
            <div>
              <div style={{ fontWeight: 600, color: "rgba(255,255,255,0.85)", fontSize: "0.95rem" }}>
                Jane Doe
              </div>
              <div style={{ display: "flex", gap: 2 }}>
                {"★★☆☆☆".split("").map((s, i) => (
                  <span key={i} style={{ color: i < 2 ? "#f59e0b" : "rgba(255,255,255,0.15)", fontSize: "0.85rem" }}>
                    ★
                  </span>
                ))}
              </div>
            </div>
          </div>
          <p
            style={{
              color: "rgba(255,255,255,0.55)",
              fontSize: "0.9rem",
              lineHeight: 1.65,
              fontStyle: "italic",
            }}
          >
            &ldquo;The food arrived cold and we waited 45 minutes with no explanation from staff. Really poor experience.&rdquo;
          </p>
          <div
            style={{
              marginTop: 16,
              padding: "8px 12px",
              background: "rgba(239,68,68,0.08)",
              borderRadius: 8,
              fontSize: "0.8rem",
              color: "#ef4444",
            }}
          >
            Sentiment: frustrated/disappointed · Priority: high
          </div>
        </motion.div>

        {/* Arrow */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.5rem",
            color: "#3b82f6",
            flexShrink: 0,
            padding: "0 4px",
          }}
        >
          →
        </motion.div>

        {/* Output */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35 }}
          style={{
            flex: "1 1 300px",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(16,185,129,0.2)",
            borderRadius: 16,
            padding: "24px 28px",
            boxShadow: "0 0 28px rgba(16,185,129,0.06)",
          }}
        >
          <div
            style={{
              fontSize: "0.75rem",
              fontWeight: 700,
              color: "#10b981",
              letterSpacing: "0.08em",
              marginBottom: 16,
            }}
          >
            AI DRAFT REPLY
          </div>
          <p
            style={{
              color: "rgba(255,255,255,0.65)",
              fontSize: "0.875rem",
              lineHeight: 1.7,
            }}
          >
            Hi Jane,
            <br /><br />
            Thank you for taking the time to leave your feedback, and I&apos;m genuinely sorry to hear about your experience. A 45-minute wait with cold food and no explanation from our team is not the standard we set for ourselves, and you&apos;re right to be disappointed.
            <br /><br />
            This falls short of what you should expect at The Red Lion, and I take full responsibility. I&apos;d like to understand what happened that evening — would you be willing to come back and let us put this right? I&apos;d like to buy you and your party a meal on us.
            <br /><br />
            Warm regards, James
          </p>
          <div
            style={{
              marginTop: 16,
              display: "flex",
              gap: 8,
            }}
          >
            <div
              style={{
                flex: 1,
                padding: "10px",
                background: "#10b981",
                borderRadius: 8,
                fontSize: "0.82rem",
                fontWeight: 600,
                color: "#fff",
                textAlign: "center",
                cursor: "pointer",
              }}
            >
              ✓ Approve & Post
            </div>
            <div
              style={{
                padding: "10px 16px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 8,
                fontSize: "0.82rem",
                color: "rgba(255,255,255,0.4)",
                cursor: "pointer",
              }}
            >
              Edit
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function SlidePricing() {
  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "0 24px", width: "100%", textAlign: "center" }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{ marginBottom: 32 }}
      >
        <h2
          style={{
            fontSize: "clamp(1.8rem, 4vw, 3rem)",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: "rgba(255,255,255,0.92)",
            marginBottom: 8,
          }}
        >
          Simple pricing
        </h2>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "1rem" }}>
          Less than one hour of your time per month
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        style={{
          background: "rgba(255,255,255,0.03)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(59,130,246,0.3)",
          borderRadius: 20,
          padding: "40px 36px",
          boxShadow: "0 0 40px rgba(59,130,246,0.1)",
        }}
      >
        <div
          style={{
            fontSize: "3.8rem",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            color: "rgba(255,255,255,0.95)",
            lineHeight: 1,
            marginBottom: 4,
          }}
        >
          £79
          <span style={{ fontSize: "1.2rem", color: "rgba(255,255,255,0.4)", fontWeight: 400 }}>
            /month
          </span>
        </div>
        <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.85rem", marginBottom: 32 }}>
          Cancel anytime. No contracts.
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14, textAlign: "left" }}>
          {[
            "Google Business Profile connected",
            "Every review handled — unlimited",
            "AI reply in your pub's voice",
            "Human approval on every response",
            "1-star alert via WhatsApp",
            "Monthly reputation report",
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.07 }}
              style={{ display: "flex", alignItems: "center", gap: 12 }}
            >
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  background: "rgba(16,185,129,0.15)",
                  border: "1px solid rgba(16,185,129,0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.7rem",
                  color: "#10b981",
                  flexShrink: 0,
                }}
              >
                ✓
              </div>
              <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.95rem" }}>{item}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function SlideCTA() {
  return (
    <div style={{ textAlign: "center", maxWidth: 660, margin: "0 auto", padding: "0 24px" }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        style={{
          width: 72,
          height: 72,
          borderRadius: "50%",
          background: "rgba(59,130,246,0.1)",
          border: "1px solid rgba(59,130,246,0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "2rem",
          margin: "0 auto 28px",
        }}
      >
        🚀
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{
          fontSize: "clamp(1.8rem, 4vw, 3rem)",
          fontWeight: 700,
          letterSpacing: "-0.02em",
          color: "rgba(255,255,255,0.92)",
          marginBottom: 16,
        }}
      >
        Get your first week free
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        style={{
          fontSize: "1.1rem",
          color: "rgba(255,255,255,0.45)",
          lineHeight: 1.7,
          marginBottom: 40,
        }}
      >
        Book a 15-minute call. We&apos;ll connect your Google account,
        <br />
        set everything up, and have you live within 24 hours.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}
      >
        <a
          href="https://calendly.com/zeroclicks"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "14px 32px",
            background: "#3b82f6",
            borderRadius: 10,
            fontWeight: 600,
            fontSize: "1rem",
            color: "#fff",
            textDecoration: "none",
            boxShadow: "0 0 28px rgba(59,130,246,0.35)",
            transition: "all 0.2s ease",
          }}
        >
          Book a free call →
        </a>
        <a
          href="mailto:hello@zeroclicks.co.uk"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "14px 28px",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 10,
            fontWeight: 500,
            fontSize: "1rem",
            color: "rgba(255,255,255,0.6)",
            textDecoration: "none",
          }}
        >
          Send an email
        </a>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        style={{ marginTop: 36, color: "rgba(255,255,255,0.25)", fontSize: "0.85rem" }}
      >
        zeroclicks.co.uk · Made in the UK
      </motion.div>
    </div>
  );
}

const slideComponents = [SlideHook, SlideProblem, SlideSolution, SlideDemo, SlidePricing, SlideCTA];
const slideTitles = ["The Problem", "Why It's Hard", "The Solution", "Live Demo", "Pricing", "Get Started"];

export default function PitchDeck() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const goTo = useCallback(
    (index: number) => {
      if (index < 0 || index >= slides.length) return;
      setDirection(index > current ? 1 : -1);
      setCurrent(index);
    },
    [current]
  );

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === " ") {
        e.preventDefault();
        next();
      }
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        prev();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [next, prev]);

  // Touch/swipe support
  useEffect(() => {
    let startX = 0;
    const onTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
    };
    const onTouchEnd = (e: TouchEvent) => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
    };
    window.addEventListener("touchstart", onTouchStart);
    window.addEventListener("touchend", onTouchEnd);
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [next, prev]);

  const SlideContent = slideComponents[current];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#020817",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: "fixed",
          top: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 600,
          height: 400,
          background: "radial-gradient(ellipse, rgba(59,130,246,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Top bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 32px",
          flexShrink: 0,
        }}
      >
        <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "rgba(255,255,255,0.6)" }}>
          Zero Clicks
        </div>
        <div
          style={{
            fontSize: "0.8rem",
            color: "rgba(255,255,255,0.3)",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 100,
            padding: "4px 14px",
          }}
        >
          {slideTitles[current]}
        </div>
        <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.3)" }}>
          {current + 1} / {slides.length}
        </div>
      </div>

      {/* Progress bar */}
      <div
        style={{
          height: 2,
          background: "rgba(255,255,255,0.05)",
          flexShrink: 0,
        }}
      >
        <motion.div
          style={{ height: "100%", background: "#3b82f6", originX: 0 }}
          animate={{ scaleX: (current + 1) / slides.length }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>

      {/* Slide content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "24px 0",
            }}
          >
            <SlideContent />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom nav */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 24,
          padding: "20px 32px",
          flexShrink: 0,
        }}
      >
        <button
          onClick={prev}
          disabled={current === 0}
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: current === 0 ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.6)",
            cursor: current === 0 ? "not-allowed" : "pointer",
            fontSize: "1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s ease",
          }}
        >
          ←
        </button>

        {/* Dots */}
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              style={{
                width: i === current ? 24 : 7,
                height: 7,
                borderRadius: 100,
                background: i === current ? "#3b82f6" : "rgba(255,255,255,0.15)",
                border: "none",
                cursor: "pointer",
                padding: 0,
                transition: "all 0.3s ease",
              }}
            />
          ))}
        </div>

        <button
          onClick={next}
          disabled={current === slides.length - 1}
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: current === slides.length - 1 ? "rgba(255,255,255,0.02)" : "rgba(59,130,246,0.15)",
            border: `1px solid ${current === slides.length - 1 ? "rgba(255,255,255,0.06)" : "rgba(59,130,246,0.3)"}`,
            color: current === slides.length - 1 ? "rgba(255,255,255,0.15)" : "#3b82f6",
            cursor: current === slides.length - 1 ? "not-allowed" : "pointer",
            fontSize: "1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s ease",
          }}
        >
          →
        </button>
      </div>

      {/* Keyboard hint */}
      <div
        style={{
          textAlign: "center",
          paddingBottom: 12,
          fontSize: "0.75rem",
          color: "rgba(255,255,255,0.18)",
        }}
      >
        Use arrow keys or swipe to navigate
      </div>
    </div>
  );
}
