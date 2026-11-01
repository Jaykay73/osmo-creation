import Image from "next/image";
import Link from "next/link";
import { getProject } from "@/content/projects";
import { ArrowUpRight } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";

type HumanFrame = {
  slug: string;
  image: string;
  span: string;
  offset?: string;
};

const frames: HumanFrame[] = [
  { slug: "eid-2026", image: "laughing", span: "human-frame--a" },
  { slug: "dhikrullah-mueenah", image: "elder", span: "human-frame--b", offset: "human-frame--drop" },
  { slug: "global-surveyor-day-2", image: "portrait", span: "human-frame--c" },
  { slug: "jcin-unilorin-photoshoot", image: "portrait-smile", span: "human-frame--d" },
  { slug: "misturoh", image: "hands", span: "human-frame--e", offset: "human-frame--drop-small" },
  { slug: "edts-2026", image: "football", span: "human-frame--f" },
  { slug: "hikmarh", image: "reading", span: "human-frame--g" },
  { slug: "law-and-sport-week", image: "audience", span: "human-frame--h" },
];

export function HumanElement() {
  return (
    <section className="human section" aria-labelledby="human-title">
      <div className="shell">
        <div className="human-head">
          <Reveal>
            <SectionLabel index="05">The human element</SectionLabel>
            <h2 id="human-title" className="display-lg">
              People. Places.
              <br />
              <em>In-between</em> moments.
            </h2>
          </Reveal>
          <Reveal className="human-intro" delay={0.08}>
            <p>
              An archive is only as good as the people in it. These are afternoons,
              greetings, ceremonies and small exchanges — recorded as they happened, without
              smoothing the world down.
            </p>
          </Reveal>
        </div>

        <div className="human-grid">
          {frames.map((frame, index) => {
            const project = getProject(frame.slug);
            if (!project) return null;
            const image = project.media.find((item) =>
              item.src.endsWith(`/${frame.image}.jpg`)
            );
            if (!image) return null;
            return (
              <Reveal
                key={`${frame.slug}-${frame.image}`}
                className={`human-frame ${frame.span} ${frame.offset ?? ""}`}
                delay={Math.min(index * 0.04, 0.16)}
                y={22}
              >
                <Link href={`/work/${project.slug}`} className="human-link">
                  <div className="human-image media">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      sizes="(max-width: 767px) 50vw, 28vw"
                      style={{ objectPosition: "center 30%" }}
                    />
                  </div>
                  <span className="human-caption">
                    <span>{project.title}</span>
                    <ArrowUpRight size={12} />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>

        <p className="human-footnote">
          Eight frames from the 2026 archive.{" "}
          <Link href="/work" className="text-link">
            See every collection
            <ArrowUpRight />
          </Link>
        </p>
      </div>
    </section>
  );
}
