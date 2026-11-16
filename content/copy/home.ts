/**
 * Home page copy. Every English string here is copied verbatim from CONTENT.md
 * (tests/copy.test.ts checks that). Do not paraphrase, shorten or "polish".
 * Interface microcopy that CONTENT.md does not contain lives in ui.ts instead.
 */

export const cover = {
  eyebrow: "Hi, nice me(e)ting you.",
  headline: "The world is changing faster than any single career. Go long on yourself.",
  /** Part of the headline set in italics. */
  headlineEm: "Go long on yourself.",
  sub: "Stack your skills, build more than one line, spread your risk, and let your life compound. A six-week life-design cohort by someone who runs her own life this way.",
  cta: "Join the waitlist",
  secondary: "Why now ↓",
};

export const whyNow = {
  num: "(01)",
  title: "Why now: the safe path became the risky one",
  titleEm: "the safe path became the risky one",
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
  ],
  result: "You would never put your whole portfolio in one stock. Most of us put our whole life in one.",
  bridge: "The answer is not to predict the future. It is to be positioned for several of them.",
};

export const idea = {
  num: "(02)",
  title: "The idea",
  lead: "Diversify like an investor, operate like a company. A company has a mission, a product line, a CFO, a talent plan and an R&D budget. Your life can too.",
  headers: ["A company has", "Your life needs"] as const,
  rows: [
    ["A mission", "A position you can say in one sentence"],
    ["A product line", "More than one income curve"],
    ["A CFO", "A runway you know to the month"],
    ["A talent plan", "An environment that makes you grow"],
    ["R&D", "Small, cheap experiments before big moves"],
  ] as const,
  line: "I am not a coach with a motivational script. I am a designer who applied the same methods to her own life, and kept the receipts.",
};

export const agenda = {
  num: "(03)",
  title: "The agenda",
  lead: "Six sessions, one per week. Each one ends with a decision, not a mood.",
  cards: [
    { verb: "Discover", text: "See where you really stand: skills, assets, money, energy." },
    { verb: "Define", text: "Design the life you want, and measure the gap." },
    { verb: "Prototype", text: "Test the new life in small, cheap experiments." },
    { verb: "Fund", text: "Make the experiments affordable: spending, runway, income curves." },
    { verb: "Environment", text: "Put yourself where growth happens on its own." },
    { verb: "Resilience", text: "Spread your risk across places, income and assets." },
  ],
  cta: "See the full agenda →",
};

export const whyMe = {
  num: "(04)",
  title: "Why me",
  lead: "I am the first client of this method. Fifteen years, five countries, three kinds of work, and one rule: design it, test it, then commit.",
  items: [
    { title: "Four curves.", text: "Design, business, money and AI building, each learned on the job." },
    { title: "Five countries.", text: "Taiwan, Germany, the Netherlands, the US and Singapore." },
    { title: "Three ways of working.", text: "Full-time, freelance and startups." },
    {
      title: "Recognised in each role.",
      text: "A US patent as a designer, Red Dot and Webby as a product team, awards as a founder.",
    },
  ],
  nowLabel: "Right now:",
  now: "I am building a startup with no salary for two years, and running this playbook in public so you can watch it work, or not.",
  cta: "Read the minutes →",
};

export const fromLog = {
  num: "(05)",
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
