"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const chapters = [
  { id: "opening", label: "Opening" },
  { id: "story", label: "A way of seeing" },
  { id: "studio", label: "The approach" },
  { id: "in-the-frame", label: "Through my lens" },
  { id: "work-together", label: "Book a session" },
  { id: "selected-work", label: "Selected stories" },
  { id: "motion", label: "Moving images" },
  { id: "next-story", label: "Your story" },
];

export function ChapterNav() {
  const [active, setActive] = useState("opening");
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    const update = () => {
      const cursor = window.innerHeight * 0.45;
      let current = chapters[0].id;
      chapters.forEach(({ id }) => {
        const element = document.getElementById(id);
        if (element && element.getBoundingClientRect().top <= cursor) current = id;
      });
      setActive(current);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);
  if (!mounted) return null;
  return createPortal(<nav className="chapter-nav" aria-label="Explore the portfolio">
    {chapters.map(({ id, label }, index) => <a key={id} href={`#${id}`} aria-label={`${index + 1}. ${label}`} aria-current={id === active ? "location" : undefined}><span className="chapter-nav-label">{label}</span><span className="chapter-nav-dot" /></a>)}
  </nav>, document.body);
}
