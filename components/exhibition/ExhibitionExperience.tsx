"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ExhibitionWork } from "@/content/exhibition";
import { PhotoLightbox } from "@/components/exhibition/PhotoLightbox";
import { ArrowLeft, ArrowRight } from "@/components/ui/Icons";
import type { OrbitState } from "@/components/exhibition/ExhibitionScene";

const ExhibitionScene = dynamic(
  () => import("@/components/exhibition/ExhibitionScene"),
  { ssr: false }
);

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function ExhibitionExperience({ works }: { works: ExhibitionWork[] }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const controls = useRef<OrbitState>({ rotation: 0 });
  const pointerState = useRef({
    dragging: false,
    captured: false,
    startX: 0,
    startRotation: 0,
    distance: 0,
    pointerId: null as number | null,
  });

  const [supportsWebgl, setSupportsWebgl] = useState<boolean | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [compact, setCompact] = useState(false);
  const [inView, setInView] = useState(true);
  const [ready, setReady] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    let context: WebGLRenderingContext | WebGL2RenderingContext | null = null;
    try {
      context = canvas.getContext("webgl2") || canvas.getContext("webgl");
    } catch {
      context = null;
    }
    setSupportsWebgl(Boolean(context));

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compactQuery = window.matchMedia("(max-width: 767px)");
    const updateMotion = () => setReducedMotion(motionQuery.matches);
    const updateCompact = () => setCompact(compactQuery.matches);
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
    const node = stageRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting && document.visibilityState === "visible"),
      { threshold: 0.08 }
    );
    observer.observe(node);
    const onVisibility = () => setInView(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const handleReady = useCallback(() => setReady(true), []);

  const openWork = useCallback((index: number) => {
    if (pointerState.current.distance > 8) {
      pointerState.current.distance = 0;
      return;
    }
    setLightboxIndex(((index % works.length) + works.length) % works.length);
  }, [works.length]);

  const rotateBy = useCallback((amount: number) => {
    controls.current.rotation = clamp(controls.current.rotation + amount, -1.15, 1.15);
  }, []);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    pointerState.current.dragging = true;
    // Don't capture yet: capturing on pointer-down would retarget the pointerup
    // away from the WebGL canvas, so R3F would never fire the frame click.
    pointerState.current.captured = false;
    pointerState.current.startX = event.clientX;
    pointerState.current.startRotation = controls.current.rotation;
    pointerState.current.distance = 0;
    pointerState.current.pointerId = event.pointerId;
    setIsDragging(true);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!pointerState.current.dragging) return;
    const delta = event.clientX - pointerState.current.startX;
    pointerState.current.distance = Math.max(pointerState.current.distance, Math.abs(delta));
    // Once a real drag starts, capture so tracking continues outside the stage.
    if (!pointerState.current.captured && Math.abs(delta) > 4) {
      pointerState.current.captured = true;
      event.currentTarget.setPointerCapture?.(event.pointerId);
    }
    controls.current.rotation = clamp(
      pointerState.current.startRotation + delta * 0.0038,
      -1.15,
      1.15
    );
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!pointerState.current.dragging) return;
    pointerState.current.dragging = false;
    pointerState.current.pointerId = null;
    setIsDragging(false);
    if (
      pointerState.current.captured &&
      event.currentTarget.hasPointerCapture?.(event.pointerId)
    ) {
      event.currentTarget.releasePointerCapture?.(event.pointerId);
    }
    pointerState.current.captured = false;
    window.setTimeout(() => {
      pointerState.current.distance = 0;
    }, 0);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      rotateBy(-0.32);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      rotateBy(0.32);
    }
  };

  const showScene = supportsWebgl === true && !reducedMotion;

  return (
    <div className="exhibition-experience">
      <div
        ref={stageRef}
        className={`exhibition-stage${isDragging ? " is-dragging" : ""}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onKeyDown={onKeyDown}
        tabIndex={0}
        role="region"
        aria-label="Spatial exhibition. Drag or use the arrow buttons to turn. Select a frame to view the photograph. An accessible thumbnail index is below."
      >
        <div className="exhibition-intro">
          <p className="eyebrow eyebrow--light">
            <span className="eyebrow-index">E</span>
            <span className="eyebrow-rule" aria-hidden="true" />
            <span>Spatial exhibition</span>
          </p>
          <h1>The archive, <em>in space</em>.</h1>
          <p className="exhibition-intro-note">
            Nine photographs, arranged as prints in a dark room. Drag to look; select a frame
            to see it whole.
          </p>
        </div>

        {showScene ? (
          <div className={`exhibition-canvas${ready ? " is-ready" : ""}`} aria-hidden="true">
            <ExhibitionScene
              works={works}
              compact={compact}
              active={inView && lightboxIndex === null}
              controls={controls}
              onReady={handleReady}
              onOpen={openWork}
            />
          </div>
        ) : (
          <div className="exhibition-flat" aria-hidden="true">
            {works.map((work, index) => (
              <button
                type="button"
                key={work.id}
                className="exhibition-flat-print"
                onClick={() => openWork(index)}
                tabIndex={-1}
              >
                <Image
                  src={work.image.src}
                  alt=""
                  width={work.image.width}
                  height={work.image.height}
                  sizes="20vw"
                />
              </button>
            ))}
          </div>
        )}

        {showScene && !ready ? (
          <p className="spatial-loading" aria-live="polite">
            Preparing the room…
          </p>
        ) : null}

        {showScene ? (
          <>
            <button
              type="button"
              className="exhibition-turn exhibition-turn--left"
              onClick={() => rotateBy(-0.36)}
              aria-label="Turn left"
            >
              <ArrowLeft size={18} />
            </button>
            <button
              type="button"
              className="exhibition-turn exhibition-turn--right"
              onClick={() => rotateBy(0.36)}
              aria-label="Turn right"
            >
              <ArrowRight size={18} />
            </button>
          </>
        ) : null}

        <p className="exhibition-hint">
          {showScene
            ? "Drag to look · Select a frame · Arrow keys turn the room"
            : "Select a print to view it · Flat presentation"}
        </p>
      </div>

      <div className="exhibition-rail-wrap">
        <div className="exhibition-rail-head">
          <p className="eyebrow eyebrow--light">
            <span className="eyebrow-rule" aria-hidden="true" />
            <span>Works · {String(works.length).padStart(2, "0")}</span>
          </p>
          <p>All photographs are also available through the conventional archive.</p>
        </div>
        <ul className="exhibition-rail">
          {works.map((work, index) => (
            <li key={work.id}>
              <button
                type="button"
                className="exhibition-thumb"
                onClick={() => setLightboxIndex(index)}
                aria-label={`View ${work.projectTitle}, ${work.dateDisplay}`}
              >
                <span className="exhibition-thumb-image">
                  <Image
                    src={work.image.src}
                    alt=""
                    fill
                    sizes="88px"
                  />
                </span>
                <span className="exhibition-thumb-index">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="exhibition-thumb-title">{work.projectTitle}</span>
              </button>
            </li>
          ))}
        </ul>
        {supportsWebgl === false ? (
          <p className="exhibition-note">
            WebGL is unavailable in this browser, so the exhibition is presented as a flat
            gallery. Every photograph can still be opened.
          </p>
        ) : null}
        {reducedMotion ? (
          <p className="exhibition-note">
            Reduced motion is on. The exhibition is presented as a still gallery; the complete
            archive is also available in the index.
          </p>
        ) : null}
      </div>

      {lightboxIndex !== null ? (
        <PhotoLightbox
          works={works}
          index={lightboxIndex}
          onChange={setLightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      ) : null}
    </div>
  );
}
