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

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    // Data-Stream Strand Configuration
    const strands: Strand[] = [];
    const strandCount = 40;
    const colors = ['#ff6d5a', '#00f2ff', '#7000ff']; // Orange, Cyan, Purple (matching Zero Clicks brand)

    class Strand {
      x: number;
      y: number;
      speed: number;
      width: number;
      color: string;
      points: { x: number; y: number }[];
      amplitude: number;
      frequency: number;
      offset: number;

      constructor() {
        this.init();
      }

      init() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 100;
        this.speed = Math.random() * 0.5 + 0.2;
        this.width = Math.random() * 1.5 + 0.5;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.points = [];
        this.amplitude = Math.random() * 50 + 20;
        this.frequency = Math.random() * 0.01 + 0.005;
        this.offset = Math.random() * 1000;
      }

      draw() {
        this.y -= this.speed;
        this.offset += 0.01;

        // Calculate wave path
        const currentX = this.x + Math.sin(this.y * this.frequency + this.offset) * this.amplitude;
        this.points.push({ x: currentX, y: this.y });
        if (this.points.length > 100) this.points.shift();

        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.width;
        ctx.lineCap = 'round';
        ctx.globalAlpha = 0.3;

        if (this.points.length > 2) {
          ctx.moveTo(this.points[0].x, this.points[0].y);
          for (let i = 1; i < this.points.length - 2; i++) {
            const xc = (this.points[i].x + this.points[i + 1].x) / 2;
            const yc = (this.points[i].y + this.points[i + 1].y) / 2;
            ctx.quadraticCurveTo(this.points[i].x, this.points[i].y, xc, yc);
          }
        }
        ctx.stroke();

        // Add glow head
        ctx.beginPath();
        ctx.arc(currentX, this.y, this.width * 2, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = 0.8;
        ctx.fill();

        if (this.y < -100) this.init();
      }
    }

    for (let i = 0; i < strandCount; i++) strands.push(new Strand());

    const render = () => {
      ctx.fillStyle = 'rgba(2, 3, 5, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.globalCompositeOperation = 'lighter';
      strands.forEach(s => s.draw());
      ctx.globalCompositeOperation = 'source-over';

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
