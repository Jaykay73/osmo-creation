import Image from "next/image";
import Link from "next/link";
import { media } from "@/lib/media";
import { site } from "@/content/site";
import { ArrowUpRight } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";

const closingImage = media(
  "/media/photography/edts-2026/children.jpg",
  "A group of smiling children with volunteers at a community outreach."
);

export function Closing() {
  return (
    <section id="next-story" className="closing" aria-labelledby="closing-title">
      <div className="closing-media">
        <Image
          src={closingImage.src}
          alt=""
          fill
          sizes="100vw"
          style={{ objectPosition: "center 30%" }}
        />
      </div>
      <div className="closing-scrim" aria-hidden="true" />
      <div className="shell closing-inner">
        <Reveal className="closing-copy">
          <SectionLabel index="06">Your turn</SectionLabel>
          <h2 id="closing-title" className="closing-title">
            I’d love to tell
            <br />
            <em>your story</em>.
          </h2>
          <p className="closing-support">
            Tell me about your day, your people, and the moments you don’t want to lose.
            Let’s make something you’ll want to come back to.
          </p>
          <Link href="/contact" className="closing-cta">
            <span>Enquire about your date</span>
            <ArrowUpRight size={20} />
          </Link>
        </Reveal>
        <div className="closing-meta">
          <div>
            <span className="closing-label">Write</span>
            <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>
          </div>
          <div>
            <span className="closing-label">Call</span>
            <a href={`tel:${site.contact.phoneHref}`}>{site.contact.phone}</a>
          </div>
          <div>
            <span className="closing-label">Studio</span>
            <span>{site.contact.city}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
