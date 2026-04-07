"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

// Urbanex-style slow cinematic easing
const EASE = [0.16, 1, 0.3, 1] as const;
const SLOW = { duration: 1.1, ease: EASE };

// n8n workflow pipeline nodes
const NODES = [
  {
    label: "Gmail Trigger",
    sub: "New email received",
    color: "#EA4335",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
  },
  {
    label: "Claude AI",
    sub: "Classify + analyse",
    color: "#CC785C",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z"/><path d="M12 8v4l3 3"/>
      </svg>
    ),
  },
  {
    label: "Route",
    sub: "Priority or archive",
    color: "#FF6D5A",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/>
      </svg>
    ),
  },
  {
    label: "Draft Reply",
    sub: "In your tone",
    color: "#FF6D5A",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
      </svg>
    ),
  },
  {
    label: "WhatsApp Alert",
    sub: "Urgent only",
    color: "#25D366",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
  },
  {
    label: "Sheets Log",
    sub: "Auto-recorded",
    color: "#34A853",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/>
      </svg>
    ),
  },
];

// Clip-path word reveal — Urbanex signature move
function RevealText({
  children,
  delay = 0,
  className,
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <div ref={ref} style={{ overflow: "hidden", ...style }} className={className}>
      <motion.div
        initial={{ y: "105%", opacity: 0 }}
        animate={inView ? { y: "0%", opacity: 1 } : {}}
        transition={{ ...SLOW, delay }}
      >
        {children}
      </motion.div>
    </div>
  );
}

export default function WorkflowReveal() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section
      ref={sectionRef}
      style={{
        borderTop: "1px solid var(--border)",
        padding: "120px 48px",
        background: "transparent",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        {/* ── Urbanex-style staggered headline ── */}
        <div style={{ marginBottom: "80px" }}>

          {/* Eyebrow */}
          <RevealText delay={0}>
            <p style={{
              fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase",
              color: "#FF6D5A", fontFamily: "var(--font-mono)", fontWeight: 600,
              marginBottom: "28px", margin: "0 0 28px",
            }}>
              n8n · Claude AI · Running 24/7
            </p>
          </RevealText>

          {/* Line 1 */}
          <RevealText delay={0.1} style={{ marginBottom: "4px" }}>
            <h2 style={{
              fontFamily: "var(--font-display)", fontWeight: 700,
              fontSize: "clamp(2.4rem, 5vw, 4rem)", color: "var(--text-primary)",
              letterSpacing: "-0.04em", lineHeight: 1.05, margin: 0,
            }}>
              Email lands.
            </h2>
          </RevealText>

          {/* Line 2 — accent colour */}
          <RevealText delay={0.22} style={{ marginBottom: "4px" }}>
            <h2 style={{
              fontFamily: "var(--font-display)", fontWeight: 700,
              fontSize: "clamp(2.4rem, 5vw, 4rem)",
              background: "linear-gradient(90deg, #FF6D5A 0%, #FF9A5C 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              letterSpacing: "-0.04em", lineHeight: 1.05, margin: 0,
            }}>
              AI handles it.
            </h2>
          </RevealText>

          {/* Line 3 */}
          <RevealText delay={0.34}>
            <h2 style={{
              fontFamily: "var(--font-display)", fontWeight: 700,
              fontSize: "clamp(2.4rem, 5vw, 4rem)", color: "rgba(255,255,255,0.3)",
              letterSpacing: "-0.04em", lineHeight: 1.05, margin: 0,
            }}>
              You do nothing.
            </h2>
          </RevealText>
        </div>

        {/* ── n8n Pipeline nodes ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.5 }}
          style={{
            position: "relative",
            overflowX: "auto",
            paddingBottom: "8px",
          }}
        >
          {/* Connector line behind nodes */}
          <div style={{
            position: "absolute",
            top: "28px",
            left: "28px",
            right: "28px",
            height: "1px",
            background: "linear-gradient(90deg, rgba(255,109,90,0.15) 0%, rgba(255,109,90,0.4) 50%, rgba(52,168,83,0.15) 100%)",
            zIndex: 0,
          }}>
            {/* Travelling dot */}
            <motion.div
              style={{
                position: "absolute",
                top: "-3px",
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                background: "#FF6D5A",
                boxShadow: "0 0 12px #FF6D5A",
              }}
              animate={{ left: ["0%", "100%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: 1 }}
            />
          </div>

          <div style={{
            display: "flex",
            gap: "0",
            alignItems: "flex-start",
            minWidth: "600px",
            position: "relative",
            zIndex: 1,
          }}>
            {NODES.map((node, i) => (
              <div key={node.label} style={{ display: "flex", alignItems: "flex-start", flex: 1 }}>
                {/* Node card */}
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.92 }}
                  animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                  transition={{ ...SLOW, delay: 0.6 + i * 0.12 }}
                  style={{ width: "100%", paddingRight: i < NODES.length - 1 ? "12px" : "0" }}
                >
                  <div style={{
                    background: "var(--bg-surface)",
                    border: "1px solid var(--border)",
                    borderRadius: "12px",
                    padding: "16px 14px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    transition: "border-color 200ms ease",
                    cursor: "default",
                  }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = node.color + "60"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"}
                  >
                    {/* Icon */}
                    <div style={{
                      width: "36px", height: "36px", borderRadius: "8px",
                      background: node.color + "18",
                      border: `1px solid ${node.color}30`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: node.color,
                    }}>
                      {node.icon}
                    </div>

                    {/* Labels */}
                    <div>
                      <p style={{
                        fontSize: "12px", fontFamily: "var(--font-body)", fontWeight: 600,
                        color: "var(--text-primary)", margin: "0 0 2px", lineHeight: 1.3,
                      }}>
                        {node.label}
                      </p>
                      <p style={{
                        fontSize: "10px", fontFamily: "var(--font-body)",
                        color: "var(--text-muted)", margin: 0, lineHeight: 1.3,
                      }}>
                        {node.sub}
                      </p>
                    </div>

                    {/* Step indicator */}
                    <span style={{
                      fontSize: "9px", fontFamily: "var(--font-mono)", fontWeight: 600,
                      color: node.color, letterSpacing: "0.08em", opacity: 0.8,
                    }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Bottom line ── */}
        <RevealText delay={0.5} style={{ marginTop: "48px" }}>
          <p style={{
            fontSize: "13px", color: "var(--text-muted)", fontFamily: "var(--font-body)",
            lineHeight: 1.6,
          }}>
            Built in n8n. Powered by Claude AI. Live in 48 hours.{" "}
            <span style={{ color: "var(--text-secondary)" }}>
              No code. No maintenance. No missed emails.
            </span>
          </p>
        </RevealText>

      </div>
    </section>
  );
}
