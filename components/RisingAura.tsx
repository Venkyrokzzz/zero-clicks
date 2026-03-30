"use client";

import { motion } from "framer-motion";

const RisingAura = () => {
  const streaks = Array.from({ length: 12 });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        display: "flex",
        justifyContent: "center",
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      {/* Central static glow */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "600px",
          height: "400px",
          background: "rgba(59, 130, 246, 0.10)",
          filter: "blur(120px)",
          borderRadius: "50%",
        }}
      />

      {/* Rising light streaks */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "960px",
          height: "100%",
        }}
      >
        {streaks.map((_, i) => {
          const duration = Math.random() * 5 + 8;
          const delay = Math.random() * 10;
          const xOffset = (i - 6) * 8;

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: "60%", x: `${xOffset}%` }}
              animate={{
                opacity: [0, 0.25, 0],
                y: "-20%",
              }}
              transition={{
                duration,
                repeat: Infinity,
                delay,
                ease: "linear",
              }}
              style={{
                position: "absolute",
                bottom: 0,
                left: "50%",
                width: "2px",
                height: "160px",
                background: "linear-gradient(to top, transparent, rgba(34, 211, 238, 0.3), transparent)",
                filter: "blur(1px)",
              }}
            />
          );
        })}

        {/* Soft rising motes */}
        {Array.from({ length: 15 }).map((_, i) => {
          const startX = Math.random() * 60 + 20;
          const duration = Math.random() * 10 + 10;
          const delay = Math.random() * 5;

          return (
            <motion.div
              key={`mote-${i}`}
              initial={{ opacity: 0, y: "50vh", x: `${startX}%` }}
              animate={{
                opacity: [0, 0.4, 0],
                y: "-10vh",
              }}
              transition={{
                duration,
                repeat: Infinity,
                delay,
                ease: "linear",
              }}
              style={{
                position: "absolute",
                width: "4px",
                height: "4px",
                background: "rgba(255, 255, 255, 0.4)",
                borderRadius: "50%",
                filter: "blur(1px)",
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default RisingAura;
