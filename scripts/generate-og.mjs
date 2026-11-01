// Generates the default social sharing image from a real archive photograph.
import { chromium } from "playwright-core";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const photo = await readFile(
  path.resolve("public/media/photography/dhikrullah-mueenah/couple-portrait.jpg")
);
const dataUrl = `data:image/jpeg;base64,${photo.toString("base64")}`;

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..600;1,9..144,300..600&family=Manrope:wght@300..700&display=swap" rel="stylesheet" />
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: 1200px; height: 630px; overflow: hidden; background: #111110; }
  .card { position: relative; width: 1200px; height: 630px; background: #111110; color: #f3f0e8; font-family: 'Manrope', sans-serif; }
  .photo { position: absolute; inset: 0 0 0 430px; background-image: url('${dataUrl}'); background-size: cover; background-position: 50% 34%; filter: saturate(0.92) contrast(1.02); }
  .scrim { position: absolute; inset: 0; background:
      linear-gradient(90deg, #111110 0%, #111110 34%, rgba(17,17,16,0.86) 48%, rgba(17,17,16,0.17) 74%, rgba(17,17,16,0.28) 100%),
      linear-gradient(0deg, rgba(11,11,10,0.86) 0%, transparent 36%); }
  .vignette { position: absolute; inset: 0; box-shadow: inset 0 0 160px rgba(0,0,0,0.55); }
  .content { position: absolute; inset: 0; padding: 52px 60px 46px; display: flex; flex-direction: column; justify-content: space-between; }
  .top { display: flex; align-items: flex-end; gap: 20px; }
  .brand { font-family: 'Fraunces', serif; font-size: 25px; letter-spacing: 0.22em; font-weight: 480; }
  .brand-sub { font-size: 10px; letter-spacing: 0.46em; text-transform: uppercase; color: #a8a196; padding-bottom: 4px; }
  .label { display: flex; align-items: center; gap: 12px; font-size: 10px; letter-spacing: 0.24em; text-transform: uppercase; color: #a8a196; margin-top: 2px; }
  .label::before { content: ''; width: 30px; height: 1px; background: #a8a196; opacity: 0.5; }
  .bottom { max-width: 660px; }
  h1 { font-family: 'Fraunces', serif; font-size: 76px; line-height: 0.96; letter-spacing: -0.035em; font-weight: 350; }
  h1 em { font-style: italic; }
  h1 .dot { color: #c57b4e; }
  .meta { margin-top: 24px; display: flex; justify-content: space-between; align-items: center; gap: 20px; padding-top: 17px; border-top: 1px solid rgba(243,240,232,0.18); max-width: 590px; }
  .meta p { font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: #a8a196; }
  .meta span { color: #c57b4e; }
</style>
</head>
<body>
  <div class="card">
    <div class="photo"></div>
    <div class="scrim"></div>
    <div class="vignette"></div>
    <div class="content">
      <div class="top">
        <div class="brand">OSMO</div>
        <div class="brand-sub">Creation</div>
      </div>
      <div class="bottom">
        <div class="label">Photography · Film · Documentary</div>
        <h1 style="margin-top:22px">Every frame<br/>holds a <em>story</em><span class="dot">.</span></h1>
        <div class="meta">
          <p>A living archive of people, places &amp; moments</p>
          <p>osmo<span>.</span>com.ng</p>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;

const browser = await chromium.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: true,
});
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.setContent(html, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(700);
await mkdir(path.resolve("public/media/og"), { recursive: true });
const buffer = await page.screenshot({ type: "jpeg", quality: 92 });
await writeFile("public/media/og/osmo-og.jpg", buffer);
await browser.close();
console.log("wrote public/media/og/osmo-og.jpg");
