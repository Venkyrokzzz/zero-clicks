import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { C, FONT_DISPLAY, FONT_BODY } from '../tokens';
import { PubBg, FadeScene, Eyebrow } from '../utils';

const FeatureCard: React.FC<{ icon: string; title: string; desc: string; delay: number }> = ({
  icon, title, desc, delay,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f        = Math.max(0, frame - delay);
  const progress = spring({ frame: f, fps, config: { stiffness: 90, damping: 13 } });
  const opacity  = interpolate(f, [0, 32], [0, 1], { extrapolateRight: 'clamp' });
  const y        = 20 * (1 - progress);

  return (
    <div style={{
      flex: 1,
      padding: '20px 18px',
      border: `1px solid rgba(244,232,204,0.1)`,
      borderRadius: 14,
      background: 'rgba(244,232,204,0.03)',
      textAlign: 'center' as const,
      opacity,
      transform: `translateY(${y}px)`,
    }}>
      <div style={{ fontSize: 28, marginBottom: 10 }}>{icon}</div>
      <div style={{ fontFamily: FONT_DISPLAY, fontSize: 16, fontWeight: 600, color: C.ink, marginBottom: 5 }}>
        {title}
      </div>
      <div style={{ fontFamily: FONT_BODY, fontSize: 12, color: C.muted, lineHeight: 1.5 }}>
        {desc}
      </div>
    </div>
  );
};

export const Scene6CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // URL springs in big
  const urlProgress = spring({ frame: Math.max(0, frame - 17), fps, config: { stiffness: 80, damping: 12 } });
  const urlOpacity  = interpolate(frame, [17, 65], [0, 1], { extrapolateRight: 'clamp' });

  // Tagline
  const tagOpacity  = interpolate(frame, [56, 96], [0, 1], { extrapolateRight: 'clamp' });

  // CTA button
  const btnProgress = spring({ frame: Math.max(0, frame - 80), fps, config: { stiffness: 110, damping: 13 } });
  const btnOpacity  = interpolate(frame, [80, 120], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <FadeScene>
      <PubBg glow="radial-gradient(ellipse 70% 50% at 50% 80%, rgba(232,168,70,0.18), transparent 60%)" />
      <AbsoluteFill style={{
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center',
        padding: '0 80px',
      }}>
        <Eyebrow text="Zero Clicks · UK pubs only" delay={0} />


        {/* URL — the hero element */}
        <div style={{
          fontFamily: FONT_DISPLAY,
          fontStyle: 'italic',
          fontSize: 80,
          fontWeight: 500,
          color: C.ale,
          opacity: urlOpacity,
          transform: `scale(${0.85 + 0.15 * urlProgress})`,
          marginBottom: 6,
          letterSpacing: '-0.01em',
        }}>
          0-clicks.uk
        </div>

        {/* Tagline */}
        <p style={{
          fontFamily: FONT_DISPLAY,
          fontStyle: 'italic',
          fontSize: 26,
          color: C.muted,
          opacity: tagOpacity,
          margin: '0 0 32px',
          textAlign: 'center' as const,
        }}>
          One less thing to open your laptop for.
        </p>

        {/* CTA button */}
        <div style={{
          padding: '16px 42px',
          borderRadius: 12,
          background: `linear-gradient(135deg, ${C.ale}, ${C.aleBright})`,
          color: C.stout,
          fontFamily: FONT_BODY,
          fontSize: 18,
          fontWeight: 800,
          opacity: btnOpacity,
          transform: `scale(${0.9 + 0.1 * btnProgress})`,
          boxShadow: `0 14px 40px rgba(232,168,70,0.32)`,
          marginBottom: 40,
        }}>
          Book a free 15-min call
        </div>

        {/* Feature cards */}
        <div style={{ display: 'flex', gap: 16, width: '100%', maxWidth: 700 }}>
          <FeatureCard icon="⚡" title="4 min avg reply"    desc="Faster than any human on any shift"   delay={113} />
          <FeatureCard icon="🚨" title="Allergen alerts"    desc="Flagged immediately, every time"       delay={128} />
          <FeatureCard icon="📱" title="Live in 48 hrs"     desc="We set it up. You're live by tomorrow." delay={144} />
        </div>
      </AbsoluteFill>
    </FadeScene>
  );
};
