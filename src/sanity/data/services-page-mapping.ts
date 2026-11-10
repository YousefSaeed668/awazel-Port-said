import "server-only";

import {
  SERVICE_TECHNOLOGY_ICONS,
  type ServicesHeading,
  type ServicesPageContent,
} from "@/lib/services-data";

import { imageUrl } from "../lib/image";
import type { SERVICES_PAGE_QUERY_RESULT } from "../sanity.types";

type QueryDocument = NonNullable<SERVICES_PAGE_QUERY_RESULT>;
type QueryApplication = NonNullable<
  NonNullable<QueryDocument["applications"]>["items"]
>[number];

export class ServicesPageError extends Error {
  constructor(message: string) {
    super(`Sanity services content: ${message}`);
    this.name = "ServicesPageError";
  }
}

function required<T>(value: T | null | undefined, field: string): T {
  if (value === null || value === undefined)
    throw new ServicesPageError(`"${field}" is required.`);
  return value;
}

function text(value: string | null | undefined, field: string): string {
  const normalized = value?.trim();
  if (!normalized) throw new ServicesPageError(`"${field}" must be non-empty.`);
  return normalized;
}

function keyed<T extends { _key: string }>(
  items: readonly T[] | null | undefined,
  field: string,
  min = 0,
): readonly T[] {
  const list = items ?? [];
  if (list.length < min)
    throw new ServicesPageError(`"${field}" needs at least ${min} entries.`);
  const keys = new Set<string>();
  for (const item of list) {
    const key = text(item._key, `${field}._key`);
    if (keys.has(key))
      throw new ServicesPageError(`"${field}" has duplicate keys.`);
    keys.add(key);
  }
  return list;
}

function heading(
  value: Pick<
    NonNullable<QueryDocument["intro"]>,
    "eyebrow" | "title" | "description"
  > | null,
  field: string,
): ServicesHeading {
  const source = required(value, field);
  return {
    eyebrow: text(source.eyebrow, `${field}.eyebrow`),
    title: text(source.title, `${field}.title`),
    description: text(source.description, `${field}.description`),
  };
}

function image(value: QueryApplication["image"], field: string) {
  const source = required(value, field);
  const asset = required(source.asset, `${field}.asset`);
  text(asset._ref, `${field}.asset._ref`);
  if (!source.dimensions?.width || !source.dimensions.height) {
    throw new ServicesPageError(
      `"${field}" image metadata is missing. Re-upload the image.`,
    );
  }
  return {
    src: imageUrl(
      { _type: "image", asset, crop: source.crop, hotspot: source.hotspot },
      1200,
    ),
    alt: text(source.alt, `${field}.alt`),
  };
}

function labels(value: QueryApplication["tags"], field: string) {
  return keyed(value, field).map((item) => ({
    id: item._key,
    label: text(item.label, `${field}.${item._key}.label`),
  }));
}

function mapApplication(
  value: QueryApplication,
): ServicesPageContent["applications"]["items"][number] {
  const field = `applications.${value._key}`;
  return {
    id: value._key,
    title: text(value.title, `${field}.title`),
    description: text(value.description, `${field}.description`),
    tags: labels(value.tags, `${field}.tags`),
    image: image(value.image, `${field}.image`),
    imageBadge: value.imageBadge?.trim() || undefined,
    systemsLabel: value.systemsLabel?.trim() || undefined,
    systems: labels(value.systems, `${field}.systems`),
    metrics: keyed(value.metrics, `${field}.metrics`).map((metric) => ({
      id: metric._key,
      label: text(metric.label, `${field}.metrics.label`),
      value: text(metric.value, `${field}.metrics.value`),
      unit: metric.unit?.trim() || undefined,
    })),
  };
}

export function mapServicesPage(
  document: QueryDocument | null,
): ServicesPageContent {
  if (!document)
    throw new ServicesPageError(
      '"servicesPage" was not found. Create and publish it at /studio.',
    );
  const intro = required(document.intro, "intro");
  const applications = required(document.applications, "applications");
  const technologies = required(document.technologies, "technologies");
  const assessment = required(document.assessment, "assessment");
  const faq = required(document.faq, "faq");
  const seo = required(document.seo, "seo");

  return {
    intro: heading(intro, "intro"),
    applications: {
      heading: heading(applications.heading, "applications.heading"),
      items: keyed(applications.items, "applications.items", 1).map(
        mapApplication,
      ),
    },
    technologies: {
      heading: heading(technologies.heading, "technologies.heading"),
      note: text(technologies.note, "technologies.note"),
      items: keyed(technologies.items, "technologies.items", 1).map((item) => {
        const icon = SERVICE_TECHNOLOGY_ICONS.find(
          (value) => value === item.icon,
        );
        if (!icon)
          throw new ServicesPageError(
            `"technologies.${item._key}.icon" is unsupported.`,
          );
        return {
          id: item._key,
          icon,
          title: text(item.title, "technologies.title"),
          englishTitle: text(item.englishTitle, "technologies.englishTitle"),
          description: text(item.description, "technologies.description"),
          noteLabel: text(item.noteLabel, "technologies.noteLabel"),
          note: text(item.note, "technologies.note"),
        };
      }),
    },
    assessment: {
      heading: heading(assessment.heading, "assessment.heading"),
      factors: keyed(assessment.factors, "assessment.factors", 1).map(
        (factor) => ({
          id: factor._key,
          title: text(factor.title, "assessment.factors.title"),
          description: text(
            factor.description,
            "assessment.factors.description",
          ),
        }),
      ),
    },
    faq: {
      heading: heading(faq.heading, "faq.heading"),
      items: keyed(faq.items, "faq.items", 1).map((item) => ({
        id: item._key,
        question: text(item.question, "faq.question"),
        answer: text(item.answer, "faq.answer"),
      })),
    },
    seo: {
      title: text(seo.title, "seo.title"),
      description: text(seo.description, "seo.description"),
    },
  };
}
