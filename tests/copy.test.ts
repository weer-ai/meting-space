import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import * as home from "@/content/copy/home";
import * as cohort from "@/content/copy/cohort";
import * as minutes from "@/content/copy/minutes";
import * as log from "@/content/copy/log";
import { EXPERIENCES, MODULES } from "@/data/nodes";
import { ME_LABEL, ME_NOW_LABEL, PILLARS, WORRIES } from "@/data/story";

/**
 * "English copy is copied verbatim" is enforced here: every string that ships
 * must be found, character for character, in the source document
 * (after stripping Markdown decoration).
 */
const read = (f: string) => readFileSync(path.join(__dirname, "..", f), "utf8");

const norm = (s: string) =>
  s
    .replace(/\\([\[\]_*`])/g, "$1") // markdown escapes
    .replace(/[*`]/g, "") // bold / italic / code
    .replace(/\s+/g, " ")
    .trim();

const CONTENT = norm(read("CONTENT.md"));
const BRIEF = norm(read("DESIGN-BRIEF.md"));

function strings(value: unknown, out: string[] = []): string[] {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) value.forEach((v) => strings(v, out));
  else if (value && typeof value === "object") Object.values(value).forEach((v) => strings(v, out));
  return out;
}

const pages = { home, cohort, minutes, log };

describe("page copy is verbatim from CONTENT.md", () => {
  for (const [file, mod] of Object.entries(pages)) {
    for (const [section, value] of Object.entries(mod)) {
      describe(`${file}.${section}`, () => {
        for (const s of strings(value)) {
          // "(01)" style numbers are structure, not copy.
          if (/^\(\d\d\)$/.test(s)) continue;
          it(JSON.stringify(s.length > 70 ? s.slice(0, 70) + "…" : s), () => {
            expect(CONTENT).toContain(norm(s));
          });
        }
      });
    }
  }

  it("italic spans are real substrings of their headline", () => {
    expect(home.cover.headline).toContain(home.cover.headlineEm);
    expect(home.idea.title).toContain(home.idea.titleEm);
  });

  it("every [TBD] placeholder CONTENT.md puts on /cohort is still there", () => {
    const text = strings(cohort).join(" ");
    expect(text).toContain("Small group [TBD]");
    expect(text).toContain("Starts [TBD]");
    expect(text).toContain("Recordings for other time zones [TBD]");
    expect(text).toContain("[month TBD]");
    expect(cohort.faq.items.find((i) => i.q.startsWith("What does it cost"))!.a).toContain("[TBD]");
    expect(cohort.faq.items.find((i) => i.q.startsWith("What if it's not"))!.a).toBe("[TBD refund policy]");
  });
});

describe("node data is verbatim from DESIGN-BRIEF.md", () => {
  for (const m of MODULES) {
    it(`module ${m.name}`, () => {
      expect(BRIEF).toContain(norm(`**${m.name}**：${m.text}`) );
    });
  }
  for (const e of EXPERIENCES) {
    it(`node ${e.name}`, () => {
      expect(BRIEF).toContain(norm(e.name));
      expect(BRIEF).toContain(norm(e.text));
      if (e.year) expect(BRIEF).toContain(e.year);
    });
  }
});

describe("3D map labels are verbatim from CONTENT.md (v2 home story)", () => {
  for (const p of PILLARS) {
    it(`pillar ${p.name}: ${p.concentrated} / ${p.diversified}`, () => {
      expect(CONTENT).toContain(p.name);
      expect(CONTENT).toContain(p.concentrated);
      expect(CONTENT).toContain(p.diversified);
    });
  }
  for (const w of WORRIES) {
    it(`worry ${w}`, () => {
      expect(CONTENT).toContain(w);
    });
  }
  it("the centre node words are in CONTENT.md", () => {
    expect(CONTENT).toContain(ME_LABEL);
    expect(CONTENT).toContain(ME_NOW_LABEL);
  });
  it("the worries are listed together in CONTENT.md, in this order", () => {
    expect(CONTENT).toContain(WORRIES.join(" · "));
  });
});

describe("launch hygiene", () => {
  it("no internal notes or unverified numbers shipped in the node data", () => {
    const blob = JSON.stringify({ EXPERIENCES, MODULES, PILLARS, WORRIES, cohort, minutes, home });
    // No Chinese internal notes. The one exception is a proper noun in Ting's own English copy.
    expect(blob.replaceAll("花花生活節", "")).not.toMatch(/[一-鿿]/);
    expect(blob).not.toMatch(/\+12%|\+18%|18 airlines|P\d{1,2}\)/);
    expect(blob).not.toMatch(/\b7 patents?\b|\bseven patents?\b/i);
  });
});

describe("home v3 additions", () => {
  it("the Hengchun block keeps every [TBD] placeholder from CONTENT.md", () => {
    const facts = home.hengchun.facts.join(" ");
    expect(facts).toContain("[duration TBD]");
    expect(facts).toContain("[price TBD]");
  });
  it("the festival name is the only Chinese in the home copy", () => {
    const cjk = strings(home).join(" ").match(/[一-鿿]+/g) ?? [];
    expect(cjk).toEqual(["花花生活節"]);
  });
});
