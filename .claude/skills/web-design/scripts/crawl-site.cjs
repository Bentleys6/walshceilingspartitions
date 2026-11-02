#!/usr/bin/env node
/**
 * Crawl a live website so it can be rebuilt: every page's text, meta tags, structured data,
 * images, links, forms and scripts, full-page screenshots (desktop 1440px + phone 390px),
 * and page weight / timings. Works on JavaScript-built sites (Landingsite, Lovable, Wix, Framer).
 *
 * Usage: node crawl-site.cjs <https://www.example.co.uk> <output-dir> [/extra-path ...]
 * Pages come from /sitemap.xml, plus same-site links found on the homepage, plus any extra paths.
 * Needs Playwright (pre-installed in Claude Code cloud sessions).
 */
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const [base, out, ...extra] = process.argv.slice(2);
if (!base || !out) {
  console.error("Usage: node crawl-site.cjs <base-url> <output-dir> [/extra-path ...]");
  process.exit(1);
}
const origin = new URL(base).origin;
fs.mkdirSync(path.join(out, "pages"), { recursive: true });

async function discover(browser) {
  const paths = new Set(["/", ...extra]);
  try {
    const res = await fetch(origin + "/sitemap.xml");
    if (res.ok)
      for (const m of (await res.text()).matchAll(/<loc>([^<]+)<\/loc>/g))
        paths.add(new URL(m[1]).pathname || "/");
  } catch {}
  const page = await browser.newPage();
  await page.goto(origin + "/", { waitUntil: "load", timeout: 60000 });
  const links = await page.evaluate(() =>
    [...document.querySelectorAll("a[href]")].map((a) => a.href),
  );
  for (const l of links) {
    try {
      const u = new URL(l);
      if (u.origin === origin && !/\.(pdf|jpg|png|webp|zip)$/i.test(u.pathname))
        paths.add(u.pathname.replace(/\/$/, "") || "/");
    } catch {}
  }
  await page.close();
  return [...paths].sort();
}

(async () => {
  const browser = await chromium.launch();
  const paths = await discover(browser);
  console.log(`Pages: ${paths.join(", ")}`);
  const allImages = new Set();
  const summary = [];
  for (const p of paths) {
    const name = p === "/" ? "home" : p.slice(1).replace(/\//g, "_");
    for (const [label, viewport] of [
      ["desktop", { width: 1440, height: 900 }],
      ["mobile", { width: 390, height: 844 }],
    ]) {
      const ctx = await browser.newContext({ viewport });
      const page = await ctx.newPage();
      let bytes = 0,
        requests = 0;
      page.on("response", async (r) => {
        requests++;
        try {
          bytes += (await r.body()).length;
        } catch {}
      });
      try {
        await page.goto(origin + p, { waitUntil: "load", timeout: 60000 });
      } catch (e) {
        console.log(`${p}: ${e.message}`);
        await ctx.close();
        continue;
      }
      await page.waitForTimeout(1500);
      // Scroll through so lazy images load before the screenshot.
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 600) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 120));
        }
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(800);
      await page.screenshot({
        path: path.join(out, "pages", `${name}-${label}.png`),
        fullPage: true,
      });
      if (label === "desktop") {
        const data = await page.evaluate(() => ({
          title: document.title,
          meta: [...document.querySelectorAll("meta")]
            .map(
              (m) =>
                `${m.getAttribute("name") || m.getAttribute("property") || ""}=${m.getAttribute("content") || ""}`,
            )
            .filter((s) => !s.startsWith("=")),
          jsonld: [...document.querySelectorAll('script[type="application/ld+json"]')].map(
            (s) => s.textContent,
          ),
          text: document.body.innerText,
          images: [...document.querySelectorAll("img")].map((i) => ({
            src: i.currentSrc || i.src,
            alt: i.alt,
            w: i.naturalWidth,
            h: i.naturalHeight,
          })),
          backgrounds: [...document.querySelectorAll("*")]
            .map((e) => getComputedStyle(e).backgroundImage)
            .filter((b) => b && b.includes("url(")),
          links: [...document.querySelectorAll("a")].map(
            (a) => `${a.innerText.trim().replace(/\s+/g, " ")} -> ${a.getAttribute("href")}`,
          ),
          forms: [...document.querySelectorAll("form")].map((f) => ({
            action: f.action,
            fields: [...f.querySelectorAll("input,select,textarea")].map(
              (i) => `${i.tagName}:${i.type}:${i.name}:${i.placeholder || ""}:${i.required}`,
            ),
          })),
          scripts: [...document.querySelectorAll("script[src]")].map((s) => s.src),
          stylesheets: [...document.querySelectorAll("link[rel=stylesheet]")].map((l) => l.href),
          embeds: [...document.querySelectorAll("iframe, video")].map((v) => v.src || v.currentSrc),
          timing: (() => {
            const n = performance.getEntriesByType("navigation")[0];
            return {
              ttfb: Math.round(n.responseStart),
              load: Math.round(n.loadEventEnd),
            };
          })(),
        }));
        data.images.forEach((i) => allImages.add(i.src));
        data.backgrounds.forEach((b) => {
          const m = b.match(/url\("?([^")]+)"?\)/);
          if (m) allImages.add(m[1]);
        });
        fs.writeFileSync(
          path.join(out, "pages", `${name}.json`),
          JSON.stringify({ path: p, requests, kb: Math.round(bytes / 1024), ...data }, null, 2),
        );
        fs.writeFileSync(path.join(out, "pages", `${name}.html`), await page.content());
        summary.push(
          `${p.padEnd(32)} ${String(requests).padStart(3)} requests  ${String(Math.round(bytes / 1024)).padStart(6)} KB  load ${data.timing.load}ms`,
        );
      }
      await ctx.close();
    }
  }
  fs.writeFileSync(path.join(out, "images.txt"), [...allImages].join("\n") + "\n");
  fs.writeFileSync(path.join(out, "summary.txt"), summary.join("\n") + "\n");
  console.log(summary.join("\n"));
  console.log(
    `\nSaved to ${out}: pages/*.json (content), pages/*.png (screenshots), images.txt, summary.txt`,
  );
  await browser.close();
})();
