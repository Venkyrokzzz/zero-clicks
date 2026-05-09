import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { C, FONT_DISPLAY, FONT_BODY } from '../tokens';
import { PubBg, FadeScene, Eyebrow, Heading, Em, Badge, Walker } from '../utils';

const WhatsAppPhone: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = Math.max(0, frame - delay);

  const progress  = spring({ frame: f, fps, config: { stiffness: 65, damping: 13 } });
  const opacity   = interpolate(f, [0, 40], [0, 1], { extrapolateRight: 'clamp' });
  const y         = 50 * (1 - progress);

  // Staggered content reveals
  const msgOpacity  = interpolate(f, [72, 120], [0, 1], { extrapolateRight: 'clamp' });
  const draftOpacity = interpolate(f, [128, 176], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <div style={{
      width: 300,
      borderRadius: 28,
      overflow: 'hidden',
      border: `1px solid rgba(37,211,102,0.18)`,
      background: '#0b141a',
      boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(37,211,102,0.06)',
      opacity,
      transform: `translateY(${y}px)`,
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '14px 16px',
        background: '#1f2c34',
        borderBottom: '1px solid rgba(37,211,102,0.08)',
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: 'linear-gradient(135deg, #25d366, #128c7e)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: FONT_DISPLAY, fontWeight: 700, color: '#fff', fontSize: 15,
        }}>Z</div>
        <div>
          <div style={{ color: '#fff', fontFamily: FONT_BODY, fontSize: 14, fontWeight: 700 }}>Zero Clicks</div>
          <div style={{ color: C.waGreen, fontFamily: FONT_BODY, fontSize: 11, marginTop: 2 }}>
            ● Online · WhatsApp
          </div>
        </div>
      </div>

      {/* Message bubble */}
      <div style={{ padding: '14px 12px', background: '#0d1f2b' }}>
        <div style={{
          padding: '12px 14px 8px',
          borderRadius: '0 10px 10px 10px',
          background: '#1e2d35',
          opacity: msgOpacity,
        }}>
          <div style={{ color: C.waGreen, fontFamily: FONT_BODY, fontSize: 12, fontWeight: 800, marginBottom: 5 }}>
            Zero Clicks Bot
          </div>
          {/* Alert header */}
          <div style={{
            fontFamily: FONT_BODY, fontSize: 13, fontWeight: 800,
            color: C.red, marginBottom: 6,
          }}>
            🚨 Complaint — The Sun Tavern
          </div>
          {/* Stars */}
          <div style={{ fontSize: 13, color: C.ale, marginBottom: 8 }}>
            ★★☆☆☆ · Mark T. · 2 stars
          </div>
          {/* Snippet */}
          <div style={{
            fontFamily: FONT_BODY, fontSize: 12, color: 'rgba(255,255,255,0.5)',
            fontStyle: 'italic',
            borderLeft: `2px solid #2d4a5a`,
            paddingLeft: 8, marginBottom: 10,
          }}>
            "mentioned a nut allergy, staff seemed unsure…"
          </div>

          {/* Draft reply */}
          <div style={{ opacity: draftOpacity }}>
            <div style={{
              fontFamily: FONT_BODY, fontSize: 10, fontWeight: 800,
              color: C.waGreen, letterSpacing: '0.14em',
              textTransform: 'uppercase' as const, marginBottom: 7,
            }}>
              ✦ Draft reply ready to copy
            </div>
            <div style={{
              padding: '10px 12px',
              borderRadius: 8,
              background: '#2a3942',
              color: 'rgba(255,255,255,0.87)',
              fontFamily: FONT_BODY, fontSize: 12, lineHeight: 1.55,
            }}>
              Hi Mark, I'm really sorry to hear about your experience — that's absolutely not good enough. Please reach out so we can make this right. — Tom
            </div>
          </div>

          {/* WA meta */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 4, marginTop: 8 }}>
            <span style={{ fontFamily: FONT_BODY, fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>11:47 PM</span>
            <span style={{ color: '#53bdeb', fontSize: 12, letterSpacing: -1 }}>✓✓</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Scene5Alert: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Customer coming back after reply
  const comebackDelay = 288;
  const f = Math.max(0, frame - comebackDelay);
  const progress  = spring({ frame: f, fps, config: { stiffness: 60, damping: 13 } });
  const comebackOpacity = interpolate(f, [0, 40], [0, 1], { extrapolateRight: 'clamp' });
  const cx = interpolate(progress, [0, 1], [-50, 0]);

  return (
    <FadeScene>
      <PubBg glow="radial-gradient(ellipse 60% 50% at 30% 50%, rgba(255,113,102,0.08), transparent 55%)" />
      <AbsoluteFill style={{
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center',
        padding: '0 80px',
      }}>
        <Eyebrow text="Complaints and allergens reach you fast" delay={0} color={C.ale} />
        <Heading delay={32} size={56}>
          <Em color={C.ink}>The replies that matter</Em>
          <br />
          land on your phone <Em>immediately.</Em>
        </Heading>

        <div style={{ display: 'flex', alignItems: 'center', gap: 60, marginTop: 36 }}>
          <WhatsAppPhone delay={89} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {/* Posted badge */}
            <Badge color={C.ale} delay={216}>
              Copied & posted by owner · 8 min
            </Badge>

            {/* Customer comes back */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
              opacity: comebackOpacity,
              transform: `translateX(${cx}px)`,
            }}>
              <Walker color={C.green} size={36} />
              <p style={{
                fontFamily: FONT_BODY, fontSize: 14, fontWeight: 700,
                color: C.green, fontStyle: 'italic', margin: 0,
              }}>
                They read your reply.<br />They're coming back.
              </p>
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </FadeScene>
  );
};
