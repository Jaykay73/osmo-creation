"use client";

import Image from "next/image";
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { MediaAsset } from "@/lib/media";
import { Reveal } from "@/components/ui/Reveal";
import { PhotoLightbox } from "@/components/exhibition/PhotoLightbox";

const OpenPhotograph = createContext<(index: number) => void>(() => {});

type Block =
  | { kind: "full"; items: MediaAsset[]; start: number }
  | { kind: "pair"; items: MediaAsset[]; start: number }
  | { kind: "trio"; items: MediaAsset[]; start: number }
  | { kind: "offset"; items: MediaAsset[]; start: number; side: "left" | "right" };

function buildBlocks(items: MediaAsset[]): Block[] {
  const blocks: Block[] = [];
  let index = 0;
  let step = 0;
  let offsetCount = 0;

  while (index < items.length) {
    const current = items[index];
    if (step === 0) {
      if (current.orientation === "landscape") {
        blocks.push({ kind: "full", items: [current], start: index });
        index += 1;
      } else {
        blocks.push({
          kind: "offset",
          items: [current],
          start: index,
          side: offsetCount++ % 2 === 0 ? "right" : "left",
        });
        index += 1;
      }
    } else if (step === 1 && index + 1 < items.length) {
      blocks.push({ kind: "pair", items: [items[index], items[index + 1]], start: index });
      index += 2;
    } else if (step === 2) {
      blocks.push({
        kind: "offset",
        items: [current],
        start: index,
        side: offsetCount++ % 2 === 0 ? "left" : "right",
      });
      index += 1;
    } else if (step === 3 && index + 2 < items.length) {
      blocks.push({
        kind: "trio",
        items: [items[index], items[index + 1], items[index + 2]],
        start: index,
      });
      index += 3;
    } else if (step === 4) {
      if (current.orientation === "landscape") {
        blocks.push({ kind: "full", items: [current], start: index });
      } else {
        blocks.push({
          kind: "offset",
          items: [current],
          start: index,
          side: offsetCount++ % 2 === 0 ? "right" : "left",
        });
      }
      index += 1;
    } else if (step === 5 && index + 1 < items.length) {
      blocks.push({ kind: "pair", items: [items[index], items[index + 1]], start: index });
      index += 2;
    } else {
      blocks.push({
        kind: "offset",
        items: [current],
        start: index,
        side: offsetCount++ % 2 === 0 ? "right" : "left",
      });
      index += 1;
    }
    step = (step + 1) % 7;
  }

  return blocks;
}

function Frame({
  item,
  index,
  total,
  sizes,
  caption = false,
}: {
  item: MediaAsset;
  index: number;
  total: number;
  sizes: string;
  caption?: boolean;
}) {
  const open = useContext(OpenPhotograph);
  return (
    <figure className="essay-figure">
      <button type="button" className="essay-zoom" onClick={() => open(index)} aria-label={`View photograph ${index + 1} full size: ${item.alt}`}>
      <Image
        src={item.src}
        alt={item.alt}
        width={item.width}
        height={item.height}
        sizes={sizes}
        style={{ width: "100%", height: "auto" }}
      />
      <span className="essay-zoom-label" aria-hidden="true">View photograph +</span>
      </button>
      <figcaption className="essay-caption">
        <span className="essay-caption-number">
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
        {caption && item.caption ? <span>{item.caption}</span> : null}
      </figcaption>
    </figure>
  );
}

export function ProjectGallery({ media, title, slug, dateDisplay, typeLabel }: { media: MediaAsset[]; title: string; slug: string; dateDisplay: string; typeLabel: string }) {
  const blocks = buildBlocks(media);
  const [active, setActive] = useState<number | null>(null);
  const close = useCallback(() => setActive(null), []);
  const works = useMemo(() => media.map((image) => ({ id: image.src, image, texture: image.src, projectSlug: slug, projectTitle: title, dateDisplay, typeLabel })), [media, slug, title, dateDisplay, typeLabel]);

  return (
    <OpenPhotograph.Provider value={setActive}>
    <section className="essay" aria-label={`${title} — image sequence`}>
      {blocks.map((block, blockIndex) => {
        if (block.kind === "full") {
          return (
            <div className="essay-full" key={`full-${block.start}`}>
              <Reveal y={18}>
                <Frame
                  item={block.items[0]}
                  index={block.start}
                  total={media.length}
                  sizes="100vw"
                />
              </Reveal>
            </div>
          );
        }

        if (block.kind === "pair") {
          return (
            <div className="shell" key={`pair-${block.start}`}>
              <Reveal className="essay-pair">
                {block.items.map((item, position) => (
                  <Frame
                    key={item.src}
                    item={item}
                    index={block.start + position}
                    total={media.length}
                    sizes="(max-width: 767px) 100vw, 46vw"
                  />
                ))}
              </Reveal>
            </div>
          );
        }

        if (block.kind === "trio") {
          return (
            <div className="shell" key={`trio-${block.start}`}>
              <Reveal className="essay-trio">
                {block.items.map((item, position) => (
                  <Frame
                    key={item.src}
                    item={item}
                    index={block.start + position}
                    total={media.length}
                    sizes="(max-width: 767px) 50vw, 30vw"
                  />
                ))}
              </Reveal>
            </div>
          );
        }

        return (
          <div className="shell" key={`offset-${block.start}`}>
            <Reveal className={`essay-offset essay-offset--${block.side}`}>
              <div className="essay-offset-media">
                <Frame
                  item={block.items[0]}
                  index={block.start}
                  total={media.length}
                  sizes="(max-width: 767px) 100vw, 62vw"
                  caption
                />
              </div>
              <aside className="essay-offset-aside" aria-hidden="true">
                <span className="essay-offset-index">
                  {String(blockIndex + 1).padStart(2, "0")}
                </span>
                <span className="essay-offset-rule" />
                <p>From the collection</p>
              </aside>
            </Reveal>
          </div>
        );
      })}
    </section>
    {active !== null ? <PhotoLightbox works={works} index={active} onChange={setActive} onClose={close} /> : null}
    </OpenPhotograph.Provider>
  );
}
