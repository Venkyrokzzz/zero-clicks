"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";

const ease = [0.25, 0.1, 0.25, 1.0] as const;

const PRODUCT_STEPS = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
      </svg>
    ),
    label: "Review comes in",
    detail: "A customer leaves a review on your Google Business Profile — 5 stars, 1 star, anything.",
    tag: "Instant",
    tagColor: "#10b981",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
      </svg>
    ),
    label: "AI drafts a reply",
    detail: "Zero Clicks reads the review and writes a reply in your pub's voice — not a template. Under 30 seconds.",
    tag: "< 30 sec",
    tagColor: "#6366f1",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.86 13a19.79 19.79 0 01-3.07-8.67A2 2 0 012.81 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L7 9.91a16 16 0 006 6l1.07-1.07a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
      </svg>
    ),
    label: "You get a ping",
    detail: "We send you a quick notification. Read the draft. If it looks right, you're done — tap approve.",
    tag: "One tap",
    tagColor: "#f59e0b",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    ),
    label: "Reply goes live",
    detail: "It posts to Google immediately. Or switch to auto-send for 4–5 star reviews so you don't even see it.",
    tag: "Done",
    tagColor: "#10b981",
  },
];

const ONBOARDING_STEPS = [
  {
    number: "01",
    title: "Claim your spot",
    description: "Book a free 15-minute call or fill in the sign-up form below. Tell us your pub name and Google profile — that's all we need to get started.",
    callout: "No card details. No commitment.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
      </svg>
    ),
  },
  {
    number: "02",
    title: "We build it for you",
    description: "We connect your Google reviews, set your AI's tone and signature, and run test drafts using your real reviews. You see everything before it goes anywhere.",
    callout: "48 hours. You do nothing.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
      </svg>
    ),
  },
  {
    number: "03",
    title: "Watch it reply",
    description: "We do a 20-minute screen-share. You see the AI draft a real reply to a real review from your pub — in your voice. You approve one live so you feel how it works.",
    callout: "This is the moment it clicks.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/>
      </svg>
    ),
  },
  {
    number: "04",
    title: "Pay only when it's live",
    description: "The moment you're happy — it goes live. That's when the £35/month starts. Not before. If it's not working to your standard, you owe us nothing.",
    callout: "£35/mo · price locked for life · cancel any time",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
    ),
  },
];

const FAQS = [
  {
    q: "Do I need to be technical?",
    a: "No. You give us your pub name and access to your Google Business Profile. We handle everything else. If you can tap approve on your phone, you can use Zero Clicks.",
  },
  {
    q: "What do I actually need to get started?",
    a: "A Google Business Profile with reviews coming in. That's it. We connect to it, watch for new reviews, and handle the rest.",
  },
  {
    q: "How long does setup take?",
    a: "48 hours from your qualifying call to your first draft reply. We move fast because you shouldn't have to wait.",
  },
  {
    q: "What if the replies don't sound like me?",
    a: "We tune it until they do — before anything goes live. You read every draft during setup. If the voice isn't right, we adjust it. You don't approve a single reply until you're happy.",
  },
  {
    q: "What about bad reviews?",
    a: "1 and 2-star reviews are never auto-sent. They get flagged to you immediately with a draft you can edit or rewrite before it posts. You stay in control of the sensitive ones.",
  },
  {
    q: "What if I want to cancel?",
    a: "Cancel any time. No notice period, no penalty. The founding offer locks in your £35/mo rate for as long as you stay — you just lose the price lock if you leave.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{
        borderBottom: "1px solid var(--border)",
        padding: "20px 0",
        cursor: "pointer",
      }}
      onClick={() => setOpen((v) => !v)}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px" }}>
        <p style={{
          fontFamily: "var(--font-body)",
          fontSize: "1rem",
          fontWeight: 600,
          color: "var(--text-primary)",
          margin: 0,
          lineHeight: 1.5,
        }}>
          {q}
        </p>
        <div style={{
          flexShrink: 0,
          width: "24px",
          height: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "50%",
          border: "1px solid var(--border)",
          transition: "transform 0.3s ease",
          transform: open ? "rotate(45deg)" : "none",
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14"/>
          </svg>
        </div>
      </div>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        style={{ overflow: "hidden" }}
      >
        <p style={{
          fontFamily: "var(--font-body)",
          fontSize: "0.95rem",
          color: "var(--text-secondary)",
          lineHeight: 1.7,
          marginTop: "12px",
          marginBottom: 0,
        }}>
          {a}
        </p>
      </motion.div>
    </div>
  );
}

