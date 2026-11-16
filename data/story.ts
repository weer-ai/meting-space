/**
 * Story-level nodes for the home page 3D map (DESIGN-BRIEF.md §2).
 * The three theme nodes only show in stage 1 (concentrated bets) and
 * stage 2 (same nodes, relabelled); their alpha is 0 in every other stage.
 */
import type { Group } from "./nodes";

export const THEMES: {
  id: string;
  group: Exclude<Group, "free">;
  /** Label in stage 1 (Why now). */
  concentrated: string;
  /** Label in stage 2 (The idea). */
  diversified: string;
}[] = [
  { id: "theme-skill", group: "skill", concentrated: "One skill", diversified: "Stacked skills" },
  { id: "theme-income", group: "income", concentrated: "One income", diversified: "More than one income" },
  { id: "theme-place", group: "place", concentrated: "One place", diversified: "More than one place" },
];

/** The me/ting centre node label (stages 0 and 5). */
export const ME_LABEL = "me/ting";
