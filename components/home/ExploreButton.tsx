"use client";

import { ui } from "@/content/copy/ui";
import { EXPLORE_EVENT } from "./events";

export default function ExploreButton({ className }: { className?: string }) {
  return (
    <button type="button" className={className} onClick={() => window.dispatchEvent(new Event(EXPLORE_EVENT))}>
      {ui.exploreOpen} <span aria-hidden="true">↗</span>
    </button>
  );
}
