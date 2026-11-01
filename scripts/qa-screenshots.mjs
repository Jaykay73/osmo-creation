import { chromium } from "playwright-core";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const base = "http://localhost:3000";
const outDir = path.resolve(".tmp/qa");
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: true,
  args: ["--ignore-gpu-blocklist", "--enable-webgl", "--disable-blink-features=AutomationControlled"],
});

const logs = [];

async function makePage(viewport, label) {
  const context = await browser.newContext({
    viewport,
    deviceScaleFactor: 1,
    reducedMotion: "no-preference",
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36",
  });
  const page = await context.newPage();
  page.on("console", (message) => {
    if (message.type() === "error") logs.push(`[${label}] console: ${message.text()}`);
  });
  page.on("pageerror", (error) => logs.push(`[${label}] pageerror: ${error.message}`));
  page.on("requestfailed", (request) => {
    logs.push(`[${label}] requestfailed: ${request.url()} ${request.failure()?.errorText}`);
  });
  page.on("response", (response) => {
    if (response.status() >= 400 && !response.url().includes("favicon")) {
      logs.push(`[${label}] http ${response.status()}: ${response.url()}`);
    }
  });
  return { context, page };
}

async function settle(page, ms = 2500) {
  await page.waitForLoadState("networkidle").catch(() => {});
  await page.evaluate(() => document.fonts?.ready).catch(() => {});
  await page.waitForTimeout(ms);
}

async function shoot(page, name, fullPage = false) {
  await page.screenshot({ path: path.join(outDir, `${name}.jpg`), fullPage, type: "jpeg", quality: 78 });
  console.log("shot", name);
}

// ---------------- Desktop ----------------
{
  const { context, page } = await makePage({ width: 1440, height: 1000 }, "desktop");
  await page.goto(base, { waitUntil: "domcontentloaded" });
  await settle(page, 3500);
  const scene = await page.evaluate(() => {
    const canvas = document.querySelector(".hero-canvas canvas");
    const test = document.createElement("canvas");
    const gl = test.getContext("webgl2") || test.getContext("webgl");
    return {
      canvas: Boolean(canvas),
      canvasSize: canvas ? [canvas.width, canvas.height] : null,
      webgl: Boolean(gl),
      fallbackHidden: document.querySelector(".hero-fallback")?.classList.contains("is-hidden"),
    };
  });
  console.log("HERO SCENE", scene);
  await shoot(page, "desktop-home-hero");
  await shoot(page, "desktop-home-full", true);

  for (const [selector, name] of [
    [".intro", "desktop-home-intro"],
    [".features", "desktop-home-features"],
    [".films-home", "desktop-home-films"],
    [".human", "desktop-home-human"],
    [".closing", "desktop-home-closing"],
  ]) {
    const element = page.locator(selector).first();
    if (await element.count()) {
      await element.scrollIntoViewIfNeeded();
      await page.waitForTimeout(900);
      await page.screenshot({ path: path.join(outDir, `${name}.jpg`), type: "jpeg", quality: 78 });
      console.log("shot", name);
    }
  }

  for (const [route, name, full] of [
    ["/work", "desktop-work", false],
    ["/work/fatima", "desktop-project", false],
    ["/films", "desktop-films", false],
    ["/about", "desktop-about", false],
    ["/contact", "desktop-contact", false],
    ["/exhibition", "desktop-exhibition", false],
  ]) {
    await page.goto(`${base}${route}`, { waitUntil: "domcontentloaded" });
    await settle(page, route === "/exhibition" ? 3500 : 1600);
    await shoot(page, name, full);
  }

  await context.close();
}

// ---------------- Mobile ----------------
{
  const { context, page } = await makePage({ width: 390, height: 844 }, "mobile");
  await page.goto(base, { waitUntil: "domcontentloaded" });
  await settle(page, 3000);
  await shoot(page, "mobile-home-hero");
  await shoot(page, "mobile-home-full", true);

  await page.locator(".menu-toggle").click();
  await page.waitForTimeout(500);
  await shoot(page, "mobile-menu");
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);

  for (const [route, name] of [
    ["/work", "mobile-work"],
    ["/work/misturoh", "mobile-project"],
    ["/films", "mobile-films"],
    ["/about", "mobile-about"],
    ["/contact", "mobile-contact"],
    ["/exhibition", "mobile-exhibition"],
  ]) {
    await page.goto(`${base}${route}`, { waitUntil: "domcontentloaded" });
    await settle(page, route === "/exhibition" ? 3200 : 1300);
    await shoot(page, name, false);
  }
  await context.close();
}

await writeFile(".tmp/qa/console-log.txt", logs.join("\n"));
console.log(`\n${logs.length} console/network issues`);
console.log(logs.join("\n").slice(0, 6000));
await browser.close();
