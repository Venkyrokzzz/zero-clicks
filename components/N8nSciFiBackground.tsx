'use client';

import React from 'react';
import { motion } from 'framer-motion';

const N8nSciFiBackground = () => {
  const nodes = [
    { id: 1, x: '20%', y: '30%', label: 'Email' },
    { id: 2, x: '80%', y: '40%', label: 'CRM' },
    { id: 3, x: '30%', y: '70%', label: 'Slack' },
    { id: 4, x: '70%', y: '75%', label: 'Ops' },
  ];

  const rays = Array.from({ length: 8 });

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        backgroundColor: '#020305',
        overflow: 'hidden',
      }}
    >
      {/* Grid Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.03,
          backgroundImage: 'url(https://grainy-gradients.vercel.app/noise.svg)',
          zIndex: 10,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255,109,90,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,109,90,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse at center, black, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black, transparent 80%)',
        }}
      />

      {/* Raycast Beams */}
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          opacity: 0.4,
        }}
      >
        <defs>
          <linearGradient id="rayGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255, 109, 90, 0.6)" />
            <stop offset="50%" stopColor="rgba(255, 109, 90, 0.3)" />
            <stop offset="100%" stopColor="rgba(255, 109, 90, 0)" />
          </linearGradient>
        </defs>
        {rays.map((_, i) => {
          const angle = (360 / rays.length) * i;
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
              stroke="url(#rayGradient)"
              strokeWidth="1.5"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0.2, 0.5, 0.2],
                strokeWidth: [1, 2, 1],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.15,
              }}
              style={{ filter: 'drop-shadow(0 0 4px rgba(255, 109, 90, 0.4))' }}
            />
          );
        })}
      </svg>

      {/* Central AI Core */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 5,
        }}
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          style={{
            width: '128px',
            height: '128px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255, 109, 90, 0.3), rgba(255, 109, 90, 0))',
            border: '2px solid rgba(255, 109, 90, 0.6)',
            filter: 'blur(15px)',
            boxShadow: '0 0 60px rgba(255, 109, 90, 0.4)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '10px',
            fontFamily: 'monospace',
            color: '#ff6d5a',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            fontWeight: 600,
          }}
        >
          AI_CORE
        </div>
      </div>

      {/* SVG Connection Lines */}
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
        }}
      >
        <defs>
          <linearGradient id="pulseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255, 109, 90, 0.8)" />
            <stop offset="100%" stopColor="rgba(255, 109, 90, 0)" />
          </linearGradient>
        </defs>

        {nodes.map((node) => (
          <React.Fragment key={node.id}>
            {/* Connection Line */}
            <line
              x1="50%"
              y1="50%"
              x2={node.x}
              y2={node.y}
              stroke="rgba(255, 109, 90, 0.1)"
              strokeWidth="1"
            />

            {/* Animated Data Pulse */}
            <motion.circle
              cx="50%"
              cy="50%"
              r="3"
              fill="#ff6d5a"
              initial={{ opacity: 0 }}
              animate={{
                cx: ['50%', node.x],
                cy: ['50%', node.y],
                opacity: [0, 0.8, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: node.id * 0.8,
                ease: 'easeInOut',
              }}
            />
          </React.Fragment>
        ))}
      </svg>

      {/* Floating Nodes - Minimal */}
      {nodes.map((node) => (
        <motion.div
          key={node.id}
          style={{
            position: 'absolute',
            left: node.x,
            top: node.y,
            transform: 'translate(-50%, -50%)',
          }}
          animate={{ y: [0, -10, 0] }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: node.id * 0.2,
          }}
        >
          <div
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              border: '1px solid rgba(255, 109, 90, 0.4)',
              background: 'rgba(255, 109, 90, 0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '6px',
              fontFamily: 'monospace',
              color: 'rgba(255, 109, 90, 0.5)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              whiteSpace: 'nowrap',
            }}
          >
            •
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default N8nSciFiBackground;
