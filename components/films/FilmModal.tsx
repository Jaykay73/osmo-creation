"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import type { Film } from "@/content/films";
import { VideoPlayer } from "@/components/films/VideoPlayer";
import { CloseIcon } from "@/components/ui/Icons";

export function FilmModal({ film, onClose }: { film: Film; onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus({ preventScroll: true });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
      if (event.key === "Tab" && dialogRef.current) {
        const elements = Array.from(dialogRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], input:not([disabled]), [tabindex="0"]')).filter((node) => node.offsetParent !== null);
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
  }, [onClose]);

  return createPortal(
    <div
      className="film-modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        className={`film-modal film-modal--${film.aspect}`}
        role="dialog"
        aria-modal="true"
        aria-label={`${film.title} — film player`}
      >
        <button
          ref={closeRef}
          type="button"
          className="film-modal-close"
          onClick={onClose}
          aria-label="Close player"
        >
          <CloseIcon size={20} />
          <span>Close</span>
        </button>
        <VideoPlayer film={film} onClose={onClose} />
      </div>
    </div>,
    document.body
  );
}
