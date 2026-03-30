"use client";

import React from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface MagneticButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const MagneticButton = ({ children, onClick, className = "" }: MagneticButtonProps) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springConfig = { damping: 15, stiffness: 150 };
  const mouseX = useSpring(x, springConfig);
  const mouseY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY, currentTarget } = e;
    const { left, top, width, height } = (currentTarget as HTMLElement).getBoundingClientRect();
    const center = { x: left + width / 2, y: top + height / 2 };
    // Move 20px toward the mouse
    x.set((clientX - center.x) * 0.2);
    y.set((clientY - center.y) * 0.2);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{ x: mouseX, y: mouseY }}
      className={`relative px-8 py-4 bg-[#ff6d5a] text-white rounded-full font-bold shadow-[0_0_20px_rgba(255,109,90,0.3)] hover:shadow-[0_0_40px_rgba(255,109,90,0.5)] transition-shadow cursor-pointer ${className}`}
    >
      {children}
    </motion.button>
  );
};

export default MagneticButton;
