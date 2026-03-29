"use client";

import React from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface AntiGravityCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  delay?: number;
  accentColor?: string;
}

const AntiGravityCard: React.FC<AntiGravityCardProps> = ({
  title,
  description,
  icon,
  delay = 0,
  accentColor = "rgba(56, 189, 248, 1)",
}) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);

  // Spotlight position for the glow-follow effect
  const spotlightX = useTransform(mouseXSpring, [-0.5, 0.5], ["0%", "100%"]);
  const spotlightY = useTransform(mouseYSpring, [-0.5, 0.5], ["0%", "100%"]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / rect.width - 0.5);
    y.set(mouseY / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <motion.div
        // Continuous floating animation
        animate={{ y: [0, -10, 0] }}
        transition={{
          duration: 5 + delay * 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          perspective: "1000px",
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover={{ scale: 1.02 }}
      >
        <div
          style={{
            position: "relative",
            height: "320px",
            width: "100%",
            borderRadius: "20px",
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(12, 12, 16, 0.7)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            padding: "36px",
            overflow: "hidden",
            cursor: "default",
            transition: "border-color 0.3s ease, box-shadow 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
            e.currentTarget.style.boxShadow = `0 24px 48px rgba(0,0,0,0.5), 0 0 60px ${accentColor.replace("1)", "0.08)")}`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          {/* Spotlight glow that follows cursor */}
          <motion.div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `radial-gradient(600px circle at var(--spot-x) var(--spot-y), ${accentColor.replace("1)", "0.06)")}, transparent 40%)`,
              pointerEvents: "none",
              borderRadius: "20px",
              // @ts-ignore - CSS custom properties
              "--spot-x": spotlightX,
              "--spot-y": spotlightY,
            } as React.CSSProperties}
          />

          {/* Inner content with parallax lift */}
          <div
            style={{
              transform: "translateZ(50px)",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              height: "100%",
              position: "relative",
              zIndex: 2,
            }}
          >
            {/* Icon */}
            <div
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "14px",
                background: accentColor.replace("1)", "0.1)"),
                border: `1px solid ${accentColor.replace("1)", "0.25)")}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "22px",
                color: accentColor,
                transition: "transform 0.3s ease, background 0.3s ease",
              }}
            >
              {icon || "🚀"}
            </div>

            {/* Title */}
            <h3
              style={{
                fontFamily: "var(--font-display, 'Inter', sans-serif)",
                fontWeight: 600,
                fontSize: "1.35rem",
                letterSpacing: "-0.02em",
                color: "#f0f0f5",
                margin: 0,
                lineHeight: 1.3,
              }}
            >
              {title}
            </h3>

            {/* Description */}
            <p
              style={{
                fontFamily: "var(--font-body, 'Inter', sans-serif)",
                fontWeight: 400,
                fontSize: "0.95rem",
                lineHeight: 1.65,
                color: "rgba(180, 180, 200, 0.8)",
                margin: 0,
              }}
            >
              {description}
            </p>

            {/* Bottom action hint */}
            <div
              style={{
                marginTop: "auto",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "13px",
                fontWeight: 500,
                color: accentColor,
                opacity: 0.6,
                transition: "opacity 0.3s ease",
              }}
            >
              Explore →
            </div>
          </div>

          {/* Corner accent gradient */}
          <div
            style={{
              position: "absolute",
              top: "-1px",
              right: "-1px",
              width: "120px",
              height: "120px",
              background: `radial-gradient(circle at 100% 0%, ${accentColor.replace("1)", "0.12)")}, transparent 70%)`,
              borderRadius: "0 20px 0 0",
              pointerEvents: "none",
            }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AntiGravityCard;
