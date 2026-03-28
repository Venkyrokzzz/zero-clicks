"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { DEMO_SCENARIOS, DEMO_PAGE, DemoScenario } from "@/lib/content";
import DemoScenarioCard from "./DemoScenarioCard";
import DemoProcessingPanel from "./DemoProcessingPanel";

const ease = [0.25, 0.1, 0.25, 1.0] as const;

export default function DemoCommandCentre() {
  const [activeScenario, setActiveScenario] = useState<DemoScenario | null>(null);

  return (
    <section
      style={{
        padding: "0 48px 80px",
        borderTop: "1px solid var(--border)",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Value prop banner */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease }}
          style={{
            textAlign: "center",
            padding: "40px 0 48px",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.1rem, 2vw, 1.4rem)",
              color: "var(--text-secondary)",
              margin: 0,
              fontStyle: "italic",
            }}
          >
            &ldquo;{DEMO_PAGE.valueProposition}&rdquo;
          </p>
        </motion.div>

        {/* Split panel */}
        <div
          className="grid grid-cols-1 lg:grid-cols-12"
          style={{ gap: "24px", alignItems: "start" }}
        >
          {/* Left — Scenario cards */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease }}
            className="lg:col-span-5"
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--text-muted)",
                margin: "0 0 8px",
              }}
            >
              Incoming Signals — 6 unread
            </p>
            {DEMO_SCENARIOS.map((scenario, i) => (
              <DemoScenarioCard
                key={scenario.id}
                scenario={scenario}
                isActive={activeScenario?.id === scenario.id}
                onClick={() => setActiveScenario(scenario)}
                index={i}
              />
            ))}
          </motion.div>

          {/* Right — Processing panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease, delay: 0.1 }}
            className="lg:col-span-7"
          >
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--text-muted)",
                margin: "0 0 8px",
              }}
            >
              AI Agent — Live Processing
            </p>
            <DemoProcessingPanel scenario={activeScenario} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
