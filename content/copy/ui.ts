/**
 * Interface microcopy that CONTENT.md does not contain.
 * Reuses v9 prototype wording where it exists; anything new or adapted is
 * flagged below so Ting can review it. NOT checked against CONTENT.md.
 */

export const SITE = {
  email: "ting@meting.space",
  linkedin: "https://www.linkedin.com/in/metingspace/",
} as const;

export const ui = {
  brand: "me/ting space", // v9
  exploreOpen: "Explore the map", // CONTENT.md (/minutes hero); v9 added an arrow
  exploreExit: "Back to story ✕", // v9
  exploreHelp: "Drag to turn. Tap a dot. Pick a module below.", // v9, "keyword" -> "module" (ADAPTED)
  chipAll: "All", // v9
  cardClose: "Close", // v9 (aria-label)
  cardModule: "Module", // v9 said "Keyword" (ADAPTED)
  tbd: "[TBD]", // CONTENT.md
  linkedin: "LinkedIn", // NEW: link label
  mapAria: "Map of experiences and the six modules they connect to", // NEW: a11y
  mapListLabel: "Map nodes", // NEW: a11y
  skipToWaitlist: "Join the waitlist", // CONTENT.md CTA
  // Page names for the footer navigation. NEW: CONTENT.md names the pages but gives no nav labels.
  navBoard: "The Board", // CONTENT.md page name for /cohort
  navMinutes: "The minutes", // CONTENT.md /minutes headline, without the full stop
  navLog: "From the log", // CONTENT.md (05) heading, reused for /log
  navLabel: "Pages", // NEW: aria-label
  // /log
  logAllModules: "All", // v9 chip label
  logModuleFilter: "Filter by module", // NEW: aria-label
  logBack: "From the log", // NEW: back link on a post, same label as the nav
} as const;
