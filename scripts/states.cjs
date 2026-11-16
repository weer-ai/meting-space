/**
 * Checks the non-default states against the built site (./out):
 *   - prefers-reduced-motion: the map must hold still, and stages change by cross-fade
 *   - WebGL unavailable: the page must show the static fallback, never an empty canvas
 *   - --make-fallback: renders public/map-fallback.jpg from the real scene
 *   node scripts/states.cjs --out DIR [--make-fallback]
 */
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

const args = Object.fromEntries(
  process.argv.slice(2).reduce((a, v, i, arr) => (v.startsWith("--") ? [...a, [v.slice(2), arr[i + 1] && !arr[i + 1].startsWith("--") ? arr[i + 1] : true]] : a), []),
);
const OUT = args.out || path.join(process.cwd(), "screenshots");
const ROOT = path.join(__dirname, "..", "out");
fs.mkdirSync(OUT, { recursive: true });
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".woff2": "font/woff2", ".jpg": "image/jpeg", ".svg": "image/svg+xml" };
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
const results = [];
const check = (name, ok, extra = "") => { results.push(ok); console.log(ok ? "PASS" : "FAIL", name, extra); };

(async () => {
  await new Promise((r) => server.listen(0, r));
  const base = `http://127.0.0.1:${server.address().port}`;

  if (args["make-fallback"]) {
    const b = await chromium.launch({ args: GL });
    const p = await (await b.newContext({ viewport: { width: 1000, height: 1000 }, deviceScaleFactor: 1 })).newPage();
    await p.goto(base + "/?explore=1", { waitUntil: "networkidle" });
    await p.addStyleTag({ content: ".xui,.bar,.lab,.hint,.site-footer,#labels{display:none!important}" });
    await p.waitForTimeout(4000);
    await p.screenshot({ path: path.join(__dirname, "..", "public", "map-fallback.jpg"), type: "jpeg", quality: 80 });
    console.log("wrote public/map-fallback.jpg", fs.statSync(path.join(__dirname, "..", "public", "map-fallback.jpg")).size, "bytes");
    await b.close();
  }

  // ---- reduced motion ----
  {
    const b = await chromium.launch({ args: GL });
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, reducedMotion: "reduce" });
    const p = await ctx.newPage();
    await p.goto(base + "/", { waitUntil: "networkidle" });
    await p.waitForTimeout(2500);
    const a = await p.screenshot();
    await p.waitForTimeout(2500);
    const c = await p.screenshot();
    check("reduced motion: map is perfectly still (no spin, no float)", a.equals(c));
    // jump to the "idea" section; stages must change without travelling
    const y = await p.evaluate(() => { const s = document.querySelectorAll("section.s")[2]; return s.getBoundingClientRect().top + scrollY + 0.2 * s.offsetHeight - innerHeight * 0.55; });
    await p.evaluate((y) => scrollTo(0, y), y);
    await p.waitForTimeout(2500);
    const stage = await p.evaluate(() => document.documentElement.dataset.mapStage);
    check("reduced motion: stage snaps to a whole number", Number.isInteger(parseFloat(stage)), `(stage=${stage})`);
    await p.screenshot({ path: path.join(OUT, "reduced-motion-idea.png") });
    await b.close();
  }

  // ---- WebGL unavailable ----
  {
    const b = await chromium.launch({ args: ["--disable-gpu", "--disable-3d-apis", "--disable-webgl"] });
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
    const p = await ctx.newPage();
    const errors = [];
    p.on("pageerror", (e) => errors.push(e.message));
    await p.goto(base + "/", { waitUntil: "networkidle" });
    await p.waitForTimeout(1500);
    const hasFallback = await p.evaluate(() => !!document.querySelector(".map-fallback"));
    const hasCanvas = await p.evaluate(() => !!document.getElementById("gl"));
    const heading = await p.evaluate(() => document.querySelector("h1")?.textContent || "");
    check("no WebGL: fallback shown, canvas removed, page text intact", hasFallback && !hasCanvas && heading.includes("Go long on yourself"));
    check("no WebGL: no uncaught errors", errors.length === 0, errors.join("; "));
    await p.screenshot({ path: path.join(OUT, "no-webgl-cover.png") });
    await b.close();
  }

  server.close();
  process.exit(results.every(Boolean) ? 0 : 1);
})();
