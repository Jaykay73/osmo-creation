import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { films } from "@/content/films";
import { VideoPlayer } from "@/components/films/VideoPlayer";
import { ArrowUpRight, PlayIcon } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";

export const metadata: Metadata = {
  title: "Films & Studies",
  description:
    "Moving image from OSMO Creation — documentary studies of ceremonies, people and places, presented in a dedicated film archive.",
  alternates: { canonical: "/films" },
  openGraph: {
    title: "Films & Studies — OSMO Creation",
    description:
      "Moving image from OSMO Creation — documentary studies of ceremonies, people and places.",
    url: "/films",
    images: [
      {
        url: films[0].poster.src,
        width: films[0].poster.width,
        height: films[0].poster.height,
        alt: films[0].poster.alt,
      },
    ],
  },
};

export default function FilmsPage() {
  const [feature, ...rest] = films;

  return (
    <>
      <header className="page-hero page-hero--films">
        <div className="shell">
          <Reveal>
            <SectionLabel index="F">The film archive</SectionLabel>
          </Reveal>
          <div className="page-hero-grid">
            <Reveal>
              <h1 className="page-title">
                Stories in
                <br />
                <em>motion</em>.
              </h1>
            </Reveal>
            <Reveal className="page-hero-side" delay={0.08}>
              <p>
                Moving image belongs to the same practice. These silent studies hold a frame
                long enough for something to shift — light, a posture, a crowd.
              </p>
              <ul className="films-facts">
                <li>
                  <span>{String(films.length).padStart(2, "0")}</span> studies
                </li>
                <li>
                  <span>16:9 / 9:16</span> formats
                </li>
                <li>
                  <span>2026</span> archive
                </li>
              </ul>
            </Reveal>
          </div>
        </div>
      </header>

      <section className="films-lead section" aria-labelledby="film-lead-title">
        <div className="shell">
          <div className="films-lead-grid">
            <Reveal className="films-lead-player">
              <VideoPlayer film={feature} />
            </Reveal>
            <Reveal className="films-lead-copy" delay={0.08}>
              <span className="film-index-large">{feature.index}</span>
              <h2 id="film-lead-title" className="display-md">
                {feature.title}
              </h2>
              <p className="film-meta-line">
                {feature.typeLabel} · {feature.duration} · Silent
              </p>
              <p>{feature.description}</p>
              <p className="films-note">{feature.note}</p>
              <Link href={`/films/${feature.slug}`} className="cta cta--small">
                Open the film page
                <ArrowUpRight />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="film-index section" aria-labelledby="film-index-title">
        <div className="shell">
          <div className="section-head section-head--small">
            <div>
              <SectionLabel index="More">In the archive</SectionLabel>
              <h2 id="film-index-title" className="display-md">
                More moving <em>image</em>
              </h2>
            </div>
            <p className="section-head-note">
              Longer documentary work from the studio will join this archive as it is
              completed.
            </p>
          </div>

          <ul className="film-list">
            {rest.map((film) => (
              <li key={film.slug}>
                <Link href={`/films/${film.slug}`} className="film-row">
                  <span className={`film-row-poster film-row-poster--${film.aspect} media`}>
                    <Image
                      src={film.poster.src}
                      alt={film.poster.alt}
                      fill
                      sizes="(max-width: 767px) 100vw, 30vw"
                    />
                    <span className="film-play film-play--small" aria-hidden="true">
                      <PlayIcon size={14} />
                    </span>
                  </span>
                  <span className="film-row-copy">
                    <span className="film-row-index">{film.index}</span>
                    <span className="film-row-title">{film.title}</span>
                    <span className="film-row-meta">
                      {film.typeLabel} · {film.duration} · Silent
                    </span>
                    <span className="film-row-desc">{film.description}</span>
                  </span>
                  <span className="film-row-action">
                    Watch film <ArrowUpRight size={14} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="films-in-progress">
            <p className="eyebrow eyebrow--light">
              <span className="eyebrow-rule" aria-hidden="true" />
              <span>In preparation</span>
            </p>
            <p>
              Ceremony films, event highlights and longer documentary pieces are being
              prepared for this archive. Enquiries about commissioned film work are welcome.
            </p>
            <Link href="/contact" className="text-link">
              Discuss a film project
              <ArrowUpRight />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
