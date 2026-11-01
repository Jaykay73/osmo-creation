// Downloads the curated selection of publicly viewable Pixieset images and
// generates web-ready derivatives. This respects Pixieset's public viewing
// renditions: only variants the public site serves are requested (no originals,
// no PIN bypass). Higher-res cover renders are used only where publicly served.
import { mkdir, readFile, writeFile, readdir, rm } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const inventory = JSON.parse(await readFile(".tmp/review/inventory.json", "utf8"));

// Selection: source gallery, sample index, destination filename, alt text.
// EPI uses three public sub-galleries held in one folder.
const selections = {
  "dhikrullah-mueenah": {
    sourceKey: "dhikrullah-mueenah",
    items: [
      [0, "couple-portrait", "A couple in peach and deep blue traditional attire at their engagement.", true],
      [1, "arrivals", "Guests arriving outside the engagement venue."],
      [2, "procession", "Women in bright red and cream outfits walking toward the venue."],
      [10, "canopy", "Rows of white chairs under a canopy decorated with pink tulle."],
      [14, "conversation", "Two women in pink hijabs speaking in the shade."],
      [18, "elder", "An older guest in a patterned headtie and pink outfit."],
      [21, "serving", "A man serving food at a long, red-covered table."],
      [24, "speaker", "A young man speaking into a microphone at the ceremony."],
      [26, "bride", "The bride's beaded pink veil and dress in close detail."],
      [29, "seated-couple", "The couple seated together during the ceremony."],
      [32, "family", "The couple standing with family members after the ceremony."],
      [34, "guests", "A procession of guests in colorful outfits crossing the venue."],
      [35, "group-portrait", "A large group portrait under the canopy."],
    ],
  },
  fatima: {
    sourceKey: "fatima",
    items: [
      [0, "desk", "A woman in a sage-green outfit seated at a desk in a studio.", true],
      [1, "standing", "A full-length portrait in a sage-green dress and dark hijab."],
      [2, "veil", "A portrait holding a dark veil across one shoulder."],
      [3, "smile", "A woman smiling in a sage-green outfit against a dark studio backdrop."],
      [5, "reading", "A woman reading an open book at a studio desk."],
      [7, "lamp", "A seated portrait beside a plant and a table lamp."],
      [9, "lean", "A woman resting her chin on her hand at the desk."],
      [10, "laptop", "A portrait working at a laptop in the studio."],
    ],
  },
  "zee-diaries": {
    sourceKey: "zee-diaries",
    items: [
      [0, "microphone", "A woman in white and burgundy seated beside a microphone.", true],
      [1, "conversation", "A woman laughing during a recorded conversation."],
      [2, "seated", "A portrait in a white outfit and burgundy headwrap."],
      [3, "standing", "A standing portrait against pale curtains."],
      [4, "detail", "A portrait beside a microphone and a small vase of flowers."],
      [5, "listening", "A woman listening while holding a microphone."],
    ],
  },
  afa: {
    sourceKey: "afa",
    items: [
      [0, "group", "Four men in coordinated pale and dark traditional outfits on a lawn.", true],
      [2, "rust", "A man in a rust-colored tunic and patterned cap on the lawn."],
      [3, "pale", "A man in a pale embroidered tunic under trees."],
      [4, "dark", "A man in a dark tunic with geometric embroidery."],
      [5, "duo", "Two men standing together in coordinating outfits."],
      [6, "lineup", "Four men standing in a row on the grass."],
      [7, "walk", "A group walking together across the lawn."],
      [8, "group-close", "A close group portrait of four men in patterned outfits."],
      [9, "group-wide", "A wide portrait of the group on the lawn."],
    ],
  },
  "aisha-birthday": {
    sourceKey: "aisha-birthday",
    items: [
      [0, "portrait", "A young woman in a purple floral dress against green trees.", true],
      [1, "seated", "A portrait of a young woman sitting on a wall outdoors."],
      [2, "smile", "A woman smiling in a purple floral dress."],
      [4, "walking", "A full-length portrait in a purple dress on a path."],
      [6, "braids", "A portrait showing long braided hair with a dark bow."],
      [8, "grass", "A young woman seated on the grass in a purple dress."],
    ],
  },
  "jcin-unilorin-photoshoot": {
    sourceKey: "jcin-unilorin-photoshoot",
    items: [
      [1, "group", "A JCIN Unilorin group portrait in formal suits and blue dresses.", true],
      [3, "group-wide", "A wide group portrait on the steps of a campus building."],
      [0, "portrait-man", "A studio portrait of a young man in a dark suit."],
      [6, "portrait-smile", "A smiling young man in a dark suit with his arms folded."],
      [7, "portrait-hijab", "A portrait of a woman in a black blazer and hijab."],
      [9, "portrait-glasses", "A young man in a suit wearing blue-tinted glasses."],
      [10, "portrait-white-wrap", "A woman in a black blazer and white head wrap."],
      [12, "portrait-navy", "A portrait of a man in a navy double-breasted suit."],
      [13, "portrait-blue", "A woman in a blue blazer and dark hijab."],
      [15, "portrait-scarf", "A woman in a black blazer with a white headscarf."],
    ],
  },
  aminat: {
    sourceKey: "aminat",
    items: [
      [0, "seated", "A studio portrait of a woman in a patterned blouse and white head wrap.", true],
      [1, "smile", "A woman smiling in a patterned blouse against a pale backdrop."],
      [2, "close", "A close portrait in a patterned blouse and white head wrap."],
      [4, "arms-folded", "A portrait with arms folded, wearing a black skirt."],
      [6, "standing", "A full-length studio portrait in a patterned blouse."],
    ],
  },
  "law-and-sport-week": {
    sourceKey: "law-and-sport-week",
    items: [
      [0, "interview", "A man in a blue suit speaking into a microphone at Law and Sport Week.", true],
      [2, "speaker-young", "A young man in a suit speaking to an audience."],
      [3, "guest", "A guest in blue traditional attire at the symposium."],
      [4, "stage", "Two speakers on a purple-lit stage."],
      [9, "audience-portrait", "A smiling woman in a black dress in the audience."],
      [15, "speaker-podium", "A man at a podium addressing the hall."],
      [21, "audience", "Audience members seated in a row at the event."],
      [24, "award", "A man in a suit holding a glass award."],
      [29, "trophy-bw", "A black-and-white photograph of a trophy celebration."],
      [31, "medal", "A young man in a football jersey holding a medal."],
    ],
  },
  "epi-2020": {
    sources: [
      ["epiawarenesswalkday1", [
        [1, "banner", "EPI volunteers holding a banner outside a campus building.", true],
        [0, "group", "A group portrait of EPI volunteers outdoors."],
        [6, "banner-close", "Volunteers standing behind a pink EPI Week banner."],
        [7, "speaker", "A volunteer speaking into a microphone."],
        [8, "sign", "A smiling volunteer holding an EPI Week sign."],
      ]],
      ["uithvisitation", [
        [1, "greeting", "A volunteer greeting another volunteer in a blue hijab."],
        [4, "bus", "Volunteers standing at the open door of a white and blue bus."],
        [6, "volunteers", "Two volunteers smiling outdoors."],
      ]],
      ["publiclectureday2", [
        [0, "lecture-hall", "A large group portrait in a lecture hall."],
        [3, "audience", "Students seated in a lecture hall."],
        [4, "listening", "Two volunteers listening in a lecture hall."],
        [5, "embrace-bw", "A black-and-white frame of two people embracing in a classroom."],
        [6, "performer", "A dancer performing in front of an audience."],
      ]],
    ],
  },
  misturoh: {
    sourceKey: "misturoh",
    items: [
      [0, "hands", "A close view of cupped hands and rings against white and burgundy fabric.", true],
      [2, "courtyard", "A woman in white and burgundy seated in a tiled courtyard."],
      [3, "dua", "A woman in white and burgundy with her hands raised."],
      [4, "profile", "A portrait from behind, a hoop earring visible against patterned tiles."],
      [5, "monochrome", "A black-and-white portrait of a woman seated on patterned tiles."],
      [6, "outdoors", "A woman outdoors with hands raised under trees."],
      [7, "wide-bw", "A wide black-and-white view of the courtyard and seated woman."],
      [8, "ledge", "A woman in a white embroidered outfit sitting on a ledge."],
      [9, "side-profile", "A side-profile portrait in a burgundy headwrap."],
      [10, "handbag", "A seated portrait on a tiled ledge with a burgundy handbag."],
      [11, "full-length", "A full-length portrait in white and burgundy on a tiled ledge."],
    ],
  },
  hikmarh: {
    sourceKey: "hikmarh",
    items: [
      [0, "books-frame", "A woman in a blue headwrap and glasses framed by tall stacks of books.", true],
      [2, "library-exterior", "A portrait outside the University of Ilorin library."],
      [3, "reading", "A woman reading a book between library shelves."],
      [4, "shelf", "A portrait leaning out from a library shelf."],
      [5, "book-towers", "A portrait seen between towers of stacked books."],
      [7, "library-wide", "A full-length portrait outside the library building."],
      [8, "reading-chair", "A woman reading in a chair beside a bookshelf."],
      [9, "call", "A portrait outside the library, a hand raised to her glasses."],
      [10, "between-shelves", "A woman standing between shelves of books."],
      [11, "seated-book", "A woman seated with an open book in a library."],
    ],
  },
  rofiat: {
    sourceKey: "rofiat",
    items: [
      [0, "bench", "A woman in a red top and white hijab seated on a bench.", true],
      [1, "standing", "A woman standing on a brick path among trees."],
      [3, "seated", "A seated portrait on brick steps."],
      [4, "profile", "A side-profile portrait against a brick wall."],
    ],
  },
  "edts-2026": {
    sourceKey: "edts-2026",
    items: [
      [0, "supplies", "Food parcels and supplies arranged on the ground at a community outreach.", true],
      [4, "children", "A group of smiling children with volunteers at an outreach."],
      [5, "embrace", "A man holding a young child at the outreach."],
      [8, "gathering", "Volunteers and community members gathered outdoors."],
      [9, "speaker", "A man speaking into a microphone under a canopy."],
      [11, "table", "Volunteers working behind a table of supplies."],
      [15, "care", "A volunteer attending to a child's arm at the outreach."],
      [17, "hands", "A volunteer holding a woman's hand during a health check."],
      [19, "group", "A group of young people posing together at the outreach."],
      [20, "red", "A woman in a red patterned outfit walking across a field."],
      [21, "dance", "Two people dancing at the outreach."],
      [24, "volunteers", "Two smiling volunteers in blue outreach shirts."],
      [26, "football", "Children playing football on a field at the outreach."],
    ],
  },
  "harmony-academy-2026": {
    sourceKey: "harmony-academy-2026",
    items: [
      [0, "group", "A group portrait of Harmony Academy students in blue shirts.", true],
      [1, "laptops", "Students working on laptops during a session."],
      [2, "portrait", "A smiling woman at a laptop during the academy."],
      [3, "pair", "Two students working together on laptops."],
      [4, "duo", "Two students posing in Harmony Academy shirts."],
      [5, "laptop-duo", "Two young men at a laptop during the academy."],
      [6, "volunteer", "A woman smiling in a blue Harmony Academy shirt."],
      [8, "certificate", "A man holding a framed certificate."],
      [14, "hijab-duo", "Two participants in hijabs posing at the academy."],
      [17, "audience", "Participants seated at an outdoor session."],
    ],
  },
  "global-surveyor-day-2": {
    sourceKey: "global-surveyor-day-2",
    items: [
      [0, "embrace", "A volunteer embracing a man during a community health outreach.", true],
      [2, "conversation", "A man speaking with a volunteer under a canopy."],
      [1, "check", "A volunteer checking a man's blood pressure."],
      [3, "check-second", "A volunteer taking a blood pressure reading at a table."],
      [5, "table", "Young men seated at a table during the outreach."],
      [6, "sashes", "Volunteers tying sashes on guests at the outreach."],
      [7, "audience", "An audience of older men at the outreach."],
      [8, "portrait", "A smiling woman in a pale hijab and patterned outfit."],
    ],
  },
  "eid-2026": {
    sourceKey: "eid-2026",
    items: [
      [0, "men", "Three men in pale traditional outfits laughing together in the sun.", true],
      [2, "teal", "A man in a pale blue tunic and cap standing outside."],
      [4, "white", "A man in a white outfit and sunglasses posing near a mosque."],
      [6, "green", "A smiling woman in a pale green hijab."],
      [7, "red", "A woman in a red headscarf smiling in the sun."],
      [8, "striped", "A woman in a red striped outfit waving."],
      [12, "pink", "A close portrait in a pink hijab."],
      [15, "henna", "Hands decorated with henna resting over a black phone."],
      [18, "laughing", "A woman in a burgundy hijab laughing with a hand over her face."],
      [20, "friends", "Two friends in purple and pink outfits standing together."],
      [22, "purple", "A portrait of a woman in a purple outfit and white headscarf."],
      [23, "black", "A side-profile portrait in a dark patterned dress."],
    ],
  },
};

