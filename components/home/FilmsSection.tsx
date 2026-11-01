"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { featuredFilms, films, type Film } from "@/content/films";
import { FilmModal } from "@/components/films/FilmModal";
import { ArrowUpRight, PlayIcon } from "@/components/ui/Icons";
import { SectionLabel } from "@/components/ui/SectionLabel";

export function FilmsSection() {
  const [activeFilm, setActiveFilm] = useState<Film | null>(null);
  const [primary, secondary] = featuredFilms;
  const third = films.find((film) => film.slug !== primary.slug && film.slug !== secondary.slug);

  return (
    <section id="motion" className="films-home section" aria-labelledby="films-title">
      <div className="shell">
        <div className="section-head section-head--films">
          <div className="section-head-main">
            <SectionLabel index="04">Films & studies</SectionLabel>
            <h2 id="films-title" className="display-lg">
              Stories in
              <br />
              <em>motion</em>.
            </h2>
          </div>
          <div className="section-head-side">
            <p>
              Moving image belongs to the same practice. Silence, duration, and the small
              shifts a still frame cannot hold.
            </p>
            <Link href="/films" className="text-link">
              Enter the film archive
              <ArrowUpRight />
            </Link>
          </div>
        </div>

        <div className="films-home-grid">
          <button
            type="button"
            className="film-feature film-feature--landscape"
            onClick={() => setActiveFilm(primary)}
            aria-label={`Play ${primary.title}, ${primary.duration} silent motion study`}
          >
            <div className="film-feature-poster media">
              <Image
                src={primary.poster.src}
                alt={primary.poster.alt}
                fill
                sizes="(max-width: 767px) 100vw, 64vw"
              />
              <span className="film-play" aria-hidden="true">
                <PlayIcon size={18} />
              </span>
              <span className="film-frame-label">
                OSMO Film Archive — {primary.index}
              </span>
            </div>
            <div className="film-feature-meta">
              <span className="film-feature-number">01</span>
              <div>
                <h3>{primary.title}</h3>
                <p>
                  {primary.typeLabel} · {primary.duration} · Silent
                </p>
              </div>
              <span className="film-feature-action">
                Play <ArrowUpRight size={13} />
              </span>
            </div>
          </button>

          <button
            type="button"
            className="film-feature film-feature--portrait"
            onClick={() => setActiveFilm(secondary)}
            aria-label={`Play ${secondary.title}, ${secondary.duration} silent motion study`}
          >
            <div className="film-feature-poster media">
              <Image
                src={secondary.poster.src}
                alt={secondary.poster.alt}
                fill
                sizes="(max-width: 767px) 72vw, 26vw"
              />
              <span className="film-play" aria-hidden="true">
                <PlayIcon size={16} />
              </span>
              <span className="film-frame-label">OSMO Film Archive — {secondary.index}</span>
            </div>
            <div className="film-feature-meta">
              <span className="film-feature-number">02</span>
              <div>
                <h3>{secondary.title}</h3>
                <p>
                  {secondary.typeLabel} · {secondary.duration} · Silent
                </p>
              </div>
              <span className="film-feature-action">
                Play <ArrowUpRight size={13} />
              </span>
            </div>
          </button>

          <aside className="films-home-aside">
            <p className="films-home-note">
              Three silent studies are currently showing — cut from the stills archive while
              the studio’s longer films are prepared.
            </p>
            {third ? (
              <button type="button" className="film-text-link" onClick={() => setActiveFilm(third)}>
                <span>{third.index} — {third.title}</span>
                <span>{third.duration}</span>
              </button>
            ) : null}
            <Link href="/films" className="cta cta--small">
              All films
              <ArrowUpRight />
            </Link>
          </aside>
        </div>
      </div>
      {activeFilm ? <FilmModal film={activeFilm} onClose={() => setActiveFilm(null)} /> : null}
    </section>
  );
}
