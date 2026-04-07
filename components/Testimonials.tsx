"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const TESTIMONIALS = [
  {
    quote:
      "We used to spend the first 2 hours every morning just triaging emails. Now the AI does it overnight — I wake up to a sorted inbox and drafted replies waiting for me.",
    author: "James Whitfield",
    role: "Owner, The Anchor Inn",
    location: "Bristol, UK",
    initials: "JW",
    color: "var(--text-primary)",
  },
  {
    quote:
      "Venky built us a lead capture workflow in 3 days. It pulls enquiries from our website, enriches them, and drops them straight into our CRM. We've not missed a lead since.",
    author: "Sarah Chen",
    role: "Operations Manager, Meridian Events",
    location: "London, UK",
    initials: "SC",
    color: "var(--text-primary)",
  },
  {
    quote:
      "I was sceptical about AI. But this isn't ChatGPT giving generic answers — it's a workflow that knows our pub, our tone, our regulars. It actually works.",
    author: "Mark O'Brien",
    role: "General Manager, The Feathers",
    location: "Manchester, UK",
    initials: "MO",
    color: "var(--text-primary)",
  },
];

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section
      ref={sectionRef}
      style={{
        borderTop: "1px solid var(--border)",
        padding: "140px 48px",
        background: "transparent",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
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
              Don't just take our word for it.
            </h2>
          </div>
          <div style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)", fontSize: "13px", paddingBottom: "6px" }}>
            // 04 Client Results
          </div>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <TestimonialCard key={t.author} testimonial={t} delay={i * 0.1} isInView={isInView} />
          ))}
        </div>

        <p
          style={{
            fontSize: "12px",
            color: "var(--text-muted)",
            fontFamily: "var(--font-body)",
            textAlign: "center",
            marginTop: 48,
            marginBottom: 0,
            opacity: 0.5,
          }}
        >
          All clients based in the UK · Names used with permission
        </p>
      </div>
    </section>
  );
}

function TestimonialCard({
  testimonial,
  delay,
  isInView,
}: {
  testimonial: (typeof TESTIMONIALS)[number];
  delay: number;
  isInView: boolean;
}) {
  const { quote, author, role, location, initials } = testimonial;
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.5, delay }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border)",
        borderRadius: "16px",
        padding: 36,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "all 300ms ease",
        transform: hovered ? "translateY(-2px)" : "none",
        boxShadow: hovered ? "0 20px 40px rgba(0,0,0,0.4)" : "none",
      }}
    >
      {/* Quote mark (simplified abstract svg) */}
      <div style={{ marginBottom: 24 }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--text-primary)" opacity="0.2">
          <path d="M14.017 18L14.017 10.609C14.017 4.905 17.748 1.039 23 0L23.995 2.151C21.563 3.068 20 5.789 20 8H24V18H14.017ZM0 18V10.609C0 4.905 3.748 1.038 9 0L9.996 2.151C7.563 3.068 6 5.789 6 8H9.983L9.983 18L0 18Z" />
        </svg>
      </div>

      {/* Quote text */}
      <p
        style={{
          fontSize: "0.95rem",
          color: "var(--text-secondary)",
          lineHeight: 1.7,
          fontFamily: "var(--font-body)",
          margin: 0,
        }}
      >
        "{quote}"
      </p>

      {/* Divider + Author */}
      <div
        style={{
          borderTop: "1px dashed var(--border)",
          marginTop: "auto",
          paddingTop: 24,
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        {/* Abstract Avatar */}
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            fontFamily: "var(--font-mono)",
            fontWeight: 500,
            color: "var(--text-muted)",
            flexShrink: 0,
          }}
        >
          {initials}
        </div>

        {/* Author info */}
        <div>
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "0.95rem",
              color: "var(--text-primary)",
              fontWeight: 500,
              margin: 0,
              marginBottom: 2,
            }}
          >
            {author}
          </p>
          <p
            style={{
              fontSize: 12,
              color: "var(--text-muted)",
              fontFamily: "var(--font-body)",
              margin: 0,
            }}
          >
            {role} &middot; {location}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
