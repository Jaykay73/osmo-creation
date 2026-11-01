import { getProject } from "@/content/projects";
import { media, type MediaAsset } from "@/lib/media";

export type ExhibitionWork = {
  id: string;
  projectSlug: string;
  projectTitle: string;
  dateDisplay: string;
  typeLabel: string;
  image: MediaAsset;
  texture: string;
};

function work(projectSlug: string, file: string, texture: string): ExhibitionWork {
  const project = getProject(projectSlug);
  if (!project) throw new Error(`Unknown exhibition project: ${projectSlug}`);
  const image = project.media.find((item) => item.src.endsWith(`/${file}.jpg`));
  if (!image) throw new Error(`Missing exhibition image: ${projectSlug}/${file}`);
  return {
    id: `${projectSlug}-${file}`,
    projectSlug,
    projectTitle: project.title,
    dateDisplay: project.dateDisplay,
    typeLabel: project.typeLabel,
    image,
    texture,
  };
}

export const exhibitionWorks: ExhibitionWork[] = [
  work("dhikrullah-mueenah", "couple-portrait", "/media/textures/hero-couple.jpg"),
  work("fatima", "veil", "/media/textures/hero-portrait.jpg"),
  work("misturoh", "dua", "/media/textures/hero-dua.jpg"),
  work("eid-2026", "black", "/media/textures/hero-eid-black.jpg"),
  work("jcin-unilorin-photoshoot", "group", "/media/textures/hero-jcin.jpg"),
  work("edts-2026", "children", "/media/textures/hero-children.jpg"),
  work("hikmarh", "reading", "/media/textures/hero-library.jpg"),
  work("law-and-sport-week", "interview", "/media/textures/hero-law.jpg"),
  work("aisha-birthday", "portrait", "/media/textures/hero-aisha.jpg"),
];
