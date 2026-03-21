// components/HowItWorks.tsx
"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { STEPS } from "@/lib/content";

const ease = [0.25, 0.1, 0.25, 1.0] as const;

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const stepVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1.0] },
  },
};

export default function HowItWorks() {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-80px" });
  const bodyRef = useRef<HTMLDivElement>(null);
  const bodyInView = useInView(bodyRef, { once: true, margin: "-80px" });

  return (
    <section
      id="how-it-works"
      className="border-t"
      style={{
        borderColor: "var(--border)",
        padding: "128px 24px",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 24 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease }}
          style={{ marginBottom: "64px" }}
        >
          <p
            style={{
              fontSize: "11px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "var(--accent)",
              marginBottom: "16px",
              fontFamily: "var(--font-body)",
              fontWeight: 500,
            }}
          >
            Process
          </p>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 400,
              fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
              color: "var(--text-primary)",
              margin: 0,
              lineHeight: 1.15,
            }}
          >
            How it works
          </h2>
        </motion.div>

        <motion.div
          ref={bodyRef}
          variants={containerVariants}
          initial="hidden"
          animate={bodyInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-3"
        >
          {STEPS.map((step, i) => (
            <motion.div
              key={step.number}
              variants={stepVariants}
              className={[
                "py-8 md:py-0",
                i < STEPS.length - 1
                  ? "border-b md:border-b-0 md:border-r md:pr-10 md:mr-10"
                  : "",
              ].join(" ")}
              style={{ borderColor: "var(--border)" }}
            >
              <span
                style={{
                  display: "block",
                  fontFamily: "var(--font-body)",
                  fontWeight: 500,
                  fontSize: "11px",
                  letterSpacing: "0.12em",
                  color: "var(--accent)",
                  marginBottom: "24px",
                }}
              >
                {step.number}
              </span>

              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 400,
                  fontSize: "1.4rem",
                  color: "var(--text-primary)",
                  marginBottom: "16px",
                  lineHeight: 1.2,
                }}
              >
                {step.title}
              </h3>

              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontWeight: 400,
                  fontSize: "0.9rem",
                  color: "var(--text-secondary)",
                  lineHeight: 1.7,
                  margin: 0,
                }}
              >
                {step.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
