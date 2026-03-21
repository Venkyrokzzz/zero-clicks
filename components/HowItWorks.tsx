// components/HowItWorks.tsx
"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { STEPS } from "@/lib/content";

const ease = [0.25, 0.1, 0.25, 1.0] as const;

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14 } },
};

const stepVariants = {
  hidden: { opacity: 0, y: 40, rotateY: -12 },
  visible: {
    opacity: 1,
    y: 0,
    rotateY: 0,
    transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1.0] },
  },
};

const prismStep = ["#a8d8ff", "#c4b5fd", "#6ee7b7"];

export default function HowItWorks() {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-80px" });
  const bodyRef = useRef<HTMLDivElement>(null);
  const bodyInView = useInView(bodyRef, { once: true, margin: "-80px" });

  return (
    <section
      id="how-it-works"
      style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "128px 48px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle background accent */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          width: "800px",
          height: "400px",
          background:
            "radial-gradient(ellipse, rgba(99,102,241,0.08) 0%, transparent 70%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
          filter: "blur(40px)",
        }}
      />

      <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative" }}>
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 28 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease }}
          style={{ marginBottom: "72px" }}
        >
          <p
            style={{
              fontSize: "11px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--text-secondary)",
              marginBottom: "14px",
              fontFamily: "var(--font-body)",
              fontWeight: 500,
            }}
          >
            Process
          </p>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 400,
              fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
              color: "var(--text-primary)",
              margin: 0,
              lineHeight: 1.15,
            }}
          >
            How it works
          </h2>
        </motion.div>

        <motion.div
          ref={bodyRef}
          variants={containerVariants}
          initial="hidden"
          animate={bodyInView ? "visible" : "hidden"}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "24px",
          }}
        >
          {STEPS.map((step, i) => (
            <motion.div
              key={step.number}
              variants={stepVariants}
              style={{
                background: "rgba(255,255,255,0.03)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "12px",
                padding: "36px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Step color accent top */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: "36px",
                  right: "36px",
                  height: "1px",
                  background: `linear-gradient(90deg, transparent, ${prismStep[i % prismStep.length]}, transparent)`,
                  opacity: 0.6,
                }}
              />

              <span
                style={{
                  display: "block",
                  fontFamily: "var(--font-body)",
                  fontWeight: 500,
                  fontSize: "11px",
                  letterSpacing: "0.14em",
                  color: prismStep[i % prismStep.length],
                  marginBottom: "24px",
                  textShadow: `0 0 20px ${prismStep[i % prismStep.length]}55`,
                }}
              >
                {step.number}
              </span>

              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 400,
                  fontSize: "1.4rem",
                  color: "var(--text-primary)",
                  marginBottom: "16px",
                  lineHeight: 1.2,
                }}
              >
                {step.title}
              </h3>

              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontWeight: 400,
                  fontSize: "0.9rem",
                  color: "var(--text-secondary)",
                  lineHeight: 1.75,
                  margin: 0,
                }}
              >
                {step.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
