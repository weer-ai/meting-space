/**
 * /cohort copy, verbatim from CONTENT.md ("Cohort 頁文案"). Checked by tests/copy.test.ts.
 *
 * Every [TBD] stays and renders as a red label. CONTENT.md writes the refund
 * placeholder as "[TBD 退款政策]"; the Chinese part is a note for Ting, so only
 * "[TBD]" ships.
 */

export const hero = {
  title: "The Board · Cohort 01",
  sub: "Six weeks to design, test and fund the next version of your life.",
  facts: ["6 weeks", "Live, online", "Small group [TBD]", "Starts [TBD]"],
  cta: "Join the waitlist",
};

export const who = {
  title: "Who it is for",
  items: [
    {
      lead: "The professional at a crossroads.",
      text: "You are good at your job, maybe senior, and quietly aware that one employer, one skill and one country is a lot to bet on. You want options before you need them.",
    },
    {
      lead: "The explorer.",
      text: "You already work remotely, travel, or have a side project. You want to turn scattered experiments into a strategy that pays.",
    },
  ],
  either: "Either way, you like frameworks, spreadsheets and honest numbers more than affirmations.",
  notFor: {
    lead: "Not for you if",
    text: "you want someone to tell you what to do, or a guaranteed income plan.",
  },
};

export const agenda = {
  title: "The agenda",
  labels: { youWill: "You will", leaveWith: "You leave with", minutes: "From my minutes" },
  weeks: [
    {
      title: "Discover: see where you stand",
      youWill: "Map your skills, assets, money and energy, as-is",
      leaveWith: "A one-page company profile of you",
      minutes: "My Ikigai map and four career curves",
    },
    {
      title: "Define: design the to-be",
      youWill: "Use design thinking to describe the life you want, then size the gap",
      leaveWith: "A to-be statement and a gap list",
      minutes: "How I chose a startup over a safe consulting niche",
    },
    {
      title: "Prototype: test before you leap",
      youWill: "Turn the gap into three small, cheap experiments",
      leaveWith: "A 90-day experiment plan",
      minutes: "Living and working across five countries before committing to one",
    },
    {
      title: "Fund: make it affordable",
      youWill: "Spending design, runway to the month, more than one income curve",
      leaveWith: "Your runway number and income map",
      minutes: "The ledger I use to fund two years without a salary",
    },
    {
      title: "Environment: grow by default",
      youWill: "Choose or create the rooms that make you better",
      leaveWith: "One environment to join, one to build",
      minutes: "Network School, and starting a builder community in Taiwan",
    },
    {
      title: "Resilience: spread the risk",
      youWill: "Spread where you live, earn and keep assets",
      leaveWith: "A personal risk map",
      minutes: "Running a company in one country while living in another",
    },
  ],
};

export const how = {
  title: "How it works",
  items: [
    { lead: "Live sessions:", text: "one per week, online. Recordings for those in other time zones [TBD]." },
    { lead: "Weekly assignment:", text: "one worksheet, about two hours." },
    { lead: "Peer board:", text: "small groups that review each other's decisions." },
    { lead: "Templates you keep:", text: "life ledger, Ikigai canvas, runway calculator." },
  ],
};

export const faq = {
  title: "FAQ",
  items: [
    {
      q: "Is this financial or tax advice?",
      a: "No. I share what I did and why. For your own case, I will point you to a licensed professional.",
    },
    { q: "Do I need to quit my job?", a: "No. Most experiments in week 3 fit around a full-time job." },
    { q: "What does it cost?", a: "[TBD] Waitlist members hear first." },
    { q: "What if it is not for me?", a: "[TBD]" },
  ],
};

export const closing = {
  title: "Your board meets in [month TBD].",
  cta: "Join the waitlist",
};
