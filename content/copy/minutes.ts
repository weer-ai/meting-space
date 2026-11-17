/**
 * /minutes copy, verbatim from CONTENT.md ("About／證據頁文案"). Checked by tests/copy.test.ts.
 * Facts v9 marked unconfirmed (patent count, Lufthansa numbers, SkyTeam 18 airlines,
 * language level) must not be added here.
 */

export const hero = {
  title: "The minutes.",
  lead: "Everything I teach, I tried on myself first. Here's the record.",
  mapCta: "Explore the map",
};

export const lines = {
  title: "Five lines that cross",
  evidenceLabel: "Evidence",
  rows: [
    {
      line: "Four curves",
      copy: "Design, business, money and AI building, layered over fifteen years.",
      evidence: "Product design → consulting → founder; building Weer with AI",
    },
    {
      line: "Five countries",
      copy: "Asia-Pacific and Europe, then the US, and back to Taiwan.",
      evidence: "Taiwan, Germany, the Netherlands, the US, Singapore",
    },
    {
      line: "Three ways of working",
      copy: "Inside large companies, on my own, and in startups.",
      evidence: "Lufthansa Group, Accenture, BMW; freelance; Weer",
    },
    {
      line: "Three industries",
      copy: "Aviation hardware, tech consulting, e-commerce and retail.",
      evidence: "Boeing 777X cabin, Accenture, Rituals, PVH",
    },
    {
      line: "Recognised in each role",
      copy: "As a designer, an engineer and a product team.",
      evidence: "US patent, Red Dot Design Concept, Webby Winner, GSMA GLOMO",
    },
  ],
};

export const means = {
  title: "What this means for you",
  lead: "Changing direction is a skill. I've done it on purpose, more than once, and measured what it cost, so you don't have to guess.",
  items: [
    "I know what it feels like to start over in a new country and a new language.",
    "I know the spreadsheet behind a calm decision.",
    "I know which experiments were cheap and which weren't.",
  ],
};

export const now = {
  title: "Now",
  items: [
    { lead: "Weer", text: "a rental marketplace so travellers can pack less. Two years, no salary, by design." },
    { lead: "The Board", text: "this cohort, and the log where I run the method in public." },
    {
      lead: "Taiwan",
      text: "Terminal Taiwan, helping international builders settle here, on the side.",
      /** Linked when TERMINAL_TAIWAN_URL is set (content/config.ts); until then it carries a red [TBD]. */
      link: "Building in Taiwan? →",
    },
  ],
};

export const closing = {
  cta: "Join the waitlist",
  /** Copied exactly as written, including "→ email". */
  secondary: "Teams and talks → email",
};
