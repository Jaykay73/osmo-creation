import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "@/components/ui/Icons";

export function BookingSection() {
  return (
    <section id="work-together" className="booking-note" aria-labelledby="booking-title">
      <div className="booking-note-image">
        <Image src="/media/photography/dhikrullah-mueenah/couple-portrait.jpg" alt="A quiet moment shared by a couple at their engagement." fill sizes="(max-width: 767px) 100vw, 50vw" style={{ objectFit: "cover", objectPosition: "center 35%" }} />
        <span className="booking-note-image-caption">A day passes. A feeling stays.</span>
      </div>
      <div className="booking-note-copy">
        <p className="eyebrow">You, through my lens</p>
        <h2 id="booking-title">Let’s make<br />something <em>personal.</em></h2>
        <p>A day you’ve been waiting for. Someone you love. A story only you can tell. I’d love to be there to capture it.</p>
        <Link href="/contact" className="booking-note-cta">Tell me about your plans <ArrowUpRight size={18} /></Link>
        <div className="booking-note-types" aria-label="Enquire by session type">
          <Link className="booking-option" href="/contact?type=Wedding%20or%20engagement">Weddings</Link>
          <span aria-hidden="true">/</span>
          <Link className="booking-option" href="/contact?type=Portrait%20session">Portraits</Link>
          <span aria-hidden="true">/</span>
          <Link className="booking-option" href="/contact?type=Film%20or%20documentary">Films</Link>
        </div>
      </div>
    </section>
  );
}
