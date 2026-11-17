/**
 * Colours of the 3D map (Ting, 2026-11-17): a deep space blue sky, neon green for
 * everything bright. Coral red is kept for the worries and "The real problem",
 * so the story reads red while it describes the problem and green once it
 * describes the net.
 *
 * styles/global.css has the same background as `--bg`; tests/theme.test.ts
 * fails if the two drift apart.
 */

export type RGB = [number, number, number];

/** Page and canvas background. */
export const BG_CSS = "#060c28";
export const BG_HEX = 0x060c28;

export const COL: Record<string, RGB> = {
  me: [0.93, 1, 0.96], //     the centre: near white with a green breath
  p: [0.62, 1, 0.72], //      experiences: light green
  kw: [0.25, 1, 0.45], //     modules and pillars: neon green
  red: [0.95, 0.45, 0.4], //  a worry that is lit, a pillar in "The real problem"
  basket: [0.85, 0.62, 0.62], // nodes that sit in a basket on their own
  worry: [0.8, 0.5, 0.48], // worries that are not lit
};

/** Lines of the net. */
export const LINE: RGB = [0.35, 1, 0.6];
/** What the lines turn into while the story describes the problem (stages 1 and 2). */
export const LINE_RED: RGB = [0.8, 0.5, 0.55];

/** Dust: mostly cold starlight, a little neon. A few of these become big soft bokeh discs. */
export const DUST: RGB[] = [
  [0.62, 0.8, 1],
  [0.86, 0.93, 1],
  [0.86, 0.93, 1],
  [0.5, 0.95, 0.8],
  [0.4, 1, 0.55],
];
