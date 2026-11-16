import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { formatDate, getAllPosts, getPost, normalizeModule } from "@/lib/log";
import { renderMarkdown } from "@/lib/markdown";

const FIX = path.join(__dirname, "fixtures", "log");
const prev = process.env.LOG_DIR;
beforeEach(() => { process.env.LOG_DIR = FIX; });
afterEach(() => { if (prev === undefined) delete process.env.LOG_DIR; else process.env.LOG_DIR = prev; });

describe("log posts", () => {
  it("lists published posts newest first and never lists drafts", () => {
    const posts = getAllPosts();
    expect(posts.map((p) => p.slug)).toEqual(["2026-11-10-first-ledger", "2026-11-02-second"]);
    expect(getPost("2026-12-01-draft")).toBeUndefined();
  });
  it("accepts a module by name or by number", () => {
    expect(normalizeModule("Fund")).toBe("Fund");
    expect(normalizeModule("fund")).toBe("Fund");
    expect(normalizeModule(2)).toBe("Define");
    expect(normalizeModule("06")).toBe("Resilience");
    expect(normalizeModule("nope")).toBeNull();
    expect(normalizeModule(7)).toBeNull();
  });
  it("formats dates like CONTENT.md (Nov 16, 2026)", () => {
    expect(formatDate("2026-11-16")).toBe("Nov 16, 2026");
  });
  it("an empty or missing folder means no posts, not an error", () => {
    process.env.LOG_DIR = path.join(os.tmpdir(), "meting-no-such-dir");
    expect(getAllPosts()).toEqual([]);
  });
  it("a half-filled post fails loudly instead of being published", () => {
    const d = fs.mkdtempSync(path.join(os.tmpdir(), "meting-log-"));
    fs.writeFileSync(path.join(d, "bad.md"), "---\ntitle: No date\nmodule: Fund\n---\nbody");
    process.env.LOG_DIR = d;
    expect(() => getAllPosts()).toThrow(/title and a date/);
    fs.writeFileSync(path.join(d, "bad.md"), "---\ntitle: T\ndate: 2026-11-01\nmodule: Nonsense\n---\nbody");
    expect(() => getAllPosts()).toThrow(/module must be one of/);
  });
});

describe("markdown", () => {
  it("renders markdown and drops raw HTML / scripts", async () => {
    const html = await renderMarkdown(getPost("2026-11-10-first-ledger")!.body);
    expect(html).toContain("<strong>not</strong>");
    expect(html).toContain("<h2>A heading</h2>");
    expect(html).not.toMatch(/<script/i);
  });
});
