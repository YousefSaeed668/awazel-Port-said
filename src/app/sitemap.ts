import type { MetadataRoute } from "next";

import { articlePath, BLOG_PATH } from "@/lib/blog";
import { getSiteUrl } from "@/lib/utils";
import { PRIVACY_PATH } from "@/lib/privacy-data";
import { getArticleSitemapEntries } from "@/sanity/data/article";
import { isNavigationPageAvailable } from "@/sanity/data/page-availability";
import { getSiteShell } from "@/sanity/data/site-settings";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { header } = await getSiteShell();
  const articles = isNavigationPageAvailable(header, BLOG_PATH)
    ? await getArticleSitemapEntries()
    : [];

  const pages: MetadataRoute.Sitemap = [
    {
      url: new URL("/", getSiteUrl()).toString(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: new URL("/about", getSiteUrl()).toString(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: new URL("/certificates", getSiteUrl()).toString(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: new URL("/services", getSiteUrl()).toString(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: new URL(BLOG_PATH, getSiteUrl()).toString(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  return [
    {
      url: new URL(PRIVACY_PATH, getSiteUrl()).toString(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    ...pages.filter((page) =>
      isNavigationPageAvailable(header, new URL(page.url).pathname),
    ),
    ...articles.map((article) => ({
      url: new URL(articlePath(article.slug), getSiteUrl()).toString(),
      lastModified: article.lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
