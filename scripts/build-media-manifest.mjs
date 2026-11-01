// Regenerates content/media-manifest.json from the files in public/media.
// Run after adding, replacing or removing photographs or posters.
import { readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const records = {};

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(full);
    } else if (/\.(jpe?g|png|webp|avif)$/i.test(entry.name)) {
      const meta = await sharp(full).metadata();
      if (!meta.width || !meta.height) continue;
      const publicPath = `/${path
        .relative(path.resolve("public"), full)
        .replaceAll("\\", "/")}`;
      records[publicPath] = {
        width: meta.width,
        height: meta.height,
        orientation:
          meta.width >= meta.height * 1.15
            ? "landscape"
            : meta.height >= meta.width * 1.15
              ? "portrait"
              : "square",
      };
    }
  }
}

for (const folder of ["photography", "posters", "textures"]) {
  try {
    await walk(path.resolve("public/media", folder));
  } catch {
    console.warn(`Skipping missing folder public/media/${folder}`);
  }
}

await writeFile("content/media-manifest.json", JSON.stringify(records, null, 2));
console.log(`Media manifest rebuilt: ${Object.keys(records).length} files.`);
