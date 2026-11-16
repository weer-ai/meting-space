import { describe, expect, it } from "vitest";
import { buildGraph } from "@/components/nodemap/graph";
import { STAGES, basketCenter, buildDust, buildMesh, buildTargets, createRandoms, shellPositions } from "@/components/nodemap/layout";

const g = buildGraph();
const mesh = buildMesh(g);
const r = createRandoms(g.nodes.length, g.edges.length + mesh.length);

const snap = (portrait: boolean, R: number) => {
  const t = buildTargets(g, r, portrait, R);
  return { stage: t.stage.map((a) => Array.from(a)), explore: Array.from(t.explore) };
};

describe("graph", () => {
  it("has me + 5 pillars + 6 modules + 18 experiences + 9 worries, and 30 edges", () => {
    expect(g.nodes.length).toBe(39);
    expect(g.pillars.length).toBe(5);
    expect(g.modules.length).toBe(6);
    expect(g.exps.length).toBe(18);
    expect(g.worries.length).toBe(9);
    expect(g.net.length).toBe(29);
    expect(g.edges.length).toBe(30);
  });
  it("edges only go experience -> module", () => {
    for (const [a, b] of g.edges) {
      expect(g.nodes[a].kind).toBe("exp");
      expect(g.nodes[b].kind).toBe("module");
    }
  });
  it("every experience belongs to one of the five pillars", () => {
    const seen = new Set(g.exps.map((i) => g.nodes[i].pillar));
    expect([...seen].sort()).toEqual(["income", "money", "people", "place", "skill"]);
  });
});

describe("the net (cover and closing)", () => {
  it("no two net nodes share a spot on the shell", () => {
    const pos = shellPositions(g, 1);
    let min = Infinity;
    for (const a of g.net) for (const b of g.net) {
      if (a >= b) continue;
      min = Math.min(min, Math.hypot(pos[a * 3] - pos[b * 3], pos[a * 3 + 1] - pos[b * 3 + 1], pos[a * 3 + 2] - pos[b * 3 + 2]));
    }
    expect(min).toBeGreaterThan(0.15);
  });
  it("the weave is deterministic, joins net nodes only, and never doubles a structural edge", () => {
    expect(buildMesh(g)).toEqual(mesh);
    const net = new Set(g.net);
    const struct = new Set(g.edges.map(([a, b]) => (a < b ? `${a}-${b}` : `${b}-${a}`)));
    const seen = new Set<string>();
    expect(mesh.length).toBeGreaterThan(30);
    for (const [a, b] of mesh) {
      expect(net.has(a) && net.has(b)).toBe(true);
      const k = a < b ? `${a}-${b}` : `${b}-${a}`;
      expect(struct.has(k)).toBe(false);
      expect(seen.has(k)).toBe(false);
      seen.add(k);
    }
  });
});

describe("layout is deterministic (resize must not move nodes)", () => {
  it("builds one target set per stage", () => {
    expect(STAGES).toBe(7);
    expect(buildTargets(g, r, false, 3.6).stage.length).toBe(STAGES);
    expect(buildDust(r, 900, false, 3.6).length).toBe(STAGES);
  });
  it("same viewport gives identical targets, regardless of what was built before", () => {
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

describe("stage 2: five separate baskets", () => {
  for (const portrait of [true, false]) {
    it(`${portrait ? "phone" : "desktop"}: each experience sits inside its own pillar's basket, and baskets do not touch`, () => {
      const R = portrait ? 1.7 : 3.6;
      const t = buildTargets(g, r, portrait, R).stage[2];
      const centers = g.pillars.map((p) => basketCenter(g.nodes[p].pillar!, portrait, R));
      const rb = R * (portrait ? 0.22 : 0.3);
      for (const i of g.exps) {
        const [cx, cy] = centers[g.pillars.findIndex((p) => g.nodes[p].pillar === g.nodes[i].pillar)];
        expect(Math.hypot(t[i * 3] - cx, t[i * 3 + 1] - cy)).toBeLessThanOrEqual(rb * 1.01);
      }
      for (let a = 0; a < 5; a++) for (let b = a + 1; b < 5; b++) {
        expect(Math.hypot(centers[a][0] - centers[b][0], centers[a][1] - centers[b][1])).toBeGreaterThan(rb * 2.4);
      }
    });
  }
  it("on a phone every basket stays above the text shade (world y high enough)", () => {
    // root is lifted by 2.95 on phones; the shade starts ~38svh down, about world y 2.0 after the lift
    for (const p of g.pillars) {
      const [, y] = basketCenter(g.nodes[p].pillar!, true, 1.7);
      expect(y + 2.95 - 1.7 * 0.22).toBeGreaterThan(2.0);
    }
  });
});
