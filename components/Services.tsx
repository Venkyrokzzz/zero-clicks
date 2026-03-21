// components/Services.tsx
"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { SERVICES, type Service } from "@/lib/content";

const ease = [0.25, 0.1, 0.25, 1.0] as const;

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1.0] },
  },
};

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const [hovered, setHovered] = useState(false);
  const num = String(index + 1).padStart(2, "0");

  return (
    <motion.div
      variants={cardVariants}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: "var(--bg-surface)",
        border: `1px solid ${hovered ? "var(--border-light)" : "var(--border)"}`,
        padding: "32px",
        borderRadius: 0,
        position: "relative",
        transition: "border-color 200ms ease",
      }}
    >
      <span
        style={{
          position: "absolute",
          top: "16px",
          right: "16px",
          fontSize: "10px",
          color: "var(--text-muted)",
          letterSpacing: "0.1em",
          fontFamily: "var(--font-body)",
          fontWeight: 500,
        }}
      >
        {num}
      </span>

      <div
        style={{
          width: "32px",
          height: "2px",
          backgroundColor: "var(--accent)",
          marginBottom: "24px",
        }}
      />

      <h3
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 400,
          fontSize: "1.1rem",
          color: "var(--text-primary)",
          marginBottom: "12px",
          lineHeight: 1.3,
        }}
      >
        {service.title}
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
        {service.description}
      </p>
    </motion.div>
  );
}

export default function Services() {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-80px" });
  const gridRef = useRef<HTMLDivElement>(null);
  const gridInView = useInView(gridRef, { once: true, margin: "-80px" });

  return (
    <section
      id="services"
      style={{ padding: "128px 24px" }}
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
            Services
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
            What we build
          </h2>
        </motion.div>

        <motion.div
          ref={gridRef}
          variants={containerVariants}
          initial="hidden"
          animate={gridInView ? "visible" : "hidden"}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1px",
            backgroundColor: "var(--border)",
          }}
        >
          {SERVICES.map((service, i) => (
            <ServiceCard key={service.title} service={service} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
