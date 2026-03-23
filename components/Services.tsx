// components/Services.tsx
"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { SERVICES, type Service } from "@/lib/content";
import Link from "next/link";

const ease = [0.25, 0.1, 0.25, 1.0] as const;

const tags = ["Workflow", "CRM & Leads", "AI Pipeline"];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1.0] } },
};

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const [hovered, setHovered] = useState(false);
  const [tilt, setTilt] = useState("perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0px)");
  const num = String(index + 1).padStart(2, "0");

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt(`perspective(900px) rotateX(${-y * 10}deg) rotateY(${x * 10}deg) translateZ(10px)`);
  };

  return (
    <Link href={`/contact?service=${encodeURIComponent(service.title)}`} style={{ textDecoration: "none", display: "block" }}>
      <motion.div
        variants={cardVariants}
        onMouseEnter={() => setHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { setHovered(false); setTilt("perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0px)"); }}
      style={{
        background: hovered ? "var(--bg-hover)" : "var(--bg-card)",
        border: `1px solid ${hovered ? "var(--border-mid)" : "var(--border)"}`,
        borderRadius: "10px",
        padding: "28px",
        position: "relative",
        transition: "background 200ms ease, border-color 200ms ease, transform 200ms ease, box-shadow 200ms ease",
        cursor: "default",
        transform: tilt,
        boxShadow: hovered ? "0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(59,130,246,0.08)" : "none",
        willChange: "transform",
      }}
    >
      {/* Number */}
      <span
        style={{
          position: "absolute",
          top: "18px",
          right: "18px",
          fontSize: "10px",
          color: "var(--text-muted)",
          fontFamily: "var(--font-body)",
          letterSpacing: "0.1em",
          fontWeight: 600,
        }}
      >
        {num}
      </span>

      {/* Tag chip */}
      <span
        style={{
          display: "inline-block",
          fontSize: "10px",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: hovered ? "var(--accent)" : "var(--text-muted)",
          background: hovered ? "var(--accent-dim)" : "transparent",
          border: `1px solid ${hovered ? "var(--accent)" : "var(--border)"}`,
          padding: "3px 8px",
          borderRadius: "4px",
          fontFamily: "var(--font-body)",
          fontWeight: 600,
          marginBottom: "20px",
          transition: "all 200ms ease",
        }}
      >
        {tags[index] ?? "Automation"}
      </span>

      <h3
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 400,
          fontSize: "1.15rem",
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
          lineHeight: 1.75,
          margin: 0,
        }}
      >
        {service.description}
      </p>

      {/* Get started link */}
      <div
        style={{
          marginTop: "20px",
          color: "var(--accent)",
          fontSize: "12px",
          fontFamily: "var(--font-body)",
          fontWeight: 600,
          opacity: hovered ? 1 : 0,
          transform: hovered ? "translateY(0)" : "translateY(5px)",
          transition: "all 0.3s ease",
        }}
      >
        → Get started
      </div>

      {/* Hover accent bottom line */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: "28px",
          right: "28px",
          height: "1px",
          background: "var(--accent)",
          opacity: hovered ? 0.5 : 0,
          transition: "opacity 200ms ease",
          borderRadius: "1px",
        }}
      />
      </motion.div>
    </Link>
  );
}

export default function Services() {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-80px" });
  const gridRef = useRef<HTMLDivElement>(null);
  const gridInView = useInView(gridRef, { once: true, margin: "-80px" });

  return (
    <section id="services" style={{ padding: "120px 48px", position: "relative" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease }}
          style={{ marginBottom: "56px" }}
        >
          <p style={{
            fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase",
            color: "var(--accent)", marginBottom: "12px", fontFamily: "var(--font-body)", fontWeight: 600,
          }}>
            Services
          </p>
          <h2 style={{
            fontFamily: "var(--font-display)", fontWeight: 400,
            fontSize: "clamp(1.8rem, 3vw, 2.6rem)", color: "var(--text-primary)", margin: 0, lineHeight: 1.15,
          }}>
            What we build
          </h2>
        </motion.div>

        <motion.div
          ref={gridRef}
          variants={containerVariants}
          initial="hidden"
          animate={gridInView ? "visible" : "hidden"}
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}
        >
          {SERVICES.map((service, i) => (
            <ServiceCard key={service.title} service={service} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
