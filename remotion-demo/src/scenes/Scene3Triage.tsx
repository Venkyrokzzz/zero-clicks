import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { C, FONT_DISPLAY, FONT_BODY } from '../tokens';
import { PubBg, FadeScene, Eyebrow, Heading, Em } from '../utils';

const TriageRow: React.FC<{
  icon: string; text: string; sub: string; delay: number;
  side: 'left' | 'right'; color: string;
}> = ({ icon, text, sub, delay, side, color }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = Math.max(0, frame - delay);
  const progress = spring({ frame: f, fps, config: { stiffness: 80, damping: 13 } });
  const opacity  = interpolate(f, [0, 40], [0, 1], { extrapolateRight: 'clamp' });
  const x        = (side === 'left' ? -1 : 1) * 40 * (1 - progress);

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '12px 16px',
      borderRadius: 12,
      background: `${color}14`,
      border: `1px solid ${color}30`,
      opacity,
      transform: `translateX(${x}px)`,
      marginBottom: 10,
    }}>
      <span style={{ fontSize: 20 }}>{icon}</span>
      <div>
        <div style={{ fontFamily: FONT_BODY, fontSize: 15, fontWeight: 700, color: C.ink }}>{text}</div>
        <div style={{ fontFamily: FONT_BODY, fontSize: 12, color: C.muted, marginTop: 2 }}>{sub}</div>
      </div>
    </div>
  );
};

const ColumnHeader: React.FC<{ label: string; color: string; icon: string; delay: number }> = ({
  label, color, icon, delay,
}) => {
  const frame   = useCurrentFrame();
  const opacity = interpolate(frame, [delay, delay + 40], [0, 1], { extrapolateRight: 'clamp' });
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      marginBottom: 18, opacity,
    }}>
      <span style={{ fontSize: 18 }}>{icon}</span>
      <span style={{
        fontFamily: FONT_BODY, fontSize: 12, fontWeight: 700,
        letterSpacing: '0.18em', textTransform: 'uppercase' as const, color,
      }}>
        {label}
      </span>
    </div>
  );
};

export const Scene3Triage: React.FC = () => (
  <FadeScene>
    <PubBg />
    <AbsoluteFill style={{
      display: 'flex', flexDirection: 'column',
      justifyContent: 'center', alignItems: 'center',
      padding: '0 80px',
    }}>
      <Eyebrow text="Zero Clicks reads every one" delay={0} />
      <Heading delay={32} size={58}>
        Good reviews <Em>reply themselves.</Em>
        <br />
        You only hear about <Em>what matters.</Em>
      </Heading>

      {/* Two-column triage */}
      <div style={{ display: 'flex', gap: 40, marginTop: 44, width: '100%', maxWidth: 900 }}>
        {/* Auto-handled */}
        <div style={{ flex: 1 }}>
          <ColumnHeader label="Auto-handled" color={C.green} icon="✅" delay={96} />
          <TriageRow icon="⭐" text="★★★★★ — Great food, will return!"  sub="Zero Clicks · 4 min" delay={120} side="left" color={C.green} />
          <TriageRow icon="⭐" text="★★★★ — Lovely atmosphere"          sub="Zero Clicks · 4 min" delay={152} side="left" color={C.green} />
          <TriageRow icon="⭐" text="★★★★★ — Amazing Sunday roast"      sub="Zero Clicks · 4 min" delay={185} side="left" color={C.green} />
        </div>

        {/* Divider */}
        <div style={{ width: 1, background: 'rgba(244,232,204,0.08)', alignSelf: 'stretch' }} />

        {/* Sent to you */}
        <div style={{ flex: 1 }}>
          <ColumnHeader label="Sent to you" color={C.ale} icon="🔔" delay={96} />
          <TriageRow icon="⚠️" text="★★☆☆☆ — Staff were unwelcoming"  sub="WhatsApp alert" delay={137} side="right" color={C.ale} />
          <TriageRow icon="🚨" text="Allergen mentioned in review"        sub="Immediate alert" delay={168} side="right" color={C.red} />
          <TriageRow icon="⚠️" text="★★★☆☆ — Waited 40 min for food"   sub="WhatsApp alert" delay={200} side="right" color={C.ale} />
        </div>
      </div>
    </AbsoluteFill>
  </FadeScene>
);
