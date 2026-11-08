import "server-only";

import { cache } from "react";

import { sanityClient } from "../lib/client";
import { PROJECTS_PAGE_TAG } from "../lib/cache-tags";
import { PROJECTS_PAGE_QUERY } from "../queries/projects";
import type { PROJECTS_PAGE_QUERY_RESULT } from "../sanity.types";
import { mapProjectsPage } from "./projects-page-mapping";

export const getProjectsPageContent = cache(async () => {
  const document = await sanityClient.fetch<PROJECTS_PAGE_QUERY_RESULT>(
    PROJECTS_PAGE_QUERY,
    {},
    {
      cache: "force-cache",
      next: { revalidate: false, tags: [PROJECTS_PAGE_TAG] },
      perspective: "published",
      stega: false,
      useCdn: false,
    },
  );

  return mapProjectsPage(document);
});
