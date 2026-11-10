import "server-only";

import { cache } from "react";

import type { ProjectCategory } from "@/lib/projects";
import {
  normalizeProjectSlug,
  type ProjectDetailContent,
} from "@/lib/project-detail";
import type { ProjectListingItem } from "@/lib/projects";

import { sanityClient } from "../lib/client";
import { PROJECTS_TAG, projectTag } from "../lib/cache-tags";
import {
  PROJECT_DETAIL_QUERY,
  PROJECT_SITEMAP_QUERY,
  PROJECT_SLUG_QUERY,
  RELATED_PROJECTS_QUERY,
} from "../queries/projects";
import type {
  PROJECT_DETAIL_QUERY_RESULT,
  PROJECT_SITEMAP_QUERY_RESULT,
  PROJECT_SLUG_QUERY_RESULT,
  RELATED_PROJECTS_QUERY_RESULT,
} from "../sanity.types";
import {
  mapProjectDetail,
  mapProjectSitemapEntries,
  type ProjectSitemapEntry,
} from "./project-detail-mapping";
import { mapProjectIndex } from "./project-index";

export type ProjectLookupResult =
  | { status: "found"; project: ProjectDetailContent }
  | { status: "missing" };

/**
 * Resolves a current slug to the project id, then fetches the full document
 * with an id-specific cache tag. Unknown, draft-only and deleted projects
 * resolve to "missing" so the route can call `notFound()`.
 */
export const getProjectPage = cache(
  async (slug: string): Promise<ProjectLookupResult> => {
    const normalizedSlug = normalizeProjectSlug(slug);
    if (!normalizedSlug) return { status: "missing" };

    const id = await sanityClient.fetch<PROJECT_SLUG_QUERY_RESULT>(
      PROJECT_SLUG_QUERY,
      { slug: normalizedSlug },
      {
        cache: "force-cache",
        next: { revalidate: false, tags: [PROJECTS_TAG] },
        perspective: "published",
        stega: false,
        useCdn: false,
      },
    );

    if (!id) return { status: "missing" };

    const document = await sanityClient.fetch<PROJECT_DETAIL_QUERY_RESULT>(
      PROJECT_DETAIL_QUERY,
      { id },
      {
        cache: "force-cache",
        next: {
          revalidate: false,
          tags: [projectTag(id), PROJECTS_TAG],
        },
        perspective: "published",
        stega: false,
        useCdn: false,
      },
    );

    if (!document) return { status: "missing" };

    return { status: "found", project: mapProjectDetail(document) };
  },
);

export async function getRelatedProjects(
  projectId: string,
  category: ProjectCategory,
): Promise<ProjectListingItem[]> {
  const documents = await sanityClient.fetch<RELATED_PROJECTS_QUERY_RESULT>(
    RELATED_PROJECTS_QUERY,
    { id: projectId, category },
    {
      cache: "force-cache",
      next: { revalidate: false, tags: [PROJECTS_TAG] },
      perspective: "published",
      stega: false,
      useCdn: false,
    },
  );

  return mapProjectIndex(documents);
}

export const getProjectSitemapEntries = cache(
  async (): Promise<ProjectSitemapEntry[]> => {
    const documents = await sanityClient.fetch<PROJECT_SITEMAP_QUERY_RESULT>(
      PROJECT_SITEMAP_QUERY,
      {},
      {
        cache: "force-cache",
        next: { revalidate: false, tags: [PROJECTS_TAG] },
        perspective: "published",
        stega: false,
        useCdn: false,
      },
    );

    return mapProjectSitemapEntries(documents);
  },
);


export const getProjectStaticSlugs = cache(async () =>
  (await getProjectSitemapEntries()).map((entry) => entry.slug),
);
