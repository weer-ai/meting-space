import { ui } from "@/content/copy/ui";

/** Red [TBD] label. Never carries an explanation: those stay out of the shipped site. */
export default function TbdTag() {
  return <span className="tbd">{ui.tbd}</span>;
}
