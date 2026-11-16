import type { Pillar } from "@/data/nodes";
import type { Graph } from "./graph";

/**
 * Pure, deterministic layout (ported from the v9 prototype, extended to seven stages).
 *
 * v9 drew from one shared random generator on every resize, so nodes jumped.
 * Here every random value is drawn ONCE (createRandoms) and buildTargets is a
 * pure function of (graph, randoms, portrait, R): same inputs, same output,
 * whatever was built before.
 *
 * Stages:  0 cover (the net)      1 what is happening (cloud + worries)
 *          2 the real problem (five separate baskets)
 *          3 the idea (net forms)  4 the method  5 meet your mentor (sphere)
 *          6 closing (a tight net around you)
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
export const STAGES = 7;

export type Randoms = {
  /** Per node: jitter direction for the sphere layout. */
  jit: Vec3[];
  /** Per node: radial jitter for the sphere layout, in [-.09, .09]. */
  radJit: number[];
  /** Per node: point on a unit sphere for cluster scatter. */
  clu: Vec3[];
  /** Per node: point on a unit sphere for the loose cloud. */
  free: Vec3[];
  /** Per edge (structural edges first, then mesh): direction its curve bows towards. */
  bow: Vec3[];
  /** Dust particles. g 0–4 belong to a basket, 5 floats free. */
  dust: { u: Vec3; r: number; g: number }[];
};

export function createRandoms(nodeCount: number, edgeCount: number): Randoms {
  const rnd = makeRng(7);
  const dust = Array.from({ length: MAX_DUST }, (_, i) => ({ u: unit(rnd), r: rnd(), g: i % 6 }));
  const jit = Array.from({ length: nodeCount }, () => unit(rnd));
  const radJit = Array.from({ length: nodeCount }, () => (rnd() - 0.5) * 0.18);
  const clu = Array.from({ length: nodeCount }, () => unit(rnd));
  const free = Array.from({ length: nodeCount }, () => unit(rnd));
  const bow = Array.from({ length: edgeCount }, () => unit(rnd));
  return { jit, radJit, clu, free, bow, dust };
}

/* ---------------- stage 2: five baskets ---------------- */

const PILLAR_ORDER: Pillar[] = ["skill", "income", "place", "people", "money"];

/** Basket centres in world units at the reference R (1.7 on phones, 3.6 on desktop). */
const BASKETS_PORTRAIT: Record<Pillar, [number, number]> = {
  // Phones: two rows that sit entirely above the text shade (it starts ~38svh down).
  skill: [-1.5, 1.15],
  income: [0, 1.2],
  place: [1.5, 1.15],
  people: [-0.8, -0.15],
  money: [0.8, -0.15],
};
const BASKETS_LANDSCAPE: Record<Pillar, [number, number]> = {
  // Desktop: spread over the right half, clear of the text column.
  skill: [-2.2, 2.3],
  income: [3.0, 2.6],
  place: [0.3, 0.0],
  people: [-1.8, -2.6],
  money: [3.4, -2.2],
};

export function basketCenter(p: Pillar, portrait: boolean, R: number): [number, number] {
  const [x, y] = (portrait ? BASKETS_PORTRAIT : BASKETS_LANDSCAPE)[p];
  const k = R / (portrait ? 1.7 : 3.6);
  return [x * k, y * k];
}

const basketRadius = (portrait: boolean, R: number) => R * (portrait ? 0.22 : 0.3);

/* ---------------- stages 0 and 6: the net ---------------- */

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
/** Step through the Fibonacci sphere that visits every slot exactly once. */
function coprimeStep(n: number) {
  let s = 3;
  while (gcd(s, n) !== 1) s += 2;
  return s;
}

/** Radius of a net node as a share of R: modules sit just inside the skin of the net. */
const shellRadius = (kind: string) => (kind === "module" ? 0.8 : kind === "pillar" ? 1.0 : 1.05);

/**
 * Net nodes spread over a shell (me at the centre). Worry nodes are not part of
 * the net and are left at the origin here.
 */
export function shellPositions(g: Graph, R: number): Float32Array {
  const out = new Float32Array(g.nodes.length * 3);
  const M = g.net.length;
  const step = coprimeStep(M);
  g.net.forEach((i, k) => {
    const d = fib((k * step) % M, M);
    const rr = R * shellRadius(g.nodes[i].kind);
    write(out, i, [d[0] * rr, d[1] * rr, d[2] * rr]);
  });
  return out;
}

/**
 * The weave: every net node is joined to its three nearest neighbours on the
 * shell, so the cover reads as a net rather than a scatter of dots. Pairs that
 * already have a structural edge are skipped. Pure and independent of R.
 */
export function buildMesh(g: Graph): [number, number][] {
  const pos = shellPositions(g, 1);
  const seen = new Set<string>();
  const key = (a: number, b: number) => (a < b ? `${a}-${b}` : `${b}-${a}`);
  g.edges.forEach(([a, b]) => seen.add(key(a, b)));
  const out: [number, number][] = [];
  for (const a of g.net) {
    const near = g.net
      .filter((b) => b !== a)
      .map((b) => ({ b, d: Math.hypot(pos[a * 3] - pos[b * 3], pos[a * 3 + 1] - pos[b * 3 + 1], pos[a * 3 + 2] - pos[b * 3 + 2]) }))
      .sort((x, y) => x.d - y.d || x.b - y.b)
      .slice(0, 3);
    for (const { b } of near) {
      const k = key(a, b);
      if (seen.has(k)) continue;
      seen.add(k);
      out.push([a, b]);
    }
  }
  return out;
}

