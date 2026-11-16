import type { Metadata } from "next";
import Link from "next/link";
import Rich from "@/components/Rich";
import { agenda, closing, faq, hero, how, who } from "@/content/copy/cohort";

export const metadata: Metadata = { title: "The Board", description: hero.sub };

export default function CohortPage() {
  return (
    <main className="page">
      <header className="page-hero">
        <h1>{hero.title.replace(" · ", "\u00a0· ")}</h1>  {/* display only: keeps the dot on the first line when the title wraps */}
        <p className="page-lead">{hero.sub}</p>
        <ul className="facts">
          {hero.facts.map((f) => (
            <li key={f}>
              <Rich text={f} />
            </li>
          ))}
        </ul>
        <div className="cta">
          <Link className="pill accent" href="/#waitlist">
            {hero.cta}
          </Link>
        </div>
      </header>

      <section className="sec" aria-labelledby="who">
        <h2 id="who">{who.title}</h2>
        <div className="who-grid">
          {who.items.map((it) => (
            <div className="who-card" key={it.lead}>
              <h3>{it.lead}</h3>
              <p>{it.text}</p>
            </div>
          ))}
        </div>
        <p className="body-text">{who.either}</p>
        <p className="body-text">
          <strong>{who.notFor.lead}</strong> {who.notFor.text}
        </p>
      </section>

      <section className="sec" aria-labelledby="agenda">
        <h2 id="agenda">{agenda.title}</h2>
        <div className="weeks">
          {agenda.weeks.map((w, i) => (
            <details className="week" key={w.title}>
              <summary>
                <span className="k">({String(i + 1).padStart(2, "0")})</span>
                <h3>{w.title}</h3>
                <dl className="week-facts">
                  <div>
                    <dt>{agenda.labels.youWill}</dt>
                    <dd>{w.youWill}</dd>
                  </div>
                  <div>
                    <dt>{agenda.labels.leaveWith}</dt>
                    <dd>{w.leaveWith}</dd>
                  </div>
                </dl>
                <span className="week-toggle" aria-hidden="true" />
              </summary>
              <div className="week-more">
                <div className="week-more-label">{agenda.labels.minutes}</div>
                <p>{w.minutes}</p>
              </div>
            </details>
          ))}
        </div>
      </section>

      <section className="sec" aria-labelledby="how">
        <h2 id="how">{how.title}</h2>
        <ol className="how">
          {how.items.map((it) => (
            <li key={it.lead}>
              <strong>{it.lead}</strong> <Rich text={it.text} />
            </li>
          ))}
        </ol>
      </section>

      <section className="sec" aria-labelledby="faq">
        <h2 id="faq">{faq.title}</h2>
        <dl className="faq">
          {faq.items.map((it) => (
            <div key={it.q}>
              <dt>{it.q}</dt>
              <dd>
                <Rich text={it.a} />
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="sec closing-block">
        <h2>
          <Rich text={closing.title} />
        </h2>
        <div className="cta">
          <Link className="pill accent" href="/#waitlist">
            {closing.cta}
          </Link>
        </div>
      </section>
    </main>
  );
}
