import { media, type MediaAsset } from "@/lib/media";

export type Film = {
  id: string;
  slug: string;
  index: string;
  title: string;
  typeLabel: string;
  description: string;
  note: string;
  src: string;
  poster: MediaAsset;
  aspect: "landscape" | "portrait";
  duration: string;
  silent: boolean;
  featured: boolean;
  order: number;
  captions?: {
    src: string;
    lang: string;
    label: string;
    default?: boolean;
  }[];
  /** Internal flag: these studies are cut from stills until the studio's own films arrive. */
  placeholder: boolean;
};

export const films: Film[] = [
  {
    id: "ceremony-study",
    slug: "ceremony-study",
    index: "01",
    title: "Ceremony",
    typeLabel: "Motion study",
    description:
      "Pink tulle, a long red table, hands in the shade. A quiet study of the wait around a ceremony, cut from the stills archive.",
    note: "A silent study — no dialogue, no music. Sound will return when the studio's own films are ingested.",
    src: "/media/video/study-ceremony.mp4",
    poster: media(
      "/media/posters/study-ceremony.jpg",
      "A couple at their engagement, seen through a slow cinematic frame."
    ),
    aspect: "landscape",
    duration: "00:10",
    silent: true,
    featured: true,
    order: 1,
    placeholder: true,
  },
  {
    id: "light-study",
    slug: "light-study",
    index: "02",
    title: "Light",
    typeLabel: "Motion study",
    description:
      "A portrait in shadow and sun. An exercise in holding still while the light moves.",
    note: "A silent study — no dialogue, no music.",
    src: "/media/video/study-light.mp4",
    poster: media(
      "/media/posters/study-light.jpg",
      "A portrait study in warm daylight, framed vertically."
    ),
    aspect: "portrait",
    duration: "00:10",
    silent: true,
    featured: true,
    order: 2,
    placeholder: true,
  },
  {
    id: "gathering-study",
    slug: "gathering-study",
    index: "03",
    title: "Gathering",
    typeLabel: "Motion study",
    description:
      "Children, volunteers, a field, a day that keeps moving. A study of people sharing the same ground.",
    note: "A silent study — no dialogue, no music.",
    src: "/media/video/study-gathering.mp4",
    poster: media(
      "/media/posters/study-gathering.jpg",
      "A community gathering on an open field."
    ),
    aspect: "landscape",
    duration: "00:10",
    silent: true,
    featured: true,
    order: 3,
    placeholder: true,
  },
];

export const featuredFilms = films.filter((film) => film.featured);

export function getFilm(slug: string) {
  return films.find((film) => film.slug === slug);
}

export function getRelatedFilms(slug: string, limit = 2) {
  return films.filter((film) => film.slug !== slug).slice(0, limit);
}
