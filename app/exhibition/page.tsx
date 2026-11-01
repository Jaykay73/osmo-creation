import type { Metadata } from "next";
import Link from "next/link";
import { exhibitionWorks } from "@/content/exhibition";
import { ExhibitionExperience } from "@/components/exhibition/ExhibitionExperience";
import { ArrowUpRight } from "@/components/ui/Icons";

export const metadata: Metadata = {
  title: "Spatial Exhibition",
  description:
    "An optional spatial exhibition of nine photographs from the OSMO Creation archive — arranged as prints in a dark room.",
  alternates: { canonical: "/exhibition" },
  openGraph: {
    title: "Spatial Exhibition — OSMO Creation",
    description:
      "An optional spatial exhibition of nine photographs from the OSMO Creation archive.",
    url: "/exhibition",
    images: [
      {
        url: exhibitionWorks[0].image.src,
        width: exhibitionWorks[0].image.width,
        height: exhibitionWorks[0].image.height,
        alt: exhibitionWorks[0].image.alt,
      },
    ],
  },
};

export default function ExhibitionPage() {
  return (
    <div className="exhibition-page">
      <header className="exhibition-bar">
        <Link href="/" className="brand brand--exhibition" aria-label="OSMO Creation, home">
          <span className="brand-mark">OSMO</span>
          <span className="brand-sub">Creation</span>
        </Link>
        <p className="exhibition-bar-title">Spatial exhibition</p>
        <nav className="exhibition-bar-nav" aria-label="Exhibition navigation">
          <Link href="/work">
            Index view <ArrowUpRight size={12} />
          </Link>
          <Link href="/" className="exhibition-exit">
            Exit
          </Link>
        </nav>
      </header>
      <main id="main" className="exhibition-main">
        <ExhibitionExperience works={exhibitionWorks} />
      </main>
    </div>
  );
}
