import "server-only";

import type { ProjectImage } from "@/lib/projects";

import { imageUrl } from "../lib/image";
import type {
  SanityImageCrop,
  SanityImageHotspot,
} from "../sanity.types";

export class ProjectContentError extends Error {
  constructor(message: string) {
    super(`Sanity project content: ${message}`);
    this.name = "ProjectContentError";
  }
}

export type ProjectQueryImage = {
  alt?: string | null;
  asset?: { _ref?: string | null } | null;
  crop?: SanityImageCrop | null;
  hotspot?: SanityImageHotspot | null;
  dimensions?: {
    width?: number | null;
    height?: number | null;
  } | null;
};

export function requiredText(
  value: string | null | undefined,
  field: string,
) {
  const normalized = value?.trim();
  if (normalized) return normalized;
  throw new ProjectContentError(`"${field}" is required.`);
}

export function optionalText(value: string | null | undefined) {
  const normalized = value?.trim();
  return normalized ? normalized : undefined;
}

export function mapProjectImage(
  image: ProjectQueryImage | null | undefined,
  field: string,
  width: number,
): ProjectImage {
  if (!image?.asset?._ref) {
    throw new ProjectContentError(`"${field}" image is required.`);
  }

  const imageWidth = image.dimensions?.width;
  const imageHeight = image.dimensions?.height;

  if (!imageWidth || !imageHeight) {
    throw new ProjectContentError(
      `"${field}" image metadata is missing. Re-upload the image.`,
    );
  }

  const hotspot = image.hotspot;
  const objectPosition =
    hotspot && typeof hotspot.x === "number" && typeof hotspot.y === "number"
      ? `${(hotspot.x * 100).toFixed(2)}% ${(hotspot.y * 100).toFixed(2)}%`
      : undefined;

  return {
    src: imageUrl(
      {
        _type: "image",
        asset: image.asset as { _ref: string; _type: "reference" },
        crop: image.crop ?? undefined,
        hotspot: hotspot ?? undefined,
      },
      width,
    ),
    alt: requiredText(image.alt, `${field}.alt`),
    ...(objectPosition ? { objectPosition } : {}),
  };
}

export function mapProjectSizedImage(
  image: ProjectQueryImage | null | undefined,
  field: string,
  width: number,
) {
  const mapped = mapProjectImage(image, field, width);
  return {
    ...mapped,
    width: image?.dimensions?.width as number,
    height: image?.dimensions?.height as number,
  };
}
