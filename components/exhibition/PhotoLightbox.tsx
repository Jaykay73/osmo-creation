"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import type { ExhibitionWork } from "@/content/exhibition";
import { ArrowLeft, ArrowRight, ArrowUpRight, CloseIcon } from "@/components/ui/Icons";

export function PhotoLightbox({
  works,
  index,
  onChange,
  onClose,
}: {
  works: ExhibitionWork[];
  index: number;
  onChange: (index: number) => void;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const work = works[index];

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus({ preventScroll: true });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        onChange((index - 1 + works.length) % works.length);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        onChange((index + 1) % works.length);
      }
      if (event.key === "Tab" && dialogRef.current) {
        const elements = Array.from(dialogRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), a[href]')).filter((node) => node.offsetParent !== null);
        const first = elements[0];
        const last = elements[elements.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.({ preventScroll: true });
    };
  }, [index, onChange, onClose, works.length]);

  if (!work) return null;

  return createPortal(
    <div
      className="photo-lightbox"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        className="photo-lightbox-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="photo-lightbox-title"
      >
        <div className="photo-lightbox-bar">
          <span className="photo-lightbox-index">
            {String(index + 1).padStart(2, "0")} / {String(works.length).padStart(2, "0")}
          </span>
          <button
            ref={closeRef}
            type="button"
            className="photo-lightbox-close"
            onClick={onClose}
            aria-label="Close photograph"
          >
            <CloseIcon size={20} />
            <span>Close</span>
          </button>
        </div>

        <div className="photo-lightbox-stage">
          <button
            type="button"
            className="photo-lightbox-arrow photo-lightbox-arrow--left"
            onClick={() => onChange((index - 1 + works.length) % works.length)}
            aria-label="Previous photograph"
          >
            <ArrowLeft size={18} />
          </button>

          <figure className="photo-lightbox-figure">
            <Image
              src={work.image.src}
              alt={work.image.alt}
              width={work.image.width}
              height={work.image.height}
              sizes="92vw"
              priority
            />
            <figcaption>
              <div>
                <h2 id="photo-lightbox-title">{work.projectTitle}</h2>
                <p>{work.image.alt}</p>
              </div>
              <div className="photo-lightbox-meta">
                <span>{work.typeLabel}</span>
                <span>{work.dateDisplay}</span>
                <Link href={`/work/${work.projectSlug}`}>
                  Open project <ArrowUpRight size={12} />
                </Link>
              </div>
            </figcaption>
          </figure>

          <button
            type="button"
            className="photo-lightbox-arrow photo-lightbox-arrow--right"
            onClick={() => onChange((index + 1) % works.length)}
            aria-label="Next photograph"
          >
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
