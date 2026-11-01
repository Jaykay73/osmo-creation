"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import type { SpatialProject } from "@/content/projects";
import { ArrowUpRight } from "@/components/ui/Icons";

const SpatialArchiveScene = dynamic(
  () => import("@/components/work/SpatialArchiveScene"),
  { ssr: false }
);

export function SpatialArchive({ projects }: { projects: SpatialProject[] }) {
  const router = useRouter();
  const stageRef = useRef<HTMLDivElement>(null);
  const [activeProject, setActiveProject] = useState<SpatialProject | null>(projects[0] ?? null);
  const [supportsWebgl, setSupportsWebgl] = useState<boolean | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [compact, setCompact] = useState(false);
  const [inView, setInView] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    let context: WebGLRenderingContext | WebGL2RenderingContext | null = null;
    try {
      context =
        canvas.getContext("webgl2") ||
        canvas.getContext("webgl");
    } catch {
      context = null;
    }
    setSupportsWebgl(Boolean(context));

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compactQuery = window.matchMedia("(max-width: 767px)");
    const updateMotion = () => setReducedMotion(motionQuery.matches);
    const updateCompact = () => setCompact(compactQuery.matches);
    updateMotion();
    updateCompact();
    motionQuery.addEventListener("change", updateMotion);
    compactQuery.addEventListener("change", updateCompact);
    return () => {
      motionQuery.removeEventListener("change", updateMotion);
      compactQuery.removeEventListener("change", updateCompact);
    };
  }, []);

  useEffect(() => {
    const node = stageRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting && document.visibilityState === "visible"),
      { threshold: 0.08 }
    );
    observer.observe(node);
    const onVisibility = () => setInView(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const handleReady = useCallback(() => setReady(true), []);
  const handleActive = useCallback((project: SpatialProject | null) => {
    if (project) setActiveProject(project);
  }, []);
  const handleOpen = useCallback(
    (slug: string) => {
      router.push(`/work/${slug}`);
    },
    [router]
  );

  const showScene = supportsWebgl === true && !reducedMotion;

  return (
    <section className="spatial" aria-labelledby="spatial-title">
      <div className="spatial-stage" ref={stageRef}>
        <div className="spatial-stage-header">
          <p className="eyebrow eyebrow--light">
            <span className="eyebrow-index">S</span>
            <span className="eyebrow-rule" aria-hidden="true" />
            <span id="spatial-title">Spatial archive</span>
          </p>
          <p className="spatial-hint">
            {showScene
              ? "Move to look · Select a frame to open"
              : "Flat view · Curated selection"}
          </p>
        </div>

        {showScene ? (
          <div
            className={`spatial-canvas${ready ? " is-ready" : ""}`}
            aria-hidden="true"
          >
            <SpatialArchiveScene
              projects={projects}
              compact={compact}
              active={inView}
              onReady={handleReady}
              onActiveChange={handleActive}
              onOpen={handleOpen}
            />
          </div>
        ) : (
          <div className="spatial-flat" aria-hidden="true">
            {projects.slice(0, compact ? 5 : 9).map((project, index) => (
              <figure
                key={project.slug}
                className={`spatial-flat-print spatial-flat-print--${index + 1}`}
              >
                <Image
                  src={project.cover.src}
                  alt=""
                  width={project.cover.width}
                  height={project.cover.height}
                  sizes="20vw"
                />
              </figure>
            ))}
          </div>
        )}

        {showScene && !ready ? (
          <p className="spatial-loading" aria-live="polite">
            Preparing the room…
          </p>
        ) : null}

        <div className="spatial-caption">
          <div>
            <span className="spatial-caption-label">On view</span>
            <h3>{activeProject?.title ?? "OSMO archive"}</h3>
            <p>
              {activeProject
                ? `${activeProject.typeLabel} · ${activeProject.dateDisplay}`
                : "A selection from the archive"}
            </p>
          </div>
          {activeProject ? (
            <Link href={`/work/${activeProject.slug}`} className="cta cta--small">
              Open project
              <ArrowUpRight />
            </Link>
          ) : null}
        </div>
      </div>

      <div className="spatial-index-wrap">
        <div className="spatial-index-head">
          <p className="eyebrow eyebrow--light">
            <span className="eyebrow-rule" aria-hidden="true" />
            <span>Index · {projects.length} selected</span>
          </p>
          <p className="spatial-index-note">
            Every frame is also available through the conventional index.
          </p>
        </div>
        <ul className="spatial-index">
          {projects.map((project, index) => (
            <li key={project.slug}>
              <button
                type="button"
                className="spatial-index-button"
                onMouseEnter={() => setActiveProject(project)}
                onFocus={() => setActiveProject(project)}
                onClick={() => handleOpen(project.slug)}
                aria-label={`Open ${project.title}`}
              >
                <span className="spatial-index-number">{String(index + 1).padStart(2, "0")}</span>
                <span className="spatial-index-title">{project.title}</span>
                <span className="spatial-index-date">{project.dateDisplay}</span>
                <ArrowUpRight size={13} />
              </button>
            </li>
          ))}
        </ul>
        {supportsWebgl === false ? (
          <p className="spatial-note">
            Your browser could not start WebGL, so the spatial view is shown as a flat wall.
            The index below remains fully accessible.
          </p>
        ) : null}
        {reducedMotion ? (
          <p className="spatial-note">
            Motion is reduced by your system settings, so this archive is presented as a
            still wall.
          </p>
        ) : null}
      </div>
    </section>
  );
}
