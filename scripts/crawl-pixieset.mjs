// Crawls the public OSMO Creation Pixieset portfolio and records all
// publicly served image variants. Read-only: no login or PIN bypass.
import { chromium } from "playwright-core";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const galleries = [
  ["dhikrullah-mueenah", "dhikrullahandmueenah"],
  ["fatima", "fatima"],
  ["zee-diaries", "zeediaries"],
  ["afa", "afa"],
  ["aisha-birthday", "aishabirthday"],
  ["jcin-unilorin-photoshoot", "jcinunilorinphotoshoot"],
  ["aminat", "aminat"],
  ["law-and-sport-week", "lawandsportweek"],
  ["epi-2020", "folder/nn7fMjyRXTKf"],
  ["misturoh", "misturoh"],
  ["hikmarh", "hikmarh-1"],
  ["rofiat", "rofiat"],
  ["edts-2026", "edts2026"],
  ["harmony-academy-2026", "harmonyacademy2026"],
  ["global-surveyor-day-2", "globalsuveryordaykwara"],
  ["eid-2026", "eid20026"],
];

const outDir = path.resolve(".tmp/pixieset");
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: true,
  args: ["--disable-blink-features=AutomationControlled"],
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 1100 },
  userAgent:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36",
  locale: "en-US",
});

const summary = [];

for (const [slug, remote] of galleries) {
  const page = await context.newPage();
  const networkImages = new Set();
  page.on("response", (response) => {
    const type = response.headers()["content-type"] || "";
    if (type.startsWith("image/") && response.url().includes("images.pixieset.com")) {
      networkImages.add(response.url());
    }
  });
  try {
    const url = `https://osmocreation03.pixieset.com/${remote}/`;
    console.log(`\n### ${slug} -> ${url}`);
    const nav = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
    console.log("status", nav?.status());
    await page.waitForTimeout(5000);

    const buttonsBefore = await page.evaluate(() =>
      Array.from(document.querySelectorAll("button, a"))
        .filter((el) => /view gallery/i.test(el.textContent || ""))
        .map((el) => ({ tag: el.tagName, text: el.textContent?.trim(), href: el.href }))
    );
    console.log("view buttons", buttonsBefore);
    if (buttonsBefore.length) {
      await page
        .getByText(/view gallery/i)
        .first()
        .click({ timeout: 8000 })
        .catch((error) => console.log("click failed", error.message));
      await page.waitForTimeout(4500);
    }

    // Scroll repeatedly to trigger lazy loading.
    let previousCount = 0;
    for (let i = 0; i < 22; i++) {
      await page.evaluate(() => window.scrollBy(0, Math.max(window.innerHeight * 0.9, 800)));
      await page.waitForTimeout(900);
      const count = await page.evaluate(() => performance.getEntriesByType("resource").length);
      if (i > 8 && count === previousCount) break;
      previousCount = count;
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1200);

    const data = await page.evaluate(() => {
      const urls = new Set();
      for (const entry of performance.getEntriesByType("resource")) {
        if (entry.name.includes("images.pixieset.com")) urls.add(entry.name);
      }
      for (const img of document.querySelectorAll("img")) {
        for (const attr of ["currentSrc", "src"]) if (img[attr]) urls.add(img[attr]);
        const srcset = img.getAttribute("srcset");
        if (srcset) {
          for (const part of srcset.split(",")) {
            const candidate = part.trim().split(" ")[0];
            if (candidate) urls.add(new URL(candidate, location.href).href);
          }
        }
      }
      const folderLinks = Array.from(document.querySelectorAll("a[href*='/folder/'], a[href*='pixieset.com/']"))
        .map((a) => a.href)
        .filter((href) => href.includes("/folder/"));
      return {
        title: document.title,
        headings: Array.from(document.querySelectorAll("h1,h2,h3")).map((el) => el.textContent?.trim()),
        bodyText: (document.body.innerText || "").slice(0, 8000),
        urls: Array.from(urls),
        folderLinks: Array.from(new Set(folderLinks)),
        hasDownload: /download/i.test(document.body.innerText || ""),
        photoCountIndicators: Array.from(document.querySelectorAll("*"))
          .map((el) => (el.children.length === 0 ? el.textContent?.trim() : ""))
          .filter((text) => text && /\bphotos?\b|\bimages?\b/i.test(text))
          .slice(0, 20),
      };
    });

    const all = new Set([...data.urls, ...networkImages]);
    const images = Array.from(all).filter((u) => /\.(jpe?g|png|webp|avif)$/i.test(u.split("?")[0]));
    const uniqueIds = new Map();
    for (const imageUrl of images) {
      const match = imageUrl.match(/\/402716021\/([a-f0-9]+)-(.+?)\.(jpe?g|png|webp|avif)$/i);
      if (!match) continue;
      const [, id, variant] = match;
      const existing = uniqueIds.get(id);
      const rank = { thumb: 1, medium: 2, large: 3, xlarge: 4, cover: 2 }[variant.toLowerCase()] || 0;
      if (!existing || rank > existing.rank) {
        uniqueIds.set(id, { id, variant, rank, url: imageUrl });
      }
    }
    const collected = Array.from(uniqueIds.values()).sort((a, b) => b.rank - a.rank);
    console.log("body:", data.bodyText.replace(/\s+/g, " ").slice(0, 500));
    console.log("unique photos:", collected.length);
    console.log(collected.slice(0, 8).map((item) => `${item.variant} ${item.url}`).join("\n"));
    if (data.folderLinks.length) console.log("folder links:", data.folderLinks);
    await page.screenshot({ path: path.join(outDir, `${slug}.png`) }).catch(() => {});
    await writeFile(
      path.join(outDir, `${slug}.json`),
      JSON.stringify({ slug, source: url, ...data, images, uniquePhotos: collected }, null, 2)
    );
    summary.push({
      slug,
      source: url,
      title: data.headings[0] || data.title,
      bodyText: data.bodyText.replace(/\s+/g, " ").slice(0, 400),
      uniquePhotoCount: collected.length,
      variantMax: collected[0]?.variant || null,
      folderLinks: data.folderLinks,
    });
  } catch (error) {
    console.error("ERROR", slug, error.message);
    summary.push({ slug, error: error.message });
  } finally {
    await page.close();
  }
}

await writeFile(path.join(outDir, "_summary.json"), JSON.stringify(summary, null, 2));
console.log("\nSUMMARY\n", JSON.stringify(summary, null, 2));
await browser.close();
