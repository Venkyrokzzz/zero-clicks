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

    // Background gradient setup
    const gradientBg = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradientBg.addColorStop(0, '#0a1628');
    gradientBg.addColorStop(1, '#0f1e2e');

    const strands: Strand[] = [];
    const strandCount = 250;
    const colors = ['#ff6d5a', '#00f2ff', '#7000ff', '#00d4ff', '#ffffff', '#ff8866', '#00e5ff', '#ff9999'];

    class Strand {
      startX: number;
      startY: number;
      speed: number;
      width: number;
      color: string;
      points: { x: number; y: number }[];
      amplitude: number;
      frequency: number;
      offset: number;
      progress: number;
      life: number;

      constructor() {
        this.init();
      }

      init() {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 800 + 300;
        this.startX = canvas.width / 2 + Math.cos(angle) * distance;
        this.startY = canvas.height / 2 + Math.sin(angle) * distance;
        this.progress = 0;
        this.life = Math.random() * 0.5 + 0.5;
        this.speed = Math.random() * 0.008 + 0.003;
        this.width = Math.random() * 3 + 0.8;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.points = [];
        this.amplitude = Math.random() * 80 + 30;
        this.frequency = Math.random() * 0.015 + 0.005;
        this.offset = Math.random() * 1000;
      }

      draw() {
        this.progress += this.speed;
        this.offset += 0.01;

        // Path toward center
        const progress = Math.min(this.progress, 1);
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        const currentX = this.startX + (centerX - this.startX) * progress;
        const currentY = this.startY + (centerY - this.startY) * progress;

        // Add wave distortion
        const angle = Math.atan2(this.startY - centerY, this.startX - centerX);
        const distortion = Math.sin(progress * 10 + this.offset) * this.amplitude;
        const distortedX = currentX + Math.cos(angle + Math.PI / 2) * distortion;
        const distortedY = currentY + Math.sin(angle + Math.PI / 2) * distortion;

        this.points.push({ x: distortedX, y: distortedY });
        if (this.points.length > 150) this.points.shift();

        const alpha = Math.max(0, this.life - Math.abs(progress - 0.5) * 2);
        ctx.globalAlpha = alpha * 0.6;
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.width;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        if (this.points.length > 1) {
          ctx.moveTo(this.points[0].x, this.points[0].y);
          for (let i = 1; i < this.points.length; i++) {
            ctx.lineTo(this.points[i].x, this.points[i].y);
          }
        }
        ctx.stroke();

        // Glow head
        ctx.beginPath();
        ctx.arc(distortedX, distortedY, this.width * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = alpha * 0.8;
        ctx.fill();

        if (progress >= 1) this.init();
      }
    }

    for (let i = 0; i < strandCount; i++) strands.push(new Strand());

    // Particles/stars
    const particles: { x: number; y: number; vx: number; vy: number; life: number; size: number }[] = [];
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        life: Math.random() * 0.5 + 0.5,
        size: Math.random() * 1.5 + 0.5,
      });
    }

    const render = () => {
      time++;

      // Background
      ctx.fillStyle = gradientBg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Darken overlay for trail effect
      ctx.fillStyle = 'rgba(10, 22, 40, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.005;

        if (p.life <= 0) {
          p.x = Math.random() * canvas.width;
          p.y = Math.random() * canvas.height;
          p.life = Math.random() * 0.5 + 0.5;
          p.vx = (Math.random() - 0.5) * 0.3;
          p.vy = (Math.random() - 0.5) * 0.3;
        }

        ctx.globalAlpha = p.life * 0.6;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw strands with additive blending
      ctx.globalCompositeOperation = 'lighter';
      strands.forEach(s => s.draw());
      ctx.globalCompositeOperation = 'source-over';
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
      }}
    />
  );
};

export default GenerativeDataStream;
