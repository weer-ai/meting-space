import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  ColorManagement,
  DynamicDrawUsage,
  Group,
  LineBasicMaterial,
  LineSegments,
  LinearSRGBColorSpace,
  PerspectiveCamera,
  Points,
  Scene,
  ShaderMaterial,
  Vector3,
  WebGLRenderer,
} from "three";
import type { GNode, Graph } from "./graph";
import { MAX_DUST, STAGES, buildDust, buildMesh, buildTargets, createRandoms, makeRng, type Targets } from "./layout";

/**
 * The home page 3D map. Ported from reference/meting-space-v9-node-map.html.
 *
 * What stays exactly as v9: the stages driven by scroll position (hold the first
 * 45% of a section, morph through the last 55% with smoothstep), the glow-point
 * shader, warm dust with a few bokeh discs, curved filaments, DOM pill labels
 * projected every frame, and the explore mode (drag / zoom / tap / filter).
 *
 * What changed: npm three, deterministic layout, frame-rate independent easing,
 * measurement after fonts load and on resize, reduced-motion, visibility pause,
 * and a clean dispose().
 *
 * The story (approved 2026-11-16) has seven stages:
 *   0 cover            a woven net of finished diversification around me/ting
 *   1 what is happening  today's date in the middle, worries lighting up around it
 *   2 the real problem   five separate baskets (one skill, one income, ...)
 *   3 the idea           the baskets join up, the net forms
 *   4 the method         six modules
 *   5 meet your mentor   the evidence
 *   6 closing            the net pulled tight around you
 */

export type Mode = "story" | "explore";

export interface SceneOptions {
  canvas: HTMLCanvasElement;
  labels: HTMLElement;
  graph: Graph;
  reducedMotion: boolean;
  /** Tap in explore mode. -1 = tapped empty space. */
  onSelect: (i: number) => void;
}

export interface SceneController {
  setMode(m: Mode): void;
  /** Node index of a module, or null for All. */
  setFilter(module: number | null): void;
  setSelected(i: number): void;
  setReducedMotion(b: boolean): void;
  measure(): void;
  dispose(): void;
}

const VERT = `
attribute float size;
attribute float alpha;
attribute vec3 col;
varying float vA;
varying vec3 vC;
uniform float scale;
uniform float fade;
void main(){
  vA = alpha * fade;
  vC = col;
  vec4 mv = modelViewMatrix * vec4(position, 1.);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = size * scale / (-mv.z);
}`;

const FRAG = `
varying float vA;
varying vec3 vC;
void main(){
  float d = length(gl_PointCoord - .5);
  if (d > .5) discard;
  float core = smoothstep(.14, .0, d);
  float glow = pow(smoothstep(.5, .0, d), 1.6);
  gl_FragColor = vec4(vC * (glow * .8 + core * 1.3), (glow * .8 + core) * vA);
}`;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (t: number) => t * t * (3 - 2 * t);
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

type RGB = [number, number, number];
const COL: Record<string, RGB> = {
  p: [1, 0.82, 0.7],
  kw: [1, 0.58, 0.5],
  me: [1, 0.95, 0.9],
  red: [0.95, 0.45, 0.4],
  basket: [0.85, 0.62, 0.62],
  worry: [0.8, 0.5, 0.48],
};

/**
 * Edge brightness per stage: [structural edges (experience -> module), the woven mesh].
 * Stages 1 and 2 are off on purpose: no net, nothing connects. It forms in stage 3.
 */
const EDGE_K: [number, number][] = [
  [0.22, 0.3], // 0 cover: the net
  [0, 0], //      1 what is happening
  [0, 0], //      2 the real problem
  [0.42, 0.16], // 3 the idea: it forms
  [0.28, 0.12], // 4 the method
  [0.26, 0.1], //  5 meet your mentor
  [0.14, 0.3], //  6 closing: pulled tight
];
const EXPLORE_K: [number, number] = [0.6, 0.1];
const WORRIES_AT_ONCE = 3;

