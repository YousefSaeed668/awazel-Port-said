import "server-only";

import { cache } from "react";

import type { AboutPageContent } from "@/lib/about-data";

import { sanityClient } from "../lib/client";
import { ABOUT_PAGE_TAG } from "../lib/cache-tags";
import { ABOUT_PAGE_QUERY } from "../queries/about-page";
import type { ABOUT_PAGE_QUERY_RESULT } from "../sanity.types";
import {
  AboutPageError,
  mapCompany,
  mapHeading,
  mapMethodology,
  mapProfile,
  mapValues,
  requiredText,
} from "./about-page-mapping";

type QueryDocument = NonNullable<ABOUT_PAGE_QUERY_RESULT>;

export const getAboutPageContent = cache(
  async (): Promise<AboutPageContent> => {
    const document = await sanityClient.fetch<QueryDocument | null>(
      ABOUT_PAGE_QUERY,
      {},
      {
        cache: "force-cache",
        next: {
          revalidate: false,
          tags: [ABOUT_PAGE_TAG],
        },
        perspective: "published",
        stega: false,
        useCdn: false,
      },
    );

    if (!document) {
      throw new AboutPageError(
        'Sanity about document "aboutPage" was not found. Create and publish it in Studio at /studio (or run npm run seed:about-page) before building the public site.',
      );
    }

    if (!document.intro || !document.company || !document.capabilities) {
      throw new AboutPageError(
        'Sanity about content is incomplete: "intro", "company", and "capabilities" are required.',
      );
    }

    if (!document.methodology || !document.values) {
      throw new AboutPageError(
        'Sanity about content is incomplete: "methodology" and "values" are required.',
      );
    }

    if (!document.profile || !document.seo) {
      throw new AboutPageError(
        'Sanity about content is incomplete: "profile" and "seo" are required.',
      );
    }

    return {
      intro: mapHeading(document.intro, "intro"),
      company: mapCompany(document.company),
      capabilities: {
        heading: mapHeading(document.capabilities.heading, "capabilities.heading"),
      },
      methodology: mapMethodology(document.methodology),
      values: mapValues(document.values),
      profile: mapProfile(document.profile),
      seo: {
        title: requiredText(document.seo.title, "seo.title"),
        description: requiredText(document.seo.description, "seo.description"),
      },
    };
  },
);
