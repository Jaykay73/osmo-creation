import Image from "next/image";
import Link from "next/link";
import { getProject, type Project } from "@/content/projects";
import { ArrowUpRight } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";

function requiredProject(slug: string): Project {
  const project = getProject(slug);
  if (!project) throw new Error(`Unknown project ${slug}`);
  return project;
}

function asset(project: Project, name: string) {
  const found = project.media.find((item) => item.src.endsWith(`/${name}.jpg`));
  if (!found) throw new Error(`Missing asset ${name} for ${project.slug}`);
  return found;
}

const dhikrullah = requiredProject("dhikrullah-mueenah");
const misturoh = requiredProject("misturoh");
const edts = requiredProject("edts-2026");
const eid = requiredProject("eid-2026");
const law = requiredProject("law-and-sport-week");

export function FeaturedStories() {
  return (
    <section id="selected-work" className="features section" aria-labelledby="features-title">
      <div className="shell">
        <Reveal className="section-head">
          <div className="section-head-main">
            <SectionLabel index="03">Featured stories</SectionLabel>
            <h2 id="features-title" className="display-lg">
              Selected from
              <br />
              the <em>archive</em>.
            </h2>
          </div>
          <div className="section-head-side">
            <p>
              Five collections from the year — a ceremony, a courtyard, a field, a festival
              morning.
            </p>
            <Link href="/work" className="text-link">
              See all 16 collections
              <ArrowUpRight />
            </Link>
          </div>
        </Reveal>

        <div className="features-list">
          {/* 01 — full-width ceremony */}
          <Reveal>
            <article className="feature feature--full">
              <Link href={`/work/${dhikrullah.slug}`} className="feature-link">
                <header className="feature-header">
                  <div className="feature-title-wrap">
                    <span className="feature-index">01</span>
                    <h3 className="feature-title">{dhikrullah.title}</h3>
                  </div>
                  <div className="feature-meta">
                    <span>{dhikrullah.typeLabel}</span>
                    <span>{dhikrullah.dateDisplay}</span>
                  </div>
                </header>
                <figure className="feature-media feature-media--wide media">
                  <Image
                    src={dhikrullah.cover.src}
                    alt={dhikrullah.cover.alt}
                    fill
                    sizes="(max-width: 767px) 100vw, 96vw"
                    style={{ objectPosition: "center 34%" }}
                  />
                  <figcaption className="feature-caption">
                    <span>{dhikrullah.description.split(".")[0]}.</span>
                    <span className="feature-caption-action">
                      View the collection <ArrowUpRight size={13} />
                    </span>
                  </figcaption>
                </figure>
              </Link>
            </article>
          </Reveal>

          {/* 02 — split portrait */}
          <Reveal>
            <article className="feature feature--split">
              <div className="feature-aside">
                <header>
                  <span className="feature-index">02</span>
                  <h3 className="feature-title">{misturoh.title}</h3>
                  <p className="feature-type">
                    {misturoh.typeLabel} · {misturoh.dateDisplay}
                  </p>
                </header>
                <p className="feature-desc">{misturoh.description}</p>
                <Link href={`/work/${misturoh.slug}`} className="cta cta--small">
                  View the story
                  <ArrowUpRight />
                </Link>
                <Link
                  href={`/work/${misturoh.slug}`}
                  className="feature-detail"
                  aria-label={`View Misturoh — ${misturoh.title}`}
                >
                  <Image
                    src={asset(misturoh, "hands").src}
                    alt={asset(misturoh, "hands").alt}
                    width={asset(misturoh, "hands").width}
                    height={asset(misturoh, "hands").height}
                    sizes="(max-width: 767px) 70vw, 20vw"
                  />
                </Link>
              </div>
              <Link
                href={`/work/${misturoh.slug}`}
                className="feature-main-image media"
                aria-label={`View ${misturoh.title}`}
              >
                <Image
                  src={asset(misturoh, "dua").src}
                  alt={asset(misturoh, "dua").alt}
                  fill
                  sizes="(max-width: 767px) 100vw, 52vw"
                  style={{ objectPosition: "center 30%" }}
                />
              </Link>
            </article>
          </Reveal>

          {/* 03 — collage */}
          <Reveal>
            <article className="feature feature--collage">
              <header className="feature-header feature-header--collage">
                <div className="feature-title-wrap">
                  <span className="feature-index">03</span>
                  <h3 className="feature-title">{edts.title}</h3>
                </div>
                <div className="feature-meta feature-meta--aside">
                  <span>{edts.typeLabel}</span>
                  <span>{edts.dateDisplay}</span>
                </div>
                <p className="feature-collage-copy">{edts.description}</p>
                <Link href={`/work/${edts.slug}`} className="text-link feature-collage-link">
                  Enter the collection <ArrowUpRight />
                </Link>
              </header>
              <div className="feature-collage-grid">
                <Link href={`/work/${edts.slug}`} className="collage-cell collage-cell--a media">
                  <Image
                    src={asset(edts, "children").src}
                    alt={asset(edts, "children").alt}
                    fill
                    sizes="(max-width: 767px) 100vw, 55vw"
                  />
                </Link>
                <Link href={`/work/${edts.slug}`} className="collage-cell collage-cell--b media">
                  <Image
                    src={asset(edts, "care").src}
                    alt={asset(edts, "care").alt}
                    fill
                    sizes="(max-width: 767px) 100vw, 32vw"
                  />
                </Link>
                <Link href={`/work/${edts.slug}`} className="collage-cell collage-cell--c media">
                  <Image
                    src={asset(edts, "red").src}
                    alt={asset(edts, "red").alt}
                    fill
                    sizes="(max-width: 767px) 60vw, 22vw"
                    style={{ objectPosition: "center 25%" }}
                  />
                </Link>
              </div>
            </article>
          </Reveal>

          {/* 04 — festival strip */}
          <Reveal>
            <article className="feature feature--strip">
              <header className="feature-strip-head">
                <div className="feature-title-wrap">
                  <span className="feature-index">04</span>
                  <h3 className="feature-title">{eid.title}</h3>
                </div>
                <p className="feature-strip-copy">{eid.description}</p>
                <Link href={`/work/${eid.slug}`} className="cta cta--small">
                  View the portraits
                  <ArrowUpRight />
                </Link>
              </header>
              <div className="feature-strip-grid">
                {["purple", "red", "black"].map((name, index) => {
                  const image = asset(eid, name);
                  return (
                    <Link
                      key={name}
                      href={`/work/${eid.slug}`}
                      className={`strip-cell strip-cell--${index + 1} media`}
                      aria-label={`View Eid 2026 — portrait ${index + 1}`}
                    >
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        sizes="(max-width: 767px) 70vw, 30vw"
                        style={{ objectPosition: "center 28%" }}
                      />
                    </Link>
                  );
                })}
              </div>
              <p className="feature-strip-meta">
                <span>Festival portraits</span>
                <span>{eid.dateDisplay}</span>
              </p>
            </article>
          </Reveal>

          {/* 05 — offset editorial */}
          <Reveal>
            <article className="feature feature--offset">
              <Link href={`/work/${law.slug}`} className="offset-image media">
                <Image
                  src={law.cover.src}
                  alt={law.cover.alt}
                  fill
                  sizes="(max-width: 767px) 100vw, 66vw"
                  style={{ objectPosition: "center 30%" }}
                />
              </Link>
              <div className="offset-copy">
                <span className="feature-index">05</span>
                <h3 className="feature-title">{law.title}</h3>
                <p className="feature-type">
                  {law.typeLabel} · {law.dateDisplay}
                </p>
                <p className="feature-desc">{law.description}</p>
                <Link href={`/work/${law.slug}`} className="cta cta--small">
                  View the collection
                  <ArrowUpRight />
                </Link>
              </div>
            </article>
          </Reveal>
        </div>

        <div className="features-end">
          <Link href="/work" className="big-link">
            <span>The full archive</span>
            <span className="big-link-meta">16 collections · 2026</span>
            <ArrowUpRight size={26} />
          </Link>
        </div>
      </div>
    </section>
  );
}
