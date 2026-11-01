"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { media } from "@/lib/media";
import { ArrowUpRight } from "@/components/ui/Icons";

const chapters = [
  { word: "Before", title: "A story begins before anyone is ready.", copy: "The chairs are still empty. The fabric catches the light. In the quiet before the ceremony, a day is already becoming a memory.", image: media("/media/photography/dhikrullah-mueenah/canopy.jpg", "White chairs under a canopy dressed in pink tulle, before the ceremony."), caption: "The anticipation", position: "center 45%" },
  { word: "Within", title: "Then, the world fills the frame.", copy: "A glance. A shared silence. Two people, surrounded by everyone who brought them here. Stay close enough, and the smallest gesture tells the whole story.", image: media("/media/photography/dhikrullah-mueenah/seated-couple.jpg", "The couple seated together during their engagement ceremony."), caption: "The connection", position: "center 35%" },
  { word: "After", title: "What remains is how it felt.", copy: "The day moves on. The people gather for one more photograph. An image holds them together, long after everyone has gone home.", image: media("/media/photography/dhikrullah-mueenah/family.jpg", "The couple standing with their family after the ceremony."), caption: "The memory", position: "center 35%" },
];

export function StorySequence() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const nodes = root.current?.querySelectorAll<HTMLElement>("[data-story-step]");
    if (!nodes) return;
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.storyStep));
      }
    }, { rootMargin: "-35% 0px -35% 0px", threshold: 0 });
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={root} id="story" className="story-sequence" aria-label="One day, three chapters">
      <div className="story-sticky">
        {chapters.map((chapter, index) => (
          <div key={chapter.word} className={`story-frame${index === active ? " is-active" : ""}`} aria-hidden="true">
            <picture>
              {index === 1 ? <source media="(max-width: 767px)" srcSet="/media/textures/hero-couple.jpg" /> : null}
              <Image src={chapter.image.src} alt="" fill sizes="100vw" style={{ objectFit: "cover", objectPosition: chapter.position }} />
            </picture>
          </div>
        ))}
        <div className="story-shade" />
        <div className="story-topline shell"><span>A way of seeing</span><span>Dhikrullah &amp; Mueenah / 2026</span></div>
        <div className="story-big-word" aria-hidden="true">{chapters[active].word}<span>.</span></div>
        <nav className="story-tabs shell" aria-label="Story chapters">
          {chapters.map((chapter, index) => (
            <a href={`#story-${index}`} key={chapter.word} aria-current={active === index ? "step" : undefined}>
              <span>0{index + 1}</span>{chapter.word}<span className="story-tab-caption">{chapter.caption}</span>
            </a>
          ))}
        </nav>
      </div>
      <div className="story-steps shell">
        {chapters.map((chapter, index) => (
          <article key={chapter.word} id={`story-${index}`} data-story-step={index} className="story-step">
            <div className="story-step-copy">
              <p className="story-kicker">0{index + 1} / {chapter.caption}</p>
              <h2>{chapter.title}</h2>
              <p>{chapter.copy}</p>
              {index === 2 && <Link href="/work/dhikrullah-mueenah" className="text-link">See the complete story <ArrowUpRight /></Link>}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
