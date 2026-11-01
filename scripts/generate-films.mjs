// Generates the three silent motion studies that hold the film section until
// the studio's own video files are ingested. Replace the files in
// public/media/video and update content/films.ts when real films are available.
import { mkdir } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";
import ffmpegPath from "ffmpeg-static";

const ffmpeg = ffmpegPath;

const films = [
  {
    input: "public/media/posters/study-ceremony.jpg",
    output: "public/media/video/study-ceremony.mp4",
    size: "1920x1080",
  },
  {
    input: "public/media/posters/study-light.jpg",
    output: "public/media/video/study-light.mp4",
    size: "1080x1920",
  },
  {
    input: "public/media/posters/study-gathering.jpg",
    output: "public/media/video/study-gathering.mp4",
    size: "1920x1080",
  },
];

await mkdir(path.resolve("public/media/video"), { recursive: true });

for (const film of films) {
  const [width] = film.size.split("x");
  const filter = [
    `scale=${Number(width) * 1.12}:-2`,
    `zoompan=z='min(zoom+0.00045,1.12)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=240:s=${film.size}:fps=24`,
    "fade=t=in:st=0:d=0.8",
    "fade=t=out:st=9.2:d=0.8",
    "format=yuv420p",
  ].join(",");

  const args = [
    "-y",
    "-loop",
    "1",
    "-framerate",
    "24",
    "-i",
    film.input,
    "-vf",
    filter,
    "-t",
    "10",
    "-an",
    "-c:v",
    "libx264",
    "-preset",
    "slow",
    "-crf",
    "25",
    "-profile:v",
    "high",
    "-level",
    "4.1",
    "-movflags",
    "+faststart",
    film.output,
  ];
  console.log(`Generating ${film.output}...`);
  const result = spawnSync(ffmpeg, args, { stdio: "inherit" });
  if (result.status !== 0) {
    console.error(`Failed to generate ${film.output}`);
    process.exitCode = 1;
  }
}
