import React from 'react';
import { Composition } from 'remotion';
import { ZeroClicksDemo } from './Demo';
import { ZeroClicksDemoIG } from './DemoIG';
import { TOTAL_FRAMES, FPS } from './tokens';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="ZeroClicksDemo"
      component={ZeroClicksDemo}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={1280}
      height={720}
    />
    <Composition
      id="ZeroClicksDemoIG"
      component={ZeroClicksDemoIG}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={1080}
      height={1920}
    />
  </>

);