/* ---------------- targets ---------------- */

/** Radius of the six module nodes as a share of R. Wide enough that six labels do not touch on a phone. */
const MODULE_R = 0.74;

export type Targets = {
  stage: Float32Array[]; // STAGES entries, each nodeCount*3
  explore: Float32Array;
};

function write(out: Float32Array, i: number, v: Vec3) {
  out[i * 3] = v[0];
  out[i * 3 + 1] = v[1];
  out[i * 3 + 2] = v[2];
}

export function buildTargets(g: Graph, r: Randoms, portrait: boolean, R: number): Targets {
  const NN = g.nodes.length;
  const W = g.worries.length;
  const cloudAt = (i: number): Vec3 => {
    const d = r.free[i];
    return [d[0] * R * 1.5 * (portrait ? 0.8 : 1), d[1] * R * 1.1, d[2] * R * 0.4];
  };
  /** Worry nodes sit on a wide ring around the centre; same place in every stage (they are only visible in stage 1). */
  const putWorries = (arr: Float32Array) => {
    g.worries.forEach((i, k) => {
      const d = fib(k, W);
      write(arr, i, [d[0] * R * 1.35 * (portrait ? 0.8 : 1), d[1] * R * 1.0, d[2] * R * 0.55]);
    });
  };

  // Stages 3–5: sphere. Modules on a Fibonacci sphere, experiences at the mean
  // direction of their modules, so related experiences sit together by themselves.
  const sphere = new Float32Array(NN * 3);
  const dirOf = new Map<number, Vec3>();
  g.modules.forEach((m, k) => dirOf.set(m, fib(k, g.modules.length)));
  g.modules.forEach((m) => {
    const d = dirOf.get(m)!;
    write(sphere, m, [d[0] * R * MODULE_R, d[1] * R * MODULE_R, d[2] * R * MODULE_R]);
  });
  // Pillar nodes: stacked on well-separated heights. Heights survive the Y-axis
  // spin, so their labels never collide.
  const P = g.pillars.length;
  g.pillars.forEach((t, k) => {
    const a = k * 2.4 + 0.6;
    const y = ((P - 1) / 2 - k) * 0.31 * R;
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
  putWorries(sphere);

  // Stage 0: the net. Stage 6: the same net pulled tight around you.
  const shell = shellPositions(g, R);
  putWorries(shell);
  const closing = shellPositions(g, R * 0.5);
  putWorries(closing);

  // Stage 1: a loose cloud with the date in the middle and the worries around it.
  const cloud = new Float32Array(NN * 3);
  g.net.forEach((i) => write(cloud, i, cloudAt(i)));
  putWorries(cloud);

  // Stage 2: five separate baskets, one per pillar. Modules float loose.
  const baskets = new Float32Array(NN * 3);
  const rb = basketRadius(portrait, R);
  g.modules.forEach((i) => write(baskets, i, cloudAt(i)));
  for (const i of [...g.pillars, ...g.exps]) {
    const n = g.nodes[i];
    const c = basketCenter(n.pillar!, portrait, R);
    const d = r.clu[i];
    const rr = rb * (n.kind === "pillar" ? 0.15 : 1);
    write(baskets, i, [c[0] + d[0] * rr, c[1] + d[1] * rr, d[2] * rr * 0.8]);
  }
  putWorries(baskets);

  const explore = new Float32Array(NN * 3);
  for (let j = 0; j < NN * 3; j++) explore[j] = sphere[j] * 1.3;

  return { stage: [shell, cloud, baskets, sphere, sphere, sphere, closing], explore };
}

/** Dust targets per stage, for the first DN particles. */
export function buildDust(r: Randoms, DN: number, portrait: boolean, R: number): Float32Array[] {
  const out: Float32Array[] = [];
  const rb = basketRadius(portrait, R);
  for (let stage = 0; stage < STAGES; stage++) {
    const a = new Float32Array(DN * 3);
    for (let i = 0; i < DN; i++) {
      const { u, r: rv, g } = r.dust[i];
      let x: number, y: number, z: number;
      if (stage === 0) {
        const rr = R * (0.9 + rv * 1.4);
        x = u[0] * rr; y = u[1] * rr; z = u[2] * rr;
      } else if (stage === 1) {
        const rr = R * (0.6 + rv * 1.6);
        x = u[0] * rr * (portrait ? 0.8 : 1.1); y = u[1] * rr; z = u[2] * rr * 0.6;
      } else if (stage === 2) {
        if (g === 5) {
          const rr = R * (1.1 + rv * 1.2);
          x = u[0] * rr; y = u[1] * rr; z = u[2] * rr;
        } else {
          const c = basketCenter(PILLAR_ORDER[g], portrait, R);
          const rr = rb * (0.4 + rv * 1.1);
          x = c[0] + u[0] * rr;
          y = c[1] + u[1] * rr;
          z = u[2] * rr * 0.8;
        }
      } else if (stage === 6) {
        const rr = R * (0.25 + rv * 0.55);
        x = u[0] * rr; y = u[1] * rr; z = u[2] * rr;
      } else {
        const rr = R * (1.15 + rv * (stage === 5 ? 0.9 : 1.1));
        x = u[0] * rr; y = u[1] * rr; z = u[2] * rr;
      }
      if (stage !== 2 && stage !== 6) {
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
