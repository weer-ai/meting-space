import TbdTag from "@/components/TbdTag";
import { mentor } from "@/content/copy/home";
import { EXPERIENCES } from "@/data/nodes";
import { PILLARS } from "@/data/story";

/**
 * "Meet your mentor": for each pillar, one line of the story and then the
 * evidence. The evidence is the node data itself (verbatim from DESIGN-BRIEF.md),
 * so a new experience added to data/nodes.ts shows up here and on the map.
 * Anything not confirmed yet carries a red [TBD] label.
 */
export default function MentorPillars() {
  return (
    <div className="pillars">
      {PILLARS.map((p) => (
        <section className="pillar" key={p.id} aria-labelledby={`${p.id}-h`}>
          <h3 id={`${p.id}-h`}>{p.name}</h3>
          <p className="pillar-line">{mentor.pillars[p.pillar]}</p>
          <ul className="proof">
            {EXPERIENCES.filter((e) => e.pillar === p.pillar).map((e) => (
              <li key={e.id}>
                <strong>{e.name}</strong>
                {e.year && <span className="yr">{e.year}</span>}
                <p>
                  {e.text} {e.tbd && <TbdTag />}
                </p>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
