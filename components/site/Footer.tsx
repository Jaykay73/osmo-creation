import Link from "next/link";
import { navigation, site } from "@/content/site";
import { ArrowUpRight } from "@/components/ui/Icons";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="shell">
        <div className="footer-top">
          <div className="footer-brand">
            <Link href="/" className="brand brand--footer" aria-label="OSMO Creation, home">
              <span className="brand-mark">OSMO</span>
              <span className="brand-sub">Creation</span>
            </Link>
            <p className="footer-statement">
              A visual archive of people, places and occasions — photographed and filmed
              with care.
            </p>
          </div>

          <nav className="footer-col" aria-label="Footer navigation">
            <p className="footer-label">Explore</p>
            <Link href="/work">Work</Link>
            <Link href="/films">Films</Link>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/exhibition">Exhibition</Link>
          </nav>

          <div className="footer-col">
            <p className="footer-label">Enquiries</p>
            <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>
            <a href={`tel:${site.contact.phoneHref}`}>{site.contact.phone}</a>
            <span>{site.contact.city}</span>
          </div>

          <div className="footer-col">
            <p className="footer-label">Elsewhere</p>
            {site.socials.map((social) => (
              <a key={social.label} href={social.href} target="_blank" rel="noreferrer">
                {social.label}
                <ArrowUpRight size={11} />
              </a>
            ))}
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {year} OSMO Creation</span>
          <span>All photographs and films © OSMO Creation</span>
          <Link href="/contact" className="footer-enquire">
            Start an enquiry <ArrowUpRight size={12} />
          </Link>
          <a href="#top" className="footer-top-link">
            Back to top ↑
          </a>
        </div>
      </div>
      <div className="footer-wordmark" aria-hidden="true">
        OSMO
      </div>
      <span className="sr-only">
        {navigation.map((item) => item.label).join(", ")}
      </span>
    </footer>
  );
}
