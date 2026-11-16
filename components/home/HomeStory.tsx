import Link from "next/link";
import { closing, cover, fromLog, happening, idea, mentor, method, problem } from "@/content/copy/home";
import { WORRIES } from "@/data/story";
import { formatDate, type LogPost } from "@/lib/log";
import ExploreButton from "./ExploreButton";
import MentorPillars from "./MentorPillars";
import WaitlistForm from "./WaitlistForm";

/** Renders `text` with the substring `em` set in italics. The words are never altered. */
function Em({ text, em }: { text: string; em: string }) {
  const at = text.indexOf(em);
  if (at < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, at)}
      <em>{em}</em>
      {text.slice(at + em.length)}
    </>
  );
}

/**
 * The seven home sections. Each `section.s` is one stage of the 3D map
 * (see CLAUDE.md "七階段"). All copy comes from content/copy/home.ts.
 */
export default function HomeStory({ posts }: { posts: LogPost[] }) {
  return (
    <main>
      {/* 0 · Cover: the finished net */}
      <section className="s" id="s0" data-stage="0">
        <div className="shade" />
        <div className="wrap">
          <div className="hello">{cover.eyebrow}</div>
          <h1>
            <Em text={cover.headline} em={cover.headlineEm} />
          </h1>
          <p className="lede">{cover.sub}</p>
          <div className="cta">
            <a className="pill accent" href="#waitlist">
              {cover.cta}
            </a>
            <a className="link" href="#s1">
              {cover.secondary}
            </a>
            <ExploreButton className="pill ghost explore-inline" />
          </div>
        </div>
      </section>

      {/* 1 · (01) What is happening? Today's date in the middle, worries lighting up around it */}
      <section className="s" id="s1" data-stage="1">
        <div className="shade" />
        <div className="wrap">
          <div className="eyebrow">
            <b>{happening.num}</b>
          </div>
          <h2>{happening.title}</h2>
          <p className="lede">{happening.lead}</p>
          <div className="result">{happening.result}</div>
          {/* The worries light up on the map. This list is their text equivalent: read aloud by screen readers, shown as tags when there is no 3D. */}
          <ul className="worry-list" aria-label={happening.title}>
            {WORRIES.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* 2 · (02) The real problem: five separate baskets */}
      <section className="s" id="s2" data-stage="2">
        <div className="shade" />
        <div className="wrap">
          <div className="eyebrow">
            <b>{problem.num}</b>
          </div>
          <h2>{problem.title}</h2>
          <p className="lede">{problem.lead}</p>
          <div className="list">
            {problem.items.map((it, i) => (
              <div className="item" key={it.title}>
                <h3>
                  <span className="k">{i + 1}</span>
                  {it.title}
                </h3>
                <p>{it.text}</p>
              </div>
            ))}
          </div>
          <div className="result">{problem.result}</div>
          <p className="bridge">{problem.bridge}</p>
        </div>
      </section>

      {/* 3 · (03) The idea: run your life like a company */}
      <section className="s" id="s3" data-stage="3">
        <div className="shade" />
        <div className="wrap">
          <div className="eyebrow">
            <b>{idea.num}</b>
          </div>
          <h2>
            <Em text={idea.title} em={idea.titleEm} />
          </h2>
          <p className="lede">{idea.lead}</p>
          <table className="tbl">
            <thead>
              <tr>
                <th scope="col">{idea.headers[0]}</th>
                <th scope="col">{idea.headers[1]}</th>
              </tr>
            </thead>
            <tbody>
              {idea.rows.map(([has, needs]) => (
                <tr key={has}>
                  <td>{has}</td>
                  <td>{needs}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="line-under">{idea.line}</p>
        </div>
      </section>

      {/* 4 · (04) The method: six tools, one per week */}
      <section className="s" id="s4" data-stage="4">
        <div className="shade" />
        <div className="wrap">
          <div className="eyebrow">
            <b>{method.num}</b>
          </div>
          <h2>{method.title}</h2>
          <p className="lede">{method.lead}</p>
          <div className="cards">
            {method.cards.map((c, i) => (
              <div className="item" key={c.tool}>
                <span className="k">({String(i + 1).padStart(2, "0")})</span>
                <span className="mod">{c.module}</span>
                <h3>{c.tool}</h3>
                <p>{c.text}</p>
              </div>
            ))}
          </div>
          <div className="cta">
            <Link className="link" href="/cohort">
              {method.cta}
            </Link>
          </div>
        </div>
      </section>

      {/* 5 · (05) Meet your mentor: evidence by pillar */}
      <section className="s" id="s5" data-stage="5">
        <div className="shade" />
        <div className="wrap">
          <div className="eyebrow">
            <b>{mentor.num}</b>
          </div>
          <h2>{mentor.title}</h2>
          <p className="lede">{mentor.lead}</p>
          <MentorPillars />
          <p className="line-under">
            <strong>{mentor.nowLabel}</strong> {mentor.now}
          </p>
          <div className="cta">
            <Link className="link" href="/minutes">
              {mentor.cta}
            </Link>
          </div>
        </div>
      </section>

      {/* 6 · Closing: the net pulled tight, with (06) From the log folded in when there are posts */}
      <section className="s closing" id="s6" data-stage="6">
        <div className="shade" />
        <div className="wrap">
          <h2>{closing.title}</h2>
          <p className="lede">{closing.body}</p>
          {posts.length > 0 && (
            <div className="log">
              <div className="eyebrow" style={{ marginTop: 20 }}>
                <b>{fromLog.num}</b>
              </div>
              <h3 style={{ font: "400 22px/1.1 var(--serif)" }}>{fromLog.title}</h3>
              <p className="lede">{fromLog.lead}</p>
              <div className="list">
                {posts.map((p) => (
                  <div className="item" key={p.slug}>
                    <h3>
                      <span className="meta">{formatDate(p.date)}</span>
                      <Link href={`/log/${p.slug}`}>{p.title}</Link>
                    </h3>
                    <p>{p.summary}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="form-wrap" id="waitlist">
            <WaitlistForm />
          </div>
        </div>
      </section>
    </main>
  );
}
