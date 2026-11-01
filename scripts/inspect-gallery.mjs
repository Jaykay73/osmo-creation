// Read-only gallery inspection: opens each public gallery, scrolls it, and
// records the displayed image URLs, captions, and available public controls.
// It does not enter passwords, bypass PINs, or force disabled downloads.
import { chromium } from "playwright-core";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const targets = process.argv.slice(2);
const galleries = targets.length
  ? targets.map((t) => ({ slug: t, url: `https://osmocreation03.pixieset.com/${t}/` }))
  : [
      { slug: "dhikrullahandmueenah", url: "https://osmocreation03.pixieset.com/dhikrullahandmueenah/" },
      { slug: "fatima", url: "https://osmocreation03.pixieset.com/fatima/" },
    ];

const outDir = path.resolve(".tmp/galleries");
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: true,
  args: ["--disable-blink-features=AutomationControlled"],
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  userAgent:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36",
  locale: "en-US",
});

for (const target of galleries) {
  const page = await context.newPage();
  const imageResponses = new Map();
  page.on("response", async (response) => {
    const contentType = response.headers()["content-type"] || "";
    if (contentType.startsWith("image/") && !response.url().includes("logo")) {
      imageResponses.set(response.url(), response.status());
    }
  });
  try {
    console.log(`\n### ${target.slug}`);
    const nav = await page.goto(target.url, { waitUntil: "domcontentloaded", timeout: 60000 });
    console.log("status", nav?.status(), "url", page.url());
    await page.waitForTimeout(4500);

    // Scroll progressively to trigger lazy loading.
    for (let i = 0; i < 14; i++) {
      await page.evaluate(() => window.scrollBy(0, Math.max(window.innerHeight * 0.85, 700)));
      await page.waitForTimeout(900);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1200);

    const data = await page.evaluate(() => {
      const urls = new Set();
      const entries = performance.getEntriesByType("resource");
      for (const entry of entries) {
        if (/\.(jpe?g|png|webp|avif)(\?|$)/i.test(entry.name)) urls.add(entry.name);
      }
      for (const img of document.querySelectorAll("img")) {
        if (img.currentSrc) urls.add(img.currentSrc);
        if (img.src) urls.add(img.src);
        const srcset = img.getAttribute("srcset");
        if (srcset) {
          for (const part of srcset.split(",")) {
            const candidate = part.trim().split(" ")[0];
            if (candidate) urls.add(new URL(candidate, location.href).href);
          }
        }
      }
      for (const el of document.querySelectorAll("*")) {
        const bg = getComputedStyle(el).backgroundImage;
        if (bg && bg.includes("url(")) {
          const matches = bg.matchAll(/url\(["']?(.*?)["']?\)/g);
          for (const match of matches) {
            if (match[1]) urls.add(new URL(match[1], location.href).href);
          }
        }
      }
      const buttons = Array.from(document.querySelectorAll("button, a[role='button']")).map((el) => ({
        text: (el.textContent || "").trim().slice(0, 80),
        aria: el.getAttribute("aria-label"),
        title: el.getAttribute("title"),
        href: el instanceof HTMLAnchorElement ? el.href : null,
      }));
      return {
        title: document.title,
        bodyText: (document.body.innerText || "").slice(0, 5000),
        urls: Array.from(urls),
        buttons: buttons.slice(0, 80),
        headings: Array.from(document.querySelectorAll("h1,h2,h3")).map((h) => h.textContent?.trim()),
      };
    });
    await page.screenshot({ path: path.join(outDir, `${target.slug}.png`) }).catch(() => {});
    const filtered = data.urls.filter(
      (url) => !/logo|favicon|avatar|sprite|icon/i.test(url) && /\.(jpe?g|png|webp|avif)/i.test(url.split("?")[0])
    );
    console.log("heading:", data.headings);
    console.log("images:", filtered.length);
    console.log(filtered.slice(0, 30).join("\n"));
    console.log("download-ish controls:", data.buttons.filter((b) => /download|save|share|pin/i.test(`${b.text} ${b.aria} ${b.title}`)));
    console.log("body:", data.bodyText.slice(0, 1200).replace(/\n{2,}/g, " | "));
    await writeFile(
      path.join(outDir, `${target.slug}.json`),
      JSON.stringify({ ...data, images: filtered, network: Array.from(imageResponses.entries()) }, null, 2)
    );
  } catch (error) {
    console.error("ERROR", target.slug, error.message);
  } finally {
    await page.close();
  }
}

await browser.close();
