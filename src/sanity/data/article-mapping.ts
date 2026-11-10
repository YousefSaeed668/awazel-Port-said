import "server-only";

import {
  extractArticleToc,
  formatReadingTime,
  getArticleReadingTimeMinutes,
  articlePath,
  formatArticleDate,
  isGenuineArticleUpdate,
} from "@/lib/blog";
import type {
  ArticleAuthor,
  ArticlePageContent,
  ArticleTag,
  BlogBanners,
  RelatedArticle,
} from "@/lib/blog";

import { resolveDestination } from "@/lib/links";

import type {
  ARTICLE_BY_ID_QUERY_RESULT,
  ARTICLE_SITEMAP_QUERY_RESULT,
  BLOG_SETTINGS_QUERY_RESULT,
  RELATED_ARTICLES_QUERY_RESULT,
} from "../sanity.types";
import {
  ArticleContentError,
  mapArticleBody,
  mapArticleImage,
} from "./article-body-mapping";

type ArticleDocument = NonNullable<ARTICLE_BY_ID_QUERY_RESULT>;
type ArticleAuthorDocument = NonNullable<ArticleDocument["author"]>;
type RelatedDocument = RELATED_ARTICLES_QUERY_RESULT[number];
type SitemapDocument = ARTICLE_SITEMAP_QUERY_RESULT[number];

function requiredText(value: string | null | undefined, field: string) {
  const normalized = value?.trim();
  if (normalized) return normalized;
  throw new ArticleContentError(
    `Sanity article content is incomplete: "${field}" is required.`,
  );
}

function optionalText(value: string | null | undefined) {
  const normalized = value?.trim();
  return normalized ? normalized : undefined;
}

function requiredDate(value: string | null | undefined, field: string) {
  const normalized = value?.trim();
  if (!normalized) {
    throw new ArticleContentError(
      `Sanity article content is incomplete: "${field}" is required.`,
    );
  }

  const time = new Date(normalized).getTime();
  if (!Number.isFinite(time)) {
    throw new ArticleContentError(
      `Sanity article content has an invalid date at "${field}".`,
    );
  }

  return { value: normalized, time };
}

function mapAuthor(
  author: ArticleAuthorDocument | null,
  field: string,
): ArticleAuthor {
  if (!author) {
    throw new ArticleContentError(
      `Sanity article content is incomplete: "${field}" is required.`,
    );
  }

  const image = author.image
    ? mapArticleImage(author.image, `${field}.image`, 160)
    : undefined;

  return {
    name: requiredText(author.name, `${field}.name`),
    ...(optionalText(author.role) ? { role: optionalText(author.role) } : {}),
    ...(optionalText(author.bio) ? { bio: optionalText(author.bio) } : {}),
    ...(image ? { image } : {}),
  };
}

function mapTags(tags: ArticleDocument["tags"]): ArticleTag[] {
  const mapped: ArticleTag[] = [];
  const seen = new Set<string>();

  for (const [index, tag] of (tags ?? []).entries()) {
    if (!tag?._id || seen.has(tag._id)) continue;
    seen.add(tag._id);
    mapped.push({
      id: tag._id,
      title: requiredText(tag.title, `tags[${index}].title`),
    });
  }

  return mapped;
}

function mapSeo(document: ArticleDocument, title: string, excerpt: string) {
  const seoTitle = optionalText(document.seo?.title);
  const seoDescription = optionalText(document.seo?.description);

  if (Boolean(seoTitle) !== Boolean(seoDescription)) {
    throw new ArticleContentError(
      'Sanity article content is incomplete: fill both "seo.title" and "seo.description", or leave both empty.',
    );
  }

  return {
    title: seoTitle ?? title,
    description: seoDescription ?? excerpt,
  };
}

export function mapArticle(document: ArticleDocument): ArticlePageContent {
  const id = requiredText(document._id, "_id");
  const title = requiredText(document.title, "title");
  const slug = requiredText(document.slug, "slug");
  const excerpt = requiredText(document.excerpt, "excerpt");
  const cover = mapArticleImage(document.cover, "cover", 1600);
  const author = mapAuthor(document.author, "author");
  const tags = mapTags(document.tags);
  const publishedAt = requiredDate(document.publishedAt, "publishedAt");
  const body = mapArticleBody(document.body);
  const readingTimeMinutes = getArticleReadingTimeMinutes(body);
  const genuineUpdate = isGenuineArticleUpdate(
    publishedAt.value,
    document.updatedAt ?? undefined,
  );
  const updated = genuineUpdate
    ? requiredDate(document.updatedAt, "updatedAt")
    : null;

  return {
    id,
    title,
    slug,
    href: articlePath(slug),
    excerpt,
    cover,
    ...(optionalText(document.coverCaption)
      ? { coverCaption: optionalText(document.coverCaption) }
      : {}),
    author,
    tags,
    publishedAt: publishedAt.value,
    publishedLabel: formatArticleDate(publishedAt.value),
    ...(updated
      ? {
          updatedAt: updated.value,
          updatedLabel: formatArticleDate(updated.value),
        }
      : {}),
    readingTimeMinutes,
    readingTimeLabel: formatReadingTime(readingTimeMinutes),
    body,
    toc: extractArticleToc(body),
    seo: mapSeo(document, title, excerpt),
  };
}

