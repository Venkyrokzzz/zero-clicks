import React from 'react';
import {
  useCurrentFrame, useVideoConfig,
  interpolate, spring, AbsoluteFill,
} from 'remotion';
import { C, FONT_DISPLAY, FONT_BODY } from './tokens';

// ── Shared background ────────────────────────────────────────────────────────
export const PubBg: React.FC<{ glow?: string }> = ({ glow }) => (
  <AbsoluteFill
    style={{
      background: [
        glow ?? 'radial-gradient(ellipse 70% 50% at 20% 15%, rgba(232,168,70,0.14), transparent 55%)',
        `radial-gradient(ellipse 60% 40% at 80% 85%, rgba(184,116,61,0.10), transparent 55%)`,
        C.stout,
      ].join(', '),
    }}
  />
);

// ── Cross-fade wrapper ────────────────────────────────────────────────────────
export const FadeScene: React.FC<{ children: React.ReactNode; fadeInDur?: number }> = ({
  children, fadeInDur = 48,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, fadeInDur], [0, 1], { extrapolateRight: 'clamp' });
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};

// ── Spring-in element ─────────────────────────────────────────────────────────
export function useSpringIn(delay = 0, stiffness = 100, damping = 14) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = Math.max(0, frame - delay);
  const progress = spring({ frame: f, fps, config: { stiffness, damping } });
  const opacity  = interpolate(f, [0, 32], [0, 1], { extrapolateRight: 'clamp' });
  return { progress, opacity };
}

// ── Eyebrow label ─────────────────────────────────────────────────────────────
export const Eyebrow: React.FC<{ text: string; delay?: number; color?: string }> = ({
  text, delay = 0, color = C.copper,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [delay, delay + 40], [0, 1], { extrapolateRight: 'clamp' });
  return (
    <p style={{
      fontFamily: FONT_BODY,
      fontSize: 18,
      fontWeight: 700,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color,
      opacity,
      margin: 0,
      marginBottom: 16,
    }}>
      {text}
    </p>
  );
};

// ── Display heading ───────────────────────────────────────────────────────────
export const Heading: React.FC<{
  children: React.ReactNode;
  delay?: number;
  size?: number;
}> = ({ children, delay = 8, size = 64 }) => {
  const { progress, opacity } = useSpringIn(delay, 90, 14);
  return (
    <h2 style={{
      fontFamily: FONT_DISPLAY,
      fontSize: size,
      fontWeight: 500,
      lineHeight: 1.15,
      color: C.ink,
      opacity,
      transform: `translateY(${24 * (1 - progress)}px)`,
      margin: 0,
    }}>
      {children}
    </h2>
  );
};

// ── Italic accent span ────────────────────────────────────────────────────────
export const Em: React.FC<{ children: React.ReactNode; color?: string }> = ({
  children, color = C.ale,
}) => (
  <em style={{ fontStyle: 'italic', color }}>{children}</em>
);

// ── Small muted text ──────────────────────────────────────────────────────────
export const Support: React.FC<{ children: React.ReactNode; delay?: number }> = ({
  children, delay = 24,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [delay, delay + 48], [0, 1], { extrapolateRight: 'clamp' });
  return (
    <p style={{
      fontFamily: FONT_BODY,
      fontSize: 22,
      color: C.muted,
      opacity,
      margin: '20px 0 0',
      lineHeight: 1.6,
    }}>
      {children}
    </p>
  );
};

// ── Walking person SVG ────────────────────────────────────────────────────────
export const Walker: React.FC<{ color?: string; size?: number }> = ({
  color = C.muted, size = 32,
}) => (
  <svg width={size * 0.55} height={size} viewBox="0 0 22 42" fill={color}>
    <circle cx="9" cy="6" r="5" />
    <path d="M2 14h14l3 16H0L2 14z" />
    <line x1="5" y1="30" x2="3" y2="40" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    <line x1="13" y1="30" x2="15" y2="40" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

// ── Google star rating ────────────────────────────────────────────────────────
export const Stars: React.FC<{ count: number; size?: number }> = ({ count, size = 18 }) => (
  <span style={{ fontSize: size, color: '#fbbc04', letterSpacing: 2 }}>
    {'★'.repeat(count)}{'☆'.repeat(5 - count)}
  </span>
);

// ── Pill / badge ─────────────────────────────────────────────────────────────
export const Badge: React.FC<{
  children: React.ReactNode;
  color?: string;
  bg?: string;
  delay?: number;
}> = ({ children, color = C.green, bg, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = Math.max(0, frame - delay);
  const scale   = spring({ frame: f, fps, config: { stiffness: 180, damping: 14 } });
  const opacity = interpolate(f, [0, 24], [0, 1], { extrapolateRight: 'clamp' });
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '6px 16px',
      borderRadius: 999,
      border: `1px solid ${color}44`,
      background: bg ?? `${color}18`,
      color,
      fontFamily: FONT_BODY,
      fontSize: 14,
      fontWeight: 700,
      letterSpacing: '0.06em',
      opacity,
      transform: `scale(${scale})`,
    }}>
      {children}
    </span>
  );
};
