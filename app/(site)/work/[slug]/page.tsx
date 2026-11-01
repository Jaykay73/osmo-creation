import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  categoryLabels,
  getAdjacentProjects,
  getProject,
  getRelatedProjects,
  projects,
} from "@/content/projects";
import { ProjectGallery } from "@/components/project/ProjectGallery";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: `${project.title} — ${project.typeLabel}`,
    description: project.description,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      title: `${project.title} — OSMO Creation`,
      description: project.description,
      url: `/work/${project.slug}`,
      type: "article",
      images: [
        {
          url: project.cover.src,
          width: project.cover.width,
          height: project.cover.height,
          alt: project.cover.alt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} — OSMO Creation`,
      description: project.description,
      images: [project.cover.src],
    },
  };
}

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const gallery = project.media.filter((item) => item.src !== project.cover.src);
  const { previous, next } = getAdjacentProjects(project.slug);
  const related = getRelatedProjects(project.slug, 3);

  return (
    <article className="project">
      <header className="project-header">
        <div className="shell">
          <div className="project-kicker">
            <Link href="/work" className="project-back">
              <ArrowLeft size={14} /> The archive
            </Link>
            <span className="project-kicker-divider" aria-hidden="true" />
            <span>{categoryLabels[project.category]}</span>
            <span className="project-kicker-divider" aria-hidden="true" />
            <span>{project.dateDisplay}</span>
          </div>

          <div className="project-head-grid">
            <Reveal className="project-title-block">
              <span className="project-number">{String(project.displayOrder).padStart(2, "0")}</span>
              <h1 className="project-title">{project.title}</h1>
            </Reveal>
            <Reveal className="project-intro" delay={0.08}>
              <p>{project.description}</p>
              <dl className="project-meta">
                <div>
                  <dt>Type</dt>
                  <dd>{project.typeLabel}</dd>
                </div>
                <div>
                  <dt>Date</dt>
                  <dd>{project.dateDisplay}</dd>
                </div>
                <div>
                  <dt>Selected frames</dt>
                  <dd>{String(project.media.length).padStart(2, "0")}</dd>
                </div>
              </dl>
            </Reveal>
          </div>
        </div>
      </header>

      <Reveal className="project-cover-wrap" y={20}>
        <figure className="project-cover">
          <Image
            src={project.cover.src}
            alt={project.cover.alt}
            width={project.cover.width}
            height={project.cover.height}
            sizes="(max-width: 767px) 100vw, 92vw"
            priority
          />
          <figcaption className="project-cover-caption">
            <span>{project.title}</span>
            <span>{project.dateDisplay}</span>
          </figcaption>
        </figure>
      </Reveal>

      <div className="shell">
        <section className="project-sequence-head" aria-label="Collection sequence">
          <SectionLabel index={String(project.displayOrder).padStart(2, "0")}>
            The sequence
          </SectionLabel>
          <p>
            A selection from the collection, sequenced as it was seen. Use your keyboard to
            move through the page; every photograph is presented at its own proportion.
          </p>
        </section>
      </div>

      <ProjectGallery media={gallery} title={project.title} slug={project.slug} dateDisplay={project.dateDisplay} typeLabel={project.typeLabel} />

      <div className="shell">
        <div className="project-end">
          <p>
            <span>{String(project.media.length).padStart(2, "0")}</span> selected frames
          </p>
          <Link href="/work" className="cta cta--small">
            Back to the archive
            <ArrowUpRight />
          </Link>
        </div>
      </div>

      <nav className="project-pagination" aria-label="Previous and next projects">
        {previous ? (
          <Link href={`/work/${previous.slug}`} className="project-page-link project-page-link--previous">
            <span className="project-page-label">
              <ArrowLeft size={14} /> Previous
            </span>
            <span className="project-page-title">{previous.title}</span>
            <span className="project-page-meta">{previous.typeLabel}</span>
            <span className="project-page-image media">
              <Image
                src={previous.cover.src}
                alt=""
                fill
                sizes="(max-width: 767px) 50vw, 25vw"
              />
            </span>
          </Link>
        ) : null}
        {next ? (
          <Link href={`/work/${next.slug}`} className="project-page-link project-page-link--next">
            <span className="project-page-label">
              Next <ArrowRight size={14} />
            </span>
            <span className="project-page-title">{next.title}</span>
            <span className="project-page-meta">{next.typeLabel}</span>
            <span className="project-page-image media">
              <Image
                src={next.cover.src}
                alt=""
                fill
                sizes="(max-width: 767px) 50vw, 25vw"
              />
            </span>
          </Link>
        ) : null}
      </nav>

      {related.length ? (
        <section className="related shell" aria-labelledby="related-title">
          <div className="section-head section-head--small">
            <div>
              <SectionLabel index="Next">Related work</SectionLabel>
              <h2 id="related-title" className="display-md">
                More from the <em>archive</em>
              </h2>
            </div>
            <Link href="/work" className="text-link">
              All collections
              <ArrowUpRight />
            </Link>
          </div>
          <div className="related-grid">
            {related.map((item) => (
              <Link key={item.slug} href={`/work/${item.slug}`} className="related-card">
                <span className="related-image media">
                  <Image
                    src={item.cover.src}
                    alt={item.cover.alt}
                    fill
                    sizes="(max-width: 767px) 100vw, 32vw"
                    style={{ objectPosition: "center 28%" }}
                  />
                </span>
                <span className="related-copy">
                  <span className="related-title">{item.title}</span>
                  <span className="related-meta">
                    {item.typeLabel} · {item.dateDisplay}
                  </span>
                  <ArrowUpRight size={14} />
                </span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <div className="project-contact shell">
        <p>Have a story like this one?</p>
        <Link href="/contact" className="big-link big-link--compact">
          <span>Start a conversation</span>
          <ArrowUpRight size={22} />
        </Link>
      </div>
    </article>
  );
}
