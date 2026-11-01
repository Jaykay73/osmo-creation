import type { Metadata } from "next";
import Link from "next/link";
import {
  archiveProjects,
  categories,
  categoryLabels,
  projectCount,
  projects,
  spatialArchiveProjects,
  type CategoryId,
} from "@/content/projects";
import { ArchiveClient } from "@/components/work/ArchiveClient";
import { ArrowUpRight } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";

export const metadata: Metadata = {
  title: "The Archive",
  description:
    "Browse every OSMO Creation collection — portraits, celebrations, events and institutional stories from 2026.",
  alternates: { canonical: "/work" },
  openGraph: {
    title: "The Archive — OSMO Creation",
    description:
      "Browse every OSMO Creation collection — portraits, celebrations, events and institutional stories from 2026.",
    url: "/work",
  },
};

const validCategories = new Set<string>(categories.map((category) => category.id));

export default async function WorkPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string | string[] }>;
}) {
  const resolved = await searchParams;
  const raw = Array.isArray(resolved.category) ? resolved.category[0] : resolved.category;
  const initialCategory: CategoryId | "all" =
    raw && validCategories.has(raw) ? (raw as CategoryId) : "all";
  const frameCount = projects.reduce((total, project) => total + project.media.length, 0);

  return (
    <>
      <header className="page-hero page-hero--archive">
        <div className="shell">
          <Reveal>
            <SectionLabel index="A">The archive</SectionLabel>
          </Reveal>
          <div className="page-hero-grid">
            <Reveal>
              <h1 className="page-title">
                The <em>archive</em>.
              </h1>
            </Reveal>
            <Reveal className="page-hero-side" delay={0.08}>
              <p>
                Every collection is a record of something real — a ceremony, a working day, a
                room full of people. Browse the index, or step into the spatial archive.
              </p>
              <div className="page-stats">
                <div>
                  <span className="page-stat-value">{projectCount}</span>
                  <span className="page-stat-label">Collections</span>
                </div>
                <div>
                  <span className="page-stat-value">{frameCount}</span>
                  <span className="page-stat-label">Selected frames</span>
                </div>
                <div>
                  <span className="page-stat-value">2026</span>
                  <span className="page-stat-label">Archive year</span>
                </div>
              </div>
            </Reveal>
          </div>
          <div className="page-hero-index">
            {categories
              .filter((category) => category.id !== "all")
              .map((category) => (
                <span key={category.id}>{categoryLabels[category.id as CategoryId]}</span>
              ))}
          </div>
        </div>
      </header>

      <ArchiveClient
        initialCategory={initialCategory}
        projects={archiveProjects}
        spatialProjects={spatialArchiveProjects}
      />

      <section className="archive-footer-cta">
        <div className="shell archive-footer-inner">
          <p>
            The full record continues beyond the site. For complete galleries, prints and
            licensing, get in touch.
          </p>
          <Link href="/contact" className="big-link big-link--compact">
            <span>Make an enquiry</span>
            <ArrowUpRight size={22} />
          </Link>
        </div>
      </section>
    </>
  );
}
