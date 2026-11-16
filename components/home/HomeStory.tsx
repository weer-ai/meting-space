import Link from "next/link";
import { agenda, closing, cover, fromLog, idea, whyMe, whyNow } from "@/content/copy/home";
import { formatDate, type LogPost } from "@/lib/log";
import ExploreButton from "./ExploreButton";
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
 * The six home sections. Each `section.s` is one stage of the 3D map
 * (DESIGN-BRIEF.md §2). All copy comes from content/copy/home.ts.
 */
export default function HomeStory({ posts }: { posts: LogPost[] }) {
  return (
    <main>
      {/* 0 · Cover */}
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

      {/* 1 · (01) Why now */}
      <section className="s" id="s1" data-stage="1">
        <div className="shade" />
        <div className="wrap">
          <div className="eyebrow">
            <b>{whyNow.num}</b>
          </div>
          <h2>
            <Em text={whyNow.title} em={whyNow.titleEm} />
          </h2>
          <p className="lede">{whyNow.lead}</p>
          <div className="list">
            {whyNow.items.map((it, i) => (
              <div className="item" key={it.title}>
                <h3>
                  <span className="k">{i + 1}</span>
                  {it.title}
                </h3>
                <p>{it.text}</p>
              </div>
            ))}
          </div>
          <div className="result">{whyNow.result}</div>
          <p className="bridge">{whyNow.bridge}</p>
        </div>
      </section>

      {/* 2 · (02) The idea */}
      <section className="s" id="s2" data-stage="2">
        <div className="shade" />
        <div className="wrap">
          <div className="eyebrow">
            <b>{idea.num}</b>
          </div>
          <h2>{idea.title}</h2>
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

      {/* 3 · (03) The agenda */}
      <section className="s" id="s3" data-stage="3">
        <div className="shade" />
        <div className="wrap">
          <div className="eyebrow">
            <b>{agenda.num}</b>
          </div>
          <h2>{agenda.title}</h2>
          <p className="lede">{agenda.lead}</p>
          <div className="cards">
            {agenda.cards.map((c, i) => (
              <div className="item" key={c.verb}>
                <span className="k">({String(i + 1).padStart(2, "0")})</span>
                <h3>{c.verb}</h3>
                <p>{c.text}</p>
              </div>
            ))}
          </div>
          <div className="cta">
            <Link className="link" href="/cohort">
              {agenda.cta}
            </Link>
          </div>
        </div>
      </section>

      {/* 4 · (04) Why me */}
      <section className="s" id="s4" data-stage="4">
        <div className="shade" />
        <div className="wrap">
          <div className="eyebrow">
            <b>{whyMe.num}</b>
          </div>
          <h2>{whyMe.title}</h2>
          <p className="lede">{whyMe.lead}</p>
          <div className="list">
            {whyMe.items.map((it) => (
              <div className="item" key={it.title}>
                <h3>{it.title}</h3>
                <p>{it.text}</p>
              </div>
            ))}
          </div>
          <p className="line-under">
            <strong>{whyMe.nowLabel}</strong> {whyMe.now}
          </p>
          <div className="cta">
            <Link className="link" href="/minutes">
              {whyMe.cta}
            </Link>
          </div>
        </div>
      </section>

      {/* 5 · Closing, with (05) From the log folded in when there are posts */}
      <section className="s closing" id="s5" data-stage="5">
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
