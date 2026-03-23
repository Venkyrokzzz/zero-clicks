"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { SITE } from "@/lib/content";

const TESTIMONIALS = [
  {
    quote:
      "We used to spend the first 2 hours every morning just triaging emails. Now the AI does it overnight — I wake up to a sorted inbox and drafted replies waiting for me.",
    author: "James Whitfield",
    role: "Owner, The Anchor Inn",
    location: "Bristol, UK",
    initials: "JW",
    color: "#3b82f6",
  },
  {
    quote:
      "Venky built us a lead capture workflow in 3 days. It pulls enquiries from our website, enriches them, and drops them straight into our CRM. We've not missed a lead since.",
    author: "Sarah Chen",
    role: "Operations Manager, Meridian Events",
    location: "London, UK",
    initials: "SC",
    color: "#8b5cf6",
  },
  {
    quote:
      "I was sceptical about AI. But this isn't ChatGPT giving generic answers — it's a workflow that knows our pub, our tone, our regulars. It actually works.",
    author: "Mark O'Brien",
    role: "General Manager, The Feathers",
    location: "Manchester, UK",
    initials: "MO",
    color: "#10b981",
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
        padding: "120px 48px",
      }}
    >
      {/* Label */}
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
        transition={{ duration: 0.5 }}
        style={{
          color: "var(--accent)",
          fontSize: "11px",
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          fontFamily: "var(--font-body)",
          fontWeight: 700,
          margin: 0,
          marginBottom: 16,
        }}
      >
        WHAT CLIENTS SAY
      </motion.p>

      {/* Heading */}
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
        transition={{ duration: 0.5, delay: 0.05 }}
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(1.8rem, 3vw, 2.6rem)",
          fontWeight: 400,
          color: "var(--text-primary)",
          margin: 0,
        }}
      >
        Results that speak for themselves
      </motion.h2>

      {/* Cards grid */}
      <div
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        style={{ marginTop: 64 }}
      >
        {TESTIMONIALS.map((t, i) => (
          <TestimonialCard key={t.author} testimonial={t} delay={i * 0.1} isInView={isInView} />
        ))}
      </div>

      {/* Disclaimer note */}
      <p
        style={{
          fontSize: "11px",
          color: "var(--text-muted)",
          fontFamily: "var(--font-body)",
          fontStyle: "italic",
          textAlign: "center",
          marginTop: 32,
          marginBottom: 0,
        }}
      >
        * Placeholder testimonials — replace with real client quotes before launch
      </p>
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
  const { quote, author, role, location, initials, color } = testimonial;
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (cardRef.current) {
      cardRef.current.style.borderColor = color + "44";
      cardRef.current.style.boxShadow = `0 8px 32px ${color}18`;
    }
  };

  const handleMouseLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.borderColor = "var(--border-mid)";
      cardRef.current.style.boxShadow = "none";
    }
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.5, delay }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-mid)",
        borderRadius: 12,
        padding: 32,
        transition: "border-color 0.2s ease, box-shadow 0.2s ease",
      }}
    >
      {/* Quote mark */}
      <div
        style={{
          color: color,
          fontSize: 48,
          fontFamily: "var(--font-display)",
          opacity: 0.4,
          lineHeight: 1,
          marginBottom: 12,
        }}
      >
        &ldquo;
      </div>

      {/* Quote text */}
      <p
        style={{
          fontSize: "0.95rem",
          color: "var(--text-secondary)",
          lineHeight: 1.8,
          fontFamily: "var(--font-body)",
          fontStyle: "italic",
          margin: 0,
        }}
      >
        {quote}
      </p>

      {/* Divider + Author */}
      <div
        style={{
          borderTop: "1px solid var(--border)",
          marginTop: 24,
          paddingTop: 20,
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        {/* Avatar */}
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${color}, ${color}88)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 13,
            fontWeight: 700,
            color: "white",
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
              fontSize: "1rem",
              color: "var(--text-primary)",
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
