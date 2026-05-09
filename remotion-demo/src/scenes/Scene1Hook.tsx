import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { C, FONT_DISPLAY, FONT_BODY } from '../tokens';
import { PubBg, FadeScene, Em } from '../utils';

// Pulsing notification dot — represents the review arriving
const ReviewPing: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = interpolate(
    frame % 120, [0, 60, 120], [1, 1.6, 1],
    { extrapolateRight: 'clamp' }
  );
  const opacity = interpolate(frame, [161, 209], [0, 1], { extrapolateRight: 'clamp' });
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, opacity, marginTop: 32 }}>
      <div style={{
        width: 10, height: 10, borderRadius: '50%',
        background: C.ale,
        transform: `scale(${pulse})`,
        boxShadow: `0 0 ${8 * pulse}px ${C.ale}`,
      }} />
      <span style={{
        fontFamily: FONT_BODY, fontSize: 18, color: C.muted,
        letterSpacing: '0.12em', textTransform: 'uppercase' as const, fontWeight: 700,
      }}>
        Every review · Every star · 24 hours a day
      </span>
    </div>
  );
};

export const Scene1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Timestamp
  const tsOpacity   = interpolate(frame, [17, 65], [0, 1], { extrapolateRight: 'clamp' });
  const tsY         = interpolate(frame, [17, 65], [14, 0], { extrapolateRight: 'clamp' });

  // Headline
  const h1Progress  = spring({ frame: Math.max(0, frame - 56), fps, config: { stiffness: 90, damping: 14 } });
  const h1Opacity   = interpolate(frame, [56, 104], [0, 1], { extrapolateRight: 'clamp' });

  // Italic second line (slightly delayed)
  const h2Progress  = spring({ frame: Math.max(0, frame - 89), fps, config: { stiffness: 90, damping: 14 } });
  const h2Opacity   = interpolate(frame, [89, 137], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <FadeScene>
      <PubBg />
      <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '0 120px' }}>

        {/* Timestamp */}
        <p style={{
          fontFamily: FONT_DISPLAY,
          fontStyle: 'italic',
          fontSize: 22,
          color: C.copper,
          letterSpacing: '0.08em',
          opacity: tsOpacity,
          transform: `translateY(${tsY}px)`,
          margin: '0 0 28px',
        }}>
          Friday · 11:47pm
        </p>

        {/* Line 1 */}
        <h1 style={{
          fontFamily: FONT_DISPLAY,
          fontSize: 74,
          fontWeight: 500,
          color: C.ink,
          lineHeight: 1.1,
          textAlign: 'center',
          margin: 0,
          opacity: h1Opacity,
          transform: `translateY(${22 * (1 - h1Progress)}px)`,
        }}>
          Your pub just got a review.
        </h1>

        {/* Line 2 — italic accent */}
        <h1 style={{
          fontFamily: FONT_DISPLAY,
          fontSize: 74,
          fontWeight: 500,
          color: C.ale,
          fontStyle: 'italic',
          lineHeight: 1.2,
          textAlign: 'center',
          margin: '8px 0 0',
          opacity: h2Opacity,
          transform: `translateY(${22 * (1 - h2Progress)}px)`,
        }}>
          Zero Clicks is already on it.
        </h1>

        <ReviewPing />
      </AbsoluteFill>
    </FadeScene>
  );
};
