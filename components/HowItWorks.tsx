"use client";

import { useRef, useState, MouseEvent } from "react";
import { motion, useInView } from "framer-motion";
import { STEPS, type Step } from "@/lib/content";

const ease = [0.25, 0.1, 0.25, 1.0] as const;

function StepCell({ step, index }: { step: Step; index: number }) {
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      variants={{ 
        hidden: { opacity: 0, y: 20, filter: "blur(4px)" }, 
        visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: [...ease] } } 
      }}
      className="relative col-span-1"
    >
      <div
        ref={cardRef}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onMouseMove={handleMouseMove}
        style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          padding: "40px 32px",
          position: "relative",
          overflow: "hidden",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          transition: "all 0.3s ease",
          transform: hovered ? "translateY(-2px)" : "none",
          boxShadow: hovered ? "0 20px 40px rgba(0,0,0,0.4)" : "none",
        }}
      >
        {/* Spotlight Effect */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `radial-gradient(800px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 255, 255, 0.04), transparent 40%)`,
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.3s ease",
            pointerEvents: "none",
          }}
        />

        {/* Border Glow tracking */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "16px",
            padding: "1px",
            background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 255, 255, 0.2), transparent 40%)`,
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.3s ease",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", zIndex: 10 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: "32px", height: "32px", borderRadius: "8px",
            background: hovered ? "var(--accent)" : "rgba(255,255,255,0.05)", 
            color: hovered ? "#000" : "var(--text-muted)",
            border: "1px solid var(--border)", marginBottom: "24px",
            transition: "all 0.3s ease",
          }}>
            <span style={{ fontSize: "14px", fontFamily: "var(--font-mono)", fontWeight: 700 }}>
              {index + 1}
            </span>
          </div>
          <h3 style={{
            fontFamily: "var(--font-display)", fontWeight: 600,
            fontSize: "1.4rem", color: "var(--text-primary)", marginBottom: "16px", lineHeight: 1.2,
            letterSpacing: "-0.02em",
          }}>
            {step.title}
          </h3>
          <p style={{
            fontFamily: "var(--font-body)", fontWeight: 400,
            fontSize: "0.95rem", color: "var(--text-secondary)", lineHeight: 1.7, margin: "0 0 32px",
          }}>
            {step.description}
          </p>

          <ul style={{ listStyle: "none", padding: 0, margin: "auto 0 0 0", display: "flex", flexDirection: "column", gap: "12px" }}>
            {step.details.map((detail, i) => (
              <li
                key={i}
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.9rem",
                  color: "var(--text-muted)",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "10px"
                }}
              >
                <svg 
                  width="14" height="14" viewBox="0 0 24 24" fill="none" 
                  stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
                  style={{ marginTop: "3px", flexShrink: 0 }}
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {detail}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}

export default function HowItWorks() {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-80px" });
  const bodyRef = useRef<HTMLDivElement>(null);
  const bodyInView = useInView(bodyRef, { once: true, margin: "-80px" });

  return (
    <section
      id="how-it-works"
      style={{
        borderTop: "1px solid var(--border)",
        padding: "140px 48px",
        background: "transparent",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease }}
          style={{ marginBottom: "64px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}
        >
          <div>
            <h2 style={{
              fontFamily: "var(--font-display)", fontWeight: 600, letterSpacing: "-0.03em",
              fontSize: "clamp(2rem, 4vw, 3rem)", color: "var(--text-primary)", margin: 0, lineHeight: 1.1,
            }}>
              How it works
            </h2>
          </div>
          <div style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)", fontSize: "13px", paddingBottom: "6px" }}>
            // 02 Deployment Lifecycle
          </div>
        </motion.div>

        <motion.div
          ref={bodyRef}
          initial="hidden"
          animate={bodyInView ? "visible" : "hidden"}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {STEPS.map((step, i) => (
            <StepCell key={step.number} step={step} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
