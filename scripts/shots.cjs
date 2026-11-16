/**
 * Screenshots of the built site (./out) at phone (390px) and desktop (1440px).
 *   npm run build && node scripts/shots.cjs --out /path/to/dir [--dpr 2] [--only mobile|desktop] [--pos 0.15,0.42]
 * Headless Chromium needs swiftshader flags to get WebGL.
 */
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

const args = Object.fromEntries(
  process.argv.slice(2).reduce((a, v, i, arr) => (v.startsWith("--") ? [...a, [v.slice(2), arr[i + 1]]] : a), []),
);
const OUT = args.out || path.join(process.cwd(), "screenshots");
const DPR = Number(args.dpr || 2);
const POS = (args.pos || "0.15,0.42").split(",").map((v) => (v === "top" ? "top" : Number(v)));
const ROOT = path.join(__dirname, "..", "out");
fs.mkdirSync(OUT, { recursive: true });

const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".woff2": "font/woff2", ".jpg": "image/jpeg", ".png": "image/png", ".svg": "image/svg+xml", ".json": "application/json", ".txt": "text/plain" };
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
  if (p.endsWith("/")) p += "index.html";
  let f = path.join(ROOT, p);
  if (!fs.existsSync(f) && fs.existsSync(f + ".html")) f += ".html";
  if (!fs.existsSync(f)) { res.writeHead(404); return res.end("not found"); }
  res.writeHead(200, { "content-type": MIME[path.extname(f)] || "application/octet-stream" });
  fs.createReadStream(f).pipe(res);
});

const VIEWPORTS = {
  mobile: { width: 390, height: 844, isMobile: true, hasTouch: true },
  desktop: { width: 1440, height: 900 },
};
const NAMES = ["0-cover", "1-why-now", "2-idea", "3-agenda", "4-why-me", "5-closing"];

(async () => {
  await new Promise((r) => server.listen(0, r));
  const base = `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch({
    args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"],
  });
  for (const [vname, vp] of Object.entries(VIEWPORTS)) {
    if (args.only && args.only !== vname) continue;
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: DPR, isMobile: vp.isMobile, hasTouch: vp.hasTouch });
    const page = await ctx.newPage();
    const problems = [];
    page.on("response", (r) => r.status() >= 400 && problems.push(`HTTP ${r.status()} ${r.url()}`));
    page.on("pageerror", (e) => problems.push("pageerror: " + e.message));
    page.on("console", (m) => ["error", "warning"].includes(m.type()) && problems.push(`console.${m.type()}: ${m.text()}`));
    await page.goto(base + "/", { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(800);

    const secs = await page.evaluate(() =>
      Array.from(document.querySelectorAll("section.s")).map((s) => ({ top: s.getBoundingClientRect().top + scrollY, h: s.offsetHeight })),
    );
    const settle = async (i, file) => {
      await page.waitForFunction((t) => Math.abs(parseFloat(document.documentElement.dataset.mapStage || "-9") - t) < (t === 0 ? 0.12 : 0.04), i, { timeout: 20000 }).catch(() => problems.push(`stage ${i} did not settle`));
      await page.waitForTimeout(1500);
      await page.screenshot({ path: file });
      console.log("wrote", file);
    };
    for (let i = 0; i < secs.length - 1; i++) {
      for (const f of POS) {
        // "top" = section top aligned with the viewport top, what an anchor jump shows
        const y = f === "top" ? Math.round(secs[i].top) : Math.max(0, Math.round(secs[i].top + f * secs[i].h - vp.height * 0.5));
        await page.evaluate((y) => window.scrollTo(0, y), y);
        await settle(i, path.join(OUT, `${vname}-${NAMES[i]}-${f === "top" ? "top" : Math.round(f * 100)}.png`));
      }
    }
    // closing: start of the section, the form, the very bottom (footer)
    const last = secs.length - 1;
    const formTop = await page.evaluate(() => document.getElementById("waitlist").getBoundingClientRect().top + scrollY);
    const closing = [
      ["start", Math.round(secs[last].top - vp.height * 0.05)],
      ["form", Math.round(formTop - vp.height * 0.12)],
      ["bottom", 1e6],
    ];
    for (const [label, y] of closing) {
      await page.evaluate((y) => window.scrollTo(0, y), y);
      await settle(last, path.join(OUT, `${vname}-5-closing-${label}.png`));
    }

    // explore mode, via the deep link used by /minutes
    await page.goto(base + "/?explore=1", { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(3500);
    await page.screenshot({ path: path.join(OUT, `${vname}-explore-all.png`) });
    await page.getByRole("button", { name: "Prototype", exact: true }).click();
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(OUT, `${vname}-explore-prototype.png`) });
    await page.locator("ul.sr-only button", { hasText: "Boeing 777X" }).focus();
    await page.waitForTimeout(1200);
    await page.screenshot({ path: path.join(OUT, `${vname}-explore-card.png`) });

    console.log(vname, problems.length ? "PROBLEMS:\n  " + problems.join("\n  ") : "no console errors");
    await ctx.close();
  }
  await browser.close();
  server.close();
})();
