"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { SERVICES } from "@/lib/content";
import AntiGravityCard from "./AntiGravityCard";

const ease = [0.25, 0.1, 0.25, 1.0] as const;

const serviceIcons = ["✉️", "📊", "⚡"];
const serviceAccents = [
  "rgba(255, 100, 100, 1)",   // Email — red
  "rgba(56, 189, 248, 1)",    // CRM — cyan
  "rgba(192, 132, 252, 1)",   // AI — purple
];

export default function Services() {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-80px" });

  return (
    <section id="services" style={{ padding: "140px 48px", position: "relative" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease }}
          style={{ marginBottom: "64px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}
        >
          <div>
            <h2 style={{
              fontFamily: "var(--font-display)", fontWeight: 600, letterSpacing: "-0.03em",
              fontSize: "clamp(2rem, 4vw, 3rem)", color: "#f0f0f5", margin: 0, lineHeight: 1.1,
            }}>
              Automate the boring.
            </h2>
          </div>
          <div style={{ color: "rgba(120,120,140,0.6)", fontFamily: "var(--font-mono)", fontSize: "13px", paddingBottom: "6px" }}>
            // 01 Core Capabilities
          </div>
        </motion.div>

        {/* AntiGravity Cards Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "32px",
          }}
        >
          {SERVICES.map((service, i) => (
            <AntiGravityCard
              key={service.title}
              title={service.title}
              description={service.description}
              icon={serviceIcons[i]}
              delay={i * 0.15}
              accentColor={serviceAccents[i]}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

