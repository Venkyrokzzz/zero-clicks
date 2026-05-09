import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { C, FONT_DISPLAY, FONT_BODY } from '../tokens';
import { PubBg, FadeScene, Eyebrow, Heading, Em, Stars, Badge } from '../utils';

// Animated timer: 0:00 → 4:07
const Timer: React.FC<{ delay: number }> = ({ delay }) => {
  const frame   = useCurrentFrame();
  const f       = Math.max(0, frame - delay);
  // 59 frames to count from 0 to 247 seconds (4:07)
  const secs    = Math.round(interpolate(f, [0, 89], [0, 247], { extrapolateRight: 'clamp' }));
  const mins    = Math.floor(secs / 60);
  const s       = secs % 60;
  const opacity = interpolate(f, [0, 32], [0, 1], { extrapolateRight: 'clamp' });
  return (
    <div style={{
      fontFamily: FONT_DISPLAY,
      fontStyle: 'italic',
      fontSize: 52,
      color: C.aleBright,
      opacity,
      letterSpacing: '0.04em',
    }}>
      {mins}:{String(s).padStart(2, '0')}
    </div>
  );
};

// Google review card
const GoogleCard: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f       = Math.max(0, frame - delay);
  const progress = spring({ frame: f, fps, config: { stiffness: 70, damping: 13 } });
  const opacity  = interpolate(f, [0, 40], [0, 1], { extrapolateRight: 'clamp' });
  const y        = 40 * (1 - progress);

  return (
    <div style={{
      padding: '22px 28px',
      background: '#fff',
      borderRadius: 14,
      boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
      width: 380,
      opacity,
      transform: `translateY(${y}px)`,
      textAlign: 'left' as const,
    }}>
      {/* Google header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
        <svg width="16" height="16" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        <span style={{ fontFamily: FONT_BODY, fontSize: 13, color: '#5f6368', fontWeight: 600 }}>Google Review</span>
      </div>
      {/* Reviewer */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <div style={{
          width: 34, height: 34, borderRadius: '50%',
          background: '#4285F4', display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontWeight: 700, fontSize: 14,
        }}>S</div>
        <div>
          <div style={{ fontFamily: FONT_BODY, fontWeight: 700, fontSize: 14, color: '#202124' }}>Sarah M.</div>
          <div style={{ fontFamily: FONT_BODY, fontSize: 12, color: '#70757a' }}>2 hours ago · Local Guide</div>
        </div>
      </div>
      <Stars count={5} size={16} />
      <p style={{
        fontFamily: FONT_BODY, fontSize: 14, color: '#3c4043',
        lineHeight: 1.55, margin: '10px 0 0',
      }}>
        "Amazing Sunday roast, staff were brilliant. Best pub in the area — will definitely be back!"
      </p>
    </div>
  );
};

export const Scene4AutoReply: React.FC = () => {
  const frame = useCurrentFrame();
  const replyBadgeDelay = 209;
  const notifDelay      = 264;

  const notifOpacity = interpolate(frame, [notifDelay, notifDelay + 40], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <FadeScene>
      <PubBg glow="radial-gradient(ellipse 60% 50% at 50% 40%, rgba(126,217,155,0.10), transparent 55%)" />
      <AbsoluteFill style={{
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center',
        padding: '0 80px',
      }}>
        <Eyebrow text="4 and 5 star reviews" delay={0} color={C.green} />
        <Heading delay={32} size={60}>
          Replied in <Em color={C.aleBright}>4 minutes.</Em>
          <br />
          While you were <Em>behind the bar.</Em>
        </Heading>

        <div style={{ display: 'flex', alignItems: 'center', gap: 60, marginTop: 44 }}>
          <GoogleCard delay={89} />

          <div style={{ textAlign: 'center' as const }}>
            {/* Arrow */}
            <div style={{
              fontSize: 32, color: C.green, marginBottom: 8,
              opacity: interpolate(frame, [120, 161], [0, 1], { extrapolateRight: 'clamp' }),
            }}>→</div>
            <Timer delay={144} />
            <div style={{ fontFamily: FONT_BODY, fontSize: 13, color: C.muted, marginTop: 4 }}>
              minutes
            </div>
            {/* Reply posted badge */}
            <div style={{ marginTop: 22 }}>
              <Badge color={C.green} delay={replyBadgeDelay}>✓ Zero Clicks replied</Badge>
            </div>
            {/* Owner never notified */}
            <p style={{
              fontFamily: FONT_BODY, fontSize: 13, color: C.muted,
              opacity: notifOpacity, margin: '14px 0 0',
              fontStyle: 'italic',
            }}>
              You were on shift. It never stopped.
            </p>
          </div>
        </div>
      </AbsoluteFill>
    </FadeScene>
  );
};
