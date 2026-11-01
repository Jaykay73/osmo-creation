# OSMO Creation — Photography & Film

A cinematic portfolio for OSMO Creation in Lagos, built with Next.js 15, React 19,
TypeScript, Framer Motion and React Three Fiber / Three.js.

## Run locally

```sh
npm install
npm run dev
```

Open http://localhost:3000. On Windows PowerShell with restricted script execution,
use `npm.cmd` in place of `npm`.

```sh
npm run build
npm start
npm run typecheck
npm run lint
```

Development uses `.next-dev`; production uses `.next`. Development no longer
overwrites production assets. Use separate ports when running both servers.

## The experience

- Opening: Three.js photographic prints, pointer parallax, camera movement on scroll
  and a pause control. Static artwork stays visible when WebGL fails or reduced
  motion is requested. Animation pauses offscreen.
- A way of seeing: full-screen **Before / Within / After** chapters from a real
  ceremony, with crossfading photographs and direct chapter links.
- Editorial studio introduction, five selected stories, films and portraits.
- Nine photographs in an inline spatial gallery that turns as the page scrolls.
  No separate exhibition entry is required; a swipeable strip replaces it for
  reduced motion or unavailable WebGL.
- Wedding, portrait and film booking links that preselect the enquiry type,
  with a booking link always visible in the desktop and mobile header.
- A closing invitation to commission a story, with direct contact details.

Desktop chapter navigation tracks the current section. Project galleries open a
full-size photograph viewer with arrow-key navigation, Escape, focus trapping and
focus restoration. Film dialogs also support keyboard navigation.

Fonts load through a browser stylesheet with system fallbacks, so a production
build does not need access to Google Fonts.

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Story-led homepage |
| `/work` | 16 collections, category filters and spatial view |
| `/work/[slug]` | Project story, gallery viewer and related work |
| `/films`, `/films/[slug]` | Film archive and accessible player |
| `/about` | Studio statement and services |
| `/contact` | Enquiry form and direct contact details |
| `/exhibition` | 3D room of nine photographs with flat fallback |
| `/api/enquiry` | Resend-backed enquiry endpoint |
| `/sitemap.xml`, `/robots.txt` | Search metadata |

## Email configuration

Copy `.env.example` to `.env.local` and configure:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Optional canonical URL; otherwise uses Vercel production/deployment URL or localhost |
| `RESEND_API_KEY` | Email provider credential |
| `ENQUIRY_FROM_EMAIL` | Verified sender |
| `ENQUIRY_TO_EMAIL` | Recipient; defaults to `salakoolashubomi@gmail.com` |

Until configured, the endpoint returns `503 email_not_configured`. The form explains
that the message was not sent and offers an email link containing the completed
enquiry. It does not report a false success.

## Content and media

- `content/site.ts`: brand, contacts, socials, About and Contact copy.
- `content/projects.ts`: project metadata and sequenced photography.
- `content/films.ts`: footage, posters, durations and placeholder flags.
- `content/exhibition.ts`: the nine exhibition works.
- `content/media-manifest.json`: generated image dimensions.
- `content/source-credits.json`: photograph provenance.
- `app/globals.css`: design system; `app/story.css`: story and viewer additions.

For a new collection, place images in `public/media/photography/<slug>/`, run
`npm run media:manifest`, then add a project using `media()` in `content/projects.ts`.
The helper validates asset paths at build time. Categories are `portraits`,
`celebrations`, `events` and `institutions`.

For new films, add an H.264/AAC MP4 with faststart to `public/media/video/` (or use a
hosted URL), add a poster, regenerate the manifest and update `content/films.ts`.
Set `placeholder: false` and update duration, descriptions and sound information.

**The current three films are silent ten-second studies generated from photographs,
not original cinematography footage.** The studio's actual films and confirmed
personal biography still need to be supplied. Founder fields remain empty.
Photographs use migrated Pixieset viewing renditions; see `MIGRATION.md` for
provenance and guidance on replacing them with higher-resolution originals.

## Tools and checks

```sh
npm run media:manifest
npm run films:generate
npm run og:generate
npm run qa:narrative
```

The narrative browser check uses Chrome through `playwright-core`. It checks story
chapters, navigation, filters, film and photo viewers, enquiry validation, mobile
layout and reduced motion. Email delivery is mocked; no message is sent.
Screenshots and results go to `.tmp/narrative-qa/`.

Set `QA_BASE_URL` to the running server (default `http://127.0.0.1:3001`) and
`CHROME_PATH` if needed. `node scripts/qa-screenshots.mjs` runs the older, broader
screenshot sweep against port 3000.

## Deploy

See `DEPLOYMENT.md` for the 20-commit import script, GitHub destination and Vercel setup.

Deploy as a standard Next.js application, for example on Vercel. Configure email
delivery and supply original films before presenting motion studies as completed
film commissions. Local changes do not publish the site.
