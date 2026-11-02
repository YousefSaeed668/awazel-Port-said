import "server-only";

import { cache } from "react";

import type {
  CertificatesPageContent,
  CompanyProfileFile,
} from "@/lib/certificates-data";

import { sanityClient } from "../lib/client";
import {
  ABOUT_PAGE_TAG,
  CERTIFICATES_PAGE_TAG,
} from "../lib/cache-tags";
import {
  CERTIFICATES_PAGE_QUERY,
  COMPANY_PROFILE_FILE_QUERY,
} from "../queries/certificates-page";
import type {
  CERTIFICATES_PAGE_QUERY_RESULT,
  COMPANY_PROFILE_FILE_QUERY_RESULT,
} from "../sanity.types";
import {
  CertificatesPageError,
  mapCertificates,
  mapCompanyProfile,
  requiredText,
} from "./certificates-page-mapping";

type QueryDocument = NonNullable<CERTIFICATES_PAGE_QUERY_RESULT>;

export const getCertificatesPageContent = cache(
  async (): Promise<CertificatesPageContent> => {
    const document = await sanityClient.fetch<QueryDocument | null>(
      CERTIFICATES_PAGE_QUERY,
      {},
      {
        cache: "force-cache",
        next: {
          revalidate: false,
          tags: [CERTIFICATES_PAGE_TAG],
        },
        perspective: "published",
        stega: false,
        useCdn: false,
      },
    );

    if (!document) {
      throw new CertificatesPageError(
        'Sanity certificates document "certificatesPage" was not found. Create and publish it in Studio at /studio before building the public site.',
      );
    }

    if (!document.intro || !document.certificates || !document.seo) {
      throw new CertificatesPageError(
        'Sanity certificates content is incomplete: "intro", "certificates", and "seo" are required.',
      );
    }

    return {
      intro: {
        eyebrow: requiredText(document.intro.eyebrow, "intro.eyebrow"),
        title: requiredText(document.intro.title, "intro.title"),
        description: requiredText(
          document.intro.description,
          "intro.description",
        ),
      },
      certificates: mapCertificates(document.certificates),
      seo: {
        title: requiredText(document.seo.title, "seo.title"),
        description: requiredText(document.seo.description, "seo.description"),
      },
    };
  },
);

/**
 * The profile PDF is owned by `aboutPage`. The fetch is tagged with the About
 * tag so editing the profile invalidates this dependency, and with the
 * certificates tag so both document changes refresh the certificates route.
 */
export const getCompanyProfileFile = cache(
  async (): Promise<CompanyProfileFile | null> => {
    const document =
      await sanityClient.fetch<COMPANY_PROFILE_FILE_QUERY_RESULT>(
        COMPANY_PROFILE_FILE_QUERY,
        {},
        {
          cache: "force-cache",
          next: {
            revalidate: false,
            tags: [CERTIFICATES_PAGE_TAG, ABOUT_PAGE_TAG],
          },
          perspective: "published",
          stega: false,
          useCdn: false,
        },
      );

    return mapCompanyProfile(document);
  },
);
