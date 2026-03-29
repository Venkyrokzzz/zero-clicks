"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useSpring, useTransform, useInView } from "framer-motion";
import { ROI_CALCULATOR } from "@/lib/content";

const ease = [0.25, 0.1, 0.25, 1.0] as const;

function AnimatedValue({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  const spring = useSpring(0, { mass: 0.8, stiffness: 80, damping: 15 });
  const display = useTransform(spring, (v) => Math.round(v).toLocaleString());

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  return (
    <span>
      {prefix}<motion.span>{display}</motion.span>{suffix}
    </span>
  );
}

export default function ROICalculator() {
  const [hours, setHours] = useState(15);
  const [rate, setRate] = useState(15);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const reclaimedHours = hours * 52;
  const savings = reclaimedHours * rate;

  return (
    <section
      id="roi-calculator"
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
        width: "600px",
        height: "600px",
        top: "-200px",
        right: "-100px",
        background: "radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)",
        pointerEvents: "none",
        animation: "ambient-drift 20s ease-in-out infinite",
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
            ROI Calculator
          </p>
          <h2 style={{
            fontFamily: "var(--font-display)", fontWeight: 400,
            fontSize: "clamp(1.8rem, 3vw, 2.6rem)", color: "var(--text-primary)", margin: 0, lineHeight: 1.15,
          }}>
            {ROI_CALCULATOR.headline}{" "}
            <span style={{ color: "var(--accent)" }}>{ROI_CALCULATOR.accentHeadline}</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: "48px", alignItems: "start" }}>
          {/* Calculator */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease, delay: 0.1 }}
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-mid)",
              borderRadius: "12px",
              padding: "40px",
            }}
          >
            {/* Hours slider */}
            <div style={{ marginBottom: "40px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "16px" }}>
                <label style={{
                  fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase",
                  color: "var(--text-muted)", fontFamily: "var(--font-body)", fontWeight: 600,
                }}>
                  {ROI_CALCULATOR.hoursLabel}
                </label>
                <span style={{
                  fontFamily: "var(--font-display)", fontSize: "1.6rem",
                  color: "var(--text-primary)", lineHeight: 1,
                }}>
                  {hours} hrs
                </span>
              </div>
              <input
                type="range" min="5" max="40" step="1"
                value={hours}
                onChange={(e) => setHours(parseInt(e.target.value))}
                style={{
                  width: "100%", height: "2px",
                  background: "var(--border-mid)",
                  appearance: "none",
                  cursor: "pointer",
                  accentColor: "var(--accent)",
                }}
              />
            </div>

            {/* Rate slider */}
            <div style={{ marginBottom: "40px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "16px" }}>
                <label style={{
                  fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase",
                  color: "var(--text-muted)", fontFamily: "var(--font-body)", fontWeight: 600,
                }}>
                  {ROI_CALCULATOR.rateLabel}
                </label>
                <span style={{
                  fontFamily: "var(--font-display)", fontSize: "1.6rem",
                  color: "var(--text-primary)", lineHeight: 1,
                }}>
                  £{rate}
                </span>
              </div>
              <input
                type="range" min="12" max="30" step="1"
                value={rate}
                onChange={(e) => setRate(parseInt(e.target.value))}
                style={{
                  width: "100%", height: "2px",
                  background: "var(--border-mid)",
                  appearance: "none",
                  cursor: "pointer",
                  accentColor: "#8b5cf6",
                }}
              />
            </div>

            {/* Results */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div style={{
                background: "var(--bg-hover)",
                border: "1px solid var(--border)",
                borderRadius: "10px",
                padding: "24px",
                textAlign: "center",
              }}>
                <p style={{
                  fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase",
                  color: "var(--text-muted)", fontFamily: "var(--font-body)", fontWeight: 600, marginBottom: "8px",
                }}>
                  {ROI_CALCULATOR.savingsLabel}
                </p>
                <p style={{
                  fontFamily: "var(--font-display)", fontSize: "2rem",
                  color: "var(--text-primary)", margin: 0, lineHeight: 1, letterSpacing: "-0.02em",
                }}>
                  <AnimatedValue value={savings} prefix="£" />
                </p>
              </div>
              <div style={{
                background: "var(--bg-hover)",
                border: "1px solid var(--border)",
                borderRadius: "10px",
                padding: "24px",
                textAlign: "center",
              }}>
                <p style={{
                  fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase",
                  color: "var(--text-muted)", fontFamily: "var(--font-body)", fontWeight: 600, marginBottom: "8px",
                }}>
                  {ROI_CALCULATOR.reclaimedLabel}
                </p>
                <p style={{
                  fontFamily: "var(--font-display)", fontSize: "2rem",
                  color: "var(--text-primary)", margin: 0, lineHeight: 1, letterSpacing: "-0.02em",
                }}>
                  <AnimatedValue value={reclaimedHours} suffix="h" />
                </p>
              </div>
            </div>
          </motion.div>

          {/* Description + CTA */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease, delay: 0.2 }}
          >
            <p style={{
              fontFamily: "var(--font-body)", fontSize: "1rem",
              color: "var(--text-secondary)", lineHeight: 1.85,
              marginBottom: "36px",
            }}>
              {ROI_CALCULATOR.subtext}
            </p>

            <a
              href="#contact"
              style={{
                display: "inline-block",
                fontSize: "14px",
                fontFamily: "var(--font-body)",
                fontWeight: 500,
                color: "#fff",
                background: "var(--accent)",
                padding: "12px 24px",
                borderRadius: "6px",
                textDecoration: "none",
                letterSpacing: "0.01em",
                transition: "opacity 200ms ease, transform 200ms ease",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.opacity = "0.88";
                (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.opacity = "1";
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              }}
            >
              {ROI_CALCULATOR.cta}
            </a>

            {/* Trust */}
            <div style={{
              marginTop: "48px",
              paddingTop: "32px",
              borderTop: "1px solid var(--border)",
              display: "flex",
              gap: "32px",
            }}>
              {[
                { val: "780h", label: "Average saved/yr" },
                { val: "£11k+", label: "Typical ROI" },
                { val: "< 1 week", label: "Setup time" },
              ].map(s => (
                <div key={s.label}>
                  <p style={{
                    fontFamily: "var(--font-display)", fontSize: "1.4rem",
                    color: "var(--text-primary)", margin: "0 0 4px", lineHeight: 1, letterSpacing: "-0.02em",
                  }}>
                    {s.val}
                  </p>
                  <p style={{
                    fontFamily: "var(--font-body)", fontSize: "11px",
                    letterSpacing: "0.08em", textTransform: "uppercase",
                    color: "var(--text-muted)", margin: 0, fontWeight: 500,
                  }}>
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
