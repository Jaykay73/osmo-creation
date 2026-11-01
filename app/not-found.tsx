import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ArrowRight } from "@/components/ui/Icons";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main">
        <section className="state-page shell">
          <span className="state-code">Error 404</span>
          <h1>
            This frame
            <br />
            isn’t in the <em>archive</em>.
          </h1>
          <p>
            The page you were looking for may have moved, or never existed. Return to the
            archive and keep looking.
          </p>
          <div style={{ display: "flex", gap: 26, flexWrap: "wrap", marginTop: 30 }}>
            <Link href="/work" className="cta">
              Enter the archive
              <ArrowRight />
            </Link>
            <Link href="/" className="text-link">
              Return home
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
