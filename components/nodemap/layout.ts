import type { Graph } from "./graph";

/**
 * Pure, deterministic layout (ported from the v9 prototype).
 *
 * v9 drew from one shared random generator on every resize, so nodes jumped.
 * Here every random value is drawn ONCE (createRandoms) and buildTargets is a
 * pure function of (graph, randoms, portrait, R): same inputs, same output,
 * whatever was built before.
 */

export type Vec3 = [number, number, number];

/** Same Park–Miller generator as v9. */
export function makeRng(seed = 7) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function unit(rnd: () => number): Vec3 {
  const u = rnd() * 2 - 1;
  const t = rnd() * 6.2832;
  const r = Math.sqrt(1 - u * u);
  return [r * Math.cos(t), u, r * Math.sin(t)];
}

/** Fibonacci sphere point i of n. */
export function fib(i: number, n: number): Vec3 {
  const y = 1 - (2 * (i + 0.5)) / n;
  const r = Math.sqrt(1 - y * y);
  const a = i * 2.399963;
  return [r * Math.cos(a), y, r * Math.sin(a)];
}

export const MAX_DUST = 1600;

export type Randoms = {
  /** Per node: jitter direction for the sphere layout. */
  jit: Vec3[];
  /** Per node: radial jitter for the sphere layout, in [-.09, .09]. */
  radJit: number[];
  /** Per node: point on a unit sphere for cluster scatter. */
  clu: Vec3[];
  /** Per node: point on a unit sphere for the loose "free" scatter. */
  free: Vec3[];
  /** Per edge: direction its curve bows towards. */
  bow: Vec3[];
  /** Dust particles. */
  dust: { u: Vec3; r: number; g: number }[];
};

export function createRandoms(nodeCount: number, edgeCount: number): Randoms {
  const rnd = makeRng(7);
  const dust = Array.from({ length: MAX_DUST }, (_, i) => ({ u: unit(rnd), r: rnd(), g: i % 4 }));
  const jit = Array.from({ length: nodeCount }, () => unit(rnd));
  const radJit = Array.from({ length: nodeCount }, () => (rnd() - 0.5) * 0.18);
  const clu = Array.from({ length: nodeCount }, () => unit(rnd));
  const free = Array.from({ length: nodeCount }, () => unit(rnd));
  const bow = Array.from({ length: edgeCount }, () => unit(rnd));
  return { jit, radJit, clu, free, bow, dust };
}

/** Basket centres for stage 1: skill, income, place. */
export function basketCenters(portrait: boolean): [number, number][] {
  // Phones: keep all three baskets above the text shade (it starts ~38svh down).
  return portrait
    ? [[-0.95, 0.65], [0.95, 0.65], [0, -0.35]]
    : [[-1.55, 0.5], [1.55, 0.5], [0, -1.3]];
}

const BASKET: Record<string, number> = { skill: 0, income: 1, place: 2 };

export const STAGES = 6;
/** Radius of the six module nodes as a share of R. Wide enough that six labels do not touch on a phone. */
const MODULE_R = 0.74;
/** Index into the per-stage target arrays: 0 shell, 1 clusters, 2–4 sphere, 5 converge. */
export type Targets = {
  stage: Float32Array[]; // 6 entries, each nodeCount*3
  explore: Float32Array;
};

function write(out: Float32Array, i: number, v: Vec3) {
  out[i * 3] = v[0];
  out[i * 3 + 1] = v[1];
  out[i * 3 + 2] = v[2];
}

