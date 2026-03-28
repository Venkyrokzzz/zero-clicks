"use client";

import { motion } from "framer-motion";
import { DEMO_PAGE } from "@/lib/content";

const ease = [0.25, 0.1, 0.25, 1.0] as const;

export default function DemoHero() {
  return (
    <section
      style={{
        padding: "140px 48px 80px",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease }}
        style={{ maxWidth: "640px" }}
      >
        <p
          style={{
            fontSize: "11px",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--accent)",
            marginBottom: "12px",
            fontFamily: "var(--font-body)",
            fontWeight: 600,
          }}
        >
          {DEMO_PAGE.hero.eyebrow}
        </p>

        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 400,
            fontSize: "clamp(2rem, 4vw, 3rem)",
            color: "var(--text-primary)",
            margin: "0 0 16px",
            lineHeight: 1.1,
          }}
        >
          {DEMO_PAGE.hero.headline}
        </h1>

        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "1rem",
            color: "var(--text-secondary)",
            lineHeight: 1.75,
            margin: "0 0 32px",
          }}
        >
          {DEMO_PAGE.hero.subtext}
        </p>

        {/* Pub context bar */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease, delay: 0.2 }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            background: "var(--bg-card)",
            border: "1px solid var(--border-mid)",
            borderRadius: "8px",
            padding: "10px 16px",
          }}
        >
          <span style={{ fontSize: "18px" }}>🍺</span>
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "13px",
              color: "var(--text-primary)",
              fontWeight: 500,
            }}
          >
            {DEMO_PAGE.hero.pubName}
          </span>
          <span
            style={{
              width: "1px",
              height: "14px",
              background: "var(--border-mid)",
            }}
          />
          <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <motion.div
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#10b981",
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "11px",
                color: "#10b981",
                fontWeight: 600,
                letterSpacing: "0.05em",
              }}
            >
              {DEMO_PAGE.hero.pubStatus}
            </span>
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
}
