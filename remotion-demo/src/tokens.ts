// ── Palette ─────────────────────────────────────────────────────────────────
export const C = {
  stout:     '#0a0806',
  oak:       '#1c140d',
  oakLight:  '#3a281a',
  copper:    '#b8743d',
  ale:       '#e8a846',
  aleBright: '#ffc96b',
  foam:      '#f8edd0',
  muted:     '#8a7e68',
  ink:       '#fbf5e6',
  green:     '#7ed99b',
  red:       '#ff7166',
  waGreen:   '#25d366',
  waGreenDim:'#128c7e',
  blue:      '#7ab7ff',
};

// ── Typography ───────────────────────────────────────────────────────────────
export const FONT_DISPLAY = '"Fraunces", Georgia, serif';
export const FONT_BODY    = '"Inter", system-ui, -apple-system, sans-serif';

// ── Timing (frames at 60fps) ─────────────────────────────────────────────────
export const FPS      = 60;
export const OVERLAP  = 60; // cross-fade overlap between scenes

// Scene sequence: each scene starts 60 frames before previous ends
// Total = 1800 frames = 30 seconds @ 60fps
export const SCENES = {
  s1: { from: 0,    dur: 360 },   // 0:00 – 6:00
  s2: { from: 300,  dur: 420 },   // 5:00 – 12:00
  s3: { from: 660,  dur: 360 },   // 11:00 – 17:00
  s4: { from: 960,  dur: 360 },   // 16:00 – 22:00
  s5: { from: 1260, dur: 420 },   // 21:00 – 28:00
  s6: { from: 1620, dur: 180 },   // 27:00 – 30:00
};

export const TOTAL_FRAMES = 1800;