type MappedRelated = {
  sharedTags: number;
  publishedTime: number;
  item: RelatedArticle;
};

function mapRelatedArticle(
  document: RelatedDocument,
  currentTagIds: ReadonlySet<string>,
): MappedRelated | null {
  const id = optionalText(document._id);
  const slug = optionalText(document.slug);
  const title = optionalText(document.title);
  const excerpt = optionalText(document.excerpt);
  if (!id || !slug || !title || !excerpt) return null;

  const publishedAt = document.publishedAt?.trim();
  if (!publishedAt || !Number.isFinite(new Date(publishedAt).getTime())) {
    return null;
  }

  try {
    const tags = mapTags(document.tags);
    const body = mapArticleBody(document.body);
    const readingTimeMinutes = getArticleReadingTimeMinutes(body);
    const cover = mapArticleImage(document.cover, "cover", 800);
    const sharedTags = tags.filter((tag) => currentTagIds.has(tag.id)).length;

    if (sharedTags === 0) return null;

    return {
      sharedTags,
      publishedTime: new Date(publishedAt).getTime(),
      item: {
        id,
        title,
        description: excerpt,
        image: {
          src: cover.src,
          alt: cover.alt,
          ...(cover.objectPosition
            ? { objectPosition: cover.objectPosition }
            : {}),
        },
        href: articlePath(slug),
        category: tags[0]?.title ?? "مقال",
        readingTimeLabel: formatReadingTime(readingTimeMinutes),
        publishedDate: formatArticleDate(publishedAt),
      },
    };
  } catch (error) {
    if (error instanceof ArticleContentError) return null;
    throw error;
  }
}

/**
 * Related articles share at least one tag. Sorting prefers more shared tags,
 * then the newest publication date, then a stable document id.
 */
export function mapRelatedArticles(
  documents: RELATED_ARTICLES_QUERY_RESULT,
  currentTagIds: readonly string[],
): RelatedArticle[] {
  const tagIds = new Set(currentTagIds);

  return documents
    .flatMap((document) => {
      const mapped = mapRelatedArticle(document, tagIds);
      return mapped ? [mapped] : [];
    })
    .sort(
      (left, right) =>
        right.sharedTags - left.sharedTags ||
        right.publishedTime - left.publishedTime ||
        left.item.id.localeCompare(right.item.id),
    )
    .slice(0, 3)
    .map(({ item }) => item);
}

export function mapBlogBanners(
  document: BLOG_SETTINGS_QUERY_RESULT,
): BlogBanners {
  const configuredNumber = document?.whatsappNumber?.trim() ?? "";
  const whatsappNumber = /^\+?[1-9]\d{7,14}$/.test(configuredNumber)
    ? configuredNumber.replace(/^\+/, "")
    : null;

  return {
    sidebar: resolveDestination(document?.sidebarDestination) ?? null,
    whatsapp: whatsappNumber
      ? {
          href: `https://wa.me/${whatsappNumber}`,
          external: true,
          openInNewTab: true,
        }
      : null,
  };
}

export function mapArticleSitemapEntries(
  documents: ARTICLE_SITEMAP_QUERY_RESULT,
) {
  return documents.flatMap((document) => {
    const entry = mapArticleSitemapEntry(document);
    return entry ? [entry] : [];
  });
}

function mapArticleSitemapEntry(document: SitemapDocument) {
  const slug = optionalText(document.slug);
  if (!slug) return null;

  const published = document.publishedAt?.trim();
  const updated = document.updatedAt?.trim();
  const publishedValid =
    published && Number.isFinite(new Date(published).getTime());
  const updatedValid = updated && Number.isFinite(new Date(updated).getTime());

  if (!publishedValid) return null;

  const lastModified =
    updatedValid && isGenuineArticleUpdate(published, updated)
      ? updated
      : published;

  return {
    slug,
    lastModified,
  };
}
