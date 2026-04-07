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
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>

        {/* ── Header ─────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: "48px" }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "20px" }}>
            <h2 style={{
              fontFamily: "var(--font-display)", fontWeight: 600, letterSpacing: "-0.03em",
              fontSize: "clamp(2rem, 4vw, 3rem)", color: "var(--text-primary)", margin: 0, lineHeight: 1.1,
            }}>
              Simple, transparent pricing.
            </h2>
            <div style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)", fontSize: "13px", paddingBottom: "6px" }}>
              // 05 Investment
            </div>
          </div>

          {/* Loss aversion anchor — compact single line */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "10px",
            background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)",
            borderRadius: "8px", padding: "10px 16px",
          }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#ef4444", flexShrink: 0, boxShadow: "0 0 6px #ef4444" }} />
            <p style={{ margin: 0, fontSize: "12px", color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>
              <span style={{ color: "#ef4444", fontWeight: 600 }}>90 min/day × 250 days = £9,375/year lost to admin.</span>
              {" "}We fix it from £499.
            </p>
          </div>
        </motion.div>

        {/* ── Cards grid ─────────────────────────── */}
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1.15fr 1fr", gap: "16px", alignItems: "stretch" }}
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
          transition={{ duration: 0.6, delay: 0.4 }}
          style={{ marginTop: "28px" }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "var(--font-mono)", letterSpacing: "0.1em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
              // Add-ons:
            </span>
            {PRICING_ADDONS.map((addon) => (
              <div key={addon.name} style={{
                background: "var(--bg-surface)", border: "1px solid var(--border)",
                borderRadius: "6px", padding: "7px 14px",
                display: "flex", alignItems: "center", gap: "8px",
              }}>
                <span style={{ fontSize: "12px", color: "var(--text-primary)", fontFamily: "var(--font-body)", fontWeight: 600 }}>{addon.name}</span>
                <span style={{ fontSize: "11px", color: "var(--accent)", fontFamily: "var(--font-mono)", fontWeight: 600, background: "var(--accent-dim)", padding: "2px 6px", borderRadius: "3px" }}>{addon.price}</span>
                <span style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>{addon.desc}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Bottom note ────────────────────────── */}
        <p style={{ fontSize: 13, color: "var(--text-muted)", fontFamily: "var(--font-body)", textAlign: "center", marginTop: 40, marginBottom: 0 }}>
          Not sure which?{" "}
          <Link href="/contact" style={{ color: "var(--text-primary)", textDecoration: "underline", textUnderlineOffset: "4px" }}>
            Book a free call and we&apos;ll tell you.
          </Link>
        </p>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .pricing-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

function PricingCard({ pkg, delay, isInView }: { pkg: Package; delay: number; isInView: boolean }) {
  const { name, tagline, price, originalPrice, timeline, features, valueStack, guarantee, scarcity, badge, highlight, cta } = pkg;
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ position: "relative", display: "flex", flexDirection: "column", height: "100%", transform: hovered ? "translateY(-3px)" : "none", transition: "transform 300ms ease" }}
    >
      {/* Glow border — Pro only */}
      {highlight && (
        <>
          <div style={{ position: "absolute", inset: -1, borderRadius: "17px", background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 40%, #06b6d4 70%, #3b82f6 100%)", zIndex: 0, animation: "border-breathe 3s ease-in-out infinite" }} />
          <div style={{ position: "absolute", inset: -6, borderRadius: "22px", background: "linear-gradient(135deg, rgba(59,130,246,0.12), rgba(139,92,246,0.1), rgba(6,182,212,0.12))", zIndex: 0, filter: "blur(8px)", animation: "border-breathe 3s ease-in-out infinite", animationDelay: "0.3s" }} />
        </>
      )}

      {/* Card body */}
      <div style={{
        background: highlight ? "var(--bg-surface)" : "var(--bg-card)",
        border: highlight ? "1px solid transparent" : "1px solid var(--border)",
        borderRadius: "16px",
        padding: "24px 24px 22px",
        position: "relative", zIndex: 1,
        display: "flex", flexDirection: "column", height: "100%",
      }}>
        {/* Badge */}
        {badge && (
          <span style={{
            position: "absolute", top: -11, left: "50%", transform: "translateX(-50%)",
            background: "var(--accent)", color: "#000", fontSize: 10, fontWeight: 700,
            padding: "3px 10px", borderRadius: "4px", letterSpacing: "0.1em",
            whiteSpace: "nowrap", fontFamily: "var(--font-mono)",
          }}>
            {badge}
          </span>
        )}

        {/* Top row: name + price */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "4px" }}>
          <div>
            <p style={{ fontSize: 11, color: highlight ? "var(--accent)" : "var(--text-muted)", fontFamily: "var(--font-mono)", fontWeight: 600, margin: "0 0 2px", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              {name}
            </p>
            <p style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-body)", margin: 0, lineHeight: 1.3 }}>
              {tagline}
            </p>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0, marginLeft: "12px" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: "6px", justifyContent: "flex-end" }}>
              <span style={{ fontSize: "1.9rem", fontFamily: "var(--font-display)", fontWeight: 700, letterSpacing: "-0.04em", color: "var(--text-primary)", lineHeight: 1 }}>
                {price}
              </span>
              {originalPrice && (
                <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", textDecoration: "line-through", opacity: 0.55 }}>{originalPrice}</span>
              )}
            </div>
            <p style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-body)", margin: "2px 0 0" }}>{timeline}</p>
          </div>
        </div>

        {/* Divider */}
        <div style={{ borderTop: "1px dashed var(--border)", margin: "14px 0" }} />

        {/* Value stack — compact grid, Pro only */}
        {valueStack && (
          <div style={{ marginBottom: "12px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "3px 12px", marginBottom: "8px" }}>
              {valueStack.map((item) => (
                <>
                  <span key={item.item + "-label"} style={{ fontSize: "11px", color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>{item.item}</span>
                  <span key={item.item + "-val"} style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "var(--font-mono)", textDecoration: "line-through", opacity: 0.6, textAlign: "right" }}>{item.value}</span>
                </>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid var(--border)", paddingTop: "6px" }}>
              <span style={{ fontSize: "11px", color: "var(--accent)", fontFamily: "var(--font-body)", fontWeight: 600 }}>You pay today</span>
              <span style={{ fontSize: "12px", color: "var(--accent)", fontFamily: "var(--font-mono)", fontWeight: 700 }}>£1,200 <span style={{ fontSize: "10px", textDecoration: "line-through", opacity: 0.6, fontWeight: 400 }}>£1,697</span></span>
            </div>
          </div>
        )}

        {/* Features — compact */}
        <ul style={{ listStyle: "none", padding: 0, margin: "0 0 14px", display: "flex", flexDirection: "column", gap: 7, flex: 1 }}>
          {features.map((feature) => (
            <li key={feature} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke={highlight ? "var(--accent)" : "var(--text-muted)"}
                strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                style={{ marginTop: "2px", flexShrink: 0 }}>
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span style={{ fontSize: 12, color: "var(--text-secondary)", fontFamily: "var(--font-body)", lineHeight: 1.4 }}>{feature}</span>
            </li>
          ))}
        </ul>

        {/* Guarantee + Scarcity inline */}
        {(guarantee || scarcity) && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "14px" }}>
            {guarantee && (
              <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.18)", borderRadius: "6px", padding: "5px 10px" }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <span style={{ fontSize: "10px", color: "#10b981", fontFamily: "var(--font-body)" }}>{guarantee}</span>
              </div>
            )}
            {scarcity && (
              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#ef4444", boxShadow: "0 0 5px #ef4444", animation: "status-pulse 1.5s ease-in-out infinite" }} />
                <span style={{ fontSize: "10px", color: "#ef4444", fontFamily: "var(--font-mono)", fontWeight: 600 }}>{scarcity}</span>
              </div>
            )}
          </div>
        )}

        {/* CTA */}
        <Link href="/contact" style={{
          background: highlight ? "var(--text-primary)" : "rgba(255,255,255,0.04)",
          color: highlight ? "#000" : "var(--text-primary)",
          border: highlight ? "none" : "1px solid var(--border)",
          width: "100%", padding: "11px", borderRadius: 7,
          fontSize: 13, fontFamily: "var(--font-body)", fontWeight: 700,
          textDecoration: "none", textAlign: "center", display: "block",
          transition: "all 0.2s ease",
        }}>
          {cta}
        </Link>
      </div>
    </motion.div>
  );
}
