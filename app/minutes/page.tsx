import type { Metadata } from "next";
import Link from "next/link";
import { closing, hero, lines, means, now } from "@/content/copy/minutes";
import { SITE } from "@/content/copy/ui";

export const metadata: Metadata = { title: "The minutes", description: hero.lead };

export default function MinutesPage() {
  return (
    <main className="page">
      <header className="page-hero">
        <h1>{hero.title}</h1>
        <p className="page-lead">{hero.lead}</p>
        {/* Full-screen entry to the 3D map: the home page opens straight in explore mode. */}
        <Link className="map-entry" href="/?explore=1">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/map-fallback.jpg" alt="" loading="lazy" decoding="async" width={1000} height={1000} />
          <span className="pill accent">
            {hero.mapCta} <span aria-hidden="true">↗</span>
          </span>
        </Link>
      </header>

      <section className="sec" aria-labelledby="lines">
        <h2 id="lines">{lines.title}</h2>
        <ol className="lines">
          {lines.rows.map((r, i) => (
            <li key={r.line}>
              <span className="num">{i + 1}</span>
              <h3>{r.line}</h3>
              <p>{r.copy}</p>
              <p className="ev">
                <span className="lab">{lines.evidenceLabel}</span> {r.evidence}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className="sec" aria-labelledby="means">
        <h2 id="means">{means.title}</h2>
        <p className="body-text lead">{means.lead}</p>
        <ul className="plain-list">
          {means.items.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </section>

      <section className="sec" aria-labelledby="now">
        <h2 id="now">{now.title}</h2>
        <ul className="plain-list">
          {now.items.map((it) => (
            <li key={it.lead}>
              <strong>{it.lead}</strong> — {it.text}
            </li>
          ))}
        </ul>
      </section>

      <section className="sec closing-block">
        <div className="cta">
          <Link className="pill accent" href="/#waitlist">
            {closing.cta}
          </Link>
          <a className="link" href={`mailto:${SITE.email}`}>
            {closing.secondary}
          </a>
        </div>
      </section>
    </main>
  );
}
