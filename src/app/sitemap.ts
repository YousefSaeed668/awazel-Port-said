import type { MetadataRoute } from "next";

import { articlePath, BLOG_PATH } from "@/lib/blog";
import { getSiteUrl } from "@/lib/utils";
import { PRIVACY_PATH } from "@/lib/privacy-data";
import { projectPath, PROJECTS_PATH } from "@/lib/projects";
import { getArticleSitemapEntries } from "@/sanity/data/article";
import { isNavigationPageAvailable } from "@/sanity/data/page-availability";
import { getProjectSitemapEntries } from "@/sanity/data/project";
import { getSiteShell } from "@/sanity/data/site-settings";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { header } = await getSiteShell();
  const blogAvailable = isNavigationPageAvailable(header, BLOG_PATH);
  const projectsAvailable = isNavigationPageAvailable(header, PROJECTS_PATH);

  const [articles, projects] = await Promise.all([
    blogAvailable ? getArticleSitemapEntries() : Promise.resolve([]),
    projectsAvailable ? getProjectSitemapEntries() : Promise.resolve([]),
  ]);

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
    {
      url: new URL(PROJECTS_PATH, getSiteUrl()).toString(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: new URL("/contact", getSiteUrl()).toString(),
      changeFrequency: "monthly",
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
    ...projects.map((project) => ({
      url: new URL(projectPath(project.slug), getSiteUrl()).toString(),
      lastModified: project.lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
