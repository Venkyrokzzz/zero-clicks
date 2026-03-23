// components/HowItWorks.tsx
"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { STEPS, type Step } from "@/lib/content";

const ease = [0.25, 0.1, 0.25, 1.0] as const;


function StepCell({ step, index, ease }: { step: Step; index: number; ease: readonly number[] }) {
  const [tilt, setTilt] = useState("perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0px)");
  const [hovered, setHovered] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt(`perspective(900px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg) translateZ(12px)`);
  };

  return (
    <motion.div
      onClick={() => setExpanded(!expanded)}
      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: ease as number[] } } }}
      onMouseEnter={() => setHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { setHovered(false); setTilt("perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0px)"); }}
      style={{
        background: hovered ? "var(--bg-hover)" : "var(--bg)",
        padding: "36px 32px",
        transform: tilt,
        transition: "transform 200ms ease, background 200ms ease, box-shadow 200ms ease",
        boxShadow: hovered ? "0 24px 48px rgba(0,0,0,0.5)" : "none",
        willChange: "transform",
        position: "relative",
        cursor: "pointer",
        zIndex: hovered ? 2 : 1,
      }}
    >
      <div style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        width: "28px", height: "28px", borderRadius: "6px",
        background: "var(--accent-dim)", border: "1px solid rgba(59,130,246,0.25)", marginBottom: "20px",
      }}>
        <span style={{ fontSize: "12px", fontFamily: "var(--font-body)", fontWeight: 700, color: "var(--accent)" }}>
          {index + 1}
        </span>
      </div>
      <h3 style={{
        fontFamily: "var(--font-display)", fontWeight: 400,
        fontSize: "1.3rem", color: "var(--text-primary)", marginBottom: "12px", lineHeight: 1.2,
      }}>
        {step.title}
      </h3>
      <p style={{
        fontFamily: "var(--font-body)", fontWeight: 400,
        fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.75, margin: 0,
      }}>
        {step.description}
      </p>

      <AnimatePresence>
        {expanded && (
          <motion.ul
            initial={{ height: 0, opacity: 0, marginTop: 0 }}
            animate={{ height: "auto", opacity: 1, marginTop: "24px" }}
            exit={{ height: 0, opacity: 0, marginTop: 0 }}
            style={{ overflow: "hidden", listStyle: "none", padding: 0, margin: 0 }}
          >
            {step.details.map((detail, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.85rem",
                  color: "var(--text-muted)",
                  marginBottom: "8px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}
              >
                <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: "var(--accent)" }} />
                {detail}
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
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
        padding: "120px 48px",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease }}
          style={{ marginBottom: "56px" }}
        >
          <p style={{
            fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase",
            color: "var(--accent)", marginBottom: "12px", fontFamily: "var(--font-body)", fontWeight: 600,
          }}>
            Process
          </p>
          <h2 style={{
            fontFamily: "var(--font-display)", fontWeight: 400,
            fontSize: "clamp(1.8rem, 3vw, 2.6rem)", color: "var(--text-primary)", margin: 0, lineHeight: 1.15,
          }}>
            How it works
          </h2>
        </motion.div>

        <motion.div
          ref={bodyRef}
          initial="hidden"
          animate={bodyInView ? "visible" : "hidden"}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1px", background: "var(--border)" }}
        >
          {STEPS.map((step, i) => (
            <StepCell key={step.number} step={step} index={i} ease={ease} />
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease, delay: 0.2 }}
          style={{ marginTop: "48px", textAlign: "center" }}
        >
          <a
            href="/contact"
            style={{
              display: "inline-block",
              color: "var(--accent)",
              fontSize: "13px",
              fontFamily: "var(--font-body)",
              fontWeight: 600,
              textDecoration: "none",
              background: "var(--accent-dim)",
              padding: "10px 20px",
              borderRadius: "6px",
              border: "1px solid rgba(59,130,246,0.25)",
              transition: "all 200ms ease",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = "rgba(59,130,246,0.15)";
              (e.currentTarget as HTMLElement).style.borderColor = "var(--accent)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = "var(--accent-dim)";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(59,130,246,0.25)";
            }}
          >
            → Start with a free audit
          </a>
        </motion.div>
      </div>
    </section>
  );
}
