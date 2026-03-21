// components/Hero.tsx
"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useRef, Suspense } from "react";
import dynamic from "next/dynamic";
import { HERO } from "@/lib/content";

const LanyardCard = dynamic(() => import("./LanyardCard"), { ssr: false });

const ease = [0.25, 0.1, 0.25, 1.0] as const;

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yContent = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const opacityContent = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <section
      ref={ref}
      style={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        padding: "0 48px",
        gap: "40px",
      }}
    >
      {/* ── Background blobs ───────────────────────────────────── */}
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        {/* Blue-purple blob top-left */}
        <div
          className="blob"
          style={{
            width: "600px",
            height: "600px",
            background:
              "radial-gradient(circle, rgba(99,102,241,0.5) 0%, rgba(59,130,246,0.3) 50%, transparent 80%)",
            top: "-180px",
            left: "-160px",
            opacity: 0.35,
          }}
        />
        {/* Pinkish blob right */}
        <div
          className="blob blob-alt"
          style={{
            width: "450px",
            height: "450px",
            background:
              "radial-gradient(circle, rgba(196,181,253,0.4) 0%, rgba(249,168,212,0.2) 60%, transparent 80%)",
            top: "10%",
            right: "-100px",
            opacity: 0.3,
            animationDelay: "3s",
          }}
        />
        {/* Teal bottom blob */}
        <div
          className="blob"
          style={{
            width: "300px",
            height: "300px",
            background:
              "radial-gradient(circle, rgba(110,231,183,0.35) 0%, rgba(126,184,255,0.2) 70%, transparent 90%)",
            bottom: "8%",
            left: "30%",
            opacity: 0.25,
            animationDelay: "6s",
          }}
        />
        {/* Grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />
        {/* Radial vignette */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at 30% 50%, transparent 40%, var(--bg) 85%)",
          }}
        />
      </div>

      {/* ── Left: copy ─────────────────────────────────────────── */}
      <motion.div
        style={{ y: yContent, opacity: opacityContent }}
        className="relative z-10"
      >
        <div style={{ paddingTop: "80px", maxWidth: "540px" }}>
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "32px" }}
          >
            <span
              style={{
                display: "inline-block",
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #7eb8ff, #c4b5fd)",
                boxShadow: "0 0 10px rgba(196,181,253,0.6)",
                animation: "glow-pulse 2.5s ease-in-out infinite",
              }}
            />
            <p
              style={{
                fontSize: "11px",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--text-secondary)",
                fontFamily: "var(--font-body)",
                fontWeight: 500,
                margin: 0,
              }}
            >
              AI Automation Consultancy
            </p>
          </motion.div>

          {/* Headline */}
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 400,
              fontSize: "clamp(2.8rem, 6vw, 5.5rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.025em",
              margin: "0 0 32px",
            }}
          >
            <motion.span
              initial={{ opacity: 0, y: 50, rotateX: 20 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.9, ease, delay: 0.05 }}
              style={{ display: "block", color: "var(--text-primary)", transformOrigin: "top center" }}
            >
              Stop doing it
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 50, rotateX: 20 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.9, ease, delay: 0.2 }}
              className="prismatic-text"
              style={{ display: "block", transformOrigin: "top center" }}
            >
              manually.
            </motion.span>
          </h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.38 }}
            style={{
              maxWidth: "440px",
              fontSize: "1rem",
              color: "var(--text-secondary)",
              lineHeight: 1.75,
              marginBottom: "48px",
              fontFamily: "var(--font-body)",
              fontWeight: 400,
            }}
          >
            {HERO.subtext}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.52 }}
            style={{ display: "flex", alignItems: "center", gap: "24px", flexWrap: "wrap" }}
          >
            <Link
              href={HERO.ctaPrimary.href}
              style={{
                fontSize: "13px",
                letterSpacing: "0.05em",
                fontFamily: "var(--font-body)",
                fontWeight: 500,
                textDecoration: "none",
                padding: "13px 28px",
                borderRadius: "6px",
                color: "#06060e",
                background: "linear-gradient(135deg, #a8d8ff 0%, #c4b5fd 50%, #f9a8d4 100%)",
                boxShadow: "0 0 30px rgba(196,181,253,0.3), 0 4px 20px rgba(0,0,0,0.4)",
                transition: "transform 200ms ease, box-shadow 200ms ease",
                display: "inline-block",
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = "translateY(-2px) scale(1.02)";
                el.style.boxShadow = "0 0 50px rgba(196,181,253,0.45), 0 8px 30px rgba(0,0,0,0.5)";
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = "translateY(0) scale(1)";
                el.style.boxShadow = "0 0 30px rgba(196,181,253,0.3), 0 4px 20px rgba(0,0,0,0.4)";
              }}
            >
              {HERO.ctaPrimary.label}
            </Link>

            <Link
              href={HERO.ctaSecondary.href}
              style={{
                fontSize: "13px",
                color: "var(--text-secondary)",
                textDecoration: "none",
                fontFamily: "var(--font-body)",
                fontWeight: 400,
                transition: "color 200ms ease",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "var(--text-primary)")}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "var(--text-secondary)")}
            >
              {HERO.ctaSecondary.label} <span>→</span>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.7 }}
            style={{ marginTop: "64px", display: "flex", gap: "40px", flexWrap: "wrap" }}
          >
            {[
              { val: "10×", label: "Faster workflows" },
              { val: "0", label: "Manual tasks" },
              { val: "24/7", label: "Automation runs" },
            ].map(s => (
              <div key={s.label}>
                <p
                  className="prismatic-text"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.9rem",
                    margin: "0 0 4px",
                    lineHeight: 1,
                  }}
                >
                  {s.val}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "10px",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "var(--text-muted)",
                    margin: 0,
                  }}
                >
                  {s.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* ── Right: physics lanyard card ─────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.3 }}
        style={{
          height: "100vh",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Suspense fallback={null}>
          <LanyardCard />
        </Suspense>
        {/* Drag hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.6 }}
          style={{
            position: "absolute",
            bottom: "80px",
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: "10px",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "var(--text-muted)",
            fontFamily: "var(--font-body)",
            pointerEvents: "none",
            whiteSpace: "nowrap",
          }}
        >
          drag me
        </motion.p>
      </motion.div>

      {/* Bottom fade */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "120px",
          background: "linear-gradient(to bottom, transparent, var(--bg))",
          pointerEvents: "none",
          zIndex: 5,
        }}
      />
    </section>
  );
}
