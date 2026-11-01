"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowRight } from "@/components/ui/Icons";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { HeroFallback } from "@/components/home/HeroFallback";
import { SceneBoundary } from "@/components/ui/SceneBoundary";

const HeroScene = dynamic(() => import("@/components/home/HeroScene"), {
  ssr: false,
});

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [supportsWebgl, setSupportsWebgl] = useState<boolean | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [compact, setCompact] = useState(false);
  const [active, setActive] = useState(true);
  const [ready, setReady] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compactQuery = window.matchMedia("(max-width: 767px)");
    const updateMotion = () => setReducedMotion(motionQuery.matches);
    const updateCompact = () => setCompact(compactQuery.matches);

    let canvas: HTMLCanvasElement | null = document.createElement("canvas");
    let context: WebGLRenderingContext | WebGL2RenderingContext | null = null;
    try {
      context =
        canvas.getContext("webgl2", { failIfMajorPerformanceCaveat: true }) ||
        canvas.getContext("webgl", { failIfMajorPerformanceCaveat: true });
    } catch {
      context = null;
    }
    setSupportsWebgl(Boolean(context));
    context?.getExtension("WEBGL_lose_context")?.loseContext();
    canvas = null;

    updateMotion();
    updateCompact();
    motionQuery.addEventListener("change", updateMotion);
    compactQuery.addEventListener("change", updateCompact);
    return () => {
      motionQuery.removeEventListener("change", updateMotion);
      compactQuery.removeEventListener("change", updateCompact);
    };
  }, []);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setActive(entry.isIntersecting && document.visibilityState === "visible");
      },
      { threshold: 0.05 }
    );
    observer.observe(node);
    const onVisibility = () =>
      setActive(document.visibilityState === "visible" && node.getBoundingClientRect().top < window.innerHeight && node.getBoundingClientRect().bottom > 0);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const handleReady = useCallback(() => setReady(true), []);

  const showScene = supportsWebgl === true && !reducedMotion;

  return (
    <section id="opening" ref={sectionRef} className="hero" aria-labelledby="hero-title">
      <div className="hero-ambient" aria-hidden="true" />
      <div className="hero-grid shell">
        <div className="hero-copy">
          <div className="hero-top">
            <SectionLabel index="01">Cinematography &amp; visual stories</SectionLabel>
            <p className="hero-location">Lagos, Nigeria</p>
          </div>

          <div className="hero-bottom">
            <h1 className="hero-title" id="hero-title">
              Life moves.
              <br />
              <em>Stories</em> stay
              <span className="hero-period">.</span>
            </h1>
            <p className="hero-support">
              Your wedding, your people, your next chapter.
              I make photographs and films that take you back to how it felt.
            </p>
            <div className="hero-actions">
              <a href="#story" className="cta">
                Let the story unfold
                <ArrowRight />
              </a>
              <Link href="/contact" className="text-link hero-book-link">
                Book a session <ArrowRight size={13} />
              </Link>
            </div>
            <p className="hero-commission-note">Based in Lagos · Weddings, portraits &amp; film commissions</p>
          </div>
        </div>

        <div className="hero-stage">
          <HeroFallback hidden={ready && showScene} />
          {showScene ? (
            <div className={`hero-canvas${ready ? " is-ready" : ""}`} aria-hidden="true">
              <SceneBoundary onError={() => { setSupportsWebgl(false); setReady(false); }}>
                <HeroScene compact={compact} active={active && (!paused || !ready)} onReady={handleReady} />
              </SceneBoundary>
            </div>
          ) : null}
          <div className="hero-stage-caption">
            <span>Selected frames</span>
            <span className="hero-stage-rule" aria-hidden="true" />
            <span>2026</span>
          </div>
        </div>
      </div>

      {showScene && ready ? <button className="hero-motion-toggle" type="button" onClick={() => setPaused((value) => !value)} aria-pressed={paused} aria-label={paused ? "Resume ambient animation" : "Pause ambient animation"}>{paused ? "Play motion +" : "Pause motion Ⅱ"}</button> : null}
      <a href="#story" className="hero-scroll" aria-label="Scroll to the story">
        <span>Scroll to explore</span>
        <span className="hero-scroll-line" aria-hidden="true" />
        <ArrowDown size={13} />
      </a>
    </section>
  );
}
