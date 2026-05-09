import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { SCENES } from './tokens';
import { Scene1Hook }      from './scenes/Scene1Hook';
import { Scene2Problem }   from './scenes/Scene2Problem';
import { Scene3Triage }    from './scenes/Scene3Triage';
import { Scene4AutoReply } from './scenes/Scene4AutoReply';
import { Scene5Alert }     from './scenes/Scene5Alert';
import { Scene6CTA }       from './scenes/Scene6CTA';

// Google Fonts — loaded at composition root so all scenes share them
const GlobalStyle: React.FC = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;1,9..144,500;1,9..144,600&family=Inter:wght@400;500;600;700;800&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
  `}</style>
);

export const ZeroClicksDemo: React.FC = () => (
  <AbsoluteFill>
    <GlobalStyle />

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
  </AbsoluteFill>
);
