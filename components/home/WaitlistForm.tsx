"use client";

import { useId } from "react";
import Rich from "@/components/Rich";
import { waitlist } from "@/content/copy/home";

function Radios({ name, label, options }: { name: string; label: string; options: string[] }) {
  return (
    <fieldset className="field">
      <legend>
        <Rich text={label} />
      </legend>
      <div className="opts">
        {options.map((o, i) => (
          <label className="opt" key={o}>
            <input type="radio" name={name} value={o} required={i === 0} />
            <span>{o}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/**
 * Fields per CONTENT.md. Submission (endpoint or mailto fallback, lang and
 * utm_source) is wired in the last phase; until then the button does not send.
 */
export default function WaitlistForm() {
  const id = useId();
  return (
    <form className="form" onSubmit={(e) => e.preventDefault()} noValidate={false}>
      <div className="field">
        <label htmlFor={`${id}-email`}>{waitlist.email}</label>
        <input id={`${id}-email`} name="email" type="email" required autoComplete="email" />
      </div>
      <div className="field">
        <label htmlFor={`${id}-name`}>{waitlist.firstName}</label>
        <input id={`${id}-name`} name="firstName" type="text" required autoComplete="given-name" />
      </div>
      <Radios name="identity" label={waitlist.identity.label} options={waitlist.identity.options} />
      <Radios name="stuck" label={waitlist.stuck.label} options={waitlist.stuck.options} />
      <Radios name="price" label={waitlist.price.label} options={waitlist.price.options} />
      <div className="field">
        <label htmlFor={`${id}-more`}>{waitlist.anything}</label>
        <textarea id={`${id}-more`} name="anything" />
      </div>
      <label className="check">
        <input type="checkbox" name="sendLog" defaultChecked />
        {waitlist.sendLog}
      </label>
      <button className="pill accent" type="submit">
        {waitlist.submit}
      </button>
    </form>
  );
}
