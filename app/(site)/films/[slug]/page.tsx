import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { films, getFilm, getRelatedFilms } from "@/content/films";
import { VideoPlayer } from "@/components/films/VideoPlayer";
import { ArrowLeft, ArrowUpRight, PlayIcon } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return films.map((film) => ({ slug: film.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const film = getFilm(slug);
  if (!film) return {};
  return {
    title: `${film.title} — ${film.typeLabel}`,
    description: film.description,
    alternates: { canonical: `/films/${film.slug}` },
    openGraph: {
      title: `${film.title} — OSMO Creation`,
      description: film.description,
      url: `/films/${film.slug}`,
      type: "video.other",
      images: [
        {
          url: film.poster.src,
          width: film.poster.width,
          height: film.poster.height,
          alt: film.poster.alt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${film.title} — OSMO Creation`,
      description: film.description,
      images: [film.poster.src],
    },
  };
}

export default async function FilmPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const film = getFilm(slug);
  if (!film) notFound();
  const related = getRelatedFilms(film.slug);

  return (
    <article className="film-page">
      <header className="film-page-header">
        <div className="shell">
          <div className="project-kicker">
            <Link href="/films" className="project-back">
              <ArrowLeft size={14} /> All films
            </Link>
            <span className="project-kicker-divider" aria-hidden="true" />
            <span>{film.typeLabel}</span>
            <span className="project-kicker-divider" aria-hidden="true" />
            <span>{film.duration} · Silent</span>
          </div>
          <div className="film-page-title-row">
            <Reveal>
              <span className="film-index-large">{film.index}</span>
              <h1 className="film-page-title">{film.title}</h1>
            </Reveal>
            <Reveal className="film-page-intro" delay={0.08}>
              <p>{film.description}</p>
            </Reveal>
          </div>
        </div>
      </header>

      <Reveal className="film-page-player-wrap" y={18}>
        <div className="shell">
          <div className={`film-page-player film-page-player--${film.aspect}`}>
            <VideoPlayer film={film} />
          </div>
          <p className="film-page-caption">
            <span>{film.note}</span>
            <span>
              {film.aspect === "portrait" ? "9:16" : "16:9"} · {film.duration} · H.264
            </span>
          </p>
        </div>
      </Reveal>

      <div className="shell">
        <section className="film-page-body" aria-labelledby="film-note-title">
          <div>
            <SectionLabel index="Note">On the study</SectionLabel>
            <h2 id="film-note-title" className="display-md">
              A frame, held <em>longer</em>.
            </h2>
          </div>
          <div className="film-page-note">
            <p>{film.note}</p>
            <p>
              Moving image is treated as another way of looking at the same archive:
              gestures, light, the small choreography between people.
            </p>
            <Link href="/contact" className="cta cta--small">
              Enquire about film work
              <ArrowUpRight />
            </Link>
          </div>
        </section>

        {related.length ? (
          <section className="film-related" aria-labelledby="film-related-title">
            <div className="section-head section-head--small">
              <div>
                <SectionLabel index="Next">More films</SectionLabel>
                <h2 id="film-related-title" className="display-md">
                  Keep <em>watching</em>
                </h2>
              </div>
              <Link href="/films" className="text-link">
                All films
                <ArrowUpRight />
              </Link>
            </div>
            <div className="film-related-grid">
              {related.map((item) => (
                <Link key={item.slug} href={`/films/${item.slug}`} className="related-card">
                  <span className={`related-image related-image--film related-image--${item.aspect} media`}>
                    <Image
                      src={item.poster.src}
                      alt={item.poster.alt}
                      fill
                      sizes="(max-width: 767px) 100vw, 46vw"
                    />
                    <span className="film-play film-play--small" aria-hidden="true">
                      <PlayIcon size={14} />
                    </span>
                  </span>
                  <span className="related-copy">
                    <span className="related-title">{item.title}</span>
                    <span className="related-meta">
                      {item.typeLabel} · {item.duration}
                    </span>
                    <ArrowUpRight size={14} />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </article>
  );
}
