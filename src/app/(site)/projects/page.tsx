import type { Metadata } from "next";

import { PROJECTS_PATH } from "@/lib/projects";
import { getSiteUrl } from "@/lib/utils";
import { getProjectIndex } from "@/sanity/data/project-index";
import { getProjectsPageContent } from "@/sanity/data/projects-page";
import { requireNavigationPage } from "@/sanity/data/page-availability";
import { getSiteShell } from "@/sanity/data/site-settings";

import { ProjectsAssurance } from "./_listing/projects-assurance";
import { ProjectsCta } from "./_listing/projects-cta";
import { ProjectsDirectory } from "./_listing/projects-directory";
import { ProjectsHero } from "./_listing/projects-hero";

export async function generateMetadata(): Promise<Metadata> {
  await requireNavigationPage(PROJECTS_PATH);
  const [content, { defaultSeo }] = await Promise.all([
    getProjectsPageContent(),
    getSiteShell(),
  ]);
  const canonicalUrl = new URL(PROJECTS_PATH, getSiteUrl()).toString();
  const images = defaultSeo.image
    ? [
        {
          url: defaultSeo.image.src,
          width: defaultSeo.image.width,
          height: defaultSeo.image.height,
          alt: defaultSeo.image.alt,
        },
      ]
    : undefined;

  return {
    title: content.seo.title,
    description: content.seo.description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "website",
      locale: "ar",
      url: canonicalUrl,
      siteName: defaultSeo.siteName,
      title: content.seo.title,
      description: content.seo.description,
      images,
    },
    twitter: {
      card: images ? "summary_large_image" : "summary",
      title: content.seo.title,
      description: content.seo.description,
      images: images?.map((image) => image.url),
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function ProjectsPage() {
  await requireNavigationPage(PROJECTS_PATH);
  const [content, projects] = await Promise.all([
    getProjectsPageContent(),
    getProjectIndex(),
  ]);

  const categoryCount = new Set(
    projects.map((project) => project.category),
  ).size;

  return (
    <>
      <ProjectsHero
        content={content}
        totalProjects={projects.length}
        categoryCount={categoryCount}
      />
      <ProjectsDirectory projects={projects} />
      <ProjectsAssurance content={content.assurance} />
      <ProjectsCta content={content.closing} />
    </>
  );
}
