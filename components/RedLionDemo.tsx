"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { RED_LION_DEMO } from "@/lib/content";

const ease = [0.25, 0.1, 0.25, 1.0] as const;

export default function RedLionDemo() {
  const [activeStep, setActiveStep] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    if (!inView) return;
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % (RED_LION_DEMO.steps.length + 1));
    }, 3000);
    return () => clearInterval(timer);
  }, [inView]);

  return (
    <section
      id="demo"
      style={{
        borderTop: "1px solid var(--border)",
        padding: "120px 48px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient glow */}
      <div aria-hidden style={{
        position: "absolute",
        width: "500px",
        height: "500px",
        bottom: "-200px",
        left: "-100px",
        background: "radial-gradient(circle, rgba(59,130,246,0.05) 0%, transparent 70%)",
        pointerEvents: "none",
        animation: "ambient-drift 25s ease-in-out infinite",
      }} />

      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease }}
          style={{ marginBottom: "56px" }}
        >
          <p style={{
            fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase",
            color: "var(--accent)", marginBottom: "12px", fontFamily: "var(--font-body)", fontWeight: 600,
          }}>
            Live demo
          </p>
          <h2 style={{
            fontFamily: "var(--font-display)", fontWeight: 400,
            fontSize: "clamp(1.8rem, 3vw, 2.6rem)", color: "var(--text-primary)", margin: 0, lineHeight: 1.15,
          }}>
            {RED_LION_DEMO.title}
          </h2>
          <p style={{
            fontFamily: "var(--font-body)", fontSize: "1rem",
            color: "var(--text-secondary)", lineHeight: 1.75, marginTop: "12px", maxWidth: "560px",
          }}>
            {RED_LION_DEMO.subtext}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12" style={{ gap: "24px" }}>
          {/* Email mockup */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease, delay: 0.1 }}
            className="lg:col-span-7"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-mid)",
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            {/* Window chrome */}
            <div style={{
              padding: "14px 20px",
              borderBottom: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}>
              <div style={{ display: "flex", gap: "6px" }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
              </div>
              <span style={{
                fontSize: "10px", color: "var(--text-muted)",
                letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "var(--font-body)",
                fontWeight: 600, marginLeft: "8px",
              }}>
                Outlook — Inbox
              </span>
            </div>

            <div style={{ padding: "32px" }}>
              {/* Sender */}
              <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "24px" }}>
                <div style={{
                  width: 40, height: 40, borderRadius: "50%",
                  background: "var(--accent-dim)", border: "1px solid var(--border-mid)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "13px", color: "var(--accent)",
                }}>
                  DS
                </div>
                <div>
                  <p style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "14px", color: "var(--text-primary)", margin: 0 }}>
                    Dave Smith
                  </p>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--text-muted)", margin: 0 }}>
                    dave@example.com
                  </p>
                </div>
                <span style={{ marginLeft: "auto", fontSize: "11px", color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
                  Today, 2:14 PM
                </span>
              </div>

              {/* Email body */}
              <h3 style={{
                fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "1rem",
                color: "var(--text-primary)", marginBottom: "12px",
              }}>
                Table for 12 this Sunday?
              </h3>
              <p style={{
                fontFamily: "var(--font-body)", fontSize: "0.9rem",
                color: "var(--text-secondary)", lineHeight: 1.75, margin: 0,
              }}>
                Hi team, looking to book a table for 12 of us for lunch this Sunday at 1pm.
                Do you have space? Usually just the 8 of us but kids are joining!
              </p>

              {/* AI Draft */}
              <AnimatePresence>
                {activeStep >= RED_LION_DEMO.steps.length && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 12 }}
                    transition={{ duration: 0.5, ease }}
                    style={{
                      marginTop: "28px",
                      padding: "20px",
                      borderRadius: "8px",
                      background: "var(--accent-dim)",
                      border: "1px solid rgba(59,130,246,0.15)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                      <span style={{
                        fontSize: "9px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                        color: "var(--accent)", fontFamily: "var(--font-body)",
                        background: "rgba(59,130,246,0.12)", padding: "3px 8px", borderRadius: "4px",
                        border: "1px solid rgba(59,130,246,0.2)",
                      }}>
                        AI Draft
                      </span>
                      <motion.div
                        animate={{ opacity: [1, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                        style={{ width: 1, height: 14, background: "var(--accent)", borderRadius: 1 }}
                      />
                    </div>
                    <p style={{
                      fontFamily: "var(--font-body)", fontSize: "0.85rem",
                      color: "var(--text-secondary)", lineHeight: 1.75, margin: 0, fontStyle: "italic",
                    }}>
                      "Hi Dave, we'd love to host your group! I've reserved a large table for 12 at 1:00 PM this Sunday.
                      Since you're a large group, would you like to see our Sunday Roast pre-order menu? Best, The Red Lion AI."
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* AI Thinking Panel */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease, delay: 0.2 }}
            className="lg:col-span-5"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-mid)",
              borderRadius: "12px",
              padding: "32px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "32px" }}>
              <div style={{
                width: 32, height: 32, borderRadius: "8px",
                background: "var(--accent-dim)", border: "1px solid rgba(59,130,246,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px",
              }}>
                ⚡
              </div>
              <div>
                <p style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "13px", color: "var(--text-primary)", margin: 0 }}>
                  Claude AI
                </p>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--text-muted)", margin: 0 }}>
                  Processing request…
                </p>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "20px", flex: 1 }}>
              {RED_LION_DEMO.steps.map((step, i) => {
                const isPast = activeStep > i;
                const isActive = activeStep === i;

                return (
                  <motion.div
                    key={i}
                    initial={false}
                    animate={{
                      opacity: isPast || isActive ? 1 : 0.3,
                    }}
                    transition={{ duration: 0.4, ease }}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "12px",
                      paddingLeft: isActive ? "4px" : "0",
                      borderLeft: isActive ? "2px solid var(--accent)" : "2px solid transparent",
                      transition: "padding-left 300ms ease, border-color 300ms ease",
                    }}
                  >
                    <div style={{ marginTop: "2px", flexShrink: 0, width: "16px", textAlign: "center" }}>
                      {isPast ? (
                        <span style={{ color: "#10b981", fontSize: "13px", fontWeight: 700 }}>✓</span>
                      ) : isActive ? (
                        <motion.div
                          animate={{ opacity: [0.4, 1, 0.4] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          style={{
                            width: 7, height: 7, borderRadius: "50%",
                            background: "var(--accent)", margin: "4px auto",
                            boxShadow: "0 0 6px var(--accent-glow)",
                          }}
                        />
                      ) : (
                        <div style={{
                          width: 7, height: 7, borderRadius: "50%",
                          border: "1.5px solid var(--border-mid)", margin: "4px auto",
                        }} />
                      )}
                    </div>
                    <span style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "13px",
                      color: isActive ? "var(--text-primary)" : isPast ? "var(--text-secondary)" : "var(--text-muted)",
                      fontWeight: isActive ? 500 : 400,
                      lineHeight: 1.5,
                      transition: "color 300ms ease",
                    }}>
                      {step.text}
                    </span>
                  </motion.div>
                );
              })}
            </div>

            {/* Bottom */}
            <div style={{
              marginTop: "32px",
              paddingTop: "20px",
              borderTop: "1px solid var(--border)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "14px" }}>📅</span>
                <span style={{
                  fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase",
                  color: "var(--text-muted)", fontFamily: "var(--font-body)", fontWeight: 600,
                }}>
                  TableRes sync
                </span>
              </div>
              <span style={{
                fontSize: "10px", color: "var(--text-muted)",
                fontFamily: "var(--font-mono)", letterSpacing: "0.05em",
              }}>
                0.2s latency
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
