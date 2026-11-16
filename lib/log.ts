import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

/** content/log/*.md  ->  one post per file. CONTENT.md §日誌. */
export type LogPost = {
  slug: string;
  title: string;
  date: string; // ISO yyyy-mm-dd
  module: string;
  summary: string;
  body: string;
};

const DIR = path.join(process.cwd(), "content", "log");

export function getAllPosts(): LogPost[] {
  if (!fs.existsSync(DIR)) return [];
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const { data, content } = matter(fs.readFileSync(path.join(DIR, f), "utf8"));
      return {
        slug: f.replace(/\.md$/, ""),
        title: String(data.title ?? ""),
        date: data.date instanceof Date ? data.date.toISOString().slice(0, 10) : String(data.date ?? ""),
        module: String(data.module ?? ""),
        summary: String(data.summary ?? ""),
        body: content,
        draft: data.draft === true,
      };
    })
    .filter((p) => !(p as { draft: boolean }).draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getLatestPosts(n: number): LogPost[] {
  return getAllPosts().slice(0, n);
}
