import { EXPERIENCES, MODULES, type Pillar } from "@/data/nodes";
import { ME_LABEL, PILLARS, WORRIES } from "@/data/story";

export type NodeKind = "me" | "pillar" | "module" | "exp" | "worry";

export type GNode = {
  i: number;
  id: string;
  kind: NodeKind;
  /** Display name (card title, default label). */
  name: string;
  /** Experiences and pillar nodes only. */
  pillar: Pillar | null;
  year?: string;
  text: string;
  proof: boolean;
  tbd: boolean;
  /** Connected node indexes: experience -> its modules, module -> its experiences. */
  links: number[];
  /** Pillar nodes: label per stage. */
  concentrated?: string;
  diversified?: string;
};

export type Graph = {
  nodes: GNode[];
  /** [experience, module] pairs. */
  edges: [number, number][];
  ME: number;
  pillars: number[];
  modules: number[];
  exps: number[];
  worries: number[];
  /** The woven net on the cover and in the closing: pillars, modules and experiences (not the worries). */
  net: number[];
};

/** Order matters for layout seeds: me, pillars, modules, experiences, worries. */
export function buildGraph(): Graph {
  const nodes: GNode[] = [];
  const push = (n: Omit<GNode, "i" | "links">): number => {
    nodes.push({ ...n, i: nodes.length, links: [] });
    return nodes.length - 1;
  };
  const blank = { text: "", proof: false, tbd: false };

  const ME = push({ id: "me", kind: "me", name: ME_LABEL, pillar: null, ...blank });
  const pillars = PILLARS.map((p) =>
    push({ id: p.id, kind: "pillar", name: p.name, pillar: p.pillar, ...blank, concentrated: p.concentrated, diversified: p.diversified }),
  );
  const modules = MODULES.map((m) =>
    push({ id: `module-${m.name}`, kind: "module", name: m.name, pillar: null, text: m.text, proof: false, tbd: false }),
  );
  const exps = EXPERIENCES.map((e) =>
    push({ id: e.id, kind: "exp", name: e.name, pillar: e.pillar, year: e.year, text: e.text, proof: !!e.proof, tbd: !!e.tbd }),
  );
  const worries = WORRIES.map((w, k) => push({ id: `worry-${k}`, kind: "worry", name: w, pillar: null, ...blank }));

  const edges: [number, number][] = [];
  EXPERIENCES.forEach((e, k) => {
    const from = exps[k];
    e.modules.forEach((name) => {
      const to = modules[MODULES.findIndex((m) => m.name === name)];
      edges.push([from, to]);
      nodes[from].links.push(to);
      nodes[to].links.push(from);
    });
  });

  return { nodes, edges, ME, pillars, modules, exps, worries, net: [...pillars, ...modules, ...exps] };
}
