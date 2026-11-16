"use client";

import Link from "next/link";
import { useState } from "react";
import { MODULES, type Module } from "@/data/nodes";
import { ui } from "@/content/copy/ui";

export type LogListItem = { slug: string; title: string; dateLabel: string; module: Module; summary: string };

/** Post list with a filter by module, so readers can see a real case for each of the six modules. */
export default function LogList({ posts }: { posts: LogListItem[] }) {
  const [filter, setFilter] = useState<Module | null>(null);
  // only offer modules that have at least one post
  const present = MODULES.filter((m) => posts.some((p) => p.module === m.name));
  const shown = filter ? posts.filter((p) => p.module === filter) : posts;

  return (
    <>
      <div className="log-filter" role="group" aria-label={ui.logModuleFilter}>
        <button type="button" className={"chip" + (filter === null ? " on" : "")} aria-pressed={filter === null} onClick={() => setFilter(null)}>
          {ui.logAllModules}
        </button>
        {present.map((m) => (
          <button key={m.name} type="button" className={"chip" + (filter === m.name ? " on" : "")} aria-pressed={filter === m.name} onClick={() => setFilter(m.name)}>
            {m.name}
          </button>
        ))}
      </div>
      <ul className="log-list">
        {shown.map((p) => (
          <li key={p.slug}>
            <div className="meta">
              <time>{p.dateLabel}</time>
              <span className="mod">{p.module}</span>
            </div>
            <h3>
              <Link href={`/log/${p.slug}`}>{p.title}</Link>
            </h3>
            {p.summary && <p>{p.summary}</p>}
          </li>
        ))}
      </ul>
    </>
  );
}
