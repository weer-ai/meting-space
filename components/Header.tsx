import { cover } from "@/content/copy/home";
import { ui } from "@/content/copy/ui";

export default function Header() {
  return (
    <div className="bar">
      <a className="brand" href="/">
        {ui.brand}
      </a>
      <a className="pill story-only" href="/#waitlist">
        {cover.cta}
      </a>
    </div>
  );
}
