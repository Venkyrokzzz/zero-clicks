// components/Services.tsx
"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { SERVICES, type Service } from "@/lib/content";

const ease = [0.25, 0.1, 0.25, 1.0] as const;

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, rotateX: 12 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1.0] },
  },
};

const prismColors = [
  "linear-gradient(135deg, #a8d8ff, #c4b5fd)",
  "linear-gradient(135deg, #c4b5fd, #f9a8d4)",
  "linear-gradient(135deg, #6ee7b7, #93c5fd)",
];

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const num = String(index + 1).padStart(2, "0");

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: -y * 13, y: x * 13 });
  };

  return (
    <motion.div
      variants={cardVariants}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setTilt({ x: 0, y: 0 }); setHovered(false); }}
      style={{ perspective: "1000px" }}
    >
      <div
        style={{
          background: hovered
            ? "rgba(255,255,255,0.07)"
            : "rgba(255,255,255,0.03)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: hovered
            ? "1px solid rgba(255,255,255,0.18)"
            : "1px solid rgba(255,255,255,0.08)",
          padding: "36px",
          borderRadius: "12px",
          position: "relative",
          overflow: "hidden",
          transform: hovered
            ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(10px)`
            : "perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)",
          transition: hovered
            ? "transform 0.07s linear, border-color 200ms, background 200ms, box-shadow 200ms"
            : "transform 0.5s ease, border-color 200ms, background 200ms, box-shadow 200ms",
          boxShadow: hovered
            ? "0 24px 64px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.12)"
            : "0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)",
          height: "100%",
          boxSizing: "border-box",
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
            letterSpacing: "0.12em",
            fontFamily: "var(--font-body)",
            fontWeight: 500,
          }}
        >
          {num}
        </span>

        {/* Prismatic accent bar */}
        <div
          style={{
            width: hovered ? "48px" : "32px",
            height: "2px",
            background: prismColors[index % prismColors.length],
            marginBottom: "28px",
            borderRadius: "1px",
            boxShadow: hovered ? "0 0 16px rgba(196,181,253,0.5)" : "none",
            transition: "width 300ms ease, box-shadow 200ms ease",
          }}
        />

        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 400,
            fontSize: "1.15rem",
            color: "var(--text-primary)",
            marginBottom: "14px",
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

        {/* Inner light refraction on hover */}
        {hovered && (
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "12px",
              background:
                "radial-gradient(ellipse at 30% 0%, rgba(196,181,253,0.08) 0%, transparent 60%)",
              pointerEvents: "none",
            }}
          />
        )}
      </div>
    </motion.div>
  );
}

export default function Services() {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-80px" });
  const gridRef = useRef<HTMLDivElement>(null);
  const gridInView = useInView(gridRef, { once: true, margin: "-80px" });

  return (
    <section id="services" style={{ padding: "128px 48px", position: "relative" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 28 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease }}
          style={{ marginBottom: "72px" }}
        >
          <p
            style={{
              fontSize: "11px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--text-secondary)",
              marginBottom: "14px",
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
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "20px",
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
