import { EXPERIENCES, MODULES, type Group } from "@/data/nodes";
import { ME_LABEL, THEMES } from "@/data/story";

export type NodeKind = "me" | "theme" | "module" | "exp";

export type GNode = {
  i: number;
  id: string;
  kind: NodeKind;
  /** Display name (card title, label). */
  name: string;
  group: Group;
  year?: string;
  text: string;
  proof: boolean;
  tbd: boolean;
  /** Connected node indexes: experience -> its modules, module -> its experiences. */
  links: number[];
  /** Theme nodes: label per stage. */
  concentrated?: string;
  diversified?: string;
};

export type Graph = {
  nodes: GNode[];
  /** [experience, module] pairs. */
  edges: [number, number][];
  ME: number;
  themes: number[];
  modules: number[];
  exps: number[];
};

/** Order matters for layout seeds: me, themes, modules, experiences. */
export function buildGraph(): Graph {
  const nodes: GNode[] = [];
  const push = (n: Omit<GNode, "i" | "links">): number => {
    nodes.push({ ...n, i: nodes.length, links: [] });
    return nodes.length - 1;
  };

  const ME = push({ id: "me", kind: "me", name: ME_LABEL, group: "free", text: "", proof: false, tbd: false });
  const themes = THEMES.map((t) =>
    push({
      id: t.id,
      kind: "theme",
      name: t.concentrated,
      group: t.group,
      text: "",
      proof: false,
      tbd: false,
      concentrated: t.concentrated,
      diversified: t.diversified,
    }),
  );
  const modules = MODULES.map((m) =>
    push({ id: `module-${m.name}`, kind: "module", name: m.name, group: "free", text: m.text, proof: false, tbd: false }),
  );
  const exps = EXPERIENCES.map((e) =>
    push({
      id: e.id,
      kind: "exp",
      name: e.name,
      group: e.group,
      year: e.year,
      text: e.text,
      proof: !!e.proof,
      tbd: !!e.tbd,
    }),
  );

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

  return { nodes, edges, ME, themes, modules, exps };
}
