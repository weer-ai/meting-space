import Link from "next/link";
import Rich from "@/components/Rich";
import TbdTag from "@/components/TbdTag";
import { closing, cover, forYou, fromLog, happening, hengchun, idea, kit, mentor, method, problem } from "@/content/copy/home";
import { HENGCHUN_BOOKING_URL, SHOW_HENGCHUN } from "@/content/config";
import { WORRIES } from "@/data/story";
import { formatDate, type LogPost } from "@/lib/log";
import ExploreButton from "./ExploreButton";
import MentorPillars from "./MentorPillars";
import StarterKitForm from "./StarterKitForm";
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
 * The home sections. Each `section.s` belongs to one stage of the 3D map through
 * `data-stage` (see CLAUDE.md "七階段"); sections next to each other may share a
 * stage. All copy comes from content/copy/home.ts.
 */
export default function HomeStory({ posts }: { posts: LogPost[] }) {
  return (
    <main>
      {/* 0 · Cover: the finished net */}
      <section className="s" id="cover" data-stage="0">
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
            <a className="link" href="#kit">
              {cover.secondary}
            </a>
            <ExploreButton className="pill ghost explore-inline" />
          </div>
        </div>
      </section>

      {/* 1 · (01) What is happening? Today's date in the middle, worries lighting up around it */}
      <section className="s" id="happening" data-stage="1">
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
      <section className="s" id="problem" data-stage="2">
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
      <section className="s" id="idea" data-stage="3">
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

      {/* Is this for you? Same stage as the idea: the net has formed */}
      <section className="s" id="foryou" data-stage="3">
        <div className="shade" />
        <div className="wrap">
          <h2>{forYou.title}</h2>
          <div className="list">
            {forYou.items.map((it) => (
              <div className="item" key={it.lead}>
                <h3>{it.lead}</h3>
                <p>{it.text}</p>
              </div>
            ))}
          </div>
          <div className="cta">
            <Link className="link" href="/cohort">
              {forYou.link}
            </Link>
          </div>
        </div>
      </section>

      {/* 4 · (04) The method: six tools, one per week */}
      <section className="s" id="method" data-stage="4">
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
      <section className="s" id="mentor" data-stage="5">
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

      {/* (06) From the log: only when there is something to read */}
      {posts.length > 0 && (
        <section className="s" id="log" data-stage="5">
          <div className="shade" />
          <div className="wrap">
            <div className="eyebrow">
              <b>{fromLog.num}</b>
            </div>
            <h2>{fromLog.title}</h2>
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
        </section>
      )}

      {/* Starter kit: the lighter second door. From here the net is pulled tight. */}
      <section className="s" id="kit" data-stage="6">
        <div className="shade" />
        <div className="wrap">
          <h2>{kit.title}</h2>
          <p className="lede">{kit.intro}</p>
          <ul className="kit-list">
            {kit.items.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          <StarterKitForm />
          <p className="note">{kit.note}</p>
        </div>
      </section>

      {/* Meet me in Hengchun: time-limited, switched off by hand (content/config.ts) */}
      {SHOW_HENGCHUN && (
        <section className="s" id="hengchun" data-stage="6">
          <div className="shade" />
          <div className="wrap">
            <div className="eyebrow">{hengchun.eyebrow}</div>
            <h2>{hengchun.title}</h2>
            <p className="lede">{hengchun.body}</p>
            <ul className="facts">
              {hengchun.facts.map((f) => (
                <li key={f}>
                  <Rich text={f} />
                </li>
              ))}
            </ul>
            <div className="cta">
              {HENGCHUN_BOOKING_URL ? (
                <a className="pill accent" href={HENGCHUN_BOOKING_URL} target="_blank" rel="noopener noreferrer">
                  {hengchun.cta}
                </a>
              ) : (
                <>
                  {/* no booking link yet: the button waits, with a red [TBD] */}
                  <button type="button" className="pill accent" disabled>
                    {hengchun.cta}
                  </button>
                  <TbdTag />
                </>
              )}
            </div>
            <p className="note">{hengchun.note}</p>
          </div>
        </section>
      )}

      {/* Closing: the waitlist */}
      <section className="s closing" id="closing" data-stage="6">
        <div className="shade" />
        <div className="wrap">
          <h2>{closing.title}</h2>
          <p className="lede">{closing.body}</p>
          <p className="note">{closing.note}</p>
          <div className="form-wrap" id="waitlist">
            <WaitlistForm />
          </div>
        </div>
      </section>
    </main>
  );
}
