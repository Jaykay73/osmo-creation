// Read-only inspection of the public Pixieset portfolio in a real browser.
// Does not attempt to bypass logins, PINs, or download restrictions.
import { chromium } from "playwright-core";
import { writeFile } from "node:fs/promises";

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

const page = await context.newPage();
page.on("response", (response) => {
  const url = response.url();
  if (/api|collection|gallery/i.test(url)) {
    console.log("RESP", response.status(), url.slice(0, 240));
  }
});

try {
  const response = await page.goto("https://osmocreation03.pixieset.com/", {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });
  console.log("NAV STATUS", response?.status());
  await page.waitForTimeout(6000);
  console.log("TITLE", await page.title());
  console.log("URL", page.url());
  const html = await page.content();
  await writeFile(".tmp/pixieset-page.html", html);
  await page.screenshot({ path: ".tmp/pixieset-page.png", fullPage: false }).catch(() => {});
  const data = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll("a")).map((a) => ({
      href: a.href,
      text: (a.textContent || "").trim().slice(0, 120),
    }));
    const images = Array.from(document.querySelectorAll("img")).map((img) => ({
      src: img.currentSrc || img.src,
      alt: img.alt,
      w: img.naturalWidth,
      h: img.naturalHeight,
    }));
    return { links, images, bodyText: (document.body.innerText || "").slice(0, 8000) };
  });
  await writeFile(".tmp/pixieset-data.json", JSON.stringify(data, null, 2));
  console.log(JSON.stringify(data, null, 2).slice(0, 9000));
} catch (error) {
  console.error("ERROR", error.message);
  await page.screenshot({ path: ".tmp/pixieset-error.png", fullPage: false }).catch(() => {});
} finally {
  await browser.close();
}
