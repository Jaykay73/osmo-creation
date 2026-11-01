"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { navigation, site } from "@/content/site";
import { ArrowUpRight, CloseIcon } from "@/components/ui/Icons";

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.classList.add("menu-open");
    closeRef.current?.focus({ preventScroll: true });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter((element) => element.offsetParent !== null);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      document.body.classList.remove("menu-open");
    };
  }, [open, close]);

  return (
    <>
      <header
        className={`site-header${scrolled ? " is-scrolled" : ""}${open ? " is-menu-open" : ""}`}
      >
        <div className="shell header-inner">
          <Link href="/" className="brand" aria-label="OSMO Creation, home" onClick={close}>
            <span className="brand-mark">OSMO</span>
            <span className="brand-sub">Creation</span>
          </Link>

          <nav className="desktop-nav" aria-label="Primary">
            {navigation.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-link${item.href === "/contact" ? " nav-book" : ""}`}
                  aria-current={active ? "page" : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <Link href="/contact" className="header-mobile-book">Book a session <ArrowUpRight size={12} /></Link>

          <button
            ref={triggerRef}
            type="button"
            className="menu-toggle"
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen((value) => !value)}
          >
            <span>{open ? "Close" : "Menu"}</span>
            <span className="menu-toggle-icon" aria-hidden="true">
              <i />
              <i />
            </span>
          </button>
        </div>
      </header>

      {open ? (
        <div
          id="site-menu"
          ref={dialogRef}
          className="menu-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
        >
          <div className="menu-overlay-inner shell">
            <div className="menu-overlay-top">
              <p className="eyebrow eyebrow--light">
                <span className="eyebrow-rule" aria-hidden="true" />
                <span>Index</span>
              </p>
              <button
                ref={closeRef}
                type="button"
                className="menu-close"
                onClick={close}
                aria-label="Close menu"
              >
                <span>Close</span>
                <CloseIcon size={20} />
              </button>
            </div>

            <nav className="menu-nav" aria-label="Menu">
              {navigation.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="menu-link"
                  aria-current={isActive(pathname, item.href) ? "page" : undefined}
                  style={{ animationDelay: `${90 + index * 70}ms` }}
                >
                  <span className="menu-link-index">0{index + 1}</span>
                  <span className="menu-link-label">{item.label}</span>
                  <ArrowUpRight size={22} />
                </Link>
              ))}
            </nav>

            <div className="menu-overlay-foot">
              <div>
                <p className="menu-foot-label">Enquiries</p>
                <a href={`mailto:${site.contact.email}`} className="menu-foot-link">
                  {site.contact.email}
                </a>
                <a href={`tel:${site.contact.phoneHref}`} className="menu-foot-link">
                  {site.contact.phone}
                </a>
              </div>
              <div>
                <p className="menu-foot-label">Elsewhere</p>
                {site.socials.slice(0, 3).map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className="menu-foot-link"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {social.label} ↗
                  </a>
                ))}
              </div>
              <div className="menu-foot-meta">
                <p className="menu-foot-label">Studio</p>
                <p>{site.contact.city}</p>
                <Link href="/exhibition" className="menu-foot-link">
                  Enter the exhibition ↗
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
