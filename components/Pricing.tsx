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
        padding: "120px 48px",
      }}
    >
      {/* Label */}
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
        transition={{ duration: 0.5 }}
        style={{
          color: "var(--accent)",
          fontSize: "11px",
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          fontFamily: "var(--font-body)",
          fontWeight: 700,
          margin: 0,
          marginBottom: 16,
        }}
      >
        PRICING
      </motion.p>

      {/* Heading */}
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
        transition={{ duration: 0.5, delay: 0.05 }}
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(1.8rem, 3vw, 2.6rem)",
          fontWeight: 400,
          color: "var(--text-primary)",
          margin: 0,
          marginBottom: 16,
        }}
      >
        Simple, honest pricing.
      </motion.h2>

      {/* Subtext */}
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        style={{
          fontSize: "1rem",
          color: "var(--text-secondary)",
          fontFamily: "var(--font-body)",
          maxWidth: 480,
          margin: 0,
          lineHeight: 1.7,
        }}
      >
        No retainer lock-ins. No hidden fees. Pay for what you need.
      </motion.p>

      {/* Cards grid */}
      <div
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        style={{
          marginTop: 56,
          maxWidth: 1000,
          margin: "56px auto 0",
        }}
      >
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
          marginTop: 32,
          marginBottom: 0,
        }}
      >
        Not sure which?{" "}
        <Link
          href="/contact"
          style={{
            color: "var(--accent)",
            textDecoration: "none",
          }}
        >
          Book a free call and we&apos;ll tell you.
        </Link>
      </p>
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

  const cardStyle: React.CSSProperties = highlight
    ? {
        background:
          "linear-gradient(135deg, rgba(59,130,246,0.12) 0%, rgba(139,92,246,0.08) 100%)",
        border: "1px solid rgba(59,130,246,0.4)",
        borderRadius: 12,
        padding: "36px 32px",
        position: "relative",
      }
    : {
        background: "var(--bg-card)",
        border: "1px solid var(--border-mid)",
        borderRadius: 12,
        padding: "36px 32px",
        position: "relative",
      };

  const btnStyle: React.CSSProperties = highlight
    ? {
        background: hovered ? "rgba(59,130,246,0.85)" : "var(--accent)",
        color: "white",
        width: "100%",
        padding: "13px",
        borderRadius: 8,
        fontSize: 14,
        fontFamily: "var(--font-body)",
        fontWeight: 600,
        textDecoration: "none",
        textAlign: "center" as const,
        display: "block",
        border: "none",
        transition: "background 0.2s ease",
        cursor: "pointer",
      }
    : {
        background: hovered ? "rgba(255,255,255,0.04)" : "transparent",
        border: "1px solid var(--border-mid)",
        color: "var(--text-secondary)",
        width: "100%",
        padding: "13px",
        borderRadius: 8,
        fontSize: 14,
        fontFamily: "var(--font-body)",
        fontWeight: 600,
        textDecoration: "none",
        textAlign: "center" as const,
        display: "block",
        transition: "background 0.2s ease",
        cursor: "pointer",
      };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.5, delay }}
      style={cardStyle}
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
            color: "white",
            fontSize: 10,
            fontWeight: 700,
            padding: "4px 12px",
            borderRadius: 20,
            letterSpacing: "0.1em",
            whiteSpace: "nowrap",
            fontFamily: "var(--font-body)",
          }}
        >
          MOST POPULAR
        </span>
      )}

      {/* Package name */}
      <p
        style={{
          fontSize: 11,
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          color: "var(--accent)",
          fontFamily: "var(--font-body)",
          fontWeight: 700,
          margin: 0,
          marginBottom: 8,
        }}
      >
        {name}
      </p>

      {/* Price */}
      <p
        style={{
          fontSize: "clamp(2rem, 4vw, 2.8rem)",
          fontFamily: "var(--font-display)",
          fontWeight: 400,
          color: "var(--text-primary)",
          lineHeight: 1,
          margin: 0,
        }}
      >
        {price}
      </p>

      {/* Timeline */}
      <p
        style={{
          fontSize: 12,
          color: "var(--text-muted)",
          fontFamily: "var(--font-body)",
          margin: 0,
          marginTop: 6,
          marginBottom: 16,
        }}
      >
        {timeline}
      </p>

      {/* Description */}
      <p
        style={{
          fontSize: "0.875rem",
          color: "var(--text-secondary)",
          lineHeight: 1.7,
          fontFamily: "var(--font-body)",
          margin: 0,
          marginBottom: 28,
          paddingBottom: 24,
          borderBottom: "1px solid var(--border)",
        }}
      >
        {description}
      </p>

      {/* Features */}
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: "0 0 32px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {features.map((feature) => (
          <li
            key={feature}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            {/* Checkmark circle */}
            <span
              style={{
                width: 18,
                height: 18,
                background: "rgba(59,130,246,0.1)",
                color: "var(--accent)",
                borderRadius: "50%",
                flexShrink: 0,
                fontSize: 10,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ✓
            </span>
            <span
              style={{
                fontSize: 13,
                color: "var(--text-secondary)",
                fontFamily: "var(--font-body)",
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
        style={btnStyle}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {cta}
      </Link>
    </motion.div>
  );
}
