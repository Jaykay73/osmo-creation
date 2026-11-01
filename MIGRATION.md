# Asset migration report

How the OSMO Creation photography and video were brought into this project, what is
verified present, and what still requires manual action.

- **Source:** the studio's public Pixieset portfolio — <https://osmocreation03.pixieset.com/>
- **Migrated:** 18 October 2026
- **Method:** `scripts/migrate-selected.mjs` (curated selection of publicly served
  renditions only) + `scripts/build-media-manifest.mjs`
- **Provenance:** `content/source-credits.json` records each photograph's source gallery,
  Pixieset photo id, variant, dimensions and alt text.

## Scope and terms

Only **publicly served viewing renditions** were retrieved — the `xlarge` (typically
1024px) variants the public site serves, and `cover-large` (up to 2400px) where Pixieset
served it for a collection cover. No original-resolution files, download PINs,
authentication or other access controls were bypassed. Full-resolution originals remain
in the owner's Pixieset account and should be supplied for final production where higher
resolution is required.

The site does **not** hotlink Pixieset. Every photograph is a local derivative under
`public/media/`.

## Collections migrated (16 / 16)

Verified present in `public/media/photography/`, with counts matching
`content/projects.ts` and `content/source-credits.json`.

| Collection (project slug) | Source gallery | Photos | Cover variant |
| --- | --- | ---: | --- |
| Dhikrullah & Mueenah (`dhikrullah-mueenah`) | `/dhikrullahandmueenah/` | 13 | cover-large (2400px) |
| Fatima (`fatima`) | `/fatima/` | 8 | cover-large |
| Zee Diaries (`zee-diaries`) | `/zeediaries/` | 6 | xlarge |
| AFA (`afa`) | `/afa/` | 9 | cover-large |
| Aisha Birthday (`aisha-birthday`) | `/aishabirthday/` | 6 | cover-large |
| JCIN Unilorin Photoshoot (`jcin-unilorin-photoshoot`) | `/jcinunilorinphotoshoot/` | 10 | cover-large |
| Aminat (`aminat`) | `/aminat/` | 5 | cover-large |
| Law and Sport Week (`law-and-sport-week`) | `/lawandsportweek/` | 10 | cover-large |
| EPI 2020 (`epi-2020`) | `/epiawarenesswalkday1/`, `/uithvisitation/`, `/publiclectureday2/` | 13 | cover-large |
| Misturoh (`misturoh`) | `/misturoh/` | 11 | cover-large |
| Hikmarh (`hikmarh`) | `/hikmarh-1/` | 10 | cover-large |
| Rofiat (`rofiat`) | `/rofiat/` | 4 | xlarge |
| EDTS 2026 (`edts-2026`) | `/edts2026/` | 13 | cover-large |
| Harmony Academy 2026 (`harmony-academy-2026`) | `/harmonyacademy2026/` | 10 | cover-large |
| Global Surveyor Day 2, Kwara (`global-surveyor-day-2`) | `/globalsuveryordaykwara/` | 8 | cover-large |
| Eid 2026 (`eid-2026`) | `/eid20026/` | 12 | cover-large |
| **Total** | | **148** | 14 cover-large · 134 xlarge |

Notes:

- **EPI 2020** is one project assembled from three public EPI Week sub-galleries. The
  `sourceGallery` field is empty for these 13 entries in `source-credits.json` because the
  inventory for those sub-galleries did not carry a resolved gallery URL. The three source
  galleries are recorded in `scripts/migrate-selected.mjs` (lines ~121–142).
- Derivations: 18 homepage/exhibition **textures** (`public/media/textures/`, 900px) and
  4 **posters** (`public/media/posters/`) were generated from the migrated photographs.

## Video

The Google Drive video folder was **not** ingested — the owner will download and supply
the files. To keep the films section complete and testable, three silent placeholder
motion studies were generated from poster stills:

- `public/media/video/study-ceremony.mp4`
- `public/media/video/study-light.mp4`
- `public/media/video/study-gathering.mp4`

They are flagged `placeholder: true` in `content/films.ts`. Replace them with the real
films following README → "Adding a film / video".

## What still requires manual action

1. **Full-resolution originals** — supply originals for any print/licensing/full-screen use.
2. **Real films** — download from the studio's Google Drive folder, encode for web, and
   register in `content/films.ts` (set `placeholder: false`).
3. **EPI source URLs** — optionally backfill `sourceGallery` in
   `content/source-credits.json` for the 13 EPI entries.
4. **Founder details** — complete the empty `founder` fields in `content/site.ts`.
5. **Enquiry delivery** — set `RESEND_API_KEY` and `ENQUIRY_FROM_EMAIL` (see README).
6. **Confirm contact/social details** are still current in `content/site.ts`.

## Re-running the migration

`node scripts/migrate-selected.mjs` re-downloads the curated selection and regenerates
textures, posters and `content/media-manifest.json`. It requires
`.tmp/review/inventory.json` (produced by the inspection scripts) and writes into
`public/media/`. Re-running it **overwrites** the derived images, so only do so
deliberately and review the diff.
