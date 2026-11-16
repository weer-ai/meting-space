/**
 * Full-page screenshots + sanity checks of the inner pages in ./out, at 390px and 1440px.
 *   node scripts/pages.cjs --out DIR [--dpr 2] [--paths /cohort,/minutes,/log]
 * Checks: no horizontal overflow, no console errors, no failed requests (other than links to pages not built yet).
 */
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

const args = Object.fromEntries(
  process.argv.slice(2).reduce((a, v, i, arr) => (v.startsWith("--") ? [...a, [v.slice(2), arr[i + 1]]] : a), []),
);
const OUT = args.out || path.join(process.cwd(), "screenshots");
const DPR = Number(args.dpr || 1);
const PATHS = (args.paths || "/cohort,/minutes,/log").split(",");
const ROOT = path.join(__dirname, "..", "out");
fs.mkdirSync(OUT, { recursive: true });
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".woff2": "font/woff2", ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".txt": "text/plain" };
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
  if (p.endsWith("/")) p += "index.html";
  let f = path.join(ROOT, p);
  const isFile = (x) => fs.existsSync(x) && fs.statSync(x).isFile();
  if (!isFile(f) && isFile(f + ".html")) f += ".html";
  if (!isFile(f)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { "content-type": MIME[path.extname(f)] || "application/octet-stream" });
  fs.createReadStream(f).pipe(res);
});
const GL = ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"];
const slug = (p) => p.replace(/^\//, "").replace(/\//g, "_") || "home";
let bad = 0;

(async () => {
  await new Promise((r) => server.listen(0, r));
  const base = `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch({ args: GL });
  for (const [vname, vp] of Object.entries({ mobile: { width: 390, height: 844, isMobile: true, hasTouch: true }, desktop: { width: 1440, height: 900 } })) {
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: DPR, isMobile: vp.isMobile, hasTouch: vp.hasTouch });
    for (const pth of PATHS) {
      const page = await ctx.newPage();
      const problems = [];
      page.on("pageerror", (e) => problems.push("pageerror: " + e.message));
      page.on("console", (m) => m.type() === "error" && !/404/.test(m.text()) && problems.push("console.error: " + m.text()));
      page.on("response", (r) => r.status() >= 400 && problems.push(`HTTP ${r.status()} ${new URL(r.url()).pathname}`));
      await page.goto(base + pth, { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(500);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      if (overflow > 0) problems.push(`horizontal overflow by ${overflow}px`);
      const canvas = await page.evaluate(() => !!document.getElementById("gl"));
      if (canvas) problems.push("a 3D canvas was loaded on an inner page");
      const file = path.join(OUT, `${vname}-${slug(pth)}.png`);
      await page.screenshot({ path: file, fullPage: true });
      // /cohort: also show a week card opened
      if (pth === "/cohort") {
        await page.locator("details.week").first().locator("summary").click();
        await page.locator("details.week").nth(2).locator("summary").click();
        await page.waitForTimeout(300);
        await page.screenshot({ path: path.join(OUT, `${vname}-cohort-open.png`), fullPage: true });
      }
      const h = await page.evaluate(() => document.documentElement.scrollHeight);
      console.log(vname, pth, `height ${h}px`, problems.length ? "PROBLEMS: " + problems.join(" | ") : "ok");
      if (problems.length) bad++;
      await page.close();
    }
    await ctx.close();
  }
  await browser.close();
  server.close();
  process.exit(bad ? 1 : 0);
})();
