/**
 * Home page copy (v2, approved by Ting 2026-11-16). Every English string here is
 * copied verbatim from CONTENT.md; tests/copy.test.ts checks that. Do not
 * paraphrase, shorten or "polish". Interface microcopy that CONTENT.md does not
 * contain lives in ui.ts instead.
 */

export const cover = {
  eyebrow: "Hi, nice me(e)ting you.",
  headline: "The world now moves faster than any career. Go long on yourself.",
  /** Part of the headline set in italics. */
  headlineEm: "Go long on yourself.",
  sub: "Skills, income, places and people that hold each other up, like a net. A six-week life-design cohort by someone who runs her own life this way.",
  cta: "Join the waitlist",
  secondary: "What is happening ↓",
};

export const happening = {
  num: "(01)",
  title: "What is happening?",
  lead: "Prices rise. AI learns your job. Teams get cut. Every week there is something new you are meant to keep up with.",
  result: "You are not falling behind. The ground is moving.",
};

export const problem = {
  num: "(02)",
  title: "The real problem",
  lead: "For decades the safe plan was one skill, one employer, one country. In a decade of AI, restructuring and borders that open and close, that plan is a concentrated bet.",
  items: [
    {
      title: "One skill.",
      text: "A single skill can be automated or outsourced. A combination of skills is much harder to replace.",
    },
    {
      title: "One income.",
      text: "When one paycheque carries rent, savings and every plan, one decision by someone else can stop all of it.",
    },
    {
      title: "One place.",
      text: "Your career, money and residency all sit under one country's rules and one market's cycle.",
    },
    {
      title: "One circle.",
      text: "When everyone around you works in the same field and thinks the same way, nobody warns you.",
    },
    {
      title: "One pot.",
      text: "All your money in one currency, one bank, one asset.",
    },
  ],
  result: "You would never put your whole portfolio in one stock. Most of us put our whole life in one.",
  bridge: "The answer is not to predict the future. It is to be positioned for several of them.",
};

export const idea = {
  num: "(03)",
  title: "The idea: run your life like a company",
  titleEm: "run your life like a company",
  lead: "Diversify like an investor, operate like a company. A company has a mission, a product line, a CFO, a talent plan and an R&D budget. Your life can too.",
  headers: ["A company has", "Your life needs"] as const,
  rows: [
    ["A mission", "A position you can say in one sentence"],
    ["A product line", "More than one income curve"],
    ["A CFO", "A runway you know to the month"],
    ["A talent plan", "An environment that makes you grow"],
    ["R&D", "Small, cheap experiments before big moves"],
    ["A board", "Five people who tell you the truth"],
    ["A risk register", "Risk spread across places and assets"],
  ] as const,
  line: "I am not a coach with a motivational script. I am a designer who applied the same methods to her own life, and kept the receipts.",
};

export const method = {
  num: "(04)",
  title: "The method",
  lead: "Six tools, one per week. Each one ends with a decision, not a mood.",
  /** `module` is the course module the tool belongs to (same six as the node map and /cohort). */
  cards: [
    { tool: "Ikigai", module: "Discover", text: "See where you really stand: skills, assets, money, energy." },
    { tool: "Design thinking", module: "Define", text: "Design the life you want, and measure the gap." },
    { tool: "Prototyping", module: "Prototype", text: "Test the new life in small, cheap experiments." },
    { tool: "Runway", module: "Fund", text: "Make the experiments affordable: spending, runway, income curves." },
    {
      tool: "Five friends",
      module: "Environment",
      text: "Put yourself where growth happens on its own. The five people around you set your normal. Choose them on purpose.",
    },
    { tool: "Flag theory", module: "Resilience", text: "Spread your risk across places, income and assets." },
  ],
  cta: "See the full agenda →",
};

export const mentor = {
  num: "(05)",
  title: "Meet your mentor",
  lead: "I am the first client of this method. Fifteen years, five countries, three kinds of work, and one rule: design it, test it, then commit.",
  /** One line per pillar; the evidence under each line comes from data/nodes.ts. */
  pillars: {
    skill: "Design, business, money and AI building, layered over fifteen years.",
    income: "Full-time, freelance and startups.",
    place: "Taiwan, Germany, the Netherlands, the US and Singapore.",
    people: "Put yourself where growth happens on its own.",
    money: "Two years, no salary, by design.",
  },
  nowLabel: "Right now:",
  now: "I am building a startup with no salary for two years, and running this playbook in public so you can watch it work, or not.",
  cta: "Read the minutes →",
};

export const fromLog = {
  num: "(06)",
  title: "From the log",
  lead: "The live case study. Real numbers, real decisions, including the ones that did not work.",
};

export const closing = {
  title: "Take a seat at your own board.",
  body: "The first cohort is small on purpose. Join the waitlist and tell me where you are stuck. I read every answer.",
};

export const waitlist = {
  email: "Email",
  firstName: "First name",
  identity: {
    label: "Which sounds more like you?",
    options: [
      "A professional at a crossroads",
      "An explorer (remote, nomad, side project, founder)",
      "Neither, tell me below",
    ],
  },
  stuck: {
    label: "Where are you stuck right now?",
    options: ["Career direction", "Money and runway", "Starting something", "Moving countries", "Other"],
  },
  price: {
    label: "If Cohort 01 costs [price TBD], would you consider joining?",
    options: ["Yes", "Maybe, depends on dates", "Not at that price"],
  },
  anything: "Anything else?",
  sendLog: "Send me the log too",
  submit: "Join the waitlist",
  success: "You are on the list. I read every answer, and I will write before the doors open.",
};

export const footer = {
  teams: "For teams and talks: the same method, in your company's language.",
  disclaimer:
    "Money, tax and residency topics are shared as personal experience, not financial, tax or legal advice.",
};
