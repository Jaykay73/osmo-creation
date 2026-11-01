import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { aboutPage, site, studioStatement } from "@/content/site";
import { media } from "@/lib/media";
import { ArrowUpRight } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";

export const metadata: Metadata = {
  title: "About the Studio",
  description:
    "OSMO Creation is a visual studio documenting people, places and occasions through photography and film. A practice of looking, based in Lagos, Nigeria.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About the Studio — OSMO Creation",
    description:
      "OSMO Creation is a visual studio documenting people, places and occasions through photography and film.",
    url: "/about",
  },
};

const openingImage = media(
  "/media/photography/misturoh/full-length.jpg",
  "A full-length portrait in white and burgundy on a tiled ledge."
);
const sequence = [
  media(
    "/media/photography/edts-2026/care.jpg",
    "A volunteer attending to a child's arm at the outreach."
  ),
  media(
    "/media/photography/hikmarh/reading.jpg",
    "A woman reading a book between library shelves."
  ),
  media(
    "/media/photography/dhikrullah-mueenah/canopy.jpg",
    "Rows of white chairs under a canopy decorated with pink tulle."
  ),
];

export default function AboutPage() {
  return (
    <>
      <header className="about-hero">
        <div className="shell">
          <Reveal>
            <SectionLabel index="A">About the studio</SectionLabel>
          </Reveal>
          <div className="about-hero-grid">
            <Reveal className="about-hero-copy">
              <h1 className="page-title about-title">
                A practice
                <br />
                of <em>looking</em>.
              </h1>
              <p className="about-opening">{aboutPage.opening}</p>
              <div className="about-location">
                <span>Based in</span>
                <span>{site.contact.city}</span>
              </div>
            </Reveal>
            <Reveal className="about-hero-image" delay={0.1} y={24}>
              <figure className="about-portrait print-frame">
                <Image
                  src={openingImage.src}
                  alt={openingImage.alt}
                  width={openingImage.width}
                  height={openingImage.height}
                  sizes="(max-width: 767px) 100vw, 42vw"
                  priority
                />
                <figcaption>
                  <span>Misturoh</span>
                  <span>22 May 2026</span>
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </div>
      </header>

      <section className="about-statement paper" aria-labelledby="about-statement-title">
        <div className="shell">
          <Reveal>
            <SectionLabel index="01" tone="dark">
              The studio
            </SectionLabel>
          </Reveal>
          <div className="about-statement-grid">
            <Reveal>
              <h2 id="about-statement-title" className="about-statement-title">
                We stay with the world
                <br />
                already <em>in front of us</em>.
              </h2>
            </Reveal>
            <Reveal className="about-body" delay={0.08}>
              {studioStatement.map((paragraph) => (
                <p key={paragraph.slice(0, 20)}>{paragraph}</p>
              ))}
            </Reveal>
          </div>
          <div className="about-body-more">
            {aboutPage.body.map((paragraph, index) => (
              <Reveal key={paragraph.slice(0, 20)} className="about-body-block" delay={index * 0.04}>
                <span className="about-body-index">{String(index + 1).padStart(2, "0")}</span>
                <p>{paragraph}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="about-sequence section" aria-labelledby="about-sequence-title">
        <div className="shell">
          <div className="section-head section-head--small">
            <div>
              <SectionLabel index="02">From the archive</SectionLabel>
              <h2 id="about-sequence-title" className="display-md">
                The work, and the <em>way there</em>.
              </h2>
            </div>
            <p className="section-head-note">
              A few frames that show the range of rooms this practice moves through — a
              health check, a library, a courtyard before a ceremony.
            </p>
          </div>
          <div className="about-sequence-grid">
            {sequence.map((image, index) => (
              <Reveal
                key={image.src}
                className={`about-sequence-frame about-sequence-frame--${index + 1}`}
                delay={index * 0.05}
              >
                <figure>
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={image.width}
                    height={image.height}
                    sizes="(max-width: 767px) 100vw, 33vw"
                  />
                  <figcaption>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <span>
                      {index === 0 ? "EDTS 2026" : index === 1 ? "Hikmarh" : "Dhikrullah & Mueenah"}
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="about-principles" aria-labelledby="about-principles-title">
        <div className="shell">
          <Reveal>
            <SectionLabel index="03">How we work</SectionLabel>
            <h2 id="about-principles-title" className="display-md about-principles-title">
              Three things we <em>hold on to</em>.
            </h2>
          </Reveal>
          <ol className="principles-grid">
            {aboutPage.principles.map((principle, index) => (
              <Reveal as="li" key={principle.title} className="principle" delay={index * 0.05}>
                <span className="principle-index">{String(index + 1).padStart(2, "0")}</span>
                <h3>{principle.title}</h3>
                <p>{principle.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="about-services paper" aria-labelledby="about-services-title">
        <div className="shell">
          <div className="about-services-grid">
            <div>
              <SectionLabel tone="dark">Commissions</SectionLabel>
              <h2 id="about-services-title" className="display-md about-services-title">
                What we <em>take on</em>.
              </h2>
              <p className="about-services-note">
                Every project begins with a conversation about what should be kept, and why.
              </p>
            </div>
            <ul className="services-list">
              {aboutPage.services.map((service, index) => (
                <li key={service}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <span>{service}</span>
                  <ArrowUpRight size={13} />
                </li>
              ))}
            </ul>
          </div>

          {site.founder.name ? (
            <div className="about-founder">
              <p className="footer-label">Studio lead</p>
              <p>
                {site.founder.name}
                {site.founder.note ? ` — ${site.founder.note}` : ""}
              </p>
            </div>
          ) : null}

          <div className="about-cta">
            <p>Available for commissions, collaborations and selected film work.</p>
            <Link href="/contact" className="big-link big-link--compact">
              <span>Start a conversation</span>
              <ArrowUpRight size={22} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
