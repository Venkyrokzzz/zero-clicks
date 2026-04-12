"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

const FAQS = [
  {
    q: "How does it connect to my tools?",
    a: "We use OAuth2 — the same secure login method your bank uses. You authorise the connection once, we never store your passwords. Works with Gmail, Google Sheets, Slack, Telegram, Notion, HubSpot, and most CRMs out of the box.",
  },
  {
    q: "Do I need to host it myself?",
    a: "No. We handle all the infrastructure. Your workflows run on a secure cloud server — always on, no maintenance needed. If you want self-hosted for data compliance reasons, we can do that too.",
  },
  {
    q: "What if something breaks?",
    a: "Every workflow has error handling and a dead letter queue. If something fails, we get an alert before you do. All packages include post-launch support — Starter gets 30 days, Pro gets 60. Monthly clients get same-day response indefinitely.",
  },
  {
    q: "How long does it take to set up?",
    a: "Starter workflows go live in 3 days. Pro packages take 7. We start with a 15-minute call to map your current process, then you see daily progress. Most clients are live before they expected to be.",
  },
  {
    q: "Do I need to know how to code?",
    a: "Not at all. We build everything and hand you a working system with documentation written in plain English. If you ever want to tweak something yourself, we'll walk you through it — but most clients never need to.",
  },
  {
    q: "Is my data secure?",
    a: "Yes. All credentials are encrypted at rest. We use OAuth2 where available, so we never see your passwords. Workflows run in isolated containers. If you're in a regulated industry, we can discuss GDPR-compliant self-hosted setups.",
  },
  {
    q: "What if I only need one thing automated?",
    a: "That's exactly what Starter is for. Most clients start with their inbox — it's usually the biggest drain. Then once they see what's possible, they come back for more. No commitment to anything beyond the first project.",
  },
];

export default function FAQ() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section
      ref={sectionRef}
      style={{
        borderTop: "1px solid var(--border)",
        padding: "80px 48px",
        background: "transparent",
      }}
    >
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
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
              Questions before you commit?
            </h2>
          </div>
          <div style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)", fontSize: "13px", paddingBottom: "6px" }}>
            // 07 FAQ
          </div>
        </motion.div>

        {/* Accordion */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          {FAQS.map((item, i) => (
            <FAQItem
              key={i}
              item={item}
              index={i}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              isInView={isInView}
            />
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          style={{
            fontSize: "13px",
            color: "var(--text-muted)",
            fontFamily: "var(--font-body)",
            textAlign: "center",
            marginTop: 48,
            marginBottom: 0,
          }}
        >
          Still have questions?{" "}
          <a
            href="mailto:zeroclicks.hq@gmail.com"
            style={{ color: "var(--text-primary)", textDecoration: "underline", textUnderlineOffset: "4px" }}
          >
            Email zeroclicks.hq@gmail.com
          </a>
          {" "}— usually replies within a few hours.
        </motion.p>
      </div>
    </section>
  );
}

function FAQItem({
  item,
  index,
  isOpen,
  onToggle,
  isInView,
}: {
  item: { q: string; a: string };
  index: number;
  isOpen: boolean;
  onToggle: () => void;
  isInView: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: isOpen
          ? "var(--bg-surface)"
          : hovered
          ? "rgba(255,255,255,0.02)"
          : "transparent",
        border: "1px solid",
        borderColor: isOpen ? "var(--border-mid)" : "var(--border)",
        borderRadius: "12px",
        overflow: "hidden",
        transition: "all 200ms ease",
      }}
    >
      <button
        onClick={onToggle}
        style={{
          width: "100%",
          background: "none",
          border: "none",
          padding: "24px 28px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "16px",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <span style={{
          fontFamily: "var(--font-body)",
          fontSize: "0.95rem",
          color: "var(--text-primary)",
          fontWeight: 500,
          lineHeight: 1.4,
        }}>
          {item.q}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          style={{
            color: "var(--text-muted)",
            fontSize: "20px",
            lineHeight: 1,
            flexShrink: 0,
            fontWeight: 300,
          }}
        >
          +
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <p style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.9rem",
              color: "var(--text-secondary)",
              lineHeight: 1.75,
              margin: 0,
              padding: "0 28px 24px",
            }}>
              {item.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
