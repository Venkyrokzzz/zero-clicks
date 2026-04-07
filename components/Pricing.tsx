"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { PACKAGES, PRICING_ADDONS, type Package } from "@/lib/content";

export default function Pricing() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section
      id="pricing"
      ref={sectionRef}
      style={{
        borderTop: "1px solid var(--border)",
        padding: "140px 48px",
        background: "transparent",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        {/* ── Header ─────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: "64px" }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "32px" }}>
            <h2 style={{
              fontFamily: "var(--font-display)", fontWeight: 600, letterSpacing: "-0.03em",
              fontSize: "clamp(2rem, 4vw, 3rem)", color: "var(--text-primary)", margin: 0, lineHeight: 1.1,
            }}>
              Simple, transparent pricing.
            </h2>
            <div style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)", fontSize: "13px", paddingBottom: "6px" }}>
              // 03 Investment
            </div>
          </div>

          {/* Loss aversion anchor */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "12px",
              background: "rgba(239,68,68,0.06)",
              border: "1px solid rgba(239,68,68,0.2)",
              borderRadius: "10px",
              padding: "14px 20px",
            }}
          >
            <div style={{
              width: "8px", height: "8px", borderRadius: "50%",
              background: "#ef4444",
              flexShrink: 0,
              boxShadow: "0 0 8px #ef4444",
            }} />
            <p style={{
              margin: 0,
              fontSize: "13px",
              color: "var(--text-secondary)",
              fontFamily: "var(--font-body)",
              lineHeight: 1.5,
            }}>
              <span style={{ color: "#ef4444", fontWeight: 600 }}>90 min/day × 250 days = 375 hours/year lost to admin.</span>
              {" "}At £25/hr, that&apos;s{" "}
              <span style={{ color: "#ef4444", fontWeight: 600 }}>£9,375 gone</span>
              {" "}before you&apos;ve served a single customer. We fix it from £499.
            </p>
          </motion.div>
        </motion.div>

        {/* ── Cards grid ─────────────────────────── */}
        {/* Layout: Starter (smaller) | Full Autopilot (dominant, taller) | Retainer (smaller) */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.18fr 1fr",
            gap: "20px",
            alignItems: "start",
          }}
          className="pricing-grid"
        >
          {PACKAGES.map((pkg, i) => (
            <PricingCard key={pkg.name} pkg={pkg} delay={i * 0.1} isInView={isInView} />
          ))}
        </div>

        {/* ── Add-ons ────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          style={{ marginTop: "40px" }}
        >
          <p style={{
            fontSize: "11px", color: "var(--text-muted)", fontFamily: "var(--font-mono)",
            letterSpacing: "0.1em", marginBottom: "16px", textTransform: "uppercase",
          }}>
            // Add-ons — bolt onto any package
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
            {PRICING_ADDONS.map((addon) => (
              <div
                key={addon.name}
                style={{
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  padding: "10px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <span style={{ fontSize: "12px", color: "var(--text-primary)", fontFamily: "var(--font-body)", fontWeight: 600 }}>
                  {addon.name}
                </span>
                <span style={{
                  fontSize: "11px", color: "var(--accent)",
                  fontFamily: "var(--font-mono)", fontWeight: 600,
                  background: "var(--accent-dim)", padding: "2px 7px",
                  borderRadius: "4px",
                }}>
                  {addon.price}
                </span>
                <span style={{ fontSize: "12px", color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
                  {addon.desc}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Bottom note ────────────────────────── */}
        <p style={{
          fontSize: 13, color: "var(--text-muted)", fontFamily: "var(--font-body)",
          textAlign: "center", marginTop: 48, marginBottom: 0,
        }}>
          Not sure which?{" "}
          <Link
            href="/contact"
            style={{ color: "var(--text-primary)", textDecoration: "underline", textUnderlineOffset: "4px" }}
          >
            Book a free call and we&apos;ll tell you.
          </Link>
        </p>
      </div>

      {/* Responsive grid override */}
      <style>{`
        @media (max-width: 768px) {
          .pricing-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

function PricingCard({
  pkg,
  delay,
  isInView,
}: {
  pkg: Package;
  delay: number;
  isInView: boolean;
}) {
  const { name, tagline, price, originalPrice, timeline, description, features, valueStack, guarantee, scarcity, badge, highlight, cta } = pkg;
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.5, delay }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        transform: hovered ? "translateY(-4px)" : "none",
        transition: "transform 300ms ease",
      }}
    >
      {/* Breathing glow border for highlighted tier */}
      {highlight && (
        <>
          <div
            style={{
              position: "absolute",
              inset: -1,
              borderRadius: "17px",
              background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 40%, #06b6d4 70%, #3b82f6 100%)",
              zIndex: 0,
              animation: "border-breathe 3s ease-in-out infinite",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: -6,
              borderRadius: "22px",
              background: "linear-gradient(135deg, rgba(59,130,246,0.15), rgba(139,92,246,0.12), rgba(6,182,212,0.15))",
              zIndex: 0,
              filter: "blur(8px)",
              animation: "border-breathe 3s ease-in-out infinite",
              animationDelay: "0.3s",
            }}
          />
        </>
      )}

      {/* Main card */}
      <div
        style={{
          background: highlight ? "var(--bg-surface)" : "var(--bg-card)",
          border: highlight ? "1px solid transparent" : "1px solid var(--border)",
          borderRadius: "16px",
          padding: highlight ? "44px 32px 36px" : "36px 28px 32px",
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        {/* Badge */}
        {badge && (
          <span
            style={{
              position: "absolute",
              top: -12,
              left: "50%",
              transform: "translateX(-50%)",
              background: "var(--accent)",
              color: "#000",
              fontSize: 10,
              fontWeight: 700,
              padding: "4px 12px",
              borderRadius: "4px",
              letterSpacing: "0.1em",
              whiteSpace: "nowrap",
              fontFamily: "var(--font-mono)",
            }}
          >
            {badge}
          </span>
        )}

        {/* Name + tagline */}
        <p style={{
          fontSize: 13, color: highlight ? "var(--accent)" : "var(--text-muted)",
          fontFamily: "var(--font-mono)", fontWeight: 600, margin: "0 0 6px 0",
          letterSpacing: "0.05em", textTransform: "uppercase",
        }}>
          {name}
        </p>
        <p style={{
          fontSize: 14, color: "var(--text-secondary)", fontFamily: "var(--font-body)",
          margin: "0 0 20px 0", lineHeight: 1.4,
        }}>
          {tagline}
        </p>

        {/* Price */}
        <div style={{ marginBottom: "6px", display: "flex", alignItems: "baseline", gap: "10px" }}>
          <span style={{
            fontSize: "clamp(2.2rem, 4vw, 2.8rem)", fontFamily: "var(--font-display)",
            fontWeight: 700, letterSpacing: "-0.04em", color: "var(--text-primary)", lineHeight: 1,
          }}>
            {price}
          </span>
          {originalPrice && (
            <span style={{
              fontSize: "1rem", color: "var(--text-muted)",
              fontFamily: "var(--font-body)", textDecoration: "line-through",
              opacity: 0.6,
            }}>
              {originalPrice}
            </span>
          )}
        </div>

        <p style={{
          fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-body)",
          margin: "0 0 20px 0",
        }}>
          {timeline}
        </p>

        <p style={{
          fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.6,
          fontFamily: "var(--font-body)", margin: "0 0 24px 0",
          paddingBottom: 20,
          borderBottom: "1px dashed var(--border)",
        }}>
          {description}
        </p>

        {/* Value stack (Hormozi) — Pro only */}
        {valueStack && (
          <div style={{ marginBottom: "24px" }}>
            <p style={{
              fontSize: "10px", color: "var(--text-muted)", fontFamily: "var(--font-mono)",
              letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 10px 0",
            }}>
              What&apos;s included
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "10px" }}>
              {valueStack.map((item) => (
                <div key={item.item} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "12px", color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>
                    {item.item}
                  </span>
                  <span style={{
                    fontSize: "12px", color: "var(--text-muted)", fontFamily: "var(--font-mono)",
                    textDecoration: "line-through", opacity: 0.7,
                  }}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
            {/* Total vs actual */}
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              paddingTop: "10px", borderTop: "1px solid var(--border)",
            }}>
              <span style={{ fontSize: "12px", color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
                If bought separately
              </span>
              <span style={{ fontSize: "12px", color: "var(--text-muted)", fontFamily: "var(--font-mono)", textDecoration: "line-through" }}>
                £1,697
              </span>
            </div>
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              paddingTop: "6px",
            }}>
              <span style={{ fontSize: "12px", color: "var(--accent)", fontFamily: "var(--font-body)", fontWeight: 600 }}>
                You pay today
              </span>
              <span style={{ fontSize: "14px", color: "var(--accent)", fontFamily: "var(--font-mono)", fontWeight: 700 }}>
                £1,200
              </span>
            </div>
          </div>
        )}

        {/* Features */}
        <ul style={{
          listStyle: "none", padding: 0,
          margin: valueStack ? "0 0 24px" : "0 0 32px",
          display: "flex", flexDirection: "column", gap: 10, flex: 1,
        }}>
          {features.map((feature) => (
            <li key={feature} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
              <svg
                width="15" height="15" viewBox="0 0 24 24" fill="none"
                stroke={highlight ? "var(--accent)" : "var(--text-muted)"}
                strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                style={{ marginTop: "2px", flexShrink: 0 }}
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span style={{
                fontSize: 13, color: "var(--text-secondary)", fontFamily: "var(--font-body)", lineHeight: 1.4,
              }}>
                {feature}
              </span>
            </li>
          ))}
        </ul>

        {/* Guarantee badge */}
        {guarantee && (
          <div style={{
            display: "flex", alignItems: "flex-start", gap: "8px",
            background: "rgba(16,185,129,0.06)",
            border: "1px solid rgba(16,185,129,0.2)",
            borderRadius: "8px",
            padding: "10px 12px",
            marginBottom: "16px",
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: "1px", flexShrink: 0 }}>
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span style={{ fontSize: "11px", color: "#10b981", fontFamily: "var(--font-body)", lineHeight: 1.4 }}>
              {guarantee}
            </span>
          </div>
        )}

        {/* Scarcity */}
        {scarcity && (
          <div style={{
            display: "flex", alignItems: "center", gap: "6px",
            marginBottom: "16px",
          }}>
            <div style={{
              width: "6px", height: "6px", borderRadius: "50%",
              background: "#ef4444",
              flexShrink: 0,
              boxShadow: "0 0 6px #ef4444",
              animation: "status-pulse 1.5s ease-in-out infinite",
            }} />
            <span style={{
              fontSize: "11px", color: "#ef4444",
              fontFamily: "var(--font-mono)", fontWeight: 600, letterSpacing: "0.04em",
            }}>
              {scarcity}
            </span>
          </div>
        )}

        {/* CTA */}
        <Link
          href="/contact"
          style={{
            background: highlight ? "var(--text-primary)" : "rgba(255,255,255,0.04)",
            color: highlight ? "#000" : "var(--text-primary)",
            border: highlight ? "none" : "1px solid var(--border)",
            width: "100%",
            padding: highlight ? "14px" : "12px",
            borderRadius: 8,
            fontSize: 13,
            fontFamily: "var(--font-body)",
            fontWeight: 700,
            textDecoration: "none",
            textAlign: "center",
            display: "block",
            transition: "all 0.2s ease",
            cursor: "pointer",
            transform: hovered && highlight ? "scale(1.02)" : "scale(1)",
            letterSpacing: highlight ? "0.02em" : "normal",
          }}
        >
          {cta}
        </Link>
      </div>
    </motion.div>
  );
}
