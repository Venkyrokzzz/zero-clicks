'use client';
import { useEffect, useState } from 'react';

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        setProgress((window.scrollY / scrollHeight) * 100);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Init

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '2px',
        zIndex: 9998,
        width: `${progress}%`,
        background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #10b981)',
        backgroundSize: '200% 100%',
        animation: 'progress-shimmer 2s linear infinite',
        transition: 'width 0.1s ease-out'
      }}
    />
  );
}
