'use client';

import React from 'react';
import { motion } from 'framer-motion';
import RaycastBeams from './RaycastBeams';

const N8nWorkflowBackground = () => {
  const nodes = Array.from({ length: 10 });

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        backgroundColor: '#080808',
        overflow: 'hidden',
      }}
    >
      {/* Raycast Beams with n8n features */}
      <RaycastBeams />

      {/* 1. Deep Orange Atmospheric Glow */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '800px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(255, 109, 90, 0.08), transparent 70%)',
          filter: 'blur(120px)',
          borderRadius: '50%',
        }}
      />

      {/* 2. Floating Workflow Nodes */}
      {nodes.map((_, i) => (
        <motion.div
          key={i}
          initial={{
            y: '110vh',
            x: `${Math.random() * 100}%`,
            opacity: 0.5,
          }}
          animate={{
            y: '-20vh',
            opacity: [0.5, 0.5, 0.5, 0],
            rotate: [0, 45, 90],
          }}
          transition={{
            duration: Math.random() * 10 + 20,
            repeat: Infinity,
            delay: Math.random() * 15,
            ease: 'linear',
          }}
          style={{
            position: 'absolute',
            width: '50px',
            height: '50px',
            padding: '16px',
            borderRadius: '12px',
            border: '1px solid rgba(255, 109, 90, 0.2)',
            background: 'rgba(17, 17, 17, 0.8)',
            backdropFilter: 'blur(8px)',
          }}
        >
          {/* Internal "Node" Dot */}
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#ff6d5a',
              boxShadow: '0 0 10px #ff6d5a',
              margin: 'auto',
            }}
          />
        </motion.div>
      ))}

      {/* 3. Connecting "Data Streams" */}
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          opacity: 0.2,
        }}
      >
        <motion.path
          d="M 50 1100 Q 400 600 800 1100"
          stroke="#ff6d5a"
          strokeWidth="1"
          fill="transparent"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 5, repeat: Infinity }}
        />
      </svg>

      {/* 4. Film Grain for Professional Finish */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.03,
          pointerEvents: 'none',
          backgroundImage: 'url(https://grainy-gradients.vercel.app/noise.svg)',
        }}
      />
    </div>
  );
};

export default N8nWorkflowBackground;
