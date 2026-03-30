import React from 'react';
import { motion } from 'framer-motion';

const RaycastBeams = () => {
  return (
    // 'fixed' and high z-index ensures it's not hidden by other divs
    <div className="fixed inset-0 z-0 overflow-hidden bg-[#050505] pointer-events-none">
      
      {/* 1. The Grain/Noise Overlay */}
      <div className="absolute inset-0 opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-50" />

      {/* 2. The Beams - Set to a very bright Red to test visibility */}
      <div className="absolute inset-0 flex justify-center items-center rotate-[35deg] scale-150">
        {[1, 2, 3, 4].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0.1, 0.4, 0.1], 
              y: [-50, 50] 
            }}
            transition={{
              duration: 5 + i,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            // If you still see nothing, change 'bg-red-600/40' to 'bg-red-600' (solid)
            className="w-24 h-[200vh] mx-12 bg-red-600/30 blur-[100px]"
          />
        ))}
      </div>
      
      {/* 3. A Central Radial Glow to pull it together */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,0,0,0.1)_0%,transparent_70%)]" />
    </div>
  );
};

export default RaycastBeams;
