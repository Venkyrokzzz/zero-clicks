"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const paths = [
  "M45.2,-78.1C58.3,-71.4,68.6,-58.3,75.1,-43.8C81.6,-29.3,84.4,-13.4,82.8,2.1C81.2,17.5,75.2,32.4,66.1,45.1C57.1,57.7,45,68.1,31.2,74.5C17.4,80.9,1.9,83.4,-13.7,81.1C-29.3,78.9,-45,71.9,-57.4,61.2C-69.8,50.6,-78.9,36.2,-83,20.8C-87.1,5.4,-86.2,-11,-80.6,-25.9C-75,-40.8,-64.7,-54.2,-52.1,-61C-39.6,-67.7,-24.8,-67.9,-10.1,-70.5C4.6,-73.2,19.2,-78.3,32.4,-81.4C45.5,-84.6,45.2,-78.1,45.2,-78.1Z",
  "M33.6,-59.1C44.7,-53.4,55.5,-45.5,63.1,-35.3C70.6,-25.1,75,-12.5,75.2,0.1C75.4,12.7,71.5,25.4,64,35.8C56.6,46.1,45.6,54,34,60.8C22.4,67.6,11.2,73.3,-1.2,75.4C-13.6,77.5,-27.2,76,-38.7,69.5C-50.2,63,-59.6,51.5,-66.1,38.9C-72.7,26.4,-76.3,12.8,-76.3,-0.1C-76.3,-12.9,-72.6,-25.8,-65.4,-37.1C-58.2,-48.3,-47.5,-58.1,-35.6,-63.3C-23.8,-68.5,-10.8,-69.3,0.8,-70.6C12.3,-72,22.4,-64.8,33.6,-59.1Z",
  "M40.2,-64.3C52.1,-58.4,61.7,-47.7,68.4,-35.4C75.1,-23.1,78.9,-9.2,78.8,4.7C78.6,18.5,74.5,32.3,66.1,43.3C57.7,54.2,45,62.3,31.7,68.4C18.3,74.5,4.3,78.7,-9.6,77C-23.6,75.3,-37.5,67.7,-48.8,58C-60,48.3,-68.7,36.4,-73.9,23.3C-79.1,10.2,-80.8,-4.2,-77.8,-17.7C-74.8,-31.2,-67.2,-43.8,-56.3,-50.2C-45.4,-56.6,-31.3,-56.8,-19.1,-62C-6.8,-67.2,5.2,-77.4,19.1,-77.4C32.9,-77.4,40.2,-64.3,40.2,-64.3Z"
];

interface FluidBlobProps {
  color: string;
  className?: string;
}

export default function FluidBlob({ color, className = "" }: FluidBlobProps) {
  const [pathIndex, setPathIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPathIndex((current) => (current + 1) % paths.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`absolute pointer-events-none transition-opacity duration-1000 ${className}`}>
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <defs>
          <filter id="fluid-glow">
            <feGaussianBlur stdDeviation="10" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        <motion.path
          d={paths[pathIndex]}
          fill={color}
          initial={false}
          animate={{ d: paths[pathIndex] }}
          transition={{
            duration: 4,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse",
          }}
          style={{ transform: "translate(100px, 100px)", filter: "url(#fluid-glow)" }}
          className="opacity-20"
        />
      </svg>
    </div>
  );
}
