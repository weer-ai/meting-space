import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { cover } from "@/content/copy/home";
import { ui } from "@/content/copy/ui";
import { formatDate, getAllPosts, getPost } from "@/lib/log";
import { renderMarkdown } from "@/lib/markdown";

export const dynamicParams = false;

/** `output: "export"` needs at least one path. With no posts yet we emit one placeholder that bounces to /log. */
const PLACEHOLDER = "_";

export function generateStaticParams() {
  const slugs = getAllPosts().map((p) => p.slug);
  return (slugs.length ? slugs : [PLACEHOLDER]).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const post = getPost((await params).slug);
  return post ? { title: post.title, description: post.summary || undefined } : { robots: { index: false } };
}

export default async function LogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) {
    if (slug === PLACEHOLDER) redirect("/log");
    notFound();
  }
  const html = await renderMarkdown(post.body);
  return (
    <main className="page">
      <article>
        <header className="page-hero">
          <div className="meta">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span className="mod">{post.module}</span>
          </div>
          <h1 className="post-title">{post.title}</h1>
          {post.summary && <p className="page-lead">{post.summary}</p>}
        </header>
        <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />
      </article>
      <section className="sec closing-block">
        <div className="cta">
          <Link className="pill accent" href="/#waitlist">
            {cover.cta}
          </Link>
          <Link className="link" href="/log">
            ← {ui.logBack}
          </Link>
        </div>
      </section>
    </main>
  );
}
