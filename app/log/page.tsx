import type { Metadata } from "next";
import Link from "next/link";
import LogList from "@/components/page/LogList";
import { fromLog } from "@/content/copy/home";
import { cover } from "@/content/copy/home";
import { logPage } from "@/content/copy/log";
import { formatDate, getAllPosts } from "@/lib/log";

export const metadata: Metadata = { title: fromLog.title, description: logPage.intro };

export default function LogPage() {
  const posts = getAllPosts();
  return (
    <main className="page">
      <header className="page-hero">
        <h1>{fromLog.title}</h1>
        <p className="page-lead">{logPage.intro}</p>
      </header>
      {posts.length > 0 ? (
        <section className="sec">
          <LogList posts={posts.map((p) => ({ slug: p.slug, title: p.title, dateLabel: formatDate(p.date), module: p.module, summary: p.summary }))} />
        </section>
      ) : (
        // No posts yet: nothing is invented. The page only offers the waitlist (the log subscription is the same list).
        <section className="sec closing-block">
          <div className="cta">
            <Link className="pill accent" href="/#waitlist">
              {cover.cta}
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}
