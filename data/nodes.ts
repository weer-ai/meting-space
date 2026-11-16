/**
 * 3D node map data. Source: DESIGN-BRIEF.md §3 (model, module texts, starter nodes).
 * Add an experience = add one entry here; no code changes needed.
 *
 * `tbd: true` only makes the card show a red [TBD] label. Internal notes
 * (what still has to be confirmed) live in comments and never ship to the browser.
 */

export type Module =
  | "Discover"
  | "Define"
  | "Prototype"
  | "Fund"
  | "Environment"
  | "Resilience";

/**
 * The five things to diversify. They are the baskets in "The real problem" and
 * the sections of "Meet your mentor": skills, income, places, people, money.
 */
export type Pillar = "skill" | "income" | "place" | "people" | "money";

export type ExperienceNode = {
  id: string;
  name: string;
  year?: string;
  pillar: Pillar;
  /** Edges: experience -> module. */
  modules: Module[];
  text: string;
  /** Highlighted in stage 4 (Why me). */
  proof?: boolean;
  tbd?: boolean;
};

export const MODULES: { name: Module; text: string }[] = [
  { name: "Discover", text: "See where you really stand." },
  { name: "Define", text: "Design the to-be and size the gap." },
  { name: "Prototype", text: "Test the new life in small, cheap experiments." },
  { name: "Fund", text: "Make the experiments affordable." },
  { name: "Environment", text: "Put yourself where growth happens on its own." },
  { name: "Resilience", text: "Spread your risk across places, income and assets." },
];

export const EXPERIENCES: ExperienceNode[] = [
  {
    id: "industrial-design-taipei",
    name: "Industrial design, Taipei",
    year: "2010",
    pillar: "skill",
    modules: ["Discover"],
    text: "BA Industrial Product Design, Shih Chien University.",
  },
  {
    id: "bmw-munich",
    name: "BMW, Munich",
    year: "2011",
    pillar: "place",
    modules: ["Prototype", "Environment"],
    text: "Design internship bridging Chinese market design preferences.",
  },
  {
    id: "designit-munich",
    name: "Designit, Munich",
    year: "2011–12",
    pillar: "place",
    modules: ["Prototype"],
    text: "Service design helping Western brands bridge into China.",
  },
  {
    id: "tu-delft",
    name: "TU Delft",
    year: "2013–15",
    pillar: "people",
    modules: ["Environment", "Discover"],
    text: "MSc Integrated Product Design, 9/10.",
  },
  {
    id: "boeing-777x",
    name: "Boeing 777X",
    year: "2014–15",
    pillar: "skill",
    modules: ["Prototype", "Define"],
    text: "Galley workspace +60%, toilet legroom +6 cm. US patents for the cabin.",
    proof: true,
    tbd: true, // patent count to confirm
  },
  {
    id: "accenture-interactive",
    name: "Accenture Interactive",
    year: "2016–21",
    pillar: "skill",
    modules: ["Prototype", "Environment"],
    text: "30+ design sprints, 10+ MVPs turned into full products.",
    proof: true,
  },
  {
    id: "smartify",
    name: "Smartify",
    year: "2016–21",
    pillar: "skill",
    modules: ["Prototype"],
    text: "Webby Winner and People's Voice; GSMA GLOMO Most Innovative Mobile App.",
    proof: true,
    tbd: true, // Ting's role to confirm
  },
  {
    id: "ai-building",
    name: "AI building",
    year: "2024–",
    pillar: "skill",
    modules: ["Prototype", "Define"],
    text: "Building Weer's product with AI coding tools.",
  },
  {
    id: "meting-experience-design",
    name: "meting experience design",
    year: "2021–",
    pillar: "income",
    modules: ["Fund", "Resilience"],
    text: "Independent practice: Rituals, gategroup, Philips, InterContinental Amstel.",
  },
  {
    id: "rituals",
    name: "Rituals",
    year: "2021–",
    pillar: "income",
    modules: ["Prototype"],
    text: "In-store sales +19%, membership sign-ups +14%.",
    proof: true,
  },
  {
    id: "gategroup",
    name: "gategroup",
    year: "2021",
    pillar: "income",
    modules: ["Prototype", "Resilience"],
    text: "A new digital business during COVID-19, $150M potential revenue.",
    proof: true,
  },
  {
    id: "lufthansa-group",
    name: "Lufthansa Group",
    year: "2025",
    pillar: "income",
    modules: ["Fund", "Prototype"],
    text: "Remote contract: product strategy across five airlines.",
    proof: true,
    tbd: true, // may the numbers go public?
  },
  {
    id: "weer",
    name: "Weer",
    year: "2023–",
    pillar: "income",
    modules: ["Define", "Prototype", "Fund"],
    text: "Founder. Startupbootcamp Top 10; Erasmus Entrepreneurship fellow.",
    proof: true,
  },
  {
    id: "life-ledger",
    name: "Life ledger",
    year: "2026",
    pillar: "money",
    modules: ["Fund"],
    text: "The spreadsheet behind two years without a salary.",
    tbd: true, // how public?
  },
  {
    id: "singapore-company",
    name: "Singapore company",
    year: "2023–",
    pillar: "place",
    modules: ["Resilience"],
    text: "A company in one country, a life in another.",
    tbd: true, // how public?
  },
  {
    id: "network-school",
    name: "Network School",
    year: "2026",
    pillar: "people",
    modules: ["Environment"],
    text: "Joined a builder environment on purpose.",
  },
  {
    id: "terminal-taiwan",
    name: "Terminal Taiwan",
    year: "2026",
    pillar: "people",
    modules: ["Environment", "Resilience"],
    text: "Started a community for international builders in Taiwan.",
  },
  {
    id: "ikigai-map",
    name: "Ikigai map",
    year: "2026",
    pillar: "skill",
    modules: ["Discover", "Define"],
    text: "How I chose a direction.",
  },
];
