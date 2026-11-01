import Image from "next/image";
import Link from "next/link";
import { media } from "@/lib/media";
import { studioStatement } from "@/content/site";
import { ArrowUpRight } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";

const portrait = media(
  "/media/photography/misturoh/profile.jpg",
  "A portrait from behind, a hoop earring visible against patterned tiles."
);
const detail = media(
  "/media/photography/dhikrullah-mueenah/conversation.jpg",
  "Two women in pink hijabs speaking in the shade."
);

export function Intro() {
  return (
    <section id="studio" className="intro paper" aria-labelledby="intro-title">
      <div className="shell">
        <Reveal>
          <SectionLabel index="02" tone="dark">
            Behind the camera
          </SectionLabel>
        </Reveal>

        <div className="intro-grid">
          <Reveal className="intro-quote-wrap">
            <h2 id="intro-title" className="intro-quote">
              I want you to remember
              <br />
              how it <em>felt</em>.
            </h2>
          </Reveal>

          <Reveal className="intro-copy" delay={0.08}>
            {studioStatement.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
            <Link href="/about" className="text-link text-link--dark">
              A little more about my approach
              <ArrowUpRight />
            </Link>
          </Reveal>
        </div>

        <div className="intro-collage">
          <Reveal className="intro-figure intro-figure--portrait" y={32}>
            <figure>
              <div className="print-frame portrait-print">
                <Image
                  src={portrait.src}
                  alt={portrait.alt}
                  width={portrait.width}
                  height={portrait.height}
                  sizes="(max-width: 767px) 55vw, 25vw"
                  style={{ width: "100%", height: "auto" }}
                />
              </div>
              <figcaption>
                <span>From the archive</span>
                <span>Misturoh, 2026</span>
              </figcaption>
            </figure>
          </Reveal>

          <Reveal className="intro-note" delay={0.1}>
            <p className="intro-note-mark" aria-hidden="true">
              “
            </p>
            <p>
              My favourite part is when you forget the camera is there. That’s when the
              photographs start to feel like you.
            </p>
            <span className="intro-note-sign">OSMO Creation</span>
          </Reveal>

          <Reveal className="intro-figure intro-figure--detail" delay={0.16} y={32}>
            <figure>
              <Image
                src={detail.src}
                alt={detail.alt}
                width={detail.width}
                height={detail.height}
                sizes="(max-width: 767px) 42vw, 20vw"
                style={{ width: "100%", height: "auto" }}
              />
              <figcaption>
                <span>Before the ceremony</span>
                <span>22 Aug 2026</span>
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
