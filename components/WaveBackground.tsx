'use client';

import { useRef, useEffect } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// StrandBundle — defines one group of wave fibres that cross the canvas.
//
// r / g / b      — colour of the bundle (0-255). Combined with screen blend
//                  mode so overlapping bundles add like coloured light.
// count          — how many individual fibre strands in this bundle.
// stride         — vertical pixel gap between adjacent fibres.
// baseY          — starting Y position as a 0-1 fraction of canvas height.
// slope          — diagonal tilt; pixels of Y-offset per X-pixel.
// amp / freq / speed — arrays (two layers each) of amplitude (px), spatial
//                  frequency (radians / px), and animation speed (radians / ms).
// phase          — global phase offset for the whole bundle.
// phaseJitter    — max random per-fibre phase variation so strands don't
//                  all move in perfect lockstep.
// ─────────────────────────────────────────────────────────────────────────────
interface StrandBundle {
  r: number; g: number; b: number;
  count: number;
  stride: number;
  baseY: number;
  slope: number;
  amp: [number, number];
  freq: [number, number];
  speed: [number, number];
  phase: number;
  phaseJitter: number;
}

// Four bundles tuned for the Zero Clicks dark theme.
// Cyan + purple cross in the upper-middle; a red accent runs low.
const BUNDLES: StrandBundle[] = [
  {
    r: 0, g: 200, b: 255,           // cyan
    count: 6, stride: 18,
    baseY: 0.32, slope: -0.04,
    amp: [28, 14], freq: [0.0055, 0.011],
    speed: [0.00022, 0.00039],
    phase: 0, phaseJitter: 1.2,
  },
  {
    r: 140, g: 60, b: 255,          // violet
    count: 5, stride: 22,
    baseY: 0.42, slope: 0.05,
    amp: [34, 16], freq: [0.0048, 0.009],
    speed: [0.00018, 0.00031],
    phase: 1.1, phaseJitter: 1.5,
  },
  {
    r: 255, g: 80, b: 80,           // red accent (dim)
    count: 4, stride: 20,
    baseY: 0.62, slope: -0.03,
    amp: [22, 10], freq: [0.006, 0.013],
    speed: [0.00028, 0.00045],
    phase: 2.4, phaseJitter: 0.9,
  },
  {
    r: 40, g: 180, b: 220,          // teal (faint, wide)
    count: 3, stride: 30,
    baseY: 0.22, slope: 0.02,
    amp: [40, 20], freq: [0.0035, 0.007],
    speed: [0.00014, 0.00026],
    phase: 0.7, phaseJitter: 2.0,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Wave equation for a single fibre at horizontal pixel x, time t ms:
//   y = baseY_px + (fibreIndex * stride) + slope * x
//     + sin(freq[0] * x  +  speed[0] * t  +  fiberPhase) * amp[0]
//     + sin(freq[1] * x  +  speed[1] * t  +  fiberPhase * 1.3) * amp[1]
// ─────────────────────────────────────────────────────────────────────────────

function drawBundle(
  ctx: CanvasRenderingContext2D,
  b: StrandBundle,
  w: number,
  h: number,
  t: number,
  jitters: number[],   // pre-computed per-fibre phase offsets
) {
  const step = 3; // sample every N pixels — increase for performance
  const baseYpx = b.baseY * h;

  // ── Pass 1: Soft halo (wide, low-alpha, blurred) ──────────────────────────
  ctx.lineWidth = 3.5;
  ctx.shadowBlur = 18;

  for (let fi = 0; fi < b.count; fi++) {
    const fPhase = b.phase + jitters[fi];
    const yOff = (fi - (b.count - 1) / 2) * b.stride;
    ctx.strokeStyle = `rgba(${b.r},${b.g},${b.b},0.07)`;
    ctx.shadowColor  = `rgba(${b.r},${b.g},${b.b},0.15)`;
    ctx.beginPath();
    for (let x = 0; x <= w; x += step) {
      const y = baseYpx + yOff + b.slope * x
        + Math.sin(b.freq[0] * x + b.speed[0] * t + fPhase) * b.amp[0]
        + Math.sin(b.freq[1] * x + b.speed[1] * t + fPhase * 1.3) * b.amp[1];
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  // ── Pass 2: Sharp fibres (thin, mid-alpha) ────────────────────────────────
  ctx.lineWidth = 0.8;
  ctx.shadowBlur = 4;

  for (let fi = 0; fi < b.count; fi++) {
    const fPhase = b.phase + jitters[fi];
    const yOff = (fi - (b.count - 1) / 2) * b.stride;
    ctx.strokeStyle = `rgba(${b.r},${b.g},${b.b},0.35)`;
    ctx.shadowColor  = `rgba(${b.r},${b.g},${b.b},0.4)`;
    ctx.beginPath();
    for (let x = 0; x <= w; x += step) {
      const y = baseYpx + yOff + b.slope * x
        + Math.sin(b.freq[0] * x + b.speed[0] * t + fPhase) * b.amp[0]
        + Math.sin(b.freq[1] * x + b.speed[1] * t + fPhase * 1.3) * b.amp[1];
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  // ── Pass 3: Glowing spine (central fibre only, brightest) ─────────────────
  ctx.lineWidth = 1.2;
  ctx.shadowBlur = 10;
  const spinePhase = b.phase + jitters[Math.floor(b.count / 2)];
  ctx.strokeStyle = `rgba(${b.r},${b.g},${b.b},0.7)`;
  ctx.shadowColor  = `rgba(${b.r},${b.g},${b.b},0.8)`;
  ctx.beginPath();
  for (let x = 0; x <= w; x += step) {
    const y = baseYpx + b.slope * x
      + Math.sin(b.freq[0] * x + b.speed[0] * t + spinePhase) * b.amp[0]
      + Math.sin(b.freq[1] * x + b.speed[1] * t + spinePhase * 1.3) * b.amp[1];
    x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.stroke();

  ctx.shadowBlur = 0; // reset — shadowBlur is expensive, clear after each bundle
}

export default function WaveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Pre-compute per-fibre phase jitter so it's stable across frames
    const jitterMap = BUNDLES.map(b =>
      Array.from({ length: b.count }, () => (Math.random() * 2 - 1) * b.phaseJitter)
    );

    let raf: number;
    let startT = 0;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const render = (ts: number) => {
      if (!startT) startT = ts;
      const t = ts - startT;

      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      // globalCompositeOperation = "screen" makes colours add like light:
      //   result = 1 − (1 − src) × (1 − dst)
      // Overlapping cyan + violet → white-ish; isolated bundles stay tinted.
      ctx.globalCompositeOperation = 'screen';

      for (let i = 0; i < BUNDLES.length; i++) {
        drawBundle(ctx, BUNDLES[i], w, h, t, jitterMap[i]);
      }

      ctx.globalCompositeOperation = 'source-over';

      raf = requestAnimationFrame(render);
    };

    resize();
    window.addEventListener('resize', resize);
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
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
        // z-0: canvas sits above the black body background but below all
        // content (content uses z-index: 10+ via position: relative).
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
