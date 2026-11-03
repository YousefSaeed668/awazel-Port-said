import "server-only";

import { cache } from "react";

import {
  formatReadingTime,
  getArticleSourceReadingTimeMinutes,
  articlePath,
  formatArticleDate,
} from "@/lib/blog";
import type { ArticleTag, BlogListingArticle, BlogListingAuthor } from "@/lib/blog";

import { sanityClient } from "../lib/client";
import {
  BLOG_ARTICLES_TAG,
  BLOG_AUTHORS_TAG,
  BLOG_TAGS_TAG,
} from "../lib/cache-tags";
import { ARTICLE_INDEX_QUERY } from "../queries/article";
import type { ARTICLE_INDEX_QUERY_RESULT } from "../sanity.types";
import { ArticleContentError, mapArticleImage } from "./article-body-mapping";

type ArticleIndexDocument = ARTICLE_INDEX_QUERY_RESULT[number];
type IndexAuthor = NonNullable<ArticleIndexDocument["author"]>;

function optionalText(value: string | null | undefined) {
  const normalized = value?.trim();
  return normalized ? normalized : undefined;
}

function cardImage(
  image: ArticleIndexDocument["cover"] | IndexAuthor["image"],
  field: string,
) {
  const mapped = mapArticleImage(image, field, 1000);
  return {
    src: mapped.src,
    alt: mapped.alt,
    ...(mapped.objectPosition
      ? { objectPosition: mapped.objectPosition }
      : {}),
  };
}

function optionalCardImage(
  image: IndexAuthor["image"],
  field: string,
) {
  if (!image?.asset?._ref) return undefined;

  try {
    return cardImage(image, field);
  } catch (error) {
    if (error instanceof ArticleContentError) return undefined;
    throw error;
  }
}

function mapTags(tags: ArticleIndexDocument["tags"]): ArticleTag[] {
  const mapped: ArticleTag[] = [];
  const seen = new Set<string>();

  for (const tag of tags ?? []) {
    const id = tag?._id?.trim();
    const title = tag?.title?.trim();
    if (!id || !title || seen.has(id)) continue;
    seen.add(id);
    mapped.push({ id, title });
  }

  return mapped;
}

function mapAuthor(author: IndexAuthor | null): BlogListingAuthor | undefined {
  const name = optionalText(author?.name);
  if (!name) return undefined;

  const role = optionalText(author?.role);
  const image = optionalCardImage(author?.image ?? null, "author.image");

  return {
    name,
    ...(role ? { role } : {}),
    ...(image ? { image } : {}),
  };
}

function mapIndexArticle(
  document: ArticleIndexDocument,
): BlogListingArticle | null {
  const id = optionalText(document._id);
  const title = optionalText(document.title);
  const slug = optionalText(document.slug);
  const excerpt = optionalText(document.excerpt);
  const publishedAt = optionalText(document.publishedAt);

  if (!id || !title || !slug || !excerpt || !publishedAt) return null;
  if (!Number.isFinite(new Date(publishedAt).getTime())) return null;

  try {
    const readingTimeMinutes = getArticleSourceReadingTimeMinutes(
      document.bodyText ?? [],
    );
    const author = mapAuthor(document.author);

    return {
      id,
      title,
      href: articlePath(slug),
      excerpt,
      image: cardImage(document.cover, "cover"),
      publishedAt,
      publishedLabel: formatArticleDate(publishedAt),
      readingTimeMinutes,
      readingTimeLabel: formatReadingTime(readingTimeMinutes),
      tags: mapTags(document.tags),
      ...(author ? { author } : {}),
    };
  } catch (error) {
    // A single incomplete article must not take down the whole archive.
    if (error instanceof ArticleContentError) return null;
    throw error;
  }
}

/**
 * Latest first publication wins, with the document id as a deterministic
 * tie-breaker so equal timestamps never reorder between requests.
 */
export function mapArticleIndex(
  documents: ARTICLE_INDEX_QUERY_RESULT,
): BlogListingArticle[] {
  return documents
    .flatMap((document) => {
      const mapped = mapIndexArticle(document);
      return mapped ? [mapped] : [];
    })
    .sort(
      (left, right) =>
        Date.parse(right.publishedAt) - Date.parse(left.publishedAt) ||
        left.id.localeCompare(right.id),
    );
}

export const getArticleIndex = cache(
  async (): Promise<BlogListingArticle[]> => {
    const documents = await sanityClient.fetch<ARTICLE_INDEX_QUERY_RESULT>(
      ARTICLE_INDEX_QUERY,
      {},
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

    return mapArticleIndex(documents);
  },
);
