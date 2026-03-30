import React from 'react';
import { motion } from 'framer-motion';

const N8nWorkflowBackground = () => {
  // Creating 10 "Nodes" that look like n8n blocks
  const nodes = Array.from({ length: 10 });

  return (
    <div className="fixed inset-0 -z-10 bg-[#080808] overflow-hidden">
      {/* 1. Deep Orange Atmospheric Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-[#ff6d5a]/5 blur-[120px] rounded-full" />

      {/* 2. Floating Workflow Nodes */}
      {nodes.map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: "110vh", x: `${Math.random() * 100}%`, opacity: 0 }}
          animate={{
            y: "-20vh",
            opacity: [0, 0.5, 0.5, 0],
            rotate: [0, 45, 90]
          }}
          transition={{
            duration: Math.random() * 10 + 20,
            repeat: Infinity,
            delay: Math.random() * 15,
            ease: "linear"
          }}
          className="absolute p-4 rounded-xl border border-[#ff6d5a]/20 bg-[#111]/80 backdrop-blur-sm"
          style={{ width: '50px', height: '50px' }}
        >
          {/* Internal "Node" Dot */}
          <div className="w-2 h-2 rounded-full bg-[#ff6d5a] shadow-[0_0_10px_#ff6d5a]" />
        </motion.div>
      ))}

      {/* 3. Connecting "Data Streams" */}
      <svg className="absolute inset-0 w-full h-full opacity-20">
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
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  );
};

export default N8nWorkflowBackground;