export default function HowItWorksFullPage() {
  const productRef = useRef<HTMLDivElement>(null);
  const onboardingRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const productInView = useInView(productRef, { once: true, margin: "-80px" });
  const onboardingInView = useInView(onboardingRef, { once: true, margin: "-80px" });
  const faqInView = useInView(faqRef, { once: true, margin: "-80px" });
  const ctaInView = useInView(ctaRef, { once: true, margin: "-80px" });

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", paddingTop: "80px" }}>

      {/* ── Hero ── */}
      <section style={{ padding: "80px 24px 64px", maxWidth: "960px", margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
        >
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            padding: "5px 14px", borderRadius: "9999px",
            border: "1px solid rgba(16,185,129,0.25)", background: "rgba(16,185,129,0.06)",
            marginBottom: "28px",
          }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10b981" }} />
            <span style={{ fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "#10b981", fontWeight: 600, fontFamily: "var(--font-mono)" }}>
              How it works
            </span>
          </div>

          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2.2rem, 5vw, 3.6rem)",
            fontWeight: 800,
            letterSpacing: "-0.04em",
            lineHeight: 1.08,
            color: "var(--text-primary)",
            margin: "0 0 20px",
          }}>
            Your reviews get answered.<br />
            <span style={{ opacity: 0.45 }}>You stay on the floor.</span>
          </h1>

          <p style={{
            fontFamily: "var(--font-body)",
            fontSize: "1.1rem",
            color: "var(--text-secondary)",
            lineHeight: 1.7,
            maxWidth: "560px",
            margin: "0 0 40px",
          }}>
            Zero Clicks watches your Google Business Profile, drafts replies in your voice, and posts them — automatically or with one tap from you. Here&apos;s exactly how it works and how to get started.
          </p>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Link href="/sign-up" style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              padding: "13px 24px", borderRadius: "8px",
              background: "#10b981", color: "#000",
              fontSize: "14px", fontWeight: 700, textDecoration: "none",
              fontFamily: "var(--font-body)",
            }}>
              Claim a founding spot →
            </Link>
            <Link href="/demo" style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              padding: "13px 24px", borderRadius: "8px",
              background: "transparent", color: "rgba(255,255,255,0.6)",
              fontSize: "14px", fontWeight: 500, textDecoration: "none",
              border: "1px solid rgba(255,255,255,0.1)",
              fontFamily: "var(--font-body)",
            }}>
              See a live demo first
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── Product Flow ── */}
      <section
        ref={productRef}
        style={{
          padding: "80px 24px",
          borderTop: "1px solid var(--border)",
          maxWidth: "960px",
          margin: "0 auto",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={productInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease }}
          style={{ marginBottom: "56px" }}
        >
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase" as const, letterSpacing: "0.1em", margin: "0 0 12px" }}>
            // What happens, day-to-day
          </p>
          <h2 style={{
            fontFamily: "var(--font-display)", fontWeight: 700,
            fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
            letterSpacing: "-0.03em", color: "var(--text-primary)", margin: 0,
          }}>
            From review to reply in under a minute
          </h2>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={productInView ? "visible" : "hidden"}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "24px",
            position: "relative",
          }}
        >
          {PRODUCT_STEPS.map((step, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [...ease] } },
              }}
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border)",
                borderRadius: "14px",
                padding: "28px 24px",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                position: "relative",
              }}
            >
              {/* Connector arrow between cards — visible on md+ */}
              {i < PRODUCT_STEPS.length - 1 && (
                <div style={{
                  position: "absolute",
                  right: "-13px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 2,
                  color: "var(--text-muted)",
                  display: "flex",
                  alignItems: "center",
                }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </div>
              )}

              <div style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                width: "44px", height: "44px", borderRadius: "12px",
                background: `${step.tagColor}18`,
                border: `1px solid ${step.tagColor}35`,
                color: step.tagColor,
              }}>
                {step.icon}
              </div>

              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                  <h3 style={{
                    fontFamily: "var(--font-display)", fontWeight: 700,
                    fontSize: "1rem", color: "var(--text-primary)", margin: 0,
                  }}>
                    {step.label}
                  </h3>
                  <span style={{
                    fontFamily: "var(--font-mono)", fontSize: "10px", fontWeight: 700,
                    color: step.tagColor, background: `${step.tagColor}18`,
                    border: `1px solid ${step.tagColor}30`,
                    padding: "2px 8px", borderRadius: "9999px",
                  }}>
                    {step.tag}
                  </span>
                </div>
                <p style={{
                  fontFamily: "var(--font-body)", fontSize: "0.9rem",
                  color: "var(--text-secondary)", lineHeight: 1.6, margin: 0,
                }}>
                  {step.detail}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── Onboarding Journey ── */}
      <section
        ref={onboardingRef}
        style={{
          padding: "80px 24px",
          borderTop: "1px solid var(--border)",
          background: "rgba(255,255,255,0.015)",
        }}
      >
        <div style={{ maxWidth: "760px", margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={onboardingInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease }}
            style={{ marginBottom: "56px" }}
          >
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase" as const, letterSpacing: "0.1em", margin: "0 0 12px" }}>
              // How to register
            </p>
            <h2 style={{
              fontFamily: "var(--font-display)", fontWeight: 700,
              fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
              letterSpacing: "-0.03em", color: "var(--text-primary)", margin: "0 0 16px",
            }}>
              From "interested" to live in 48 hours
            </h2>
            <p style={{
              fontFamily: "var(--font-body)", fontSize: "1rem",
              color: "var(--text-secondary)", lineHeight: 1.7, margin: 0,
            }}>
              No forms to fill in, no software to install. We do it for you — and you pay nothing until you&apos;ve seen it work on your real reviews.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate={onboardingInView ? "visible" : "hidden"}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15 } } }}
            style={{ display: "flex", flexDirection: "column", gap: "0" }}
          >
            {ONBOARDING_STEPS.map((step, i) => (
              <motion.div
                key={i}
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [...ease] } },
                }}
                style={{ display: "flex", gap: "24px", position: "relative" }}
              >
                {/* Vertical line */}
                {i < ONBOARDING_STEPS.length - 1 && (
                  <div style={{
                    position: "absolute",
                    left: "20px",
                    top: "52px",
                    bottom: "0",
                    width: "1px",
                    background: "linear-gradient(to bottom, var(--border), transparent)",
                  }} />
                )}

                {/* Number bubble */}
                <div style={{ flexShrink: 0, paddingTop: "4px" }}>
                  <div style={{
                    width: "40px", height: "40px",
                    borderRadius: "50%",
                    background: i === 3 ? "rgba(16,185,129,0.15)" : "var(--bg-surface)",
                    border: i === 3 ? "1px solid rgba(16,185,129,0.4)" : "1px solid var(--border)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: i === 3 ? "#10b981" : "var(--text-muted)",
                    position: "relative", zIndex: 1,
                  }}>
                    {step.icon}
                  </div>
                </div>

                {/* Content */}
                <div style={{ paddingBottom: "40px", flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                    <span style={{
                      fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--text-muted)",
                    }}>
                      {step.number}
                    </span>
                    <h3 style={{
                      fontFamily: "var(--font-display)", fontWeight: 700,
                      fontSize: "1.15rem", color: "var(--text-primary)", margin: 0,
                    }}>
                      {step.title}
                    </h3>
                  </div>
                  <p style={{
                    fontFamily: "var(--font-body)", fontSize: "0.95rem",
                    color: "var(--text-secondary)", lineHeight: 1.7,
                    margin: "0 0 10px",
                  }}>
                    {step.description}
                  </p>
                  <span style={{
                    display: "inline-block",
                    fontFamily: "var(--font-mono)", fontSize: "11px", fontWeight: 600,
                    color: i === 3 ? "#10b981" : "var(--text-muted)",
                    background: i === 3 ? "rgba(16,185,129,0.08)" : "rgba(255,255,255,0.03)",
                    border: `1px solid ${i === 3 ? "rgba(16,185,129,0.25)" : "var(--border)"}`,
                    padding: "4px 12px", borderRadius: "9999px",
                  }}>
                    {step.callout}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── What you need ── */}
      <section style={{ padding: "64px 24px", borderTop: "1px solid var(--border)", maxWidth: "960px", margin: "0 auto" }}>
        <div style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          padding: "40px 36px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "40px",
        }}
        className="requirements-grid"
        >
          <div>
            <h3 style={{
              fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.2rem",
              color: "var(--text-primary)", margin: "0 0 20px",
            }}>
              What you need to get started
            </h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
              {[
                "A Google Business Profile (with reviews)",
                "Owner or manager-level access to it",
                "15 minutes for a qualifying call",
                "That's it — we handle the rest",
              ].map((item, i) => (
                <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontFamily: "var(--font-body)", fontSize: "0.95rem", color: "var(--text-secondary)" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" style={{ marginTop: "3px", flexShrink: 0 }}>
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 style={{
              fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.2rem",
              color: "var(--text-primary)", margin: "0 0 20px",
            }}>
              You do not need
            </h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
              {[
                "Any technical knowledge",
                "To install any software",
                "To pay anything upfront",
                "To write a single reply yourself",
              ].map((item, i) => (
                <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontFamily: "var(--font-body)", fontSize: "0.95rem", color: "var(--text-secondary)" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" style={{ marginTop: "3px", flexShrink: 0 }}>
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <style>{`
          @media (max-width: 640px) {
            .requirements-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </section>

      {/* ── FAQ ── */}
      <section
        ref={faqRef}
        style={{
          padding: "80px 24px",
          borderTop: "1px solid var(--border)",
          maxWidth: "760px",
          margin: "0 auto",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={faqInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease }}
          style={{ marginBottom: "40px" }}
        >
          <h2 style={{
            fontFamily: "var(--font-display)", fontWeight: 700,
            fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
            letterSpacing: "-0.03em", color: "var(--text-primary)", margin: 0,
          }}>
            Common questions
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={faqInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {FAQS.map((faq, i) => (
            <FAQItem key={i} q={faq.q} a={faq.a} />
          ))}
        </motion.div>
      </section>

      {/* ── CTA ── */}
      <section
        ref={ctaRef}
        style={{
          padding: "80px 24px",
          borderTop: "1px solid var(--border)",
          background: "rgba(16,185,129,0.03)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={ctaInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease }}
          style={{ maxWidth: "640px", margin: "0 auto", textAlign: "center" }}
        >
          <h2 style={{
            fontFamily: "var(--font-display)", fontWeight: 800,
            fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
            letterSpacing: "-0.03em", color: "var(--text-primary)", margin: "0 0 16px",
          }}>
            Ready to stop writing reviews yourself?
          </h2>
          <p style={{
            fontFamily: "var(--font-body)", fontSize: "1.05rem",
            color: "var(--text-secondary)", lineHeight: 1.7, margin: "0 0 36px",
          }}>
            7 of 10 founding spots remaining. We build it free — you pay £35/month only when it&apos;s live and working on your real reviews.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/sign-up" style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              padding: "15px 32px", borderRadius: "8px",
              background: "#10b981", color: "#000",
              fontSize: "15px", fontWeight: 700, textDecoration: "none",
              fontFamily: "var(--font-body)",
              boxShadow: "0 0 32px rgba(16,185,129,0.3)",
            }}>
              Claim your spot →
            </Link>
            <Link href="/contact" style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              padding: "15px 28px", borderRadius: "8px",
              background: "transparent", color: "rgba(255,255,255,0.7)",
              fontSize: "15px", fontWeight: 500, textDecoration: "none",
              border: "1px solid rgba(255,255,255,0.12)",
              fontFamily: "var(--font-body)",
            }}>
              Book a 15-min call instead
            </Link>
          </div>
          <p style={{
            fontFamily: "var(--font-mono)", fontSize: "11px",
            color: "var(--text-muted)", margin: "20px 0 0",
          }}>
            No card required · No commitment · Cancel any time
          </p>
        </motion.div>
      </section>
    </div>
  );
}
