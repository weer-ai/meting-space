/**
 * Interaction checks on the built site (./out): explore mode open/close, chips,
 * tap-to-select on the canvas, keyboard path, scroll restore, anchors.
 */
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");
const ROOT = path.join(__dirname, "..", "out");
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
  const b = await chromium.launch({ args: GL });

  for (const [label, vp] of [["desktop", { width: 1440, height: 900 }], ["mobile", { width: 390, height: 844, isMobile: true, hasTouch: true }]]) {
    const ctx = await b.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: 1, isMobile: vp.isMobile, hasTouch: vp.hasTouch });
    const p = await ctx.newPage();
    const errors = [];
    p.on("pageerror", (e) => errors.push(e.message));
    await p.goto(base + "/", { waitUntil: "networkidle" });
    await p.waitForTimeout(1500);

    // anchors
    await p.getByRole("link", { name: "What is happening ↓" }).click();
    await p.waitForTimeout(2500);
    const stageAfterAnchor = parseFloat(await p.evaluate(() => document.documentElement.dataset.mapStage));
    check(`${label}: "What is happening ↓" lands on stage 1`, Math.abs(stageAfterAnchor - 1) < 0.06, `(stage=${stageAfterAnchor})`);
    // "What is happening?": today's date in the middle, worries taking turns
    await p.waitForTimeout(1500);
    const seen = new Set();
    let maxAtOnce = 0;
    for (let k = 0; k < 24; k++) {
      const lit = await p.evaluate(() => [...document.querySelectorAll("#labels .lab.worry")].filter((e) => parseFloat(e.style.opacity || "0") > 0.5).map((e) => e.textContent));
      lit.forEach((t) => seen.add(t));
      maxAtOnce = Math.max(maxAtOnce, lit.length);
      await p.waitForTimeout(350);
    }
    const today = await p.evaluate(() => new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }));
    const meText = await p.evaluate(() => { const e = document.querySelector("#labels .lab.me"); return e ? e.textContent : null; });
    check(`${label}: the middle node shows today's date`, meText === today, `(label=${meText}, today=${today})`);
    check(`${label}: worries take turns lighting up (saw ${seen.size} different, at most ${maxAtOnce} at once)`, seen.size >= 4 && maxAtOnce <= 4, `[${[...seen].join(", ")}]`);
    await p.evaluate(() => scrollTo(0, 0));
    await p.waitForTimeout(500);

    // open explore from the visible button, remember scroll
    await p.evaluate(() => scrollTo(0, 1500));
    await p.waitForTimeout(600);
    const y0 = await p.evaluate(() => scrollY);
    const opener = label === "desktop" ? p.locator("button.hint") : null;
    if (label === "mobile") await p.evaluate(() => scrollTo(0, 0));
    const y1 = label === "mobile" ? 0 : y0;
    await (opener ?? p.locator("button.explore-inline")).click();
    await p.waitForTimeout(3500);
    check(`${label}: explore opens (body.explore, story hidden)`, await p.evaluate(() => document.body.classList.contains("explore") && getComputedStyle(document.querySelector("main")).visibility === "hidden"));

    // tap a real node: find the Prototype module label and click its node
    const pos = await p.evaluate(() => {
      const l = [...document.querySelectorAll("#labels .lab")].find((e) => e.textContent === "Prototype");
      const m = l.style.transform.match(/translate\(([-\d.]+)px,\s*([-\d.]+)px\)/);
      return { x: parseFloat(m[1]) - 10, y: parseFloat(m[2]) + 8, op: parseFloat(l.style.opacity) };
    });
    await p.mouse.click(pos.x, pos.y);
    await p.waitForTimeout(600);
    let title = await p.locator(".card .t").textContent().catch(() => null);
    check(`${label}: tapping a node opens its card`, title === "Prototype", `(card=${title})`);
    check(`${label}: module card says "Module"`, (await p.locator(".card .m").textContent().catch(() => "")) === "Module");

    // tap empty space closes it
    await p.mouse.click(vp.width * 0.5, vp.height * 0.93 - 140 > 0 ? 120 : 120);
    await p.waitForTimeout(500);
    // chip filter
    await p.getByRole("button", { name: "Fund", exact: true }).click();
    await p.waitForTimeout(1200);
    check(`${label}: chip filter marks itself pressed`, (await p.getByRole("button", { name: "Fund", exact: true }).getAttribute("aria-pressed")) === "true");

    // keyboard: focusing a list item opens the card
    await p.locator("ul.sr-only button", { hasText: /^Weer,/ }).focus();
    await p.waitForTimeout(400);
    title = await p.locator(".card .t").textContent().catch(() => null);
    check(`${label}: keyboard focus on a node opens its card`, title === "Weer", `(card=${title})`);
    const tbd = await p.locator(".card .tbd").count();
    check(`${label}: no [TBD] on Weer, no internal notes on any card`, tbd === 0 && !(await p.locator(".card").innerText()).match(/[一-鿿]/));

    // Escape leaves explore and restores scroll
    await p.keyboard.press("Escape");
    await p.waitForTimeout(600);
    const back = await p.evaluate(() => ({ ex: document.body.classList.contains("explore"), y: scrollY }));
    check(`${label}: Esc leaves explore and restores scroll`, !back.ex && Math.abs(back.y - y1) < 2, `(was ${y1}, now ${back.y})`);

    // deep link
    await p.goto(base + "/?explore=1", { waitUntil: "networkidle" });
    await p.waitForTimeout(1500);
    check(`${label}: /?explore=1 opens explore directly`, await p.evaluate(() => document.body.classList.contains("explore")));
    await p.locator("button", { hasText: "Back to story" }).click();
    await p.waitForTimeout(400);
    check(`${label}: leaving drops ?explore from the URL`, !(await p.evaluate(() => location.search.includes("explore"))));

    // join the waitlist anchor
    await p.getByRole("link", { name: "Join the waitlist" }).first().click();
    await p.waitForTimeout(2500);
    const formVisible = await p.evaluate(() => { const r = document.querySelector("form.form").getBoundingClientRect(); return r.top < innerHeight && r.bottom > 0; });
    check(`${label}: "Join the waitlist" scrolls to the form`, formVisible);
    check(`${label}: no uncaught errors`, errors.length === 0, errors.join("; "));
    await ctx.close();
  }
  // ---- navigation between pages ----
  {
    const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
    const p = await ctx.newPage();
    const errors = [];
    p.on("pageerror", (e) => errors.push(e.message));
    await p.goto(base + "/", { waitUntil: "networkidle" });
    await p.waitForTimeout(1200);
    await p.getByRole("link", { name: "See the full agenda →" }).click();
    await p.waitForURL("**/cohort");
    check("nav: home -> /cohort via 'See the full agenda →'", (await p.locator("h1").textContent()).replace(/\u00a0/g, " ") === "The Board · Cohort 01");
    check("nav: /cohort carries no 3D canvas", (await p.locator("#gl").count()) === 0);
    check("nav: week cards expand", await (async () => { const d = p.locator("details.week").first(); await d.locator("summary").click(); return d.evaluate((e) => e.open); })());
    await p.getByRole("link", { name: "The minutes" }).click();
    await p.waitForURL("**/minutes");
    check("nav: footer link goes to /minutes", (await p.locator("h1").textContent()) === "The minutes.");
    await p.getByRole("link", { name: /Explore the map/ }).first().click();
    await p.waitForURL("**/?explore=1");
    await p.waitForTimeout(2500);
    check("nav: /minutes 'Explore the map' opens explore mode on the home page", await p.evaluate(() => document.body.classList.contains("explore")));
    await p.goto(base + "/log/_", { waitUntil: "networkidle" });
    await p.waitForTimeout(1500);
    check("nav: placeholder /log/_ bounces to /log", await p.evaluate(() => location.pathname === "/log"), `(at ${await p.evaluate(() => location.pathname)})`);
    await p.goto(base + "/cohort", { waitUntil: "networkidle" });
    await p.getByRole("link", { name: "Join the waitlist" }).first().click();
    await p.waitForURL("**/#waitlist");
    await p.waitForTimeout(2500);
    check("nav: /cohort 'Join the waitlist' lands on the home form", await p.evaluate(() => { const r = document.querySelector("form.form").getBoundingClientRect(); return r.top < innerHeight && r.bottom > 0; }));
    check("nav: no uncaught errors while navigating", errors.length === 0, errors.join("; "));
    await ctx.close();
  }
  await b.close();
  server.close();
  process.exit(results.every(Boolean) ? 0 : 1);
})();
