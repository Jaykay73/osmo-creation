import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "@/components/ui/Icons";

export function ExhibitionInvite() {
  return <section className="exhibition-invite shell" aria-labelledby="exhibition-invite-title">
    <div className="exhibition-preview" aria-hidden="true">
      {["hero-dua", "hero-couple", "hero-children"].map((name, index) => <div key={name} className={`exhibition-preview-print exhibition-preview-print--${index}`}><Image src={`/media/textures/${name}.jpg`} alt="" fill sizes="(max-width: 767px) 30vw, 18vw" style={{ objectFit: "cover" }} /></div>)}
      <span className="exhibition-floor" />
    </div>
    <div className="exhibition-invite-copy">
      <p className="eyebrow">An invitation to linger</p>
      <h2 id="exhibition-invite-title">Step inside<br />the <em>frame</em>.</h2>
      <p>Nine photographs. A room of your own. Explore a spatial exhibition at your own pace, and get a little closer to the work.</p>
      <Link href="/exhibition" className="cta">Enter the exhibition <ArrowUpRight /></Link>
      <span className="exhibition-invite-note">Drag to look around · Select a photograph to explore</span>
    </div>
  </section>;
}
