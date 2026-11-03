import type { MetadataRoute } from "next";

import { articlePath, BLOG_PATH } from "@/lib/blog";
import { getSiteUrl } from "@/lib/utils";
import { getArticleSitemapEntries } from "@/sanity/data/article";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getArticleSitemapEntries();

  return [
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
      url: new URL(BLOG_PATH, getSiteUrl()).toString(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...articles.map((article) => ({
      url: new URL(articlePath(article.slug), getSiteUrl()).toString(),
      lastModified: article.lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