export function buildTargets(g: Graph, r: Randoms, portrait: boolean, R: number): Targets {
  const NN = g.nodes.length;
  const kind = (i: number) => g.nodes[i].kind;

  // Stage 2–4: sphere. Modules on a Fibonacci sphere, experiences at the mean
  // direction of their modules, so related experiences sit together by themselves.
  const sphere = new Float32Array(NN * 3);
  const dirOf = new Map<number, Vec3>();
  g.modules.forEach((m, k) => dirOf.set(m, fib(k, g.modules.length)));
  write(sphere, g.ME, [0, 0, 0]);
  g.modules.forEach((m) => {
    const d = dirOf.get(m)!;
    write(sphere, m, [d[0] * R * MODULE_R, d[1] * R * MODULE_R, d[2] * R * MODULE_R]);
  });
  // Theme nodes: stacked on three well-separated heights (skill top, income middle,
  // place bottom). Heights survive the Y-axis spin, so their labels never collide.
  g.themes.forEach((t, k) => {
    const a = k * 2.4 + 0.6;
    const y = (g.themes.length === 3 ? (1 - k) * 0.62 : 0) * R;
    write(sphere, t, [Math.cos(a) * R * 0.42, y, Math.sin(a) * R * 0.42]);
  });
  g.exps.forEach((e) => {
    const s: Vec3 = [0, 0, 0];
    g.nodes[e].links.forEach((m) => {
      const d = dirOf.get(m)!;
      s[0] += d[0];
      s[1] += d[1];
      s[2] += d[2];
    });
    const j = r.jit[e];
    s[0] += j[0] * 0.35;
    s[1] += j[1] * 0.35;
    s[2] += j[2] * 0.35;
    const l = Math.hypot(s[0], s[1], s[2]) || 1;
    const rr = R * (1 + r.radJit[e]);
    write(sphere, e, [(s[0] / l) * rr, (s[1] / l) * rr, (s[2] / l) * rr]);
  });

  // Stage 0: shell.
  const shell = new Float32Array(NN * 3);
  write(shell, g.ME, [0, 0, 0]);
  for (let i = 1; i < NN; i++) {
    const d = fib((i * 3) % NN, NN);
    const rr = R * (kind(i) === "module" ? 0.8 : 1.05);
    write(shell, i, [d[0] * rr, d[1] * rr, d[2] * rr]);
  }

  // Stage 1: three separate baskets (skill / income / place). Modules and the
  // "free" node float loose around them.
  const cluster = new Float32Array(NN * 3);
  const C = basketCenters(portrait);
  const k = portrait ? 0.62 : 1;
  const cs = portrait ? 1.15 : 1;
  write(cluster, g.ME, [0, 0, 0]);
  for (let i = 1; i < NN; i++) {
    const n = g.nodes[i];
    if (n.kind === "module" || n.group === "free") {
      const d = r.free[i];
      write(cluster, i, [d[0] * R * 1.5 * (portrait ? 0.8 : 1), d[1] * R * 1.1, d[2] * R * 0.4]);
      continue;
    }
    const c = C[BASKET[n.group]];
    const d = r.clu[i];
    const rr = R * 0.62 * k * (n.kind === "theme" ? 0.15 : 0.9);
    write(cluster, i, [c[0] * R * cs + d[0] * rr, c[1] * R * cs + d[1] * rr, d[2] * rr * 0.8]);
  }

  // Stage 5: converge on the centre.
  const converge = new Float32Array(NN * 3);
  for (let i = 0; i < NN; i++) {
    const d = fib((i * 5) % NN, NN);
    const rr = i === 0 ? 0 : R * 0.22;
    write(converge, i, [d[0] * rr, d[1] * rr, d[2] * rr]);
  }

  const explore = new Float32Array(NN * 3);
  for (let j = 0; j < NN * 3; j++) explore[j] = sphere[j] * 1.3;

  return { stage: [shell, cluster, sphere, sphere, sphere, converge], explore };
}

/** Dust targets per stage, for the first DN particles. */
export function buildDust(r: Randoms, DN: number, portrait: boolean, R: number): Float32Array[] {
  const Cc = basketCenters(portrait);
  const out: Float32Array[] = [];
  for (let stage = 0; stage < STAGES; stage++) {
    const a = new Float32Array(DN * 3);
    for (let i = 0; i < DN; i++) {
      const { u, r: rv, g } = r.dust[i];
      let x: number, y: number, z: number;
      if (stage === 0) {
        const rr = R * (0.9 + rv * 1.4);
        x = u[0] * rr; y = u[1] * rr; z = u[2] * rr;
      } else if (stage === 1) {
        if (g === 3) {
          const rr = R * (1.1 + rv * 1.2);
          x = u[0] * rr; y = u[1] * rr; z = u[2] * rr;
        } else {
          const c = Cc[g % 3];
          const kk = portrait ? 1.15 : 1;
          const rr = R * (0.2 + rv * 0.8) * (portrait ? 0.6 : 0.62);
          x = c[0] * R * kk + u[0] * rr;
          y = c[1] * R * kk + u[1] * rr;
          z = u[2] * rr * 0.8;
        }
      } else if (stage === 5) {
        const rr = R * (0.15 + rv * 0.55);
        x = u[0] * rr; y = u[1] * rr; z = u[2] * rr;
      } else {
        const rr = R * (1.15 + rv * (stage === 4 ? 0.9 : 1.1));
        x = u[0] * rr; y = u[1] * rr; z = u[2] * rr;
      }
      if (stage !== 1 && stage !== 5) {
        const q = Math.hypot(x, y, z) / R;
        const an = q * 0.75;
        const ca = Math.cos(an);
        const sa = Math.sin(an);
        const nx = x * ca - z * sa;
        z = x * sa + z * ca;
        x = nx;
        y *= 0.82;
      }
      a[i * 3] = x; a[i * 3 + 1] = y; a[i * 3 + 2] = z;
    }
    out.push(a);
  }
  return out;
}
