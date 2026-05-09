import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { SCENES, C, FONT_DISPLAY, FONT_BODY } from './tokens';
import { Scene1Hook }      from './scenes/Scene1Hook';
import { Scene2Problem }   from './scenes/Scene2Problem';
import { Scene3Triage }    from './scenes/Scene3Triage';
import { Scene4AutoReply } from './scenes/Scene4AutoReply';
import { Scene5Alert }     from './scenes/Scene5Alert';
import { Scene6CTA }       from './scenes/Scene6CTA';

// ── Layout constants ───────────────────────���──────────────────────────────────
const CONTENT_W = 1280;
const CONTENT_H = 720;
const FRAME_W   = 1080;
const FRAME_H   = 1920;
const SCALE     = FRAME_W / CONTENT_W;          // 0.84375
const SCALED_H  = CONTENT_H * SCALE;            // 607.5
const BAND_H    = (FRAME_H - SCALED_H) / 2;     // 656.25 each

// ── Top brand band ─────────────────────────���───────────────────────────────────
const IGTop: React.FC = () => (
  <div style={{
    position: 'absolute', top: 0, left: 0, right: 0, height: BAND_H,
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center', gap: 14,
    background: `radial-gradient(ellipse 80% 60% at 50% 100%, rgba(232,168,70,0.14), transparent 70%), ${C.stout}`,
  }}>
    <div style={{
      fontFamily: FONT_DISPLAY,
      fontStyle: 'italic',
      fontSize: 62,
      fontWeight: 600,
      color: C.ale,
      letterSpacing: '-0.01em',
    }}>
      Zero Clicks
    </div>
    <div style={{
      fontFamily: FONT_BODY,
      fontSize: 18,
      fontWeight: 700,
      color: C.muted,
      letterSpacing: '0.18em',
      textTransform: 'uppercase' as const,
    }}>
      AI for UK Pubs
    </div>
  </div>
);

// ── Bottom CTA band ────────────────────────────────��───────────────────────────
const IGBottom: React.FC = () => (
  <div style={{
    position: 'absolute', bottom: 0, left: 0, right: 0, height: BAND_H,
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center', gap: 20,
    background: `radial-gradient(ellipse 80% 60% at 50% 0%, rgba(232,168,70,0.12), transparent 70%), ${C.stout}`,
  }}>
    <div style={{
      fontFamily: FONT_DISPLAY,
      fontStyle: 'italic',
      fontSize: 52,
      fontWeight: 500,
      color: C.ink,
    }}>
      0-clicks.uk
    </div>
    <div style={{
      padding: '16px 44px',
      borderRadius: 999,
      background: `linear-gradient(135deg, ${C.ale}, ${C.aleBright})`,
      color: C.stout,
      fontFamily: FONT_BODY,
      fontSize: 18,
      fontWeight: 800,
      boxShadow: `0 12px 36px rgba(232,168,70,0.30)`,
    }}>
      Book a free 15-min call
    </div>
    <div style={{
      fontFamily: FONT_BODY,
      fontSize: 15,
      color: C.muted,
      letterSpacing: '0.08em',
    }}>
      Link in bio
    </div>
  </div>
);

// ── Google Fonts ─────────────────────────────────────────────��────────────────
const GlobalStyle: React.FC = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;1,9..144,500;1,9..144,600&family=Inter:wght@400;500;600;700;800&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
  `}</style>
);

// ── Main IG composition ───────────────────────────��───────────────────────────
export const ZeroClicksDemoIG: React.FC = () => (
  <AbsoluteFill style={{ background: C.stout }}>
    <GlobalStyle />

    {/* Top branding */}
    <IGTop />

    {/* Scaled 16:9 content — sits in the middle band */}
    <div style={{
      position: 'absolute',
      top: BAND_H,
      left: 0,
      width: CONTENT_W,
      height: CONTENT_H,
      transform: `scale(${SCALE})`,
      transformOrigin: 'top left',
    }}>
      <Sequence from={SCENES.s1.from} durationInFrames={SCENES.s1.dur}>
        <Scene1Hook />
      </Sequence>
      <Sequence from={SCENES.s2.from} durationInFrames={SCENES.s2.dur}>
        <Scene2Problem />
      </Sequence>
      <Sequence from={SCENES.s3.from} durationInFrames={SCENES.s3.dur}>
        <Scene3Triage />
      </Sequence>
      <Sequence from={SCENES.s4.from} durationInFrames={SCENES.s4.dur}>
        <Scene4AutoReply />
      </Sequence>
      <Sequence from={SCENES.s5.from} durationInFrames={SCENES.s5.dur}>
        <Scene5Alert />
      </Sequence>
      <Sequence from={SCENES.s6.from} durationInFrames={SCENES.s6.dur}>
        <Scene6CTA />
      </Sequence>
    </div>

    {/* Bottom CTA */}
    <IGBottom />
  </AbsoluteFill>
);
