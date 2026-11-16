import { describe, expect, it } from "vitest";
import { buildGraph } from "@/components/nodemap/graph";
import { buildDust, buildTargets, createRandoms } from "@/components/nodemap/layout";

const g = buildGraph();
const r = createRandoms(g.nodes.length, g.edges.length);

const snap = (portrait: boolean, R: number) => {
  const t = buildTargets(g, r, portrait, R);
  return { stage: t.stage.map((a) => Array.from(a)), explore: Array.from(t.explore) };
};

describe("graph", () => {
  it("has me + 3 themes + 6 modules + 18 experiences and 30 edges", () => {
    expect(g.nodes.length).toBe(28);
    expect(g.themes.length).toBe(3);
    expect(g.modules.length).toBe(6);
    expect(g.exps.length).toBe(18);
    expect(g.edges.length).toBe(30);
  });
  it("edges only go experience -> module", () => {
    for (const [a, b] of g.edges) {
      expect(g.nodes[a].kind).toBe("exp");
      expect(g.nodes[b].kind).toBe("module");
    }
  });
});

describe("layout is deterministic (resize must not move nodes)", () => {
  it("same viewport gives identical targets, regardless of what was built in between", () => {
    const first = snap(false, 3.6);
    snap(true, 1.7); // simulate a resize to portrait
    snap(false, 2.2);
    const again = snap(false, 3.6);
    expect(again).toEqual(first);
  });
  it("dust is deterministic too", () => {
    const a = buildDust(r, 900, true, 1.7).map((x) => Array.from(x));
    buildDust(r, 1600, false, 3.6);
    const b = buildDust(r, 900, true, 1.7).map((x) => Array.from(x));
    expect(b).toEqual(a);
  });
  it("no NaN anywhere", () => {
    for (const portrait of [true, false]) {
      const t = buildTargets(g, r, portrait, portrait ? 1.7 : 3.6);
      for (const a of [...t.stage, t.explore]) for (const v of a) expect(Number.isFinite(v)).toBe(true);
    }
  });
});
