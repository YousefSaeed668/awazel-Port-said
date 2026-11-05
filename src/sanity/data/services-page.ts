import "server-only";

import { cache } from "react";

import { sanityClient } from "../lib/client";
import { SERVICES_PAGE_TAG } from "../lib/cache-tags";
import { SERVICES_PAGE_QUERY } from "../queries/services-page";
import type { SERVICES_PAGE_QUERY_RESULT } from "../sanity.types";
import { mapServicesPage } from "./services-page-mapping";

export const getServicesPageContent = cache(async () => {
  const document = await sanityClient.fetch<SERVICES_PAGE_QUERY_RESULT>(
    SERVICES_PAGE_QUERY,
    {},
    {
      cache: "force-cache",
      next: { revalidate: false, tags: [SERVICES_PAGE_TAG] },
      perspective: "published",
      stega: false,
      useCdn: false,
    },
  );
  return mapServicesPage(document);
});
