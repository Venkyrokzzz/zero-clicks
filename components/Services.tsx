"use client";

import { useState, useRef, MouseEvent } from "react";
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
  hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease } },
};

// Determines how the 3 service cards span the 3-column grid
const getGridSpanClass = (index: number) => {
  if (index === 0) return "col-span-1 md:col-span-2";
  if (index === 1) return "col-span-1 md:col-span-1";
  return "col-span-1 md:col-span-3";
};

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const spanClass = getGridSpanClass(index);

  return (
    <motion.div
      variants={cardVariants}
      style={{ minHeight: index === 2 ? "320px" : "360px" }}
      className={spanClass}
    >
      <Link href={`/contact?service=${encodeURIComponent(service.title)}`} style={{ textDecoration: "none", display: "block", height: "100%" }}>
        <div
          ref={cardRef}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onMouseMove={handleMouseMove}
          style={{
            background: "var(--bg-surface)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            padding: "40px",
            position: "relative",
            overflow: "hidden",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            transition: "all 0.3s ease",
            transform: hovered ? "translateY(-2px)" : "none",
            boxShadow: hovered ? "0 20px 40px rgba(0,0,0,0.4)" : "none",
          }}
        >
          {/* Spotlight Effect */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `radial-gradient(800px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 255, 255, 0.04), transparent 40%)`,
              opacity: hovered ? 1 : 0,
              transition: "opacity 0.3s ease",
              pointerEvents: "none",
            }}
          />

          {/* Border Glow tracking */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "16px",
              padding: "1px",
              background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 255, 255, 0.2), transparent 40%)`,
              WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
              opacity: hovered ? 1 : 0,
              transition: "opacity 0.3s ease",
              pointerEvents: "none",
            }}
          />

          <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", height: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "40px" }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid var(--border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: hovered ? "var(--text-primary)" : "var(--text-secondary)",
                  transition: "all 0.3s ease",
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: "24px", height: "24px" }}>
                  <path d={service.icon} />
                </svg>
              </div>

              <span
                style={{
                  fontSize: "10px",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--text-muted)",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid var(--border)",
                  padding: "4px 10px",
                  borderRadius: "6px",
                  fontFamily: "var(--font-body)",
                  fontWeight: 600,
                }}
              >
                {tags[index]}
              </span>
            </div>

            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: "1.5rem",
                letterSpacing: "-0.02em",
                color: "var(--text-primary)",
                marginBottom: "16px",
                lineHeight: 1.2,
              }}
            >
              {service.title}
            </h3>

            <p
              style={{
                fontFamily: "var(--font-body)",
                fontWeight: 400,
                fontSize: "1rem",
                color: "var(--text-secondary)",
                lineHeight: 1.6,
                margin: 0,
                maxWidth: index === 2 ? "600px" : "100%",
              }}
            >
              {service.description}
            </p>

            {/* Action link */}
            <div
              style={{
                marginTop: "auto",
                paddingTop: "32px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "var(--text-primary)",
                fontSize: "13px",
                fontFamily: "var(--font-body)",
                fontWeight: 500,
                opacity: hovered ? 1 : 0.4,
                transform: hovered ? "translateX(4px)" : "translateX(0)",
                transition: "all 0.3s ease",
              }}
            >
              Configure Flow <span style={{ fontFamily: "var(--font-mono)", fontSize: "16px" }}>→</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function Services() {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-80px" });
  const gridRef = useRef<HTMLDivElement>(null);
  const gridInView = useInView(gridRef, { once: true, margin: "-80px" });

  return (
    <section id="services" style={{ padding: "140px 48px", position: "relative" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease }}
          style={{ marginBottom: "64px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}
        >
          <div>
            <h2 style={{
              fontFamily: "var(--font-display)", fontWeight: 600, letterSpacing: "-0.03em",
              fontSize: "clamp(2rem, 4vw, 3rem)", color: "var(--text-primary)", margin: 0, lineHeight: 1.1,
            }}>
              Automate the boring.
            </h2>
          </div>
          <div style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)", fontSize: "13px", paddingBottom: "6px" }}>
            // 01 Core Capabilities
          </div>
        </motion.div>

        <motion.div
          ref={gridRef}
          variants={containerVariants}
          initial="hidden"
          animate={gridInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {SERVICES.map((service, i) => (
            <ServiceCard key={service.title} service={service} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
