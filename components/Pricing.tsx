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
      style={{ borderTop: "1px solid var(--border)", padding: "80px 48px", background: "transparent" }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: "48px" }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "18px" }}>
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
          {/* Loss aversion — single line */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.18)", borderRadius: "6px", padding: "8px 14px" }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#ef4444", flexShrink: 0, boxShadow: "0 0 6px #ef4444" }} />
            <p style={{ margin: 0, fontSize: "12px", color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>
              <span style={{ color: "#ef4444", fontWeight: 600 }}>90 min/day × 250 days = £9,375/year lost to admin.</span>{" "}We fix it from £499.
            </p>
          </div>
        </motion.div>

        {/* Cards — equal 3 cols, Raycast style */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", alignItems: "stretch" }} className="pricing-grid">
          {PACKAGES.map((pkg, i) => (
            <PricingCard key={pkg.name} pkg={pkg} delay={i * 0.1} isInView={isInView} />
          ))}
        </div>

        {/* Add-ons */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          style={{ marginTop: "24px", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px" }}
        >
          <span style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "var(--font-mono)", letterSpacing: "0.08em", textTransform: "uppercase", marginRight: "4px" }}>
            Add-ons:
          </span>
          {PRICING_ADDONS.map((addon) => (
            <div key={addon.name} style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: "6px", padding: "6px 12px" }}>
              <span style={{ fontSize: "12px", color: "var(--text-primary)", fontFamily: "var(--font-body)", fontWeight: 600 }}>{addon.name}</span>
              <span style={{ fontSize: "11px", color: "var(--accent)", fontFamily: "var(--font-mono)", fontWeight: 600 }}>{addon.price}</span>
              <span style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>— {addon.desc}</span>
            </div>
          ))}
        </motion.div>

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

function CheckIcon({ active }: { active: boolean }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: "1px" }}>
      <circle cx="12" cy="12" r="11" stroke={active ? "var(--accent)" : "var(--border-mid)"} strokeWidth="1.5" />
      <polyline points="7 12 10 15 17 9" stroke={active ? "var(--accent)" : "var(--text-muted)"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
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
      style={{ position: "relative", display: "flex", flexDirection: "column", height: "100%", transform: hovered ? "translateY(-3px)" : "none", transition: "transform 280ms ease" }}
    >
      {/* Glow layers — Pro only */}
      {highlight && (
        <>
          <div style={{ position: "absolute", inset: -1, borderRadius: "17px", background: "linear-gradient(135deg, #3b82f6, #8b5cf6, #06b6d4, #3b82f6)", zIndex: 0, animation: "border-breathe 3s ease-in-out infinite" }} />
          <div style={{ position: "absolute", inset: -8, borderRadius: "24px", background: "linear-gradient(135deg, rgba(59,130,246,0.1), rgba(139,92,246,0.08), rgba(6,182,212,0.1))", zIndex: 0, filter: "blur(10px)", animation: "border-breathe 3s ease-in-out infinite", animationDelay: "0.4s" }} />
        </>
      )}

      <div style={{
        background: "var(--bg-surface)",
        border: highlight ? "1px solid transparent" : "1px solid var(--border)",
        borderRadius: "16px",
        padding: "28px 24px 24px",
        position: "relative", zIndex: 1,
        display: "flex", flexDirection: "column", height: "100%",
        boxShadow: highlight ? "0 24px 60px rgba(0,0,0,0.5)" : hovered ? "0 12px 32px rgba(0,0,0,0.3)" : "none",
        transition: "box-shadow 280ms ease",
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

        {/* Name + tagline */}
        <div style={{ marginBottom: "20px" }}>
          <p style={{ fontSize: "1rem", fontFamily: "var(--font-display)", fontWeight: 600, color: "var(--text-primary)", margin: "0 0 4px", letterSpacing: "-0.01em" }}>
            {name}
          </p>
          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontFamily: "var(--font-body)", margin: 0, lineHeight: 1.4 }}>
            {tagline}
          </p>
        </div>

        {/* Price block */}
        <div style={{ marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "6px", marginBottom: "4px" }}>
            <span style={{ fontSize: "2.6rem", fontFamily: "var(--font-display)", fontWeight: 700, letterSpacing: "-0.05em", color: "var(--text-primary)", lineHeight: 1 }}>
              {price}
            </span>
            {originalPrice && (
              <span style={{ fontSize: "0.9rem", color: "var(--text-muted)", textDecoration: "line-through", opacity: 0.5, fontFamily: "var(--font-body)" }}>
                {originalPrice}
              </span>
            )}
          </div>
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontFamily: "var(--font-body)", margin: "0 0 2px" }}>
            {timeline}
          </p>
          <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontFamily: "var(--font-body)", margin: 0, opacity: 0.6 }}>
            then £{name === "Full Autopilot" ? "75" : "50"}/month
          </p>
          {/* Value stack savings line — Pro only */}
          {valueStack && (
            <p style={{ fontSize: "0.72rem", color: "var(--accent)", fontFamily: "var(--font-mono)", margin: "6px 0 0", fontWeight: 600 }}>
              Save £497 vs buying separately
            </p>
          )}
        </div>

        {/* Divider */}
        <div style={{ borderTop: "1px solid var(--border)", marginBottom: "18px" }} />

        {/* Features */}
        <ul style={{ listStyle: "none", padding: 0, margin: "0 0 20px", display: "flex", flexDirection: "column", gap: "10px", flex: 1 }}>
          {features.map((feature) => (
            <li key={feature} style={{ display: "flex", alignItems: "flex-start", gap: "9px" }}>
              <CheckIcon active={highlight} />
              <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)", fontFamily: "var(--font-body)", lineHeight: 1.45 }}>
                {feature}
              </span>
            </li>
          ))}
          {/* Value stack items as features — Pro only */}
          {valueStack && (
            <>
              <li style={{ display: "flex", alignItems: "center", gap: "9px" }}>
                <div style={{ width: "15px", height: "1px", background: "var(--border-mid)", flexShrink: 0 }} />
                <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)", letterSpacing: "0.06em" }}>
                  INCLUDES
                </span>
              </li>
              {valueStack.map((item) => (
                <li key={item.item} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "9px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
                    <CheckIcon active={true} />
                    <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>{item.item}</span>
                  </div>
                  <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)", textDecoration: "line-through", opacity: 0.5, flexShrink: 0 }}>{item.value}</span>
                </li>
              ))}
            </>
          )}
        </ul>

        {/* Guarantee + scarcity */}
        {(guarantee || scarcity) && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "16px" }}>
            {guarantee && (
              <div style={{ display: "inline-flex", alignItems: "center", gap: "5px", background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.18)", borderRadius: "5px", padding: "4px 9px" }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <span style={{ fontSize: "10px", color: "#10b981", fontFamily: "var(--font-body)", lineHeight: 1.3 }}>{guarantee}</span>
              </div>
            )}
            {scarcity && (
              <div style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
                <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#ef4444", boxShadow: "0 0 4px #ef4444", animation: "status-pulse 1.5s ease-in-out infinite", flexShrink: 0 }} />
                <span style={{ fontSize: "10px", color: "#ef4444", fontFamily: "var(--font-mono)", fontWeight: 600 }}>{scarcity}</span>
              </div>
            )}
          </div>
        )}

        {/* CTA — pinned to bottom */}
        <Link href="/contact" style={{
          background: highlight ? "var(--text-primary)" : "rgba(255,255,255,0.05)",
          color: highlight ? "#000" : "var(--text-primary)",
          border: highlight ? "none" : "1px solid var(--border-mid)",
          width: "100%", padding: "11px 16px",
          borderRadius: "8px", fontSize: "13px",
          fontFamily: "var(--font-body)", fontWeight: 600,
          textDecoration: "none", textAlign: "center", display: "block",
          letterSpacing: "0.01em",
          transition: "opacity 200ms ease",
        }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = "0.85"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
        >
          {cta}
        </Link>
      </div>
    </motion.div>
  );
}
