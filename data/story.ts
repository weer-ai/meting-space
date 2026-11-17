/**
 * Story-level nodes for the home page 3D map. Copy approved by Ting on 2026-11-16
 * (also written into CONTENT.md, which tests/copy.test.ts checks).
 */
import type { Pillar } from "./nodes";

/**
 * The five pillars. Each is one node on the map:
 *  - `name`         the net on the cover (stage 0)
 *  - `concentrated` a basket that holds only one thing (stage 2, "The real problem")
 *  - `diversified`  the same node once it is spread out (stage 3, "The idea")
 */
export const PILLARS: {
  id: string;
  pillar: Pillar;
  name: string;
  concentrated: string;
  diversified: string;
}[] = [
  { id: "pillar-skill", pillar: "skill", name: "Skills", concentrated: "One skill", diversified: "Stacked skills" },
  { id: "pillar-income", pillar: "income", name: "Income", concentrated: "One income", diversified: "More than one income" },
  { id: "pillar-place", pillar: "place", name: "Places", concentrated: "One place", diversified: "More than one place" },
  { id: "pillar-people", pillar: "people", name: "People", concentrated: "One circle", diversified: "More than one circle" },
  { id: "pillar-money", pillar: "money", name: "Money", concentrated: "One pot", diversified: "More than one pot" },
];

/**
 * What keeps people up at night right now. In "What is happening?" these nodes
 * take turns lighting up around "The world today".
 */
export const WORRIES = [
  "Inflation",
  "AI",
  "Robots taking jobs",
  "Layoffs",
  "Job hunting",
  "Can't keep up",
  "Rising rent",
  "Stale skills",
  "Borders and visas",
] as const;

/** The centre node label on the cover and in the closing. */
export const ME_LABEL = "me/ting";

/** The centre node label in "What is happening?": the world the worries are lighting up around. */
export const ME_NOW_LABEL = "The world today";
