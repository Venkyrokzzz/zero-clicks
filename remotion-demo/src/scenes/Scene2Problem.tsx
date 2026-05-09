import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { C, FONT_DISPLAY, FONT_BODY } from '../tokens';
import { PubBg, FadeScene, Eyebrow, Heading, Em, Walker } from '../utils';

// Single floating review slip
const ReviewSlip: React.FC<{ stars: number; delay: number; x: number }> = ({ stars, delay, x }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = Math.max(0, frame - delay);
  const progress = spring({ frame: f, fps, config: { stiffness: 60, damping: 12 } });
  const opacity  = interpolate(f, [0, 40], [0, 1], { extrapolateRight: 'clamp' });
  const y        = interpolate(progress, [0, 1], [-40, 0]);

  return (
    <div style={{
      position: 'absolute',
      left: x,
      opacity,
      transform: `translateY(${y}px)`,
    }}>
      <div style={{
        padding: '14px 20px',
        background: C.foam,
        borderRadius: 6,
        boxShadow: '0 8px 28px rgba(0,0,0,0.4)',
        minWidth: 180,
      }}>
        <div style={{ fontSize: 16, color: '#fbbc04', letterSpacing: 2, marginBottom: 6 }}>
          {'★'.repeat(stars)}{'☆'.repeat(5 - stars)}
        </div>
        <div style={{
          fontFamily: FONT_BODY, fontSize: 12, fontWeight: 700,
          color: C.red, letterSpacing: '0.12em', textTransform: 'uppercase' as const,
        }}>
          Unanswered
        </div>
      </div>
    </div>
  );
};

// Counting stat number
const CountStat: React.FC<{ label: string; value: number; delay: number; color?: string }> = ({
  label, value, delay, color = C.ale,
}) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);
  const displayed = Math.round(interpolate(f, [0, 80], [0, value], { extrapolateRight: 'clamp' }));
  const opacity   = interpolate(f, [0, 32], [0, 1], { extrapolateRight: 'clamp' });
  return (
    <div style={{ textAlign: 'center' as const, opacity }}>
      <div style={{ fontFamily: FONT_DISPLAY, fontStyle: 'italic', fontSize: 68, fontWeight: 500, color, lineHeight: 1 }}>
        {displayed}
      </div>
      <div style={{ fontFamily: FONT_BODY, fontSize: 12, fontWeight: 700, color: C.muted, letterSpacing: '0.16em', textTransform: 'uppercase' as const, marginTop: 8 }}>
        {label}
      </div>
    </div>
  );
};

// Walker that approaches and leaves
const WalkingCustomer: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);

  // Walk in → pause → turn → walk out
  const x = interpolate(f,
    [0,   48, 140, 200, 281],
    [120,  0,   0, -120, -140],
    { extrapolateRight: 'clamp' }
  );
  const scaleX = f < 168 ? -1 : 1; // flip direction when leaving
  const opacity = interpolate(f, [0, 32, 221, 272], [0, 1, 1, 0], { extrapolateRight: 'clamp' });

  return (
    <div style={{
      position: 'absolute',
      transform: `translateX(${x}px) scaleX(${scaleX})`,
      opacity,
    }}>
      <Walker color={C.muted} size={40} />
    </div>
  );
};

export const Scene2Problem: React.FC = () => {
  return (
    <FadeScene>
      <PubBg />
      <AbsoluteFill style={{
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center',
        padding: '0 100px',
      }}>
        <Eyebrow text="The pile never stops" delay={0} />

        <Heading delay={8}>
          Reviews arrive <Em>all night.</Em>
          <br />
          Replies wait for a <Em>quiet Tuesday.</Em>
        </Heading>

        {/* Floating review slips */}
        <div style={{ position: 'relative', height: 80, width: 600, margin: '36px 0' }}>
          <ReviewSlip stars={1} delay={80}  x={30}  />
          <ReviewSlip stars={2} delay={113} x={220} />
          <ReviewSlip stars={3} delay={144} x={420} />
        </div>

        {/* Stats */}
        <div style={{
          display: 'flex', gap: 60, alignItems: 'center',
          padding: '24px 48px',
          border: `1px solid rgba(244,232,204,0.12)`,
          borderRadius: 16,
          background: 'rgba(244,232,204,0.03)',
          margin: '8px 0 32px',
        }}>
          <CountStat value={30} label="Pubs checked"  delay={176} />
          <div style={{ width: 1, height: 52, background: 'rgba(244,232,204,0.1)' }} />
          <CountStat value={26} label="Unanswered reviews" delay={200} color={C.red} />
          <div style={{ width: 1, height: 52, background: 'rgba(244,232,204,0.1)' }} />
          <CountStat value={0}  label="Replies posted" delay={224} />
        </div>

        {/* Walking customers */}
        <div style={{ position: 'relative', height: 48, width: 500 }}>
          <WalkingCustomer delay={248} />
          <WalkingCustomer delay={296} />
          <WalkingCustomer delay={344} />
        </div>
        <p style={{ fontFamily: FONT_BODY, fontSize: 13, fontWeight: 700, color: C.red, letterSpacing: '0.14em', textTransform: 'uppercase' as const, margin: 0 }}>
          26 potential bookings · walked
        </p>
      </AbsoluteFill>
    </FadeScene>
  );
};
