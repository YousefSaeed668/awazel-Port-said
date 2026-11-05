import "server-only";

import { cache } from "react";

import { PRIVACY_PAGE_TAG } from "../lib/cache-tags";
import { sanityClient } from "../lib/client";
import { PRIVACY_PAGE_QUERY } from "../queries/privacy-page";
import type { PRIVACY_PAGE_QUERY_RESULT } from "../sanity.types";
import { mapPrivacyPage } from "./privacy-page-mapping";

export const getPrivacyPageContent = cache(async () => {
  const document = await sanityClient.fetch<PRIVACY_PAGE_QUERY_RESULT>(
    PRIVACY_PAGE_QUERY,
    {},
    {
      cache: "force-cache",
      next: { revalidate: false, tags: [PRIVACY_PAGE_TAG] },
      perspective: "published",
      stega: false,
      useCdn: false,
    },
  );
  return mapPrivacyPage(document);
});
