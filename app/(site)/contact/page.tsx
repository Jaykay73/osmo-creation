import type { Metadata } from "next";
import { contactPage, site } from "@/content/site";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { ArrowUpRight } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";

export const metadata: Metadata = {
  title: "Enquiries",
  description:
    "Enquire with OSMO Creation about portrait sessions, weddings, events, editorial work and film projects. Email salakoolashubomi@gmail.com or use the enquiry form.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Enquiries — OSMO Creation",
    description:
      "Enquire with OSMO Creation about portrait sessions, weddings, events, editorial work and film projects.",
    url: "/contact",
  },
};

export default function ContactPage() {
  return (
    <div className="contact-page">
      <header className="contact-hero">
        <div className="shell contact-grid">
          <div className="contact-intro">
            <Reveal>
              <SectionLabel index="C">Enquiries</SectionLabel>
              <h1 className="page-title contact-title">
                Let’s make
                <br />
                it <em>yours</em>.
              </h1>
            </Reveal>
            <Reveal className="contact-body" delay={0.08}>
              <p>{contactPage.intro}</p>
            </Reveal>

            <Reveal className="contact-details" delay={0.12}>
              <div className="contact-detail-group">
                <span className="contact-detail-label">Email</span>
                <a href={`mailto:${site.contact.email}`} className="contact-detail-link">
                  {site.contact.email}
                </a>
                <a href={`tel:${site.contact.phoneHref}`} className="contact-detail-link">
                  {site.contact.phone}
                </a>
              </div>
              <div className="contact-detail-group">
                <span className="contact-detail-label">Studio</span>
                <p>{site.contact.address}</p>
              </div>
              <div className="contact-detail-group">
                <span className="contact-detail-label">Elsewhere</span>
                <div className="contact-socials">
                  {site.socials.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {social.label} <ArrowUpRight size={11} />
                    </a>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal className="contact-form-panel paper" delay={0.06} y={30}>
            <div className="contact-form-head">
              <SectionLabel index="01" tone="dark">
                Project enquiry
              </SectionLabel>
              <p>
                Share your date and a little about your story. This is a booking enquiry;
                we’ll confirm the details and availability with you directly.
              </p>
            </div>
            <EnquiryForm />
          </Reveal>
        </div>
      </header>

      <section className="contact-foot" aria-labelledby="contact-foot-title">
        <div className="shell">
          <div className="contact-foot-grid">
            <div>
              <SectionLabel index="02">Working together</SectionLabel>
              <h2 id="contact-foot-title" className="display-md">
                A clear brief,
                <br />a calm <em>process</em>.
              </h2>
            </div>
            <div className="contact-foot-list">
              <div>
                <span>01</span>
                <div>
                  <h3>Send the essentials</h3>
                  <p>What is happening, where, and roughly when.</p>
                </div>
              </div>
              <div>
                <span>02</span>
                <div>
                  <h3>We reply directly</h3>
                  <p>A conversation about scope, sequence and what should be kept.</p>
                </div>
              </div>
              <div>
                <span>03</span>
                <div>
                  <h3>We make the work</h3>
                  <p>Photography, film, or both — with the archive in mind.</p>
                </div>
              </div>
            </div>
          </div>
          <p className="contact-foot-note">
            For print requests, licensing, full gallery access or press, please use the same
            email and note the collection name.
          </p>
        </div>
      </section>
    </div>
  );
}
