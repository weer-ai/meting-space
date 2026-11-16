import Link from "next/link";
import { footer } from "@/content/copy/home";
import { SITE, ui } from "@/content/copy/ui";
import { getAllPosts } from "@/lib/log";

export default function Footer() {
  // /log is only linked once there is something to read (same rule as (05) on the home page).
  const hasLog = getAllPosts().length > 0;
  return (
    <footer className="site-footer">
      <div className="inner">
        <nav className="foot-nav" aria-label={ui.navLabel}>
          <Link href="/cohort">{ui.navBoard}</Link>
          <Link href="/minutes">{ui.navMinutes}</Link>
          {hasLog && <Link href="/log">{ui.navLog}</Link>}
        </nav>
        <a href={`mailto:${SITE.email}`}>{footer.teams}</a>
        <div className="links">
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
          <a href={SITE.linkedin} target="_blank" rel="noopener noreferrer">
            {ui.linkedin}
          </a>
        </div>
        <p>{footer.disclaimer}</p>
      </div>
    </footer>
  );
}
