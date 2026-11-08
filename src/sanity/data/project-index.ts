import "server-only";

import { cache } from "react";

import {
  PROJECT_CATEGORIES,
  PROJECT_STATUS_TONES,
  projectPath,
  type ProjectCategory,
  type ProjectListingItem,
  type ProjectStatusTone,
} from "@/lib/projects";

import { sanityClient } from "../lib/client";
import { PROJECTS_TAG } from "../lib/cache-tags";
import { PROJECT_INDEX_QUERY } from "../queries/projects";
import type { PROJECT_INDEX_QUERY_RESULT } from "../sanity.types";
import {
  mapProjectImage,
  optionalText,
  ProjectContentError,
  requiredText,
} from "./project-mapping";

type ProjectIndexDocument = PROJECT_INDEX_QUERY_RESULT[number];

function category(value: string | null | undefined): ProjectCategory | null {
  const normalized = optionalText(value);
  return (
    PROJECT_CATEGORIES.find((candidate) => candidate === normalized) ?? null
  );
}

function statusTone(
  value: string | null | undefined,
): ProjectStatusTone | null {
  const normalized = optionalText(value);
  return (
    PROJECT_STATUS_TONES.find((candidate) => candidate === normalized) ?? null
  );
}

function mapFact(
  value: { label?: string | null; value?: string | null } | null,
  field: string,
) {
  return {
    label: requiredText(value?.label, `${field}.label`),
    value: requiredText(value?.value, `${field}.value`),
  };
}

function mapProject(
  document: ProjectIndexDocument,
): ProjectListingItem | null {
  const id = optionalText(document._id);
  const title = optionalText(document.title);
  const slug = optionalText(document.slug);
  const summary = optionalText(document.summary);
  const projectCategory = category(document.category);
  const tone = statusTone(document.status?.tone);
  const location = optionalText(document.location);
  const completedAt = optionalText(document.completedAt);

  if (
    !id ||
    !title ||
    !slug ||
    !summary ||
    !projectCategory ||
    !tone ||
    !location ||
    !completedAt
  ) {
    return null;
  }

  if (!Number.isFinite(Date.parse(completedAt))) return null;

  try {
    return {
      id,
      title,
      href: projectPath(slug),
      summary,
      image: mapProjectImage(document.cover, "cover", 1000),
      category: projectCategory,
      status: {
        label: requiredText(document.status?.label, "status.label"),
        tone,
      },
      location,
      completedAt,
      measurement: mapFact(document.measurement, "measurement"),
      system: mapFact(document.system, "system"),
      ...(optionalText(document.highlight)
        ? { highlight: optionalText(document.highlight) }
        : {}),
    };
  } catch (error) {
    if (error instanceof ProjectContentError) return null;
    throw error;
  }
}

export function mapProjectIndex(
  documents: PROJECT_INDEX_QUERY_RESULT,
): ProjectListingItem[] {
  return documents
    .flatMap((document) => {
      const mapped = mapProject(document);
      return mapped ? [mapped] : [];
    })
    .sort(
      (left, right) =>
        Date.parse(right.completedAt) - Date.parse(left.completedAt) ||
        left.id.localeCompare(right.id),
    );
}

export const getProjectIndex = cache(async (): Promise<ProjectListingItem[]> => {
  const documents = await sanityClient.fetch<PROJECT_INDEX_QUERY_RESULT>(
    PROJECT_INDEX_QUERY,
    {},
    {
      cache: "force-cache",
      next: { revalidate: false, tags: [PROJECTS_TAG] },
      perspective: "published",
      stega: false,
      useCdn: false,
    },
  );

  return mapProjectIndex(documents);
});
