import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { films } from "@/content/films";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url.replace(/\/$/, "");

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: `${base}/work`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/films`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.6 },
    { url: `${base}/contact`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.6 },
    { url: `${base}/exhibition`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];

  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${base}/work/${project.slug}`,
    lastModified: new Date(project.date),
    changeFrequency: "yearly",
    priority: 0.7,
    images: [`${base}${project.cover.src}`],
  }));

  const filmRoutes: MetadataRoute.Sitemap = films.map((film) => ({
    url: `${base}/films/${film.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
    images: [`${base}${film.poster.src}`],
  }));

  return [...staticRoutes, ...projectRoutes, ...filmRoutes];
}
