"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { DEMO_SCENARIOS } from "@/lib/content";

export default function DemoStrip() {
  const [hovered, setHovered] = useState(false);
  const scenario = DEMO_SCENARIOS[0]; // TripAdvisor complaint

  const codeSnippet = `
// 01. Ingest
const trigger = await n8n.webhook.listen({
  source: 'TRIPADVISOR',
  priority: 'HIGH'
});

// 02. Classify & Analyze
const analysis = await claude.analyze({
  text: trigger.fullText,
  model: 'claude-3-haiku'
});
if (analysis.sentiment === 'NEGATIVE') {
  await slack.alert(admin, analysis.summary);
}

// 03. Execute Action
const draft = await claude.draft({
  context: analysis,
  tone: 'warm, apologetic, human',
  signOff: 'Sarah, The Red Lion'
});
await draft.send();
`.trim();

  return (
    <section style={{ padding: "140px 48px", borderTop: "1px solid var(--border)" }}>
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
        }}
        className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center"
      >
        {/* Text Content */}
        <div>
          <p style={{
            fontSize: "13px", fontFamily: "var(--font-mono)", color: "var(--text-muted)", marginBottom: "16px"
          }}>
            // 04 Live Execution
          </p>
          <h2 style={{
            fontFamily: "var(--font-display)", fontWeight: 600, letterSpacing: "-0.03em",
            fontSize: "clamp(2rem, 3vw, 2.5rem)", color: "var(--text-primary)",
            margin: "0 0 24px", lineHeight: 1.1,
          }}>
            Watch the engine handle a 1-star review.
          </h2>
          <p style={{
            fontFamily: "var(--font-body)", fontWeight: 400,
            fontSize: "1rem", color: "var(--text-secondary)", lineHeight: 1.6,
            marginBottom: "40px"
          }}>
            The AI processes the live TripAdvisor review, classifies the sentiment, alerts the team, and drafts a warm, personalized resolution — instantly.
          </p>
          
          <Link
            href="/demo"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: hovered ? "var(--text-primary)" : "var(--bg-surface)",
              color: hovered ? "#000" : "var(--text-primary)",
              border: hovered ? "1px solid var(--text-primary)" : "1px solid var(--border)",
              padding: "12px 24px",
              borderRadius: "8px",
              fontSize: "13px",
              fontFamily: "var(--font-body)",
              fontWeight: 600,
              textDecoration: "none",
              transition: "all 0.2s ease",
            }}
          >
            Run Demo Script <span style={{ fontFamily: "var(--font-mono)" }}>↵</span>
          </Link>
        </div>

        {/* Code Editor Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            background: "var(--bg-surface)",
            border: "1px solid var(--border-strong)",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 24px 48px rgba(0,0,0,0.5)",
          }}
        >
          {/* Editor Header */}
          <div style={{
            display: "flex", alignItems: "center", padding: "12px 16px",
            borderBottom: "1px solid var(--border)", background: "rgba(255,255,255,0.02)"
          }}>
            <div style={{ display: "flex", gap: "6px" }}>
              <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#FF5F56" }} />
              <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#FFBD2E" }} />
              <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#27C93F" }} />
            </div>
            <div style={{ marginLeft: "16px", fontSize: "12px", fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>
              workflow.ts
            </div>
          </div>

          {/* Editor Body */}
          <div style={{ padding: "24px", overflowX: "auto" }}>
            <pre style={{ margin: 0, fontFamily: "var(--font-mono)", fontSize: "13px", lineHeight: 1.6 }}>
              <code style={{ color: "var(--text-secondary)" }}>
                {codeSnippet.split('\\n').map((line, i) => {
                  let color = "var(--text-secondary)";
                  if (line.startsWith('//')) color = "var(--text-muted)";
                  else if (line.includes('const') || line.includes('await') || line.includes('if')) color = "var(--accent)";
                  else if (line.includes("'") || line.includes('"')) color = "#A6E22E"; // String like color
                  
                  return (
                    <div key={i} style={{ display: "flex", gap: "16px" }}>
                      <span style={{ color: "var(--text-muted)", opacity: 0.5, userSelect: "none" }}>{String(i + 1).padStart(2, '0')}</span>
                      <span style={{ color }}>{line}</span>
                    </div>
                  );
                })}
              </code>
            </pre>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
