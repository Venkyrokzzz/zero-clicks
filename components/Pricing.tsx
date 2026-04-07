"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { PACKAGES, type Package } from "@/lib/content";

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
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: "64px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}
        >
          <div>
            <h2 style={{
              fontFamily: "var(--font-display)", fontWeight: 600, letterSpacing: "-0.03em",
              fontSize: "clamp(2rem, 4vw, 3rem)", color: "var(--text-primary)", margin: 0, lineHeight: 1.1,
            }}>
              Simple, transparent pricing.
            </h2>
          </div>
          <div style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)", fontSize: "13px", paddingBottom: "6px" }}>
            // 03 Investment
          </div>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PACKAGES.map((pkg, i) => (
            <PricingCard key={pkg.name} pkg={pkg} delay={i * 0.1} isInView={isInView} />
          ))}
        </div>

        {/* Bottom note */}
        <p
          style={{
            fontSize: 13,
            color: "var(--text-muted)",
            fontFamily: "var(--font-body)",
            textAlign: "center",
            marginTop: 48,
            marginBottom: 0,
          }}
        >
          Not sure which?{" "}
          <Link
            href="/contact"
            style={{
              color: "var(--text-primary)",
              textDecoration: "underline",
              textUnderlineOffset: "4px",
            }}
          >
            Book a free call and we&apos;ll tell you.
          </Link>
        </p>
      </div>
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
  const { name, price, timeline, description, features, highlight, cta } = pkg;
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
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transform: hovered ? "translateY(-4px)" : "none",
        transition: "transform 300ms ease",
      }}
    >
      {/* Breathing glow border for Pro Tier */}
      {highlight && (
        <>
          {/* Gradient border layer */}
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
          {/* Soft outer glow */}
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

      {/* Main Card Content */}
      <div
        style={{
          background: "var(--bg-surface)",
          border: highlight ? "1px solid transparent" : "1px solid var(--border)",
          borderRadius: "16px",
          padding: "40px 32px",
          position: "relative",
          zIndex: 1,
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Most popular badge */}
        {highlight && (
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
            RECOMMENDED
          </span>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <p
            style={{
              fontSize: 14,
              color: highlight ? "var(--text-primary)" : "var(--text-secondary)",
              fontFamily: "var(--font-body)",
              fontWeight: 600,
              margin: 0,
            }}
          >
            {name}
          </p>
        </div>

        <p
          style={{
            fontSize: "clamp(2rem, 4vw, 2.5rem)",
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            letterSpacing: "-0.04em",
            color: "var(--text-primary)",
            lineHeight: 1,
            margin: "0 0 8px 0",
          }}
        >
          {price}
        </p>

        <p
          style={{
            fontSize: 12,
            color: "var(--text-muted)",
            fontFamily: "var(--font-body)",
            margin: "0 0 24px 0",
          }}
        >
          {timeline}
        </p>

        <p
          style={{
            fontSize: "0.9rem",
            color: "var(--text-secondary)",
            lineHeight: 1.6,
            fontFamily: "var(--font-body)",
            margin: "0 0 32px 0",
            paddingBottom: 24,
            borderBottom: "1px dashed var(--border)",
          }}
        >
          {description}
        </p>

        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: "0 0 40px",
            display: "flex",
            flexDirection: "column",
            gap: 12,
            flex: 1,
          }}
        >
          {features.map((feature) => (
            <li
              key={feature}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
              }}
            >
              <svg 
                width="16" height="16" viewBox="0 0 24 24" fill="none" 
                stroke={highlight ? "var(--accent)" : "var(--text-secondary)"} 
                strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" 
                style={{ marginTop: "2px", flexShrink: 0 }}
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span
                style={{
                  fontSize: 13,
                  color: "var(--text-secondary)",
                  fontFamily: "var(--font-body)",
                  lineHeight: 1.4,
                }}
              >
                {feature}
              </span>
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        <Link
          href="/contact"
          style={{
            background: highlight ? "var(--text-primary)" : "rgba(255,255,255,0.05)",
            color: highlight ? "#000" : "var(--text-primary)",
            border: highlight ? "none" : "1px solid var(--border)",
            width: "100%",
            padding: "12px",
            borderRadius: 8,
            fontSize: 13,
            fontFamily: "var(--font-body)",
            fontWeight: 600,
            textDecoration: "none",
            textAlign: "center",
            display: "block",
            transition: "all 0.2s ease",
            cursor: "pointer",
            transform: hovered ? "scale(1.02)" : "scale(1)",
          }}
        >
          {cta}
        </Link>
      </div>
    </motion.div>
  );
}
