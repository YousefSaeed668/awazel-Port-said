import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { normalizeProjectSlug } from "@/lib/project-detail";
import { PROJECTS_PATH } from "@/lib/projects";
import { getSiteUrl } from "@/lib/utils";
import { requireNavigationPage } from "@/sanity/data/page-availability";
import {
  getProjectPage,
  getRelatedProjects,
} from "@/sanity/data/project";
import { getProjectsPageContent } from "@/sanity/data/projects-page";

import { ProjectClosing } from "./_detail/project-closing";
import { ProjectGallery } from "./_detail/project-gallery";
import { ProjectHeader } from "./_detail/project-header";
import { ProjectHero } from "./_detail/project-hero";
import { ProjectNarrative } from "./_detail/project-narrative";
import { ProjectRelated } from "./_detail/project-related";
import { ProjectStatusStrip } from "./_detail/project-status-strip";
import { ProjectVerification } from "./_detail/project-verification";

type ProjectRouteProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: ProjectRouteProps): Promise<Metadata> {
  await requireNavigationPage(PROJECTS_PATH);
  const { slug } = await params;
  const lookup = await getProjectPage(normalizeProjectSlug(slug));

  if (lookup.status === "missing") notFound();

  const project = lookup.project;
  const canonicalUrl = new URL(project.href, getSiteUrl()).toString();

  return {
    title: project.seo.title,
    description: project.seo.description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "website",
      locale: "ar",
      url: canonicalUrl,
      title: project.seo.title,
      description: project.seo.description,
      images: [
        {
          url: project.cover.src,
          width: project.cover.width,
          height: project.cover.height,
          alt: project.cover.alt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: project.seo.title,
      description: project.seo.description,
      images: [project.cover.src],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function ProjectPage({ params }: ProjectRouteProps) {
  await requireNavigationPage(PROJECTS_PATH);
  const { slug } = await params;
  const lookup = await getProjectPage(normalizeProjectSlug(slug));

  if (lookup.status === "missing") notFound();

  const project = lookup.project;
  const [page, related] = await Promise.all([
    getProjectsPageContent(),
    getRelatedProjects(project.id, project.category),
  ]);

  return (
    <>
      <ProjectStatusStrip project={project} />
      <ProjectHeader project={project} />
      <ProjectHero project={project} />
      <ProjectNarrative project={project} />
      <ProjectGallery projectTitle={project.title} images={project.gallery} />
      {project.verification?.length ? (
        <ProjectVerification items={project.verification} />
      ) : null}
      <ProjectRelated projects={related} />
      <ProjectClosing content={page.closing} />
    </>
  );
}
