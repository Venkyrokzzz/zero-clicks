'use client';
import { useEffect, useRef, useState } from 'react';

export default function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);
  const [isMoved, setIsMoved] = useState(false);

  useEffect(() => {
    let currentX = window.innerWidth / 2;
    let currentY = window.innerHeight / 2;
    let targetX = currentX;
    let targetY = currentY;
    let rafId: number;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isMoved) setIsMoved(true);
      targetX = e.clientX;
      targetY = e.clientY;
    };

    const animate = () => {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;
      
      if (glowRef.current) {
        glowRef.current.style.transform = `translate(calc(${currentX}px - 50%), calc(${currentY}px - 50%))`;
      }
      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, [isMoved]);

  return (
    <div
      ref={glowRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '320px',
        height: '320px',
        borderRadius: '50%',
        background: 'radial-gradient(rgba(59,130,246,0.07), transparent 70%)',
        pointerEvents: 'none',
        zIndex: 9999,
        opacity: isMoved ? 1 : 0,
        animation: isMoved ? 'cursor-appear 1s forwards' : 'none',
        transform: 'translate(-50%, -50%)',
        willChange: 'transform'
      }}
    />
  );
}
