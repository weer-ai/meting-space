import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

/** Markdown -> sanitized HTML. Raw HTML in a post is dropped, not rendered. */
export async function renderMarkdown(md: string): Promise<string> {
  const file = await unified().use(remarkParse).use(remarkRehype).use(rehypeSanitize).use(rehypeStringify).process(md);
  return String(file);
}
