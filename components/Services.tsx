"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { SERVICES, SERVICES_ALSO } from "@/lib/content";
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
    <section id="services" style={{ borderTop: "1px solid var(--border)", padding: "80px 48px", position: "relative", background: "transparent" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease }}
          style={{ marginBottom: "40px", display: "flex", justifyContent: "flex-end" }}
        >
          <div style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)", fontSize: "13px" }}>
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
        {/* Also automate strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease, delay: 0.4 }}
          style={{
            marginTop: "40px",
            padding: "20px 28px",
            borderRadius: "12px",
            border: "1px solid var(--border)",
            background: "rgba(255,255,255,0.02)",
            display: "flex",
            flexWrap: "wrap" as const,
            alignItems: "center",
            gap: "12px",
          }}
        >
          <span style={{ fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "var(--text-muted)", fontFamily: "var(--font-mono)", whiteSpace: "nowrap" as const }}>
            Also automate:
          </span>
          {SERVICES_ALSO.map((item, i) => (
            <span
              key={item}
              style={{
                fontSize: "12px",
                color: "var(--text-secondary)",
                fontFamily: "var(--font-body)",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              {item}
              {i < SERVICES_ALSO.length - 1 && (
                <span style={{ width: "3px", height: "3px", borderRadius: "50%", background: "var(--border-mid)", display: "inline-block" }} />
              )}
            </span>
          ))}
        </motion.div>

      </div>
    </section>
  );
}

