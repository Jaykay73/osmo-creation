"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ExhibitionWork } from "@/content/exhibition";
import { PhotoLightbox } from "@/components/exhibition/PhotoLightbox";
import { SceneBoundary } from "@/components/ui/SceneBoundary";
import { ArrowUpRight } from "@/components/ui/Icons";

const ExhibitionScene = dynamic(() => import("@/components/exhibition/ExhibitionScene"), { ssr: false });

export function HomeGallery({ works }: { works: ExhibitionWork[] }) {
  const root = useRef<HTMLElement>(null);
  const controls = useRef({ rotation: -Math.PI * .46 });
  const [near, setNear] = useState(false);
  const [visible, setVisible] = useState(false);
  const [supported, setSupported] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [compact, setCompact] = useState(false);
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState(0);
  const [photo, setPhoto] = useState<number | null>(null);
  const handleReady = useCallback(() => setReady(true), []);
  const close = useCallback(() => setPhoto(null), []);

  useEffect(() => {
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const mobile = matchMedia("(max-width: 767px)");
    const update = () => { setReduced(motion.matches); setCompact(mobile.matches); };
    update();
    motion.addEventListener("change", update);
    mobile.addEventListener("change", update);
    const canvas = document.createElement("canvas");
    try {
      const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
      setSupported(Boolean(gl));
      gl?.getExtension("WEBGL_lose_context")?.loseContext();
    } catch { setSupported(false); }
    return () => { motion.removeEventListener("change", update); mobile.removeEventListener("change", update); };
  }, []);

  useEffect(() => {
    if (!root.current) return;
    const node = root.current;
    const preload = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setNear(true); }, { rootMargin: "500px" });
    const update = () => {
      const rect = node.getBoundingClientRect();
      setVisible(document.visibilityState === "visible" && rect.top < innerHeight && rect.bottom > 0);
      const progress = Math.min(1, Math.max(0, -rect.top / Math.max(1, rect.height - innerHeight)));
      const spread = Math.PI * (compact ? .75 : .92);
      controls.current.rotation = spread * (progress - .5);
      setActive(Math.round(progress * (works.length - 1)));
    };
    preload.observe(node);
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    document.addEventListener("visibilitychange", update);
    return () => { preload.disconnect(); window.removeEventListener("scroll", update); window.removeEventListener("resize", update); document.removeEventListener("visibilitychange", update); };
  }, [compact, works.length]);

  const spatial = supported && !reduced;
  const jump = (index: number) => {
    const node = root.current;
    if (!node) return;
    const top = node.getBoundingClientRect().top + scrollY;
    window.scrollTo({ top: top + index / Math.max(1, works.length - 1) * (node.offsetHeight - innerHeight), behavior: reduced ? "instant" : "smooth" });
  };

  return <section ref={root} id="in-the-frame" className={`home-gallery${spatial ? " is-spatial" : " is-flat"}`} aria-labelledby="home-gallery-title">
    <div className="home-gallery-sticky">
      <div className="home-gallery-heading shell">
        <div><p className="eyebrow">A few moments I keep coming back to</p><h2 id="home-gallery-title">Come a little <em>closer</em>.</h2></div>
        <p>{spatial ? "Keep scrolling. The room moves with you." : "Take your time. Swipe through the photographs."}<br />Select a frame to see its story.</p>
      </div>
      <div className={`home-gallery-room${ready && spatial ? " is-ready" : ""}`}>
        <div className="home-gallery-stills" aria-hidden={ready && spatial} inert={ready && spatial}>
          {works.map((work, index) => <button key={work.id} type="button" onClick={() => setPhoto(index)} aria-label={`View ${work.projectTitle}: ${work.image.alt}`}><Image src={work.texture} alt={work.image.alt} width={500} height={650} sizes="(max-width: 767px) 70vw, 28vw" /><span>{String(index + 1).padStart(2, "0")} / {work.projectTitle}</span></button>)}
        </div>
        {spatial && near ? <div className="home-gallery-canvas" aria-hidden="true"><SceneBoundary onError={() => { setSupported(false); setReady(false); }}><ExhibitionScene works={works} compact={compact} showAll active={visible && photo === null} controls={controls} onReady={handleReady} onOpen={setPhoto} /></SceneBoundary></div> : null}
      </div>
      <div className="home-gallery-foot shell">
        {spatial ? <div className="home-gallery-current"><span>{String(active + 1).padStart(2, "0")} / {String(works.length).padStart(2, "0")}</span><button type="button" onClick={() => setPhoto(active)}>{works[active].projectTitle} <ArrowUpRight size={14} /></button><div className="home-gallery-dots" role="group" aria-label="Choose a photograph">{works.map((work, index) => <button key={work.id} type="button" aria-label={`Scroll to ${work.projectTitle}`} aria-pressed={index === active} onClick={() => jump(index)} />)}</div></div> : <p>People, places, and the feeling of being there.</p>}
      </div>
    </div>
    {photo !== null ? <PhotoLightbox works={works} index={photo} onChange={setPhoto} onClose={close} /> : null}
  </section>;
}
