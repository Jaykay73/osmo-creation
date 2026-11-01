"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  categories,
  categoryCounts,
  type ArchiveProject,
  type CategoryId,
  type SpatialProject,
} from "@/content/projects";
import { SpatialArchive } from "@/components/work/SpatialArchive";
import { ArrowUpRight } from "@/components/ui/Icons";

const sizePattern = [
  "card--lg",
  "card--portrait",
  "card--portrait",
  "card--wide",
  "card--wide",
  "card--tall",
  "card--square",
  "card--square",
  "card--tall",
  "card--wide",
  "card--portrait",
  "card--lg",
  "card--lg",
  "card--portrait",
  "card--square",
  "card--square",
];

type Filter = CategoryId | "all";

export function ArchiveClient({
  initialCategory = "all",
  projects,
  spatialProjects,
}: {
  initialCategory?: Filter;
  projects: ArchiveProject[];
  spatialProjects: SpatialProject[];
}) {
  const reduced = useReducedMotion();
  const [category, setCategory] = useState<Filter>(initialCategory);
  const [view, setView] = useState<"index" | "spatial">("index");

  useEffect(() => {
    setCategory(initialCategory);
  }, [initialCategory]);

  const filtered = useMemo(() => {
    if (category === "all") return projects;
    return projects.filter((project) => project.category === category);
  }, [category, projects]);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (category === "all") url.searchParams.delete("category");
    else url.searchParams.set("category", category);
    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
  }, [category]);

  const label = categories.find((item) => item.id === category)?.label ?? "All collections";

  return (
    <>
      <div className={`archive-toolbar${view === "spatial" ? " is-spatial" : ""}`}>
        <div className="shell archive-toolbar-inner">
          {view === "index" ? (
            <div
              className="archive-filters"
              role="group"
              aria-label="Filter collections by category"
            >
              {categories.map((item) => {
                const count = categoryCounts[item.id] ?? 0;
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`filter-button${category === item.id ? " is-active" : ""}`}
                    aria-pressed={category === item.id}
                    onClick={() => setCategory(item.id)}
                  >
                    <span>{item.label}</span>
                    <sup>{String(count).padStart(2, "0")}</sup>
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="archive-spatial-label">
              Spatial archive <span>·</span> {spatialProjects.length} selected works
            </p>
          )}

          <div className="archive-view" role="group" aria-label="Archive view">
            <span className="archive-view-label">View</span>
            <button
              type="button"
              className={view === "index" ? "is-active" : ""}
              aria-pressed={view === "index"}
              onClick={() => setView("index")}
            >
              Index
            </button>
            <button
              type="button"
              className={view === "spatial" ? "is-active" : ""}
              aria-pressed={view === "spatial"}
              onClick={() => setView("spatial")}
            >
              Spatial
            </button>
          </div>
        </div>
      </div>

      <div className="shell">
        {view === "index" ? (
          <>
            <div className="archive-status">
              <p aria-live="polite">
                {filtered.length === projects.length
                  ? `${projects.length} collections`
                  : `${filtered.length} of ${projects.length} collections`}
              </p>
              <p>{label}</p>
            </div>

            {filtered.length === 0 ? (
              <div className="archive-empty">
                <p className="eyebrow eyebrow--light">
                  <span className="eyebrow-rule" aria-hidden="true" />
                  <span>Empty shelf</span>
                </p>
                <h2>Nothing filed under this yet.</h2>
                <p>Try another category, or return to the complete archive.</p>
                <button type="button" className="cta cta--small" onClick={() => setCategory("all")}>
                  View all collections
                  <ArrowUpRight />
                </button>
              </div>
            ) : (
              <div className="archive-grid">
                <AnimatePresence mode="popLayout" initial={false}>
                  {filtered.map((project, index) => {
                    const size = sizePattern[index % sizePattern.length];
                    return (
                      <motion.article
                        key={project.slug}
                        layout={reduced ? false : "position"}
                        initial={reduced ? false : { opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={reduced ? undefined : { opacity: 0, y: 8 }}
                        transition={{ duration: 0.45, ease: [0.22, 0.61, 0.36, 1] }}
                        className={`archive-card ${size}`}
                      >
                        <Link href={`/work/${project.slug}`} className="archive-card-link">
                          <figure className="archive-card-media media">
                            <Image
                              src={project.cover.src}
                              alt={project.cover.alt}
                              fill
                              sizes="(max-width: 767px) 100vw, (max-width: 1199px) 50vw, 55vw"
                              style={{ objectPosition: "center 28%" }}
                            />
                            <span className="archive-card-arrow">
                              <ArrowUpRight size={16} />
                            </span>
                          </figure>
                          <div className="archive-card-copy">
                            <span className="archive-card-index">
                              {String(index + 1).padStart(2, "0")}
                            </span>
                            <div className="archive-card-title-wrap">
                              <h3>{project.title}</h3>
                              <p>
                                {project.typeLabel} <span aria-hidden="true">·</span>{" "}
                                {project.dateDisplay}
                              </p>
                            </div>
                            <ArrowUpRight className="archive-card-arrow-small" size={15} />
                          </div>
                        </Link>
                      </motion.article>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </>
        ) : (
          <SpatialArchive projects={spatialProjects} />
        )}
      </div>
    </>
  );
}
