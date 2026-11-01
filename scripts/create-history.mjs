import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
process.chdir(root);
const steps = [
  ["chore: scaffold Next.js application and dependency tooling", [".gitignore", ".env.example", ".eslintrc.json", "package.json", "package-lock.json", "next.config.ts", "postcss.config.mjs", "tsconfig.json"]],
  ["style: establish cinematic typography and responsive design system", ["app/globals.css", "app/story.css", "app/booking.css", "app/icon.svg"]],
  ["feat: model studio content and validated media metadata", ["content", "lib"]],
  ["content: add curated photography collections", ["public/media/photography"]],
  ["content: add scene textures and silent motion studies", ["public/media/textures", "public/media/video", "public/media/posters", "public/media/og"]],
  ["feat: add shared icons, reveal motion and scene recovery", ["components/ui"]],
  ["feat: configure root metadata and application boundaries", ["app/layout.tsx", "app/robots.ts", "app/sitemap.ts", "app/loading.tsx", "app/error.tsx", "app/not-found.tsx"]],
  ["feat: build responsive navigation and shared site shell", ["components/site", "app/(site)/layout.tsx", "app/(site)/template.tsx"]],
  ["feat: introduce interactive Three.js photographic opening", ["components/home/Hero.tsx", "components/home/HeroScene.tsx", "components/home/HeroFallback.tsx"]],
  ["feat: sequence scroll-driven story chapters and chapter navigation", ["components/home/StorySequence.tsx", "components/home/ChapterNav.tsx"]],
  ["feat: introduce the filmmaker through personal editorial sections", ["components/home/Intro.tsx", "components/home/IndexStrip.tsx", "components/home/HumanElement.tsx"]],
  ["feat: embed scrollable spatial gallery and exhibition viewer", ["components/home/HomeGallery.tsx", "components/home/ExhibitionInvite.tsx", "components/exhibition", "app/exhibition"]],
  ["feat: add personal booking invitation and closing contact scene", ["components/home/BookingSection.tsx", "components/home/Closing.tsx"]],
  ["feat: compose selected photographic stories on the homepage", ["components/home/FeaturedStories.tsx", "app/(site)/page.tsx"]],
  ["feat: add film archive and accessible playback controls", ["components/home/FilmsSection.tsx", "components/films", "app/(site)/films"]],
  ["feat: build filterable work archive and full-size project galleries", ["components/work", "components/project", "app/(site)/work"]],
  ["feat: handle booking enquiries with validation and email fallback", ["components/forms", "app/api", "app/(site)/contact"]],
  ["feat: present studio approach and commission services", ["app/(site)/about"]],
  ["test: add browser checks and media preparation utilities", ["scripts/build-media-manifest.mjs", "scripts/crawl-pixieset.mjs", "scripts/generate-films.mjs", "scripts/generate-og.mjs", "scripts/inspect-gallery.mjs", "scripts/inspect-pixieset.mjs", "scripts/migrate-selected.mjs", "scripts/qa-narrative.mjs", "scripts/qa-screenshots.mjs", "scripts/review-pixieset.mjs"]],
  ["docs: prepare GitHub publication and Vercel deployment", ["README.md", "MIGRATION.md", "DEPLOYMENT.md", "vercel.json", "scripts/create-history.mjs"]],
];

function git(args, { optional = false } = {}) {
  const result = spawnSync("git", ["-c", "core.excludesFile=.git/info/exclude", ...args], { cwd: root, encoding: "utf8", shell: false });
  if (result.error) throw result.error;
  if (result.status !== 0 && !optional) throw new Error(result.stderr || result.stdout || `git ${args[0]} failed`);
  return { ok: result.status === 0, output: result.stdout.trim() };
}

if (process.argv.includes("--plan")) {
  for (const [index, [message, paths]] of steps.entries()) {
    console.log(`${String(index + 1).padStart(2, "0")} ${message}`);
    for (const path of paths) if (!existsSync(path)) throw new Error(`Missing input: ${path}`);
  }
  if (existsSync(".git")) {
    const candidates = git(["ls-files", "--others", "--exclude-standard"]).output.split("\n").filter(Boolean);
    const planned = steps.flatMap(([, paths]) => paths);
    const missing = candidates.filter((file) => !planned.some((path) => file === path || file.startsWith(`${path}/`)));
    if (missing.length) throw new Error(`Unplanned files need review:\n${missing.join("\n")}`);
  }
  console.log("All inputs exist. Plan only: no Git changes made.");
  process.exit(0);
}

if (!existsSync(".git")) git(["init", "-b", "main"]);
if (!git(["config", "user.name"]).output || !git(["config", "user.email"]).output) throw new Error("Set your Git author name and email before running this script.");
if (git(["diff", "--cached", "--name-only"]).output) throw new Error("The index already contains staged changes. Review them before proceeding.");
const hasHead = git(["rev-parse", "--verify", "HEAD"], { optional: true }).ok;
const existing = hasHead ? git(["log", "--reverse", "--format=%s"]).output.split("\n") : [];
if (existing.length > steps.length || existing.some((message, index) => message !== steps[index][0])) throw new Error("Existing history does not match this initial import. No history was rewritten.");
for (const [message, paths] of steps.slice(existing.length)) {
  git(["add", "--", ...paths]);
  if (!git(["diff", "--cached", "--name-only"]).output) throw new Error(`No staged files for: ${message}`);
  git(["commit", "-m", message]);
  console.log(message);
}
const remaining = git(["status", "--porcelain"]).output;
if (remaining) throw new Error(`History created, but files remain to review:\n${remaining}`);
console.log(`Created ${steps.length} logical commits. Working tree is clean. Nothing was pushed.`);
