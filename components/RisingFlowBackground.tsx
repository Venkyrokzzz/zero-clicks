"use client";

import { motion } from "framer-motion";

const RisingFlowBackground = () => {
  const particles = Array.from({ length: 20 });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 5,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      {particles.map((_, i) => {
        const size = Math.random() * 8 + 3;
        const startX = Math.random() * 100;
        const driftX = startX + (Math.random() * 10 - 5);
        const duration = Math.random() * 10 + 15;
        const delay = Math.random() * 15;

        return (
          <motion.div
            key={i}
            initial={{
              opacity: 0,
              y: "110vh",
              x: `${startX}%`,
            }}
            animate={{
              opacity: [0, 0.7, 0.7, 0],
              y: "-10vh",
              x: `${driftX}%`,
            }}
            transition={{
              duration,
              repeat: Infinity,
              delay,
              ease: "linear",
            }}
            style={{
              position: "absolute",
              width: `${size}px`,
              height: `${size}px`,
              borderRadius: "50%",
              background: "rgba(34, 211, 238, 0.8)",
              boxShadow: "0 0 6px rgba(34, 211, 238, 0.5)",
            }}
          />
        );
      })}
    </div>
  );
};

export default RisingFlowBackground;
