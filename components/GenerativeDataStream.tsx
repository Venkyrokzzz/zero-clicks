'use client';

import React, { useRef, useEffect } from 'react';

const GenerativeDataStream = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    const W = () => canvas.width;
    const H = () => canvas.height;

    // --- Flowing strand config ---
    const strandCount = 300;
    const colors = [
      '#ff4d4d', '#ff6d5a', '#ff8866', '#e85533',   // reds/oranges
      '#00e5ff', '#00d4ff', '#00f2ff', '#29b6f6',   // cyans
      '#7c4dff', '#a855f7', '#7000ff', '#b388ff',   // purples
    ];

    interface StrandData {
      baseY: number;
      amplitude: number;
      frequency: number;
      phase: number;
      phaseSpeed: number;
      width: number;
      color: string;
      opacity: number;
      direction: number; // 1 = left-to-right, -1 = right-to-left
      yDrift: number;
    }

    const strandsData: StrandData[] = [];

    for (let i = 0; i < strandCount; i++) {
      strandsData.push({
        baseY: Math.random() * H() * 1.4 - H() * 0.2,
        amplitude: Math.random() * 120 + 40,
        frequency: Math.random() * 0.004 + 0.001,
        phase: Math.random() * Math.PI * 2,
        phaseSpeed: (Math.random() * 0.008 + 0.002) * (Math.random() > 0.5 ? 1 : -1),
        width: Math.random() * 1.8 + 0.3,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.22 + 0.05,
        direction: Math.random() > 0.5 ? 1 : -1,
        yDrift: (Math.random() - 0.5) * 0.15,
      });
    }

    // --- Particles ---
    const particleCount = 100;
    const particles: { x: number; y: number; size: number; alpha: number; twinkleSpeed: number }[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * W(),
        y: Math.random() * H(),
        size: Math.random() * 2 + 0.5,
        alpha: Math.random(),
        twinkleSpeed: Math.random() * 0.02 + 0.005,
      });
    }

    // --- Render ---
    const render = () => {
      time++;
      const w = W();
      const h = H();

      // Deep navy background
      ctx.fillStyle = '#080e1a';
      ctx.fillRect(0, 0, w, h);

      // Warm central glow
      const glowRadius = Math.min(w, h) * 0.6;
      const glow = ctx.createRadialGradient(w * 0.5, h * 0.35, 0, w * 0.5, h * 0.35, glowRadius);
      glow.addColorStop(0, 'rgba(255, 90, 60, 0.12)');
      glow.addColorStop(0.3, 'rgba(180, 60, 100, 0.06)');
      glow.addColorStop(0.6, 'rgba(80, 40, 120, 0.03)');
      glow.addColorStop(1, 'transparent');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      // Draw strands with additive blending
      ctx.globalCompositeOperation = 'lighter';

      const segmentWidth = 4; // pixels between sample points

      for (const s of strandsData) {
        s.phase += s.phaseSpeed;
        s.baseY += s.yDrift;

        // Wrap around vertically
        if (s.baseY > h * 1.3) s.baseY = -h * 0.3;
        if (s.baseY < -h * 0.3) s.baseY = h * 1.3;

        ctx.beginPath();
        ctx.strokeStyle = s.color;
        ctx.lineWidth = s.width;
        ctx.globalAlpha = s.opacity;

        const steps = Math.ceil(w / segmentWidth);
        let prevX = 0;
        let prevY = s.baseY + Math.sin(s.phase) * s.amplitude;

        ctx.moveTo(prevX, prevY);

        for (let step = 1; step <= steps; step++) {
          const x = step * segmentWidth;
          // Multi-frequency sine for organic shape
          const y =
            s.baseY +
            Math.sin(x * s.frequency + s.phase) * s.amplitude +
            Math.sin(x * s.frequency * 2.3 + s.phase * 1.7) * (s.amplitude * 0.3) +
            Math.sin(x * s.frequency * 0.5 + s.phase * 0.4) * (s.amplitude * 0.5);

          // Smooth curve using quadratic bezier
          const cpX = (prevX + x) / 2;
          const cpY = (prevY + y) / 2;
          ctx.quadraticCurveTo(prevX, prevY, cpX, cpY);

          prevX = x;
          prevY = y;
        }

        ctx.stroke();
      }

      ctx.globalCompositeOperation = 'source-over';

      // Draw particles (twinkling dots)
      for (const p of particles) {
        p.alpha += p.twinkleSpeed;
        const a = (Math.sin(p.alpha) + 1) * 0.5 * 0.6;
        ctx.globalAlpha = a;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;

      // Centre vignette for text readability
      const vignette = ctx.createRadialGradient(w * 0.5, h * 0.45, 0, w * 0.5, h * 0.45, w * 0.35);
      vignette.addColorStop(0, 'rgba(8, 14, 26, 0.5)');
      vignette.addColorStop(0.6, 'rgba(8, 14, 26, 0.2)');
      vignette.addColorStop(1, 'transparent');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, w, h);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 1,
        backgroundColor: 'transparent',
        filter: 'blur(0.5px)',
      }}
    />
  );
};

export default GenerativeDataStream;
