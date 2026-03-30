'use client';

import React, { useRef, useEffect } from 'react';

const NeuralFlow = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: Particle[] = [];
    let animationFrameId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
      color: string;
      trailX: number[];
      trailY: number[];

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        this.maxLife = Math.random() * 100 + 50;
        this.life = this.maxLife;
        const colors = ['#00f2ff', '#7000ff', '#ff4d4d'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.trailX = [];
        this.trailY = [];
      }

      update() {
        // Flow field: spiral toward centre with Perlin-like noise
        const dx = canvas.width / 2 - this.x;
        const dy = canvas.height / 2 - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx);

        // Spring physics: Stiffness 60, Damping 20
        const stiffness = 0.06;
        const damping = 0.8;
        const force = stiffness * distance;

        this.vx += Math.cos(angle) * force;
        this.vy += Math.sin(angle) * force;
        this.vx *= damping;
        this.vy *= damping;

        // Add organic turbulence
        this.vx += (Math.sin(this.x * 0.002 + this.life * 0.01) - 0.5) * 0.05;
        this.vy += (Math.cos(this.y * 0.002 + this.life * 0.01) - 0.5) * 0.05;

        this.x += this.vx;
        this.y += this.vy;
        this.life -= 0.5;

        // Build trail
        this.trailX.push(this.x);
        this.trailY.push(this.y);
        if (this.trailX.length > 20) {
          this.trailX.shift();
          this.trailY.shift();
        }

        // Reset when life ends
        if (this.life <= 0) {
          this.x = Math.random() * canvas.width;
          this.y = Math.random() * canvas.height;
          this.life = this.maxLife;
          this.vx = 0;
          this.vy = 0;
          this.trailX = [];
          this.trailY = [];
        }
      }

      draw() {
        // Draw trail
        if (this.trailX.length > 1) {
          ctx.beginPath();
          ctx.strokeStyle = this.color;
          ctx.lineWidth = 0.5;
          ctx.globalAlpha = (this.life / this.maxLife) * 0.2;

          ctx.moveTo(this.trailX[0], this.trailY[0]);
          for (let i = 1; i < this.trailX.length; i++) {
            ctx.lineTo(this.trailX[i], this.trailY[i]);
          }
          ctx.stroke();
        }

        // Draw particle head
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.globalAlpha = (this.life / this.maxLife) * 0.5;
        ctx.arc(this.x, this.y, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const init = () => {
      resize();
      particles = Array.from({ length: 2000 }, () => new Particle());
    };

    const render = () => {
      // Trail effect (slight decay)
      ctx.fillStyle = 'rgba(2, 3, 5, 0.03)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Additive blending for glow
      ctx.globalCompositeOperation = 'lighter';

      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;

      animationFrameId = requestAnimationFrame(render);
    };

    window.addEventListener('resize', resize);
    init();
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
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -20,
        backgroundColor: '#020305',
      }}
    />
  );
};

export default NeuralFlow;
