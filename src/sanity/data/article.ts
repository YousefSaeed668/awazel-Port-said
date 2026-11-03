import "server-only";

import { cache } from "react";

import { articlePath } from "@/lib/blog";
import type { ArticlePageContent, RelatedArticle } from "@/lib/blog";

import { sanityClient } from "../lib/client";
import {
  articleTag,
  BLOG_ARTICLES_TAG,
  BLOG_AUTHORS_TAG,
  BLOG_SETTINGS_TAG,
  BLOG_TAGS_TAG,
} from "../lib/cache-tags";
import {
  ARTICLE_BY_ID_QUERY,
  ARTICLE_SITEMAP_QUERY,
  ARTICLE_SLUG_QUERY,
  BLOG_SETTINGS_QUERY,
  RELATED_ARTICLES_QUERY,
} from "../queries/article";
import type {
  ARTICLE_BY_ID_QUERY_RESULT,
  ARTICLE_SITEMAP_QUERY_RESULT,
  ARTICLE_SLUG_QUERY_RESULT,
  BLOG_SETTINGS_QUERY_RESULT,
  RELATED_ARTICLES_QUERY_RESULT,
} from "../sanity.types";
import {
  mapArticle,
  mapArticleSitemapEntries,
  mapBlogBanners,
  mapRelatedArticles,
} from "./article-mapping";

export type ArticleLookupResult =
  | { status: "found"; article: ArticlePageContent }
  | { status: "redirect"; href: string }
  | { status: "missing" };

export function normalizeArticleSlug(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";

  try {
    return decodeURIComponent(trimmed).trim();
  } catch {
    return trimmed;
  }
}

/**
 * Resolves a current or historical slug to the article id, then fetches the
 * full article with an id-specific cache tag. A historical slug redirects
 * straight to the current slug so no redirect chains are created.
 */
export const getArticlePage = cache(
  async (slug: string): Promise<ArticleLookupResult> => {
    const normalizedSlug = normalizeArticleSlug(slug);
    if (!normalizedSlug) return { status: "missing" };

    const lookup = await sanityClient.fetch<ARTICLE_SLUG_QUERY_RESULT>(
      ARTICLE_SLUG_QUERY,
      { slug: normalizedSlug },
      {
        cache: "force-cache",
        next: {
          revalidate: false,
          tags: [BLOG_ARTICLES_TAG],
        },
        perspective: "published",
        stega: false,
        useCdn: false,
      },
    );

    const id = lookup?._id;
    const currentSlug = lookup?.slug?.trim();
    if (!id || !currentSlug) return { status: "missing" };

    if (currentSlug !== normalizedSlug) {
      return { status: "redirect", href: articlePath(currentSlug) };
    }

    const document = await sanityClient.fetch<ARTICLE_BY_ID_QUERY_RESULT>(
      ARTICLE_BY_ID_QUERY,
      { id },
      {
        cache: "force-cache",
        next: {
          revalidate: false,
          tags: [
            articleTag(id),
            BLOG_ARTICLES_TAG,
            BLOG_AUTHORS_TAG,
            BLOG_TAGS_TAG,
          ],
        },
        perspective: "published",
        stega: false,
        useCdn: false,
      },
    );

    if (!document) return { status: "missing" };

    return { status: "found", article: mapArticle(document) };
  },
);

export async function getRelatedArticles(
  articleId: string,
  tagIds: readonly string[],
): Promise<RelatedArticle[]> {
  if (tagIds.length === 0) return [];

  const documents = await sanityClient.fetch<RELATED_ARTICLES_QUERY_RESULT>(
    RELATED_ARTICLES_QUERY,
    { articleId, tagIds },
    {
      cache: "force-cache",
      next: {
        revalidate: false,
        tags: [BLOG_ARTICLES_TAG, BLOG_AUTHORS_TAG, BLOG_TAGS_TAG],
      },
      perspective: "published",
      stega: false,
      useCdn: false,
    },
  );

  return mapRelatedArticles(documents, tagIds);
}

/**
 * Banner copy is fixed in the template. The singleton contributes primary
 * destinations and the shared WhatsApp number. Missing numbers use the dummy
 * default; missing primary destinations use the site's primary contact action.
 */
export const getBlogBanners = cache(async () => {
  const document = await sanityClient.fetch<BLOG_SETTINGS_QUERY_RESULT>(
    BLOG_SETTINGS_QUERY,
    {},
    {
      cache: "force-cache",
      next: {
        revalidate: false,
        tags: [BLOG_SETTINGS_TAG],
      },
      perspective: "published",
      stega: false,
      useCdn: false,
    },
  );

  return mapBlogBanners(document);
});

export const getArticleSitemapEntries = cache(async () => {
  const documents = await sanityClient.fetch<ARTICLE_SITEMAP_QUERY_RESULT>(
    ARTICLE_SITEMAP_QUERY,
    {},
    {
      cache: "force-cache",
      next: {
        revalidate: false,
        tags: [BLOG_ARTICLES_TAG],
      },
      perspective: "published",
      stega: false,
      useCdn: false,
    },
  );

  return mapArticleSitemapEntries(documents);
});
