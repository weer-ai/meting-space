"use client";

import { useEffect, useRef } from "react";
import TbdTag from "@/components/TbdTag";
import { ui } from "@/content/copy/ui";
import type { Graph } from "@/components/nodemap/graph";

type Props = {
  graph: Graph;
  filter: number | null;
  sel: number;
  onFilter: (module: number | null) => void;
  onSelect: (i: number) => void;
  onExit: () => void;
};

/** Explore mode chrome: help line, exit button, module chips, info card. */
export default function ExploreUI({ graph, filter, sel, onFilter, onSelect, onExit }: Props) {
  const exitRef = useRef<HTMLButtonElement>(null);
  useEffect(() => exitRef.current?.focus({ preventScroll: true }), []);

  const n = sel >= 0 ? graph.nodes[sel] : null;

  return (
    <>
      <div className="xui xhelp">{ui.exploreHelp}</div>
      <div className="xui xtop">
        <button ref={exitRef} type="button" className="pill" onClick={onExit}>
          {ui.exploreExit}
        </button>
      </div>
      <div className="xui chips" role="group" aria-label={ui.mapListLabel}>
        <button
          type="button"
          className={"chip" + (filter === null ? " on" : "")}
          aria-pressed={filter === null}
          onClick={() => onFilter(null)}
        >
          {ui.chipAll}
        </button>
        {graph.modules.map((m) => (
          <button
            key={m}
            type="button"
            className={"chip" + (filter === m ? " on" : "")}
            aria-pressed={filter === m}
            onClick={() => onFilter(m)}
          >
            {graph.nodes[m].name}
          </button>
        ))}
      </div>
      {n && (
        <div className="card" role="region" aria-label={n.name} aria-live="polite">
          <button type="button" className="x" aria-label={ui.cardClose} onClick={() => onSelect(-1)}>
            ×
          </button>
          {(n.kind === "module" || n.year) && <div className="m">{n.kind === "module" ? ui.cardModule : n.year}</div>}
          <div className="t">{n.name}</div>
          <p>{n.text}</p>
          {n.tbd && <TbdTag />}
          <div className="tg">
            {n.links.map((l) => (
              <span key={l}>{graph.nodes[l].name}</span>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
