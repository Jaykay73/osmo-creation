import { chromium } from "playwright-core";
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";

const base = process.env.QA_BASE_URL || "http://127.0.0.1:3001";
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
  args: ["--enable-webgl", "--ignore-gpu-blocklist", "--enable-unsafe-swiftshader"],
});
const results = [];
const errors = [];
await mkdir(".tmp/narrative-qa", { recursive: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 960 } });
// Offline font delivery must not stop navigation or conceal content.
await context.route(/fonts\.(googleapis|gstatic)\.com/, (route) => route.abort());
const page = await context.newPage();
page.on("pageerror", (error) => errors.push(error.message));
const go = async (route) => {
  const response = await page.goto(`${base}${route}`, { waitUntil: "domcontentloaded", timeout: 60000 });
  assert.equal(response.status(), 200, route);
  await page.waitForLoadState("networkidle");
};
try {
  await go("/");
  await page.locator(".chapter-nav").waitFor();
  await page.waitForTimeout(1800);
  await page.screenshot({ path: ".tmp/narrative-qa/desktop-opening.png" });
  assert.equal(await page.locator("h1").count(), 1);
  await page.getByRole("link", { name: "Let the story unfold" }).click();
  await page.waitForTimeout(1200);
  for (const index of [0, 1, 2]) {
    await page.locator(`#story-${index}`).scrollIntoViewIfNeeded();
    await page.waitForTimeout(1200);
    assert.equal(await page.locator(".story-tabs a[aria-current]").getAttribute("href"), `#story-${index}`);
  }
  await page.screenshot({ path: ".tmp/narrative-qa/desktop-story.png" });
  await page.locator('.chapter-nav a[href="#motion"]').click();
  await page.waitForTimeout(1400);
  assert.equal(await page.locator('.chapter-nav a[aria-current]').getAttribute('href'), '#motion');
  await page.locator(".film-feature").first().click();
  await page.getByRole("dialog").waitFor();
  await page.keyboard.press("Shift+Tab");
  assert.equal(await page.evaluate(() => Boolean(document.activeElement?.closest('[role="dialog"]'))), true);
  await page.keyboard.press("Escape");
  assert.equal(await page.getByRole("dialog").count(), 0);
  results.push("Desktop story chapters, chapter navigation and film modal keyboard controls passed.");

  const gallery = page.locator("#in-the-frame");
  await gallery.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1400);
  assert.equal(await gallery.locator(".home-gallery-stills button").count(), 9);
  if (await gallery.evaluate((node) => node.classList.contains("is-spatial"))) {
    await page.evaluate(() => { const node = document.querySelector("#in-the-frame"); window.scrollTo({ top: node.getBoundingClientRect().top + scrollY + (node.offsetHeight - innerHeight) * .65, behavior: "instant" }); });
    await page.waitForTimeout(1400);
    assert.ok(Number((await gallery.locator(".home-gallery-current > span").innerText()).slice(0, 2)) >= 5);
    await page.screenshot({ path: ".tmp/narrative-qa/home-gallery.png" });
    await gallery.locator(".home-gallery-current > button").click();
  } else {
    await gallery.locator(".home-gallery-stills button").first().click();
  }
  await page.getByRole("dialog").waitFor();
  await page.keyboard.press("Escape");
  await page.locator(".booking-option").first().click();
  await page.waitForFunction(() => document.querySelector("#field-projectType")?.value === "Wedding or engagement");
  results.push("Inline gallery, photograph viewing and wedding booking preselection passed.");

  await go("/work?category=portraits");
  assert.match(await page.locator('.filter-button[aria-pressed="true"]').innerText(), /portraits/i);
  await page.locator(".filter-button").first().click();
  await page.waitForFunction(() => document.querySelectorAll(".archive-card").length === 16);
  assert.equal(await page.locator(".archive-card").count(), 16);
  await page.getByRole("button", { name: "Spatial", exact: true }).click();
  await page.waitForTimeout(1600);
  results.push("Archive category URL, all 16 collections and spatial view passed.");

  await go("/contact");
  await page.getByRole("button", { name: "Send enquiry", exact: true }).click();
  assert.equal(await page.locator('[aria-invalid="true"]').count(), 4);
  await page.locator("#field-name").fill("Portfolio QA");
  await page.locator("#field-email").fill("qa@example.com");
  await page.locator("#field-projectType").selectOption({ label: "Film or documentary" });
  await page.locator("#field-message").fill("A documentary project about a family gathering in Lagos.");
  await page.route("**/api/enquiry", (route) => route.fulfill({ status: 503, contentType: "application/json", body: JSON.stringify({ code: "email_not_configured", message: "Your message has not been sent." }) }));
  await page.getByRole("button", { name: "Send enquiry", exact: true }).click();
  await page.locator('.form-notice[role="alert"]').waitFor();
  assert.match(await page.getByRole("link", { name: "Email the studio directly" }).getAttribute("href"), /A%20documentary/);
  results.push("Enquiry validation and populated email fallback passed (delivery mocked; no message sent).");

  await go("/work/dhikrullah-mueenah");
  await page.locator(".essay-zoom").first().click();
  await page.getByRole("dialog").waitFor();
  const before = await page.locator(".photo-lightbox-index").innerText();
  await page.keyboard.press("ArrowRight");
  assert.notEqual(await page.locator(".photo-lightbox-index").innerText(), before);
  await page.keyboard.press("Escape");
  assert.equal(await page.locator(".essay-zoom").first().evaluate((node) => node === document.activeElement), true);
  results.push("Project full-size photographs, arrow-key navigation and focus restoration passed.");
  for (const route of ["/films", "/films/ceremony-study", "/about", "/exhibition"]) await go(route);
  results.push("Project, film, about and exhibition routes returned 200.");

  await page.setViewportSize({ width: 390, height: 844 });
  await go("/");
  await page.waitForTimeout(1800);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  await page.screenshot({ path: ".tmp/narrative-qa/mobile-opening.png" });
  assert.equal(await page.locator(".header-mobile-book").isVisible(), true);
  await page.locator(".menu-toggle").click();
  await page.keyboard.press("Escape");
  assert.equal(await page.locator(".menu-toggle").getAttribute("aria-expanded"), "false");
  await page.locator("#story-1").scrollIntoViewIfNeeded();
  await page.waitForTimeout(1200);
  await page.screenshot({ path: ".tmp/narrative-qa/mobile-story.png" });
  results.push("Mobile layout, story sequence and menu Escape control passed.");

  await page.emulateMedia({ reducedMotion: "reduce" });
  await go("/");
  await page.waitForTimeout(900);
  assert.equal(await page.locator(".hero-canvas canvas").count(), 0);
  assert.equal(await page.locator(".hero-fallback.is-hidden").count(), 0);
  assert.equal(await page.locator(".home-gallery.is-flat").count(), 1);
  await page.locator("#in-the-frame").scrollIntoViewIfNeeded();
  await page.locator(".home-gallery-stills button").first().click();
  await page.getByRole("dialog").waitFor();
  await page.keyboard.press("Escape");
  results.push("Reduced motion keeps the static hero visible and disables the 3D scene.");
  assert.deepEqual(errors, []);
  console.log(results.join("\n"));
} finally {
  await writeFile(".tmp/narrative-qa/results.json", JSON.stringify({ results, errors }, null, 2));
  await browser.close();
}
