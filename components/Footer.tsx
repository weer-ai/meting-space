import { footer } from "@/content/copy/home";
import { SITE, ui } from "@/content/copy/ui";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="inner">
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