export function createScene(o: SceneOptions): SceneController | null {
  const { canvas, labels: labBox, graph: G } = o;
  const N = G.nodes;
  const NN = N.length;
  const E = G.edges;
  const MESH = buildMesh(G);
  const EN = E.length + MESH.length;
  const EP = new Int32Array(EN);
  const EQ = new Int32Array(EN);
  for (let e = 0; e < EN; e++) {
    const pair = e < E.length ? E[e] : MESH[e - E.length];
    EP[e] = pair[0];
    EQ[e] = pair[1];
  }
  /** The date the visitor opens the page on: the middle node of "What is happening?". */
  const DATE = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  // Match the v9 look (it was built on three r128, which did no colour management).
  ColorManagement.enabled = false;

  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({ canvas, antialias: true, alpha: false });
  } catch {
    return null;
  }
  renderer.outputColorSpace = LinearSRGBColorSpace;
  const DPR = Math.min(window.devicePixelRatio || 1, 2);
  renderer.setPixelRatio(DPR);
  renderer.setClearColor(0x0c0809, 1);

  const scene = new Scene();
  const cam = new PerspectiveCamera(50, 1, 0.1, 100);
  cam.position.set(0, 0, 12);
  const root = new Group();
  scene.add(root);

  /* ---------------- layout state ---------------- */
  const rand = createRandoms(NN, EN);
  const DN = Math.min(window.innerWidth < 700 ? 900 : 1600, MAX_DUST);
  let vw = 1;
  let vh = 1;
  let portrait = false;
  let R = 3.6;
  let NT: Targets = buildTargets(G, rand, portrait, R);
  let DT: Float32Array[] = buildDust(rand, DN, portrait, R);

  function resize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    vw = w;
    vh = h;
    renderer.setSize(vw, vh, false);
    cam.aspect = vw / vh;
    cam.updateProjectionMatrix();
    const p = vw < 900 && vh > vw * 0.9;
    const r = p ? 1.7 : 3.6;
    if (p !== portrait || r !== R) {
      portrait = p;
      R = r;
      NT = buildTargets(G, rand, portrait, R);
      DT = buildDust(rand, DN, portrait, R);
    }
  }

  /* ---------------- geometry ---------------- */
  function mkPoints(n: number) {
    const g = new BufferGeometry();
    const attrs: [string, number][] = [["position", 3], ["size", 1], ["alpha", 1], ["col", 3]];
    for (const [name, itemSize] of attrs) {
      const a = new BufferAttribute(new Float32Array(n * itemSize), itemSize);
      a.setUsage(DynamicDrawUsage);
      g.setAttribute(name, a);
    }
    const m = new ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      uniforms: { scale: { value: 1 }, fade: { value: 1 } },
    });
    const p = new Points(g, m);
    p.frustumCulled = false;
    root.add(p);
    return p;
  }
  const dust = mkPoints(DN);
  const nodes = mkPoints(NN);

  const SEG = 10;
  const lineGeo = new BufferGeometry();
  const lpAttr = new BufferAttribute(new Float32Array(EN * SEG * 6), 3);
  const lcAttr = new BufferAttribute(new Float32Array(EN * SEG * 6), 3);
  lpAttr.setUsage(DynamicDrawUsage);
  lcAttr.setUsage(DynamicDrawUsage);
  lineGeo.setAttribute("position", lpAttr);
  lineGeo.setAttribute("color", lcAttr);
  const lineMat = new LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity: 1,
    blending: AdditiveBlending,
    depthWrite: false,
  });
  const lines = new LineSegments(lineGeo, lineMat);
  lines.frustumCulled = false;
  root.add(lines);

  // Warm dust: some soft bokeh discs, the rest small points.
  (() => {
    const rnd = makeRng(11);
    const c = (dust.geometry.attributes.col as BufferAttribute).array as Float32Array;
    const s = (dust.geometry.attributes.size as BufferAttribute).array as Float32Array;
    const a = (dust.geometry.attributes.alpha as BufferAttribute).array as Float32Array;
    const pal: RGB[] = [
      [1, 0.62, 0.5],
      [0.92, 0.52, 0.64],
      [1, 0.78, 0.42],
      [0.86, 0.78, 0.74],
      [0.86, 0.78, 0.74],
    ];
    for (let i = 0; i < DN; i++) {
      const v = pal[Math.floor(rnd() * pal.length)];
      c[i * 3] = v[0];
      c[i * 3 + 1] = v[1];
      c[i * 3 + 2] = v[2];
      if (rnd() < 0.06) {
        s[i] = 26 + rnd() * 30;
        a[i] = 0.1 + rnd() * 0.08;
      } else {
        s[i] = 3 + rnd() * 6;
        a[i] = 0.3 + rnd() * 0.5;
      }
    }
    dust.geometry.attributes.col.needsUpdate = true;
    dust.geometry.attributes.size.needsUpdate = true;
    dust.geometry.attributes.alpha.needsUpdate = true;
  })();

  /* ---------------- labels ---------------- */
  const labEl: HTMLDivElement[] = [];
  const labTxt: string[] = [];
  const labA = new Float32Array(NN);
  const labNudge = new Float32Array(NN);
  const labW = new Float32Array(NN);
  const labH = new Float32Array(NN);
  const labX = new Float32Array(NN);
  const labY = new Float32Array(NN);
  const labTgt = new Float32Array(NN);
  const measureLabels = () => labW.fill(0);
  const sizeLabel = (i: number) => {
    if (labW[i]) return;
    labW[i] = labEl[i].offsetWidth || 80;
    labH[i] = labEl[i].offsetHeight || 24;
  };
  N.forEach((n, i) => {
    const d = document.createElement("div");
    d.className =
      "lab" +
      (n.kind === "module" || n.kind === "pillar" ? " kw" : "") +
      (n.kind === "me" ? " me" : "") +
      (n.kind === "worry" ? " worry" : "");
    d.textContent = n.name;
    labTxt[i] = n.name;
    labBox.appendChild(d);
    labEl[i] = d;
  });

  /* ---------------- which nodes carry a label, and what it says ---------------- */
  /** Worry nodes currently lit (node index -> time in seconds when it goes dark again). */
  const worryOn = new Map<number, number>();
  let nextWorry = 0;

  const labelled = (i: number, st: number): boolean => {
    const n = N[i];
    switch (n.kind) {
      case "me": return st === 0 || st === 1 || st === 6;
      case "pillar": return st === 0 || st === 2 || st === 3;
      case "module": return st === 4;
      case "exp": return st === 5 && n.proof;
      case "worry": return st === 1 && worryOn.has(i);
    }
  };
  const textFor = (n: GNode, st: number): string => {
    if (n.kind === "me") return st === 1 ? DATE : n.name;
    if (n.kind === "pillar") return st === 2 ? n.concentrated! : st === 3 ? n.diversified! : n.name;
    return n.name;
  };

  /** Keeps a few worries lit at a time, each for a couple of seconds, at random. */
  function updateWorries(nowMs: number, on: boolean) {
    if (!on) {
      worryOn.clear();
      nextWorry = 0;
      return;
    }
    if (reduced) {
      // reduced motion: nothing flashes, a fixed few stay lit
      if (worryOn.size === 0) G.worries.slice(0, WORRIES_AT_ONCE + 1).forEach((i) => worryOn.set(i, Infinity));
      return;
    }
    const t = nowMs * 0.001;
    for (const [i, until] of worryOn) if (until < t) worryOn.delete(i);
    if (worryOn.size < WORRIES_AT_ONCE && t >= nextWorry) {
      const idle = G.worries.filter((i) => !worryOn.has(i));
      const pick = idle[Math.floor(Math.random() * idle.length)];
      worryOn.set(pick, t + 2.2 + Math.random() * 1.4);
      nextWorry = t + 0.55 + Math.random() * 0.7;
    }
  }

  /* ---------------- state ---------------- */
  let mode: Mode = "story";
  let filter: number | null = null;
  let sel = -1;
  let reduced = o.reducedMotion;
  let stageF = 0;
  let exploreK = 0;
  let fade = 1; // reduced-motion cross-fade
  let shownStage = 0;
  let rotY = 0;
  let rotX = 0;
  let vY = 0;
  let drag = false;
  let lx = 0;
  let ly = 0;
  let zoom = 1;
  let lineS = 0.22;
  let lineM = 0.3;
  let redMix = 0;
  let lastDebug = -1;

  let secs: HTMLElement[] = [];
  let tops: number[] = [];
  function measure() {
    secs = Array.from(document.querySelectorAll<HTMLElement>("section.s"));
    const y = window.scrollY;
    tops = secs.map((s) => s.getBoundingClientRect().top + y);
  }

  function stageFromScroll() {
    const n = secs.length;
    if (!n) return 0;
    // v9 used 0.55 here, which left every section's own stage ~9% morphed when scrolled to its top
    const y = window.scrollY + window.innerHeight * 0.5;
    let i = 0;
    for (i = 0; i < n - 1; i++) if (y < tops[i + 1]) break;
    const h = (i < n - 1 ? tops[i + 1] : tops[i] + secs[i].offsetHeight) - tops[i];
    const f = clamp((y - tops[i]) / h, 0, 1);
    // hold the stage in the first 45% of the section, morph in the last 55%
    let t = f < 0.45 ? 0 : (f - 0.45) / 0.55;
    t = ease(t);
    return i + (i < n - 1 ? t : 0);
  }

  const matches = (i: number) => {
    if (filter === null) return true;
    const n = N[i];
    return n.kind === "module" ? i === filter : n.kind === "exp" ? n.links.includes(filter) : false;
  };

  /** Brightness of a node in a story stage (worries are driven by updateWorries). */
  function dimFor(n: GNode, st: number, inLab: boolean): number {
    switch (n.kind) {
      case "me": return [1, 1, 0, 0, 0, 0, 0.9][st];
      case "pillar": return [0.9, 0, 1, 1, 0, 0, 0][st];
      case "module": return [0.7, 0.4, 0.4, 0.85, 1, 0.3, 0.8][st];
      case "exp": return [0.7, 0.5, 1, 1, 0.55, inLab ? 1 : 0.3, 0.8][st];
      default: return 0;
    }
  }

  /* ---------------- frame loop ---------------- */
  const cur = new Float32Array(NN * 3);
  const sx = new Float32Array(NN);
  const sy = new Float32Array(NN);
  const sv = new Uint8Array(NN);
  const curA = new Float32Array(NN);
  const curS = new Float32Array(NN).fill(15);
  const curC = new Float32Array(NN * 3);
  const v3 = new Vector3();
  let raf = 0;
  let last = 0;
  let disposed = false;

  function frame(now: number) {
    raf = requestAnimationFrame(frame);
    const dt = clamp(last ? (now - last) / 1000 : 0.016, 0.001, 0.1);
    last = now;
    const k1 = 1 - Math.pow(1 - 0.09, dt * 60);
    const k2 = 1 - Math.pow(1 - 0.12, dt * 60);
    const kx = 1 - Math.pow(1 - 0.08, dt * 60);
    const ex = mode === "explore";

    const tgt = stageFromScroll();
    if (reduced) {
      // No travelling: fade out, jump to the new shape, fade in.
      const want = Math.round(tgt);
      if (want !== shownStage) {
        fade -= dt / 0.18;
        if (fade <= 0) {
          fade = 0;
          shownStage = want;
        }
      } else fade = Math.min(1, fade + dt / 0.25);
      stageF = shownStage;
      exploreK = ex ? 1 : 0;
    } else {
      fade = 1;
      stageF += (tgt - stageF) * k1;
      exploreK += ((ex ? 1 : 0) - exploreK) * kx;
    }

    const LAST = STAGES - 1;
    let a = clamp(Math.floor(stageF), 0, LAST - 1);
    let b = Math.min(LAST, a + 1);
    let f = ease(stageF - a);
    if (stageF >= LAST) { a = LAST; b = LAST; f = 0; }
    const stA = clamp(Math.round(stageF), 0, LAST);
    updateWorries(now, stA === 1 && !ex);
    const A = NT.stage[a];
    const B = NT.stage[b];
    const X = NT.explore;

    const np = (nodes.geometry.attributes.position as BufferAttribute).array as Float32Array;
    const ns = (nodes.geometry.attributes.size as BufferAttribute).array as Float32Array;
    const na = (nodes.geometry.attributes.alpha as BufferAttribute).array as Float32Array;
    const nc = (nodes.geometry.attributes.col as BufferAttribute).array as Float32Array;
    const tq = now * 0.001;
    const wob = reduced ? 0 : R * 0.035;

    for (let i = 0; i < NN; i++) {
      const j = i * 3;
      let x = lerp(lerp(A[j], B[j], f), X[j], exploreK);
      let y = lerp(lerp(A[j + 1], B[j + 1], f), X[j + 1], exploreK);
      let z = lerp(lerp(A[j + 2], B[j + 2], f), X[j + 2], exploreK);
      x += Math.sin(tq * 0.6 + i * 1.3) * wob;
      y += Math.sin(tq * 0.5 + i * 2.1) * wob;
      z += Math.sin(tq * 0.4 + i * 0.9) * wob;
      cur[j] = np[j] = x;
      cur[j + 1] = np[j + 1] = y;
      cur[j + 2] = np[j + 2] = z;

      const n = N[i];
      const inLab = !ex && labelled(i, stA);
      const lit = n.kind === "worry" && worryOn.has(i);
      let aT: number;
      if (ex) {
        const on = filter !== null && !matches(i) ? 0.12 : 1;
        aT = n.kind === "pillar" || n.kind === "worry" ? 0 : on;
      } else if (n.kind === "worry") aT = stA === 1 ? (lit ? 1 : 0.22) : 0;
      else if (n.kind === "me") aT = dimFor(n, stA, inLab);
      else aT = dimFor(n, stA, inLab);

      const base = n.kind === "me" ? 30 : n.kind === "exp" ? 15 : n.kind === "worry" ? 17 : 22;
      const sT = base * (inLab ? 1.4 : 1) * (i === sel ? 1.7 : 1);

      let c: RGB = n.kind === "me" ? COL.me : n.kind === "exp" ? COL.p : n.kind === "worry" ? (lit ? COL.red : COL.worry) : COL.kw;
      if (!ex && stA === 1 && n.kind !== "me" && n.kind !== "worry") c = COL.basket;
      if (!ex && stA === 2) {
        if (n.kind === "pillar") c = COL.red;
        else if (n.kind !== "me") c = COL.basket;
      }

      const snap = reduced ? 1 : k2;
      curA[i] += (aT - curA[i]) * snap;
      curS[i] += (sT - curS[i]) * snap;
      for (let q = 0; q < 3; q++) curC[j + q] += (c[q] - curC[j + q]) * snap;
      na[i] = curA[i] * fade;
      ns[i] = curS[i];
      nc[j] = curC[j];
      nc[j + 1] = curC[j + 1];
      nc[j + 2] = curC[j + 2];
    }
    nodes.geometry.attributes.position.needsUpdate = true;
    nodes.geometry.attributes.size.needsUpdate = true;
    nodes.geometry.attributes.alpha.needsUpdate = true;
    nodes.geometry.attributes.col.needsUpdate = true;

    // dust
    const dp = (dust.geometry.attributes.position as BufferAttribute).array as Float32Array;
    const DA = reduced ? 0 : R * 0.025;
    const DA0 = DT[a];
    const DB = DT[b];
    const DE = DT[3];
    const tq2 = now * 0.001;
    for (let j = 0; j < DN * 3; j++) {
      const v = lerp(DA0[j], DB[j], f);
      dp[j] = lerp(v, DE[j] * 1.1, exploreK) + Math.sin(tq2 * 0.5 + j * 0.61) * DA;
    }
    dust.geometry.attributes.position.needsUpdate = true;
    const scale = ((vh * 0.5 * DPR) / Math.tan((cam.fov * Math.PI) / 360)) * 0.015;
    (dust.material as ShaderMaterial).uniforms.scale.value = scale;
    (nodes.material as ShaderMaterial).uniforms.scale.value = scale;
    (dust.material as ShaderMaterial).uniforms.fade.value = fade;
    (nodes.material as ShaderMaterial).uniforms.fade.value = fade;
    lineMat.opacity = fade;

    // lines: soft curved filaments (structural edges) and the woven mesh of the net
    const lp = lpAttr.array as Float32Array;
    const lc = lcAttr.array as Float32Array;
    const kt = ex ? EXPLORE_K : EDGE_K[stA];
    lineS += (kt[0] - lineS) * (reduced ? 1 : k2);
    lineM += (kt[1] - lineM) * (reduced ? 1 : k2);
    const redT = (stA === 1 || stA === 2) && !ex ? 1 : 0;
    redMix += (redT - redMix) * (reduced ? 1 : k2);
    const cr = lerp(1, 0.8, redMix);
    const cg = lerp(0.62, 0.5, redMix);
    const cb = lerp(0.5, 0.55, redMix);
    let w = 0;
    for (let e = 0; e < EN; e++) {
      const mesh = e >= E.length;
      const p = EP[e];
      const q = EQ[e];
      const ax = cur[p * 3], ay = cur[p * 3 + 1], az = cur[p * 3 + 2];
      const bx = cur[q * 3], by = cur[q * 3 + 1], bz = cur[q * 3 + 2];
      const len = Math.hypot(bx - ax, by - ay, bz - az);
      const ow = rand.bow[e];
      // structural edges bow like loose threads, the mesh stays taut
      const bow = mesh ? 0.1 : 0.45;
      const sway = reduced ? 1 : 1 + (mesh ? 0.05 : 0.15) * Math.sin(tq * 0.8 + e);
      const cx = (ax + bx) / 2 + ow[0] * len * bow * sway;
      const cy = (ay + by) / 2 + ow[1] * len * bow * sway;
      const cz = (az + bz) / 2 + ow[2] * len * bow * sway;
      let k = mesh ? lineM : lineS;
      if (ex) {
        if (!mesh) {
          if (filter !== null) k = q === filter ? 1 : 0.04;
          if (sel >= 0) k = p === sel || q === sel ? 1 : k * 0.4;
        } else {
          if (filter !== null) k *= 0.2;
          if (sel >= 0) k *= p === sel || q === sel ? 3 : 0.5;
        }
      }
      for (let sg = 0; sg <= SEG; sg++) {
        const u = sg / SEG;
        const m = 1 - u;
        const PX = m * m * ax + 2 * m * u * cx + u * u * bx;
        const PY = m * m * ay + 2 * m * u * cy + u * u * by;
        const PZ = m * m * az + 2 * m * u * cz + u * u * bz;
        const fd = (0.3 + 0.7 * Math.sin(Math.PI * u)) * k;
        if (sg > 0) {
          lp[w] = PX; lp[w + 1] = PY; lp[w + 2] = PZ;
          lc[w] = cr * fd; lc[w + 1] = cg * fd; lc[w + 2] = cb * fd;
          w += 3;
        }
        if (sg < SEG) {
          lp[w] = PX; lp[w + 1] = PY; lp[w + 2] = PZ;
          lc[w] = cr * fd; lc[w + 1] = cg * fd; lc[w + 2] = cb * fd;
          w += 3;
        }
      }
    }
    lpAttr.needsUpdate = true;
    lcAttr.needsUpdate = true;

    // rotation + camera
    if (!drag) {
      vY *= Math.pow(0.95, dt * 60);
      if (!reduced) rotY += vY + (ex ? 0.0012 : 0.0016) * dt * 60;
      else rotY += vY;
    }
    rotX += (0 - rotX) * (ex ? 0 : 0.04 * dt * 60);
    root.rotation.y = rotY;
    root.rotation.x = rotX;
    const offY = portrait ? lerp(2.95, 0, exploreK) : 0;
    const offX = portrait ? 0 : lerp(2.2, 0, exploreK);
    root.position.set(offX, offY, 0);
    root.scale.set(zoom, zoom, zoom);
    renderer.render(scene, cam);

    // project labels
    root.updateMatrixWorld();
    const live: number[] = [];
    for (let i = 0; i < NN; i++) {
      v3.set(cur[i * 3], cur[i * 3 + 1], cur[i * 3 + 2]).applyMatrix4(root.matrixWorld).project(cam);
      const X2 = (v3.x * 0.5 + 0.5) * vw;
      const Y2 = (-v3.y * 0.5 + 0.5) * vh;
      sx[i] = X2;
      sy[i] = Y2;
      sv[i] = v3.z < 1 ? 1 : 0;
      const n = N[i];
      let show = 0;
      if (ex) {
        if (filter !== null) show = matches(i) && n.kind !== "me" ? 1 : 0;
        else show = n.kind === "module" || i === sel ? 1 : 0;
        if (i === sel) show = 1;
        if (n.kind === "me" || n.kind === "pillar" || n.kind === "worry") show = 0;
      } else show = labelled(i, stA) ? 1 : 0;
      const depthFade = ex ? Math.max(0.35, 1 - (v3.z - 0.9) * 6) : 1;
      const target = show ? Math.min(1, depthFade) : 0;
      labA[i] += (target - labA[i]) * (reduced ? 1 : k2);
      labY[i] = Y2 - 8;
      if (n.kind === "me" || n.kind === "pillar") {
        const txt = textFor(n, stA);
        if (labTxt[i] !== txt) {
          labTxt[i] = txt;
          labEl[i].textContent = txt;
          // the date in the middle of "What is happening?" is the main picture of that stage
          if (n.kind === "me") labEl[i].classList.toggle("date", stA === 1);
          labW[i] = 0;
        }
      }
      // label sits right of its node; near the right edge it flips to the left
      let lx = X2 + 10;
      if (show && labA[i] > 0.05) {
        sizeLabel(i);
        if (lx + labW[i] > vw - 8) lx = Math.max(8, X2 - 10 - labW[i]);
        live.push(i);
      }
      labX[i] = lx;
      labTgt[i] = 0;
    }

    // De-collide: walk the visible labels top to bottom and push a label down
    // when it would sit on one already placed. The push is eased, so labels
    // slide apart instead of popping as the map turns.
    live.sort((p, q) => labY[p] - labY[q]);
    const placed: number[] = [];
    for (const i of live) {
      let y = labY[i];
      for (let pass = 0; pass < 3; pass++) {
        for (const j of placed) {
          const yj = labY[j] + labTgt[j];
          const hitX = labX[i] < labX[j] + labW[j] + 4 && labX[i] + labW[i] + 4 > labX[j];
          if (hitX && Math.abs(y - yj) < labH[i] + 4) y = yj + labH[i] + 4;
        }
      }
      labTgt[i] = Math.min(60, y - labY[i]);
      placed.push(i);
    }

    for (let i = 0; i < NN; i++) {
      labNudge[i] += (labTgt[i] - labNudge[i]) * (reduced ? 1 : k2);
      const el = labEl[i];
      const op = labA[i] * fade;
      const o = op < 0.01 ? "0" : op.toFixed(3);
      if (el.style.opacity !== o) el.style.opacity = o;
      el.style.transform = `translate(${labX[i].toFixed(1)}px,${(labY[i] + labNudge[i]).toFixed(1)}px)`;
    }

    // hook for screenshots / tests
    const dbg = Math.round(stageF * 100);
    if (dbg !== lastDebug) {
      lastDebug = dbg;
      document.documentElement.dataset.mapStage = stageF.toFixed(2);
    }
  }

  /* ---------------- interaction (explore mode) ---------------- */
  let downX = 0;
  let downY = 0;
  let moved = 0;
  const onDown = (e: PointerEvent) => {
    if (mode !== "explore") return;
    drag = true;
    lx = downX = e.clientX;
    ly = downY = e.clientY;
    moved = 0;
    canvas.setPointerCapture(e.pointerId);
  };
  const onMove = (e: PointerEvent) => {
    if (!drag) return;
    const dx = e.clientX - lx;
    const dy = e.clientY - ly;
    lx = e.clientX;
    ly = e.clientY;
    moved += Math.abs(dx) + Math.abs(dy);
    rotY += dx * 0.006;
    vY = dx * 0.006;
    rotX = clamp(rotX + dy * 0.004, -1, 1);
  };
  const onUp = (e: PointerEvent) => {
    if (!drag) return;
    drag = false;
    if (reduced) vY = 0;
    if (moved < 8) {
      // tap: nearest visible node within 34px
      let best = -1;
      let bd = 34 * 34;
      for (let i = 0; i < NN; i++) {
        const n = N[i];
        if (!sv[i] || n.kind === "me" || n.kind === "pillar" || n.kind === "worry") continue;
        if (!matches(i)) continue;
        const dx = sx[i] - e.clientX;
        const dy = sy[i] - e.clientY;
        const d = dx * dx + dy * dy;
        if (d < bd) { bd = d; best = i; }
      }
      o.onSelect(best);
    }
  };
  const onWheel = (e: WheelEvent) => {
    if (mode !== "explore") return;
    e.preventDefault();
    zoom = clamp(zoom * (e.deltaY > 0 ? 0.95 : 1.05), 0.6, 1.8);
  };
  canvas.addEventListener("pointerdown", onDown);
  canvas.addEventListener("pointermove", onMove);
  canvas.addEventListener("pointerup", onUp);
  canvas.addEventListener("pointercancel", onUp);
  canvas.addEventListener("wheel", onWheel, { passive: false });

  /* ---------------- lifecycle ---------------- */
  const start = () => {
    if (raf || disposed) return;
    last = 0;
    raf = requestAnimationFrame(frame);
  };
  const stop = () => {
    cancelAnimationFrame(raf);
    raf = 0;
  };
  const onVis = () => (document.hidden ? stop() : start());
  document.addEventListener("visibilitychange", onVis);

  const onResize = () => { resize(); measure(); measureLabels(); };
  window.addEventListener("resize", onResize);
  const ro = new ResizeObserver(onResize);
  ro.observe(canvas);
  ro.observe(document.body); // content height changes (fonts, form) move the sections
  void document.fonts?.ready.then(() => { if (!disposed) { measure(); measureLabels(); } });
  window.addEventListener("load", measure);

  resize();
  measure();
  if (!document.hidden) start();

  return {
    setMode(m) {
      mode = m;
      if (m === "explore") { filter = null; sel = -1; vY = 0; }
      else { drag = false; zoom = 1; }
    },
    setFilter(m) { filter = m; },
    setSelected(i) { sel = i; },
    setReducedMotion(b) { reduced = b; worryOn.clear(); if (b) { vY = 0; shownStage = Math.round(stageF); } },
    measure,
    dispose() {
      disposed = true;
      stop();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("load", measure);
      ro.disconnect();
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      canvas.removeEventListener("wheel", onWheel);
      labEl.forEach((el) => el.remove());
      for (const p of [dust, nodes]) {
        p.geometry.dispose();
        (p.material as ShaderMaterial).dispose();
      }
      lineGeo.dispose();
      lineMat.dispose();
      scene.remove(root);
      renderer.dispose();
      delete document.documentElement.dataset.mapStage;
    },
  };
}
