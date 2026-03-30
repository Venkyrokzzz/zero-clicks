import React from 'react';
import { motion } from 'framer-motion';

const RaycastBeams = () => {
  const beams = Array.from({ length: 6 });

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 1,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      {/* Central radial glow */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '1200px',
          height: '1200px',
          background: 'radial-gradient(circle, rgba(255, 109, 90, 0.15) 0%, transparent 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }}
      />

      {/* Animated raycast beams */}
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          opacity: 0.6,
        }}
      >
        <defs>
          <linearGradient id="beamGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255, 109, 90, 0.8)" />
            <stop offset="50%" stopColor="rgba(255, 109, 90, 0.4)" />
            <stop offset="100%" stopColor="rgba(255, 109, 90, 0)" />
          </linearGradient>
        </defs>

        {/* Animated beam lines radiating from center */}
        {beams.map((_, i) => {
          const angle = (360 / beams.length) * i;
          const rad = (angle * Math.PI) / 180;
          const x2 = 50 + 50 * Math.cos(rad);
          const y2 = 50 + 50 * Math.sin(rad);

          return (
            <motion.line
              key={i}
              x1="50%"
              y1="50%"
              x2={`${x2}%`}
              y2={`${y2}%`}
              stroke="url(#beamGradient)"
              strokeWidth="2"
              initial={{ opacity: 0, strokeDasharray: '100' }}
              animate={{
                opacity: [0.3, 0.7, 0.3],
                strokeDashoffset: [0, -50, 0],
              }}
              transition={{
                duration: 3 + i * 0.3,
                repeat: Infinity,
                ease: 'linear',
              }}
              style={{ filter: 'drop-shadow(0 0 8px rgba(255, 109, 90, 0.6))' }}
            />
          );
        })}
      </svg>

      {/* Pulsing core glow */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0.3 }}
        animate={{
          scale: [0.8, 1.2, 0.8],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(255, 109, 90, 0.3) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(40px)',
        }}
      />
    </div>
  );
};

export default RaycastBeams;
