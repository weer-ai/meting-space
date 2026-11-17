import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { BG_CSS, BG_HEX } from "@/components/nodemap/theme";

const read = (f: string) => readFileSync(path.join(__dirname, "..", f), "utf8");

describe("the background is the same everywhere", () => {
  it("3D clear colour (hex number) and CSS string agree", () => {
    expect(BG_CSS).toBe("#" + BG_HEX.toString(16).padStart(6, "0"));
  });
  it("styles/global.css --bg and --bg-rgb match theme.ts", () => {
    const css = read("styles/global.css");
    expect(css).toContain(`--bg: ${BG_CSS};`);
    const n = parseInt(BG_CSS.slice(1), 16);
    expect(css).toContain(`--bg-rgb: ${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255};`);
  });
  it("the site icon uses it too", () => {
    expect(read("app/icon.svg").toLowerCase()).toContain(BG_CSS);
  });
  it("no leftover warm-black or apricot colour in the styles", () => {
    const css = read("styles/global.css") + read("styles/pages.css");
    for (const old of ["#0c0809", "#f4a58a", "244, 165, 138", "12, 8, 9", "#ffd0be", "#ffd9cb"]) {
      expect(css.toLowerCase()).not.toContain(old);
    }
  });
});
