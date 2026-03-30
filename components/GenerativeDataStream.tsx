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

    // Focal point — upper centre, where the warm glow sits
    const focalX = () => W() * 0.5;
    const focalY = () => H() * 0.3;

    // --- Colours matching the reference ---
    const colors = [
      '#ff4d4d', '#ff6d5a', '#ff8866', '#e85533', '#ff3333',  // reds/oranges
      '#00e5ff', '#00d4ff', '#00f2ff', '#29b6f6', '#4dd0e1',  // cyans
      '#7c4dff', '#a855f7', '#7000ff', '#b388ff', '#ce93d8',  // purples/magentas
    ];

    // --- Strand: each is a full-screen flowing curve that arcs toward the focal point ---
    interface StrandData {
      // Start on a random edge
      sx: number;
      sy: number;
      // End on the opposite-ish edge
      ex: number;
      ey: number;
      // Control point pull toward focal
      pull: number;
      // Visual
      width: number;
      color: string;
      opacity: number;
      // Animation
      phase: number;
      phaseSpeed: number;
      waveAmp: number;
    }

    const strandCount = 350;
    const strandsData: StrandData[] = [];

    const randomEdgePoint = (w: number, h: number): [number, number] => {
      const edge = Math.floor(Math.random() * 4);
      switch (edge) {
        case 0: return [Math.random() * w, -20];                // top
        case 1: return [Math.random() * w, h + 20];             // bottom
        case 2: return [-20, Math.random() * h];                 // left
        case 3: return [w + 20, Math.random() * h];              // right
        default: return [0, 0];
      }
    };

    const initStrands = () => {
      strandsData.length = 0;
      const w = W();
      const h = H();

      for (let i = 0; i < strandCount; i++) {
        const [sx, sy] = randomEdgePoint(w, h);
        const [ex, ey] = randomEdgePoint(w, h);

        strandsData.push({
          sx, sy, ex, ey,
          pull: Math.random() * 0.6 + 0.3,       // how much it curves toward focal
          width: Math.random() * 2.0 + 0.3,
          color: colors[Math.floor(Math.random() * colors.length)],
          opacity: Math.random() * 0.28 + 0.06,
          phase: Math.random() * Math.PI * 2,
          phaseSpeed: (Math.random() * 0.006 + 0.001) * (Math.random() > 0.5 ? 1 : -1),
          waveAmp: Math.random() * 60 + 15,
        });
      }
    };

    initStrands();

    // --- Particles (twinkling dots) ---
    const particleCount = 120;
    const particles: { x: number; y: number; size: number; alpha: number; speed: number }[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * W(),
        y: Math.random() * H(),
        size: Math.random() * 2.5 + 0.5,
        alpha: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.015 + 0.005,
      });
    }

    // --- Render loop ---
    const render = () => {
      time++;
      const w = W();
      const h = H();
      const fx = focalX();
      const fy = focalY();

      // Deep navy background
      ctx.fillStyle = '#070d19';
      ctx.fillRect(0, 0, w, h);

      // Strong warm glow in upper-centre (like reference)
      const glowR = Math.max(w, h) * 0.55;
      const glow1 = ctx.createRadialGradient(fx, fy, 0, fx, fy, glowR);
      glow1.addColorStop(0, 'rgba(255, 100, 50, 0.18)');
      glow1.addColorStop(0.25, 'rgba(220, 60, 80, 0.10)');
      glow1.addColorStop(0.5, 'rgba(120, 40, 140, 0.05)');
      glow1.addColorStop(1, 'transparent');
      ctx.fillStyle = glow1;
      ctx.fillRect(0, 0, w, h);

      // Secondary cooler glow lower
      const glow2 = ctx.createRadialGradient(w * 0.5, h * 0.75, 0, w * 0.5, h * 0.75, glowR * 0.7);
      glow2.addColorStop(0, 'rgba(0, 100, 200, 0.06)');
      glow2.addColorStop(0.5, 'rgba(60, 0, 150, 0.03)');
      glow2.addColorStop(1, 'transparent');
      ctx.fillStyle = glow2;
      ctx.fillRect(0, 0, w, h);

      // --- Draw strands ---
      ctx.globalCompositeOperation = 'lighter';
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      for (const s of strandsData) {
        s.phase += s.phaseSpeed;

        // Quadratic bezier: start → control (pulled toward focal) → end
        // The control point is a weighted average between midpoint and focal
        const midX = (s.sx + s.ex) / 2;
        const midY = (s.sy + s.ey) / 2;
        const cpX = midX + (fx - midX) * s.pull;
        const cpY = midY + (fy - midY) * s.pull;

        // Animate wave perpendicular to the curve direction
        const angle = Math.atan2(s.ey - s.sy, s.ex - s.sx) + Math.PI / 2;
        const wave = Math.sin(s.phase) * s.waveAmp;
        const animCpX = cpX + Math.cos(angle) * wave;
        const animCpY = cpY + Math.sin(angle) * wave;

        ctx.beginPath();
        ctx.strokeStyle = s.color;
        ctx.lineWidth = s.width;
        ctx.globalAlpha = s.opacity;

        // Draw as a series of small segments for smoother curves
        const segments = 60;
        for (let i = 0; i <= segments; i++) {
          const t = i / segments;
          // Quadratic bezier formula
          const x = (1 - t) * (1 - t) * s.sx + 2 * (1 - t) * t * animCpX + t * t * s.ex;
          const y = (1 - t) * (1 - t) * s.sy + 2 * (1 - t) * t * animCpY + t * t * s.ey;

          // Add secondary micro-wave for organic feel
          const microWave = Math.sin(t * 12 + s.phase * 2) * (s.waveAmp * 0.15);
          const finalX = x + Math.cos(angle) * microWave;
          const finalY = y + Math.sin(angle) * microWave;

          if (i === 0) {
            ctx.moveTo(finalX, finalY);
          } else {
            ctx.lineTo(finalX, finalY);
          }
        }

        ctx.stroke();
      }

      ctx.globalCompositeOperation = 'source-over';

      // --- Particles ---
      for (const p of particles) {
        p.alpha += p.speed;
        const a = (Math.sin(p.alpha) + 1) * 0.5 * 0.7;
        ctx.globalAlpha = a;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;

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
