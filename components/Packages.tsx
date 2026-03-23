// components/Packages.tsx
"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { PACKAGES } from "@/lib/content";

const ease = [0.25, 0.1, 0.25, 1.0] as const;

export default function Packages() {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-80px" });

  return (
    <section id="pricing" style={{ padding: "120px 48px", position: "relative" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease }}
          style={{ marginBottom: "64px", textAlign: "center" }}
        >
          <p style={{
            fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase",
            color: "var(--accent)", marginBottom: "12px", fontFamily: "var(--font-body)", fontWeight: 600,
          }}>
            Pricing
          </p>
          <h2 style={{
            fontFamily: "var(--font-display)", fontWeight: 400,
            fontSize: "clamp(1.8rem, 3vw, 2.6rem)", color: "var(--text-primary)",
            margin: "0 0 16px", lineHeight: 1.15,
          }}>
            Simple, transparent packages
          </h2>
          <p style={{
            fontFamily: "var(--font-body)", fontSize: "1rem",
            color: "var(--text-secondary)", lineHeight: 1.75, maxWidth: "480px", margin: "0 auto",
          }}>
            No retainers unless you want one. No surprise invoices. You know what you're getting before we start.
          </p>
        </motion.div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "20px",
          alignItems: "start",
        }}>
          {PACKAGES.map((pkg, i) => (
            <PackageCard key={pkg.name} pkg={pkg} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PackageCard({ pkg, index }: { pkg: typeof PACKAGES[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease, delay: index * 0.1 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        borderRadius: "12px",
        padding: "36px 32px",
        background: pkg.highlight ? "var(--accent)" : hovered ? "var(--bg-hover)" : "var(--bg-card)",
        border: pkg.highlight
          ? "1px solid var(--accent)"
          : `1px solid ${hovered ? "var(--border-mid)" : "var(--border)"}`,
        transition: "background 200ms ease, border-color 200ms ease, box-shadow 200ms ease, transform 200ms ease",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: pkg.highlight
          ? "0 24px 64px rgba(59,130,246,0.25)"
          : hovered
          ? "0 20px 48px rgba(0,0,0,0.35)"
          : "none",
      }}
    >
      {pkg.highlight && (
        <span style={{
          position: "absolute",
          top: "-12px",
          left: "50%",
          transform: "translateX(-50%)",
          background: "#fff",
          color: "var(--accent)",
          fontSize: "10px",
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          padding: "4px 12px",
          borderRadius: "20px",
          fontFamily: "var(--font-body)",
          whiteSpace: "nowrap",
        }}>
          Most Popular
        </span>
      )}

      <p style={{
        fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "11px",
        letterSpacing: "0.1em", textTransform: "uppercase",
        color: pkg.highlight ? "rgba(255,255,255,0.7)" : "var(--text-muted)",
        margin: "0 0 12px",
      }}>
        {pkg.name}
      </p>

      <p style={{
        fontFamily: "var(--font-display)", fontSize: "2.4rem", fontWeight: 400,
        color: pkg.highlight ? "#fff" : "var(--text-primary)",
        margin: "0 0 4px", lineHeight: 1,
        letterSpacing: "-0.02em",
      }}>
        {pkg.price}
      </p>

      <p style={{
        fontFamily: "var(--font-body)", fontSize: "12px",
        color: pkg.highlight ? "rgba(255,255,255,0.6)" : "var(--text-muted)",
        margin: "0 0 20px",
      }}>
        {pkg.timeline}
      </p>

      <div style={{
        height: "1px",
        background: pkg.highlight ? "rgba(255,255,255,0.15)" : "var(--border)",
        margin: "0 0 20px",
      }} />

      <p style={{
        fontFamily: "var(--font-body)", fontSize: "0.9rem",
        color: pkg.highlight ? "rgba(255,255,255,0.85)" : "var(--text-secondary)",
        lineHeight: 1.7, margin: "0 0 24px",
      }}>
        {pkg.description}
      </p>

      <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px" }}>
        {pkg.features.map(f => (
          <li key={f} style={{
            display: "flex", alignItems: "flex-start", gap: "10px",
            marginBottom: "10px",
            fontFamily: "var(--font-body)", fontSize: "0.875rem",
            color: pkg.highlight ? "rgba(255,255,255,0.9)" : "var(--text-secondary)",
          }}>
            <span style={{
              flexShrink: 0, width: "16px", height: "16px", marginTop: "2px",
              color: pkg.highlight ? "#fff" : "var(--accent)",
            }}>
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="2,8 6,12 14,4" />
              </svg>
            </span>
            {f}
          </li>
        ))}
      </ul>

      <Link
        href="https://calendly.com/zeroclicks-hq/discovery"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "block",
          textAlign: "center",
          fontSize: "14px",
          fontFamily: "var(--font-body)",
          fontWeight: 500,
          textDecoration: "none",
          padding: "12px 24px",
          borderRadius: "6px",
          color: pkg.highlight ? "var(--accent)" : "#fff",
          background: pkg.highlight ? "#fff" : "var(--accent)",
          transition: "opacity 200ms ease, transform 200ms ease",
          letterSpacing: "0.01em",
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = "0.88"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
      >
        {pkg.cta}
      </Link>
    </motion.div>
  );
}
