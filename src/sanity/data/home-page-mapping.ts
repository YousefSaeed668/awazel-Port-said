import "server-only";

import type { HomePageContent } from "@/lib/data";
import { resolveDestination } from "@/lib/links";

import { imageUrl } from "../lib/image";
import type { HOME_PAGE_QUERY_RESULT } from "../sanity.types";

type QueryDocument = NonNullable<HOME_PAGE_QUERY_RESULT>;

export type QueryHero = NonNullable<QueryDocument["hero"]>;
export type QueryCompany = NonNullable<QueryDocument["company"]>;
export type QueryWorkStages = NonNullable<QueryDocument["workStages"]>;
export type QueryQuality = NonNullable<QueryDocument["quality"]>;
export type QueryFaq = NonNullable<QueryDocument["faq"]>;
export type QueryImage = QueryHero["image"];
export type QueryAction = QueryHero["primaryAction"];
export type QueryHeading = QueryWorkStages["heading"];

export type ActionValue = NonNullable<HomePageContent["hero"]["primaryAction"]>;
export type SectionHeadingValue = HomePageContent["workStages"]["heading"];

export class HomePageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "HomePageError";
  }
}

export function requiredText(value: string | null | undefined, field: string) {
  const normalized = value?.trim();
  if (!normalized) {
    throw new HomePageError(
      `Sanity homepage content is incomplete: "${field}" is required.`,
    );
  }
  return normalized;
}

export function optionalText(value: string | null | undefined) {
  const normalized = value?.trim();
  return normalized ? normalized : undefined;
}

export function requiredList<T>(
  value: readonly T[] | null | undefined,
  field: string,
) {
  if (!value?.length) {
    throw new HomePageError(
      `Sanity homepage content is incomplete: "${field}" must contain at least one entry.`,
    );
  }
  return value;
}

export function requiredIcon<T extends string>(
  value: string | null | undefined,
  allowed: readonly T[],
  field: string,
): T {
  if (!value || !allowed.includes(value as T)) {
    throw new HomePageError(
      `Sanity homepage content has an unsupported icon at "${field}".`,
    );
  }
  return value as T;
}

export function mapImage(
  image: QueryImage,
  field: string,
  width: number,
): HomePageContent["hero"]["image"] {
  if (!image?.asset?._ref) {
    throw new HomePageError(
      `Sanity homepage content is incomplete: "${field}" image is required.`,
    );
  }
  if (!image.dimensions?.width || !image.dimensions?.height) {
    throw new HomePageError(
      `Sanity image metadata is missing for "${field}". Re-upload the image asset.`,
    );
  }

  return {
    src: imageUrl(
      {
        _type: "image",
        asset: image.asset,
        crop: image.crop,
        hotspot: image.hotspot,
      },
      width,
    ),
    alt: requiredText(image.alt, `${field}.alt`),
  };
}

export function mapAction(
  action: QueryAction,
  field: string,
  required: boolean,
): ActionValue | null {
  if (!action) {
    if (required) {
      throw new HomePageError(
        `Sanity homepage content is incomplete: "${field}" is required.`,
      );
    }
    return null;
  }

  if (action.enabled === false) return null;

  const destination = resolveDestination(action.destination);
  if (!destination) {
    throw new HomePageError(
      `Sanity homepage content contains an unsafe or missing destination at "${field}".`,
    );
  }

  return {
    label: requiredText(action.label, `${field}.label`),
    href: destination.href,
    external: destination.external,
    openInNewTab: destination.openInNewTab,
  };
}

export function mapHeading(
  heading: QueryHeading,
  field: string,
): SectionHeadingValue {
  if (!heading) {
    throw new HomePageError(
      `Sanity homepage content is incomplete: "${field}" is required.`,
    );
  }

  return {
    eyebrow: requiredText(heading.eyebrow, `${field}.eyebrow`),
    title: requiredText(heading.title, `${field}.title`),
    description: requiredText(heading.description, `${field}.description`),
  };
}
