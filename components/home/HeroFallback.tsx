import Image from "next/image";
import { media } from "@/lib/media";

const prints = [
  {
    src: "/media/textures/hero-couple.jpg",
    alt: "",
    className: "hero-print hero-print--main",
    priority: true,
  },
  {
    src: "/media/textures/hero-bride.jpg",
    alt: "",
    className: "hero-print hero-print--bride",
    priority: false,
  },
  {
    src: "/media/textures/hero-children.jpg",
    alt: "",
    className: "hero-print hero-print--children",
    priority: false,
  },
  {
    src: "/media/textures/hero-microphone.jpg",
    alt: "",
    className: "hero-print hero-print--mic",
    priority: false,
  },
  {
    src: "/media/textures/hero-jcin.jpg",
    alt: "",
    className: "hero-print hero-print--group",
    priority: false,
  },
];

export function HeroFallback({ hidden = false }: { hidden?: boolean }) {
  return (
    <div
      className={`hero-fallback${hidden ? " is-hidden" : ""}`}
      aria-hidden="true"
      data-hero-fallback
    >
      {prints.map((print) => {
        const asset = media(print.src, "");
        return (
          <figure key={print.src} className={print.className}>
            <Image
              src={asset.src}
              alt={print.alt}
              width={asset.width}
              height={asset.height}
              sizes="(max-width: 767px) 38vw, 22vw"
              priority={print.priority}
            />
          </figure>
        );
      })}
    </div>
  );
}
