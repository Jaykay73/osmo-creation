import manifest from "@/content/media-manifest.json";

type ManifestEntry = {
  width: number;
  height: number;
  orientation: "landscape" | "portrait" | "square";
};

const mediaManifest = manifest as Record<string, ManifestEntry>;

export type MediaAsset = {
  src: string;
  alt: string;
  width: number;
  height: number;
  orientation: "landscape" | "portrait" | "square";
  caption?: string;
};

/**
 * Resolve an image's intrinsic dimensions from the generated media manifest.
 * Run `npm run media:manifest` after adding or replacing files.
 */
export function media(src: string, alt: string, caption?: string): MediaAsset {
  const entry = mediaManifest[src];
  if (!entry) {
    throw new Error(
      `Missing media manifest entry for ${src}. Run "npm run media:manifest" after adding files.`
    );
  }
  return {
    src,
    alt,
    caption,
    width: entry.width,
    height: entry.height,
    orientation: entry.orientation,
  };
}

export function aspectRatio(asset: Pick<MediaAsset, "width" | "height">) {
  return `${asset.width} / ${asset.height}`;
}
