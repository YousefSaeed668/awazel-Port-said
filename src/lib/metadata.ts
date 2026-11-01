import type { Metadata } from "next";

import { getSiteUrl } from "./utils";

import type { DefaultSeoViewModel } from "./site-view-models";

export function buildDefaultMetadata(seo: DefaultSeoViewModel): Metadata {
  const images = seo.image
    ? [
        {
          url: seo.image.src,
          width: seo.image.width,
          height: seo.image.height,
          alt: seo.image.alt,
        },
      ]
    : undefined;

  return {
    metadataBase: new URL(getSiteUrl()),
    applicationName: seo.siteName,
    title: {
      default: seo.title,
      template: `%s | ${seo.siteName}`,
    },
    description: seo.description,
    openGraph: {
      type: "website",
      locale: "ar",
      siteName: seo.siteName,
      title: seo.title,
      description: seo.description,
      images,
    },
    twitter: {
      card: images ? "summary_large_image" : "summary",
      title: seo.title,
      description: seo.description,
      images: images?.map((image) => image.url),
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}
