import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { MODULES, type Module } from "@/data/nodes";

/** content/log/*.md, one post per file (CONTENT.md, "日誌 /log"). */
export type LogPost = {
  slug: string;
  title: string;
  /** ISO yyyy-mm-dd */
  date: string;
  /** Which of the six modules the post is a real case for. */
  module: Module;
  summary: string;
  body: string;
};

/** Tests and previews can point at another folder with LOG_DIR. */
const dir = () => process.env.LOG_DIR || path.join(process.cwd(), "content", "log");

/** Accepts "Fund", "fund", 4, "04" (module numbers follow the 01–06 order). */
export function normalizeModule(v: unknown): Module | null {
  const s = String(v ?? "").trim().toLowerCase();
  const byName = MODULES.find((m) => m.name.toLowerCase() === s);
  if (byName) return byName.name;
  const n = Number(s);
  return Number.isInteger(n) && n >= 1 && n <= MODULES.length ? MODULES[n - 1].name : null;
}

export function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
}

/** Published posts, newest first. `draft: true` posts are left out of every page and list. */
export function getAllPosts(): LogPost[] {
  const d = dir();
  if (!fs.existsSync(d)) return [];
  const posts: LogPost[] = [];
  for (const f of fs.readdirSync(d).filter((x) => x.endsWith(".md"))) {
    const { data, content } = matter(fs.readFileSync(path.join(d, f), "utf8"));
    if (data.draft === true) continue;
    const date = data.date instanceof Date ? data.date.toISOString().slice(0, 10) : String(data.date ?? "");
    const module = normalizeModule(data.module);
    // Fail the build loudly instead of publishing a half-filled post.
    if (!data.title || !/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error(`content/log/${f}: needs a title and a date (yyyy-mm-dd)`);
    if (!module) throw new Error(`content/log/${f}: module must be one of ${MODULES.map((m) => m.name).join(", ")} (or 1–6)`);
    posts.push({ slug: f.replace(/\.md$/, ""), title: String(data.title), date, module, summary: String(data.summary ?? ""), body: content });
  }
  return posts.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.slug.localeCompare(b.slug)));
}

export const getLatestPosts = (n: number) => getAllPosts().slice(0, n);
export const getPost = (slug: string) => getAllPosts().find((p) => p.slug === slug);
