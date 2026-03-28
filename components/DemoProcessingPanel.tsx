// components/DemoProcessingPanel.tsx
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DemoScenario } from "@/lib/content";

type Stage = "idle" | "reading" | "classifying" | "drafting" | "response" | "notifying";

interface Props {
  scenario: DemoScenario | null;
}

const STEPS: Array<{
  stage: Stage;
  icon: string;
  label: (s: DemoScenario) => string;
}> = [
  {
    stage: "reading",
    icon: "📥",
    label: (s) => `Reading incoming signal from ${s.source}...`,
  },
  {
    stage: "classifying",
    icon: "🔍",
    label: (s) => `Classifying: ${s.priority} priority — ${s.source.toLowerCase()} signal`,
  },
  {
    stage: "drafting",
    icon: "✍️",
    label: () => "Crafting response in The Red Lion's voice...",
  },
  {
    stage: "notifying",
    icon: "📱",
    label: (s) =>
      s.priority === "HIGH"
        ? "WhatsApp alert sent to Sarah (owner)"
        : "Handled automatically. Logged to dashboard.",
  },
];

const STAGE_ORDER: Stage[] = ["reading", "classifying", "drafting", "notifying"];

export default function DemoProcessingPanel({ scenario }: Props) {
  const [stage, setStage] = useState<Stage>("idle");
  const [aiResponse, setAiResponse] = useState<string>("");
  const [displayedResponse, setDisplayedResponse] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!scenario) return;

    setStage("reading");
    setAiResponse("");
    setDisplayedResponse("");
    setError("");
    setIsLoading(false);

    const timers: ReturnType<typeof setTimeout>[] = [];

    timers.push(setTimeout(() => setStage("classifying"), 800));
    timers.push(
      setTimeout(() => {
        setStage("drafting");
        setIsLoading(true);

        fetch("/api/demo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            systemPrompt: scenario.systemPrompt,
            fullText: scenario.fullText,
          }),
        })
          .then((r) => r.json())
          .then((data: { response?: string; error?: string }) => {
            setIsLoading(false);
            if (data.error) {
              setError(data.error);
              return;
            }
            setAiResponse(data.response ?? "");
            setStage("response");
          })
          .catch(() => {
            setIsLoading(false);
            setError("Network error. Please try again.");
          });
      }, 1800)
    );

    return () => timers.forEach(clearTimeout);
  }, [scenario]);

  useEffect(() => {
    if (!aiResponse) return;
    setDisplayedResponse("");
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayedResponse(aiResponse.slice(0, i));
      if (i >= aiResponse.length) {
        clearInterval(interval);
        setTimeout(() => setStage("notifying"), 400);
      }
    }, 18);
    return () => clearInterval(interval);
  }, [aiResponse]);

  const currentStageIndex = STAGE_ORDER.indexOf(
    stage === "response" ? "drafting" : stage
  );

  if (!scenario) {
    return (
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "12px",
          padding: "48px 32px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "440px",
          gap: "16px",
        }}
      >
        <div style={{ fontSize: "32px" }}>👈</div>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "14px",
            color: "var(--text-muted)",
            textAlign: "center",
            margin: 0,
          }}
        >
          Pick a scenario to watch the AI work
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-mid)",
        borderRadius: "12px",
        padding: "32px",
        minHeight: "440px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "32px" }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "8px",
            background: "var(--accent-dim)",
            border: "1px solid rgba(59,130,246,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "14px",
          }}
        >
          ⚡
        </div>
        <div>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 600,
              fontSize: "13px",
              color: "var(--text-primary)",
              margin: 0,
            }}
          >
            Claude AI — Red Lion Agent
          </p>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "11px",
              color: "var(--text-muted)",
              margin: 0,
            }}
          >
            {stage === "idle" ? "Ready" : "Processing..."}
          </p>
        </div>
      </div>

      {/* Steps */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px", flex: 1 }}>
        {STEPS.map((step) => {
          const stepIndex = STAGE_ORDER.indexOf(step.stage);
          const isPast = currentStageIndex > stepIndex;
          const isActive =
            stage === step.stage ||
            (step.stage === "drafting" && (stage === "response" || stage === "drafting"));

          if (stepIndex > currentStageIndex + 1) return null;

          return (
            <motion.div
              key={step.stage}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "12px",
                paddingLeft: isActive ? "4px" : "0",
                borderLeft: isActive
                  ? "2px solid var(--accent)"
                  : "2px solid transparent",
                transition: "padding-left 300ms ease, border-color 300ms ease",
              }}
            >
              <span style={{ fontSize: "14px", flexShrink: 0, marginTop: "1px" }}>
                {isPast ? "✅" : step.icon}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "13px",
                  color: isActive
                    ? "var(--text-primary)"
                    : isPast
                    ? "var(--text-secondary)"
                    : "var(--text-muted)",
                  lineHeight: 1.5,
                }}
              >
                {step.label(scenario)}
              </span>
            </motion.div>
          );
        })}

        {/* Loading spinner */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ display: "flex", alignItems: "center", gap: "10px", paddingLeft: "6px" }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  border: "2px solid var(--border-mid)",
                  borderTopColor: "var(--accent)",
                }}
              />
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "12px",
                  color: "var(--text-muted)",
                }}
              >
                Generating response...
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{
                padding: "12px 16px",
                borderRadius: "8px",
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.2)",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "12px",
                  color: "#f87171",
                  margin: 0,
                }}
              >
                {error}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* AI Response */}
        <AnimatePresence>
          {(stage === "response" || stage === "notifying") && displayedResponse && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              style={{
                padding: "20px",
                borderRadius: "8px",
                background: "var(--accent-dim)",
                border: "1px solid rgba(59,130,246,0.15)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                <span
                  style={{
                    fontSize: "9px",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase" as const,
                    color: "var(--accent)",
                    background: "rgba(59,130,246,0.12)",
                    padding: "3px 8px",
                    borderRadius: "4px",
                    border: "1px solid rgba(59,130,246,0.2)",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  AI Draft
                </span>
              </div>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "13px",
                  color: "var(--text-secondary)",
                  lineHeight: 1.75,
                  margin: "0 0 16px",
                  fontStyle: "italic",
                }}
              >
                {displayedResponse}
                {displayedResponse.length < aiResponse.length && (
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    style={{
                      display: "inline-block",
                      width: 2,
                      height: 14,
                      background: "var(--accent)",
                      marginLeft: 2,
                      verticalAlign: "middle",
                    }}
                  />
                )}
              </p>

              <AnimatePresence>
                {stage === "notifying" && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ display: "flex", gap: "8px" }}
                  >
                    <button
                      style={{
                        flex: 1,
                        padding: "8px 0",
                        borderRadius: "6px",
                        background: "var(--accent)",
                        border: "none",
                        color: "#fff",
                        fontSize: "12px",
                        fontWeight: 600,
                        cursor: "pointer",
                        fontFamily: "var(--font-body)",
                        transition: "opacity 150ms ease",
                      }}
                      onMouseEnter={(e) =>
                        ((e.currentTarget as HTMLElement).style.opacity = "0.85")
                      }
                      onMouseLeave={(e) =>
                        ((e.currentTarget as HTMLElement).style.opacity = "1")
                      }
                    >
                      ✉️ Send Response
                    </button>
                    <button
                      style={{
                        flex: 1,
                        padding: "8px 0",
                        borderRadius: "6px",
                        background: "transparent",
                        border: "1px solid var(--border-mid)",
                        color: "var(--text-secondary)",
                        fontSize: "12px",
                        fontWeight: 500,
                        cursor: "pointer",
                        fontFamily: "var(--font-body)",
                        transition: "border-color 150ms ease, color 150ms ease",
                      }}
                      onMouseEnter={(e) => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.borderColor = "var(--accent)";
                        el.style.color = "var(--accent)";
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.borderColor = "var(--border-mid)";
                        el.style.color = "var(--text-secondary)";
                      }}
                    >
                      ✏️ Edit First
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* WhatsApp notification for HIGH priority */}
        <AnimatePresence>
          {stage === "notifying" && scenario.priority === "HIGH" && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "12px 16px",
                borderRadius: "8px",
                background: "rgba(37,211,102,0.06)",
                border: "1px solid rgba(37,211,102,0.2)",
              }}
            >
              <span style={{ fontSize: "16px" }}>📱</span>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "12px",
                  color: "#4ade80",
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                <strong>WhatsApp alert sent to Sarah</strong>
                <br />
                "Hi Sarah — urgent {scenario.source.toLowerCase()} just in. I&apos;ve drafted a response. Tap to review."
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
