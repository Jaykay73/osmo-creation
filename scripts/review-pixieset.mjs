// Builds small review sheets + an ordered inventory for every public gallery.
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const dir = path.resolve(".tmp/pixieset");
const outDir = path.resolve(".tmp/review");
await mkdir(outDir, { recursive: true });

const files = (await import("node:fs/promises")).readdir;
const entries = (await files(dir)).filter((f) => f.endsWith(".json") && !f.startsWith("_"));

const inventory = {};
let cursor = 0;
const tasks = [];

for (const entry of entries) {
  const data = JSON.parse(await readFile(path.join(dir, entry), "utf8"));
  const slug = data.slug || entry.replace(/\.json$/i, "");
  const photos = new Map();
  const order = [];
  for (const url of data.images || []) {
    const match = url.match(/images\.pixieset\.com\/(\d+)\/([a-f0-9]+)-([^.]+)\.(jpe?g|png|webp|avif)$/i);
    if (!match) continue;
    const [, galleryId, id, variant, ext] = match;
    if (!photos.has(id)) {
      photos.set(id, { id, galleryId, ext, variants: new Set() });
      order.push(id);
    }
    photos.get(id).variants.add(variant.toLowerCase());
  }
  const cover =
    Array.from(photos.values()).find((photo) => photo.variants.has("cover"))?.id || order[0] || null;
  const ordered = cover
    ? [cover, ...order.filter((id) => id !== cover)]
    : order;

  // Evenly sample up to 36 photographs for review.
  const max = 36;
  const selected = [];
  if (ordered.length <= max) {
    selected.push(...ordered);
  } else {
    selected.push(ordered[0]);
    const step = (ordered.length - 1) / (max - 1);
    for (let i = 1; i < max; i++) selected.push(ordered[Math.round(i * step)]);
    selected[0] = ordered[0];
  }

  const galleryDir = path.join(outDir, slug);
  await mkdir(galleryDir, { recursive: true });
  const records = [];

  for (let i = 0; i < selected.length; i++) {
    const id = selected[i];
    const photo = photos.get(id);
    const thumbUrl = `https://images.pixieset.com/${photo.galleryId}/${id}-thumb.${photo.ext}`;
    const mediumUrl = `https://images.pixieset.com/${photo.galleryId}/${id}-medium.${photo.ext}`;
    const dest = path.join(galleryDir, `${String(i).padStart(2, "0")}_${id}.jpg`);
    records.push({ index: i, id, file: path.relative(process.cwd(), dest), thumbUrl, mediumUrl });
    tasks.push({ url: thumbUrl, dest });
  }

  inventory[slug] = {
    slug,
    source: data.source,
    title: data.headings?.[0] || null,
    bodyText: data.bodyText?.replace(/\s+/g, " ").slice(0, 2000) || "",
    totalPhotos: ordered.length,
    coverId: cover,
    sampled: records,
  };
}

let downloaded = 0;
const queue = [...tasks];
await Promise.all(
  Array.from({ length: 12 }, async () => {
    while (queue.length) {
      const task = queue.shift();
      try {
        const response = await fetch(task.url);
        if (!response.ok) throw new Error(String(response.status));
        await writeFile(task.dest, Buffer.from(await response.arrayBuffer()));
        downloaded++;
        if (downloaded % 50 === 0) console.log(`${downloaded}/${tasks.length}`);
      } catch (error) {
        console.log("thumb fail", path.basename(task.dest), error.message);
      }
    }
  })
);

await writeFile(path.join(outDir, "inventory.json"), JSON.stringify(inventory, null, 2));
console.log(`Downloaded ${downloaded}/${tasks.length} review thumbs.`);
