import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";

import { getSiteUrl } from "@/lib/utils";
import {
  getArticlePage,
  getBlogBanners,
  getRelatedArticles,
  normalizeArticleSlug,
} from "@/sanity/data/article";
import { getSiteShell } from "@/sanity/data/site-settings";
import { requireNavigationPage } from "@/sanity/data/page-availability";

import { ArticleStructuredData } from "./_article/article-structured-data";
import { ArticleView } from "./_article/article-view";

type ArticleRouteProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: ArticleRouteProps): Promise<Metadata> {
  await requireNavigationPage("/blog");
  const { slug } = await params;
  const lookup = await getArticlePage(normalizeArticleSlug(slug));

  if (lookup.status === "missing") {
    notFound();
  }

  if (lookup.status === "redirect") {
    return {};
  }

  const article = lookup.article;
  const canonicalUrl = new URL(article.href, getSiteUrl()).toString();

  const modifiedTime = article.updatedAt ?? article.publishedAt;

  return {
    title: article.seo.title,
    description: article.seo.description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "article",
      locale: "ar",
      url: canonicalUrl,
      title: article.seo.title,
      description: article.seo.description,
      publishedTime: article.publishedAt,
      modifiedTime,
      authors: [article.author.name],
      images: [
        {
          url: article.cover.src,
          width: article.cover.width,
          height: article.cover.height,
          alt: article.cover.alt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: article.seo.title,
      description: article.seo.description,
      images: [article.cover.src],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function ArticlePage({ params }: ArticleRouteProps) {
  await requireNavigationPage("/blog");
  const { slug } = await params;
  const lookup = await getArticlePage(normalizeArticleSlug(slug));

  if (lookup.status === "missing") notFound();
  if (lookup.status === "redirect") permanentRedirect(lookup.href);

  const article = lookup.article;
  const tagIds = article.tags.map((tag) => tag.id);
  const [shell, banners, related] = await Promise.all([
    getSiteShell(),
    getBlogBanners(),
    getRelatedArticles(article.id, tagIds),
  ]);
  const canonicalUrl = new URL(article.href, getSiteUrl()).toString();

  return (
    <>
      <ArticleView
        article={article}
        banners={{
          ...banners,
          sidebar: banners.sidebar ?? shell.header.primaryAction,
          wide: banners.wide ?? shell.header.primaryAction,
        }}
        related={related}
        canonicalUrl={canonicalUrl}
      />
      <ArticleStructuredData
        article={article}
        canonicalUrl={canonicalUrl}
        siteName={shell.header.companyName}
        siteLogoUrl={shell.header.logo.src}
      />
    </>
  );
}
