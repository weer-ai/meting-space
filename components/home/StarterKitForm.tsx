"use client";

import { useId } from "react";
import { kit, waitlist } from "@/content/copy/home";

/**
 * Email-only form for the free starter kit (second door, same list as the
 * waitlist, tag `kit`). Submission is wired in the forms phase; until then the
 * button does not send.
 */
export default function StarterKitForm() {
  const id = useId();
  return (
    <form className="form kit-form" onSubmit={(e) => e.preventDefault()}>
      <div className="field">
        <label htmlFor={`${id}-email`}>{waitlist.email}</label>
        <input id={`${id}-email`} name="email" type="email" required autoComplete="email" />
      </div>
      <button className="pill accent" type="submit">
        {kit.submit}
      </button>
    </form>
  );
}
