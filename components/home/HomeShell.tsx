"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ui } from "@/content/copy/ui";
import { buildGraph } from "@/components/nodemap/graph";
import type { Mode, SceneController } from "@/components/nodemap/scene";
import ExploreUI from "./ExploreUI";
import { EXPLORE_EVENT } from "./events";

const GRAPH = buildGraph();

/**
 * Client shell for the home page. Owns the canvas, the story/explore mode and
 * the explore UI state; the six story sections arrive as server-rendered children.
 * The 3D scene is only ever created here, so no other page carries three.js.
 */
export default function HomeShell({ children }: { children: React.ReactNode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelsRef = useRef<HTMLDivElement>(null);
  const ctl = useRef<SceneController | null>(null);
  const savedY = useRef(0);
  const [mode, setMode] = useState<Mode>("story");
  const [filter, setFilter] = useState<number | null>(null);
  const [sel, setSel] = useState(-1);
  const [failed, setFailed] = useState(false);
  const [formInView, setFormInView] = useState(false);

  // latest UI state, so a scene that finishes loading late can catch up
  const latest = useRef({ mode, filter, sel });
  latest.current = { mode, filter, sel };

  // scene lifecycle. three.js is a separate chunk, loaded after the page is interactive.
  useEffect(() => {
    const canvas = canvasRef.current;
    const labels = labelsRef.current;
    if (!canvas || !labels) return;
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)");
    let cancelled = false;
    let c: SceneController | null = null;
    let onRm: (() => void) | null = null;
    void import("@/components/nodemap/scene").then(({ createScene }) => {
      if (cancelled) return;
      c = createScene({ canvas, labels, graph: GRAPH, reducedMotion: rm.matches, onSelect: setSel });
      if (!c) {
        setFailed(true);
        document.body.classList.add("no-map"); // hides every "Explore the map" button
        return;
      }
      ctl.current = c;
      c.setMode(latest.current.mode);
      c.setFilter(latest.current.filter);
      c.setSelected(latest.current.sel);
      const ctlNow = c;
      onRm = () => ctlNow.setReducedMotion(rm.matches);
      rm.addEventListener("change", onRm);
    });
    return () => {
      cancelled = true;
      if (onRm) rm.removeEventListener("change", onRm);
      c?.dispose();
      ctl.current = null;
      document.body.classList.remove("no-map");
    };
  }, []);

  // keep the scene in sync with React state
  useEffect(() => {
    ctl.current?.setMode(mode);
    document.body.classList.toggle("explore", mode === "explore");
    return () => document.body.classList.remove("explore");
  }, [mode]);
  useEffect(() => ctl.current?.setFilter(filter), [filter]);
  useEffect(() => ctl.current?.setSelected(sel), [sel]);

  const enter = useCallback(() => {
    savedY.current = window.scrollY;
    setFilter(null);
    setSel(-1);
    setMode("explore");
  }, []);
  const leave = useCallback(() => {
    setMode("story");
    setFilter(null);
    setSel(-1);
    if (new URLSearchParams(location.search).has("explore")) {
      history.replaceState(null, "", location.pathname + location.hash);
    }
    window.scrollTo(0, savedY.current);
  }, []);

  // /?explore=1 opens the map straight away (linked from /minutes)
  useEffect(() => {
    if (!failed && new URLSearchParams(location.search).get("explore") === "1") enter();
  }, [enter, failed]);

  // buttons inside the server-rendered story ask for explore mode through an event
  useEffect(() => {
    if (failed) return;
    window.addEventListener(EXPLORE_EVENT, enter);
    return () => window.removeEventListener(EXPLORE_EVENT, enter);
  }, [enter, failed]);

  useEffect(() => {
    if (mode !== "explore") return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && leave();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode, leave]);

  // do not float the "Explore the map" button over the form
  useEffect(() => {
    const el = document.getElementById("waitlist");
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setFormInView(e.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const explore = mode === "explore";

  return (
    <>
      {failed ? (
        <div className="map-fallback" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/map-fallback.jpg" alt="" onError={(e) => (e.currentTarget.hidden = true)} />
        </div>
      ) : (
        <>
          <canvas id="gl" ref={canvasRef} aria-hidden="true" />
          <div id="labels" ref={labelsRef} aria-hidden="true" />
        </>
      )}

      {children}

      {!failed && (
        <button
          type="button"
          className={"pill ghost hint story-only" + (formInView ? " away" : "")}
          onClick={enter}
          tabIndex={formInView ? -1 : 0}
        >
          {ui.exploreOpen} <span aria-hidden="true">↗</span>
        </button>
      )}

      {explore && (
        <ExploreUI graph={GRAPH} filter={filter} sel={sel} onFilter={setFilter} onSelect={setSel} onExit={leave} />
      )}

      {/* text equivalent of the map for screen readers; focusing an item opens its card */}
      {!failed && (
        <ul className="sr-only" aria-label={ui.mapListLabel}>
          {GRAPH.nodes
            .filter((n) => n.kind === "module" || n.kind === "exp")
            .map((n) => (
              <li key={n.id}>
                <button
                  type="button"
                  tabIndex={explore ? 0 : -1}
                  onFocus={() => explore && setSel(n.i)}
                  onClick={() => (explore ? setSel(n.i) : enter())}
                >
                  {n.name}
                  {n.year ? `, ${n.year}` : ""}. {n.text}
                </button>
              </li>
            ))}
        </ul>
      )}
    </>
  );
}