const photoRoot = path.resolve("public/media/photography");
await mkdir(path.resolve("content"), { recursive: true });
// Remove placeholder assets so the published library contains only the
// curated selection of the owner's public portfolio.
await rm(photoRoot, { recursive: true, force: true });
await rm(path.resolve("public/media/placeholder-credits.json"), { force: true });
await rm(path.resolve("public/media/textures"), { recursive: true, force: true });
await mkdir(path.resolve("public/media/textures"), { recursive: true });

function buildItems(spec) {
  const groups = spec.sources
    ? spec.sources.map(([sourceKey, items]) => ({ sourceKey, items }))
    : [{ sourceKey: spec.sourceKey, items: spec.items }];
  return groups.flatMap((group) => {
    const inv = inventory[group.sourceKey];
    if (!inv) throw new Error(`Missing inventory ${group.sourceKey}`);
    return group.items.map(([index, name, alt, isCover = false]) => {
      const record = inv.sampled.find((photo) => photo.index === index);
      if (!record) throw new Error(`Missing sample ${group.sourceKey}[${index}]`);
      const galleryId = record.thumbUrl.match(/images\.pixieset\.com\/(\d+)\//)[1];
      const ext = record.thumbUrl.match(/\.([a-z0-9]+)$/i)[1];
      const base = `https://images.pixieset.com/${galleryId}/${record.id}`;
      return {
        sourceKey: group.sourceKey,
        sourceGalleryUrl: inv.source,
        sourcePhotoId: record.id,
        sampleIndex: index,
        name,
        alt,
        isCover,
        base,
        ext,
        xlarge: `${base}-xlarge.${ext}`,
        coverLarge: `${base}-cover-large.${ext}`,
      };
    });
  });
}

const manifest = [];
const downloads = [];
for (const [slug, spec] of Object.entries(selections)) {
  await mkdir(path.join(photoRoot, slug), { recursive: true });
  manifest.push({ slug, items: buildItems(spec).map((item) => ({ ...item, slug })) });
  downloads.push(...manifest[manifest.length - 1].items);
}

let downloaded = 0;
const queue = [...downloads];
await Promise.all(
  Array.from({ length: 5 }, async () => {
    while (queue.length) {
      const item = queue.shift();
      const dest = path.join(photoRoot, item.slug, `${item.name}.jpg`);
      let usedVariant = "xlarge";
      try {
        let buffer = null;
        if (item.isCover) {
          for (const variant of [item.coverLarge, item.xlarge]) {
            const response = await fetch(variant);
            if (response.ok) {
              buffer = Buffer.from(await response.arrayBuffer());
              usedVariant = variant === item.coverLarge ? "cover-large" : "xlarge";
              break;
            }
          }
        } else {
          const response = await fetch(item.xlarge);
          if (response.ok) buffer = Buffer.from(await response.arrayBuffer());
        }
        if (!buffer) throw new Error("no publicly served variant");
        let pipeline = sharp(buffer).rotate();
        if (usedVariant === "cover-large") {
          pipeline = pipeline.resize({ width: 2400, height: 2400, fit: "inside", withoutEnlargement: true });
        }
        await pipeline.jpeg({ quality: 88, mozjpeg: true }).toFile(dest);
        const meta = await sharp(dest).metadata();
        item.width = meta.width;
        item.height = meta.height;
        item.destination = path.relative(process.cwd(), dest).replaceAll("\\", "/");
        item.variant = usedVariant;
        item.retrievedAt = new Date().toISOString().slice(0, 10);
        downloaded++;
        console.log(`${downloaded}/${downloads.length} ${item.slug}/${item.name} ${usedVariant} ${item.width}x${item.height}`);
      } catch (error) {
        console.log(`FAIL ${item.slug}/${item.name}: ${error.message}`);
      }
    }
  })
);

// Credits + migration record.
await writeFile(
  "content/source-credits.json",
  JSON.stringify(
    {
      note:
        "Photography migrated from the OSMO Creation public Pixieset portfolio. Only publicly served viewing renditions were retrieved. Full-resolution originals remain in the owner's Pixieset account and should be supplied for final production where higher resolution is needed.",
      source: "https://osmocreation03.pixieset.com/",
      migratedAt: new Date().toISOString().slice(0, 10),
      photos: manifest.flatMap((project) =>
        project.items
          .filter((item) => item.destination)
          .map((item) => ({
            project: project.slug,
            file: item.destination,
            sourceGallery: item.sourceGalleryUrl,
            sourcePhotoId: item.sourcePhotoId,
            variant: item.variant,
            alt: item.alt,
            width: item.width,
            height: item.height,
            retrievedAt: item.retrievedAt,
          }))
      ),
    },
    null,
    2
  )
);

// 3D/exhibition texture set: downsample only selected archive frames.
const textures = [
  ["dhikrullah-mueenah", "couple-portrait", "hero-couple"],
  ["dhikrullah-mueenah", "bride", "hero-bride"],
  ["fatima", "veil", "hero-portrait"],
  ["zee-diaries", "microphone", "hero-microphone"],
  ["misturoh", "dua", "hero-dua"],
  ["misturoh", "side-profile", "hero-side"],
  ["eid-2026", "men", "hero-eid-men"],
  ["eid-2026", "black", "hero-eid-black"],
  ["eid-2026", "purple", "hero-eid-purple"],
  ["edts-2026", "children", "hero-children"],
  ["edts-2026", "red", "hero-red"],
  ["jcin-unilorin-photoshoot", "group", "hero-jcin"],
  ["law-and-sport-week", "interview", "hero-law"],
  ["harmony-academy-2026", "group", "hero-harmony"],
  ["hikmarh", "reading", "hero-library"],
  ["global-surveyor-day-2", "embrace", "hero-embrace"],
  ["aisha-birthday", "portrait", "hero-aisha"],
  ["afa", "group", "hero-afa"],
];
for (const [slug, name, textureName] of textures) {
  const source = path.join(photoRoot, slug, `${name}.jpg`);
  try {
    await sharp(source)
      .resize({ width: 900, withoutEnlargement: true })
      .jpeg({ quality: 80, mozjpeg: true })
      .toFile(path.resolve("public/media/textures", `${textureName}.jpg`));
  } catch (error) {
    console.log(`texture fail ${textureName}: ${error.message}`);
  }
}

// Poster stills for the placeholder motion studies.
const postersDir = path.resolve("public/media/posters");
await mkdir(postersDir, { recursive: true });
const posterSources = [
  ["dhikrullah-mueenah/couple-portrait.jpg", "study-ceremony", 1920, 1080],
  ["eid-2026/black.jpg", "study-light", 1080, 1920],
  ["edts-2026/football.jpg", "study-gathering", 1920, 1080],
  ["edts-2026/children.jpg", "study-community", 1920, 1080],
];
for (const [source, name, width, height] of posterSources) {
  try {
    await sharp(path.join(photoRoot, source))
      .resize({ width, height, fit: "cover", position: "attention" })
      .modulate({ saturation: 0.92, brightness: 0.92 })
      .jpeg({ quality: 86, mozjpeg: true })
      .toFile(path.join(postersDir, `${name}.jpg`));
  } catch (error) {
    console.log(`poster fail ${name}: ${error.message}`);
  }
}

// Media dimensions manifest, consumed by the app for stable aspect ratios.
await buildMediaManifest();

async function buildMediaManifest() {
  const records = {};
  async function walk(dir) {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) await walk(full);
      else if (/\.(jpe?g|png|webp|avif)$/i.test(entry.name)) {
        const meta = await sharp(full).metadata();
        const publicPath = `/${path.relative(path.resolve("public"), full).replaceAll("\\", "/")}`;
        records[publicPath] = {
          width: meta.width,
          height: meta.height,
          orientation: meta.width >= meta.height * 1.15 ? "landscape" : meta.height >= meta.width * 1.15 ? "portrait" : "square",
        };
      }
    }
  }
  for (const folder of ["photography", "posters", "textures"]) {
    try {
      await walk(path.resolve("public/media", folder));
    } catch {
      /* optional folder */
    }
  }
  await writeFile("content/media-manifest.json", JSON.stringify(records, null, 2));
  console.log(`media manifest: ${Object.keys(records).length} files`);
}

console.log(`\nMigrated ${downloaded} curated photographs.`);
