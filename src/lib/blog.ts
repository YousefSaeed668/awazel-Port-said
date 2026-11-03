import type { ComponentProps } from "react";
import type { BlogCard, ContentImage } from "@/components/content-cards";
import type { ResolvedDestination } from "@/lib/links";

export type ArticleTextBlockStyle =
  "normal" | "h2" | "h3" | "h4" | "blockquote";

export type ArticleListType = "bullet" | "number";

export type ArticleLinkMarkDef = {
  _key: string;
  _type: "articleLink";
  href: string;
  external: boolean;
  openInNewTab: boolean;
};

export type ArticleTextSpan = {
  _type: "span";
  _key: string;
  text: string;
  marks: string[];
};

export type ArticleTextBlock = {
  _type: "block";
  _key: string;
  style: ArticleTextBlockStyle;
  listItem?: ArticleListType;
  level?: number;
  children: ArticleTextSpan[];
  markDefs: ArticleLinkMarkDef[];
};

export type ArticleImage = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  objectPosition?: string;
};

export type ArticleBodyImageBlock = {
  _type: "articleBodyImage";
  _key: string;
  image: ArticleImage;
  caption?: string;
};

export type ArticleCalloutTone = "info" | "warning" | "technical";

export type ArticleCallout = {
  _type: "articleCallout";
  _key: string;
  tone: ArticleCalloutTone;
  title?: string;
  body: ArticleTextBlock[];
};

export type ArticleTableRow = {
  key: string;
  cells: string[];
};

export type ArticleTable = {
  _type: "articleTable";
  _key: string;
  caption?: string;
  headers?: string[];
  rows: ArticleTableRow[];
};

export type ArticleCard = {
  key: string;
  title: string;
  description: string;
  icon?: "water" | "thermal" | "layers";
};

export type ArticleCardGroup = {
  _type: "articleCardGroup";
  _key: string;
  title?: string;
  description?: string;
  cards: ArticleCard[];
};

export type ArticleExplanation = {
  _type: "articleExplanation";
  _key: string;
  title: string;
  text: string;
  image?: ArticleImage;
  imageCaption?: string;
  points?: string[];
  imageSide: "start" | "end";
};

export type ArticleQaItem = {
  key: string;
  question: string;
  answer: string;
};

export type ArticleQaGroup = {
  _type: "articleQaGroup";
  _key: string;
  title?: string;
  items: ArticleQaItem[];
};

export type ArticleStep = {
  key: string;
  title: string;
  description?: string;
};

export type ArticleNumberedSteps = {
  _type: "articleNumberedSteps";
  _key: string;
  title?: string;
  items: ArticleStep[];
};

export type ArticlePromoAction = {
  label: string;
  href: string;
  external: boolean;
  openInNewTab: boolean;
};

export type ArticleServicePromo = {
  _type: "articleServicePromo";
  _key: string;
  title: string;
  description: string;
  action: ArticlePromoAction | null;
};

export type ArticleBodyValue = Array<
  | ArticleTextBlock
  | ArticleBodyImageBlock
  | ArticleCallout
  | ArticleTable
  | ArticleCardGroup
  | ArticleExplanation
  | ArticleQaGroup
  | ArticleNumberedSteps
  | ArticleServicePromo
>;

export type ArticleTocItem = {
  id: string;
  label: string;
};

export type ArticleAuthor = {
  name: string;
  role?: string;
  bio?: string;
  image?: ArticleImage;
};

export type ArticleTag = {
  id: string;
  title: string;
};

export type BlogBanners = {
  sidebar: ResolvedDestination | null;
  wide: ResolvedDestination | null;
  whatsapp: ResolvedDestination;
};

export type RelatedArticle = { id: string } & Omit<
  ComponentProps<typeof BlogCard>,
  "className" | "headingLevel" | "imageSizes" | "linkLabel" | "variant"
>;

export interface ArticlePageContent {
  id: string;
  title: string;
  slug: string;
  href: string;
  excerpt: string;
  cover: ArticleImage;
  coverCaption?: string;
  author: ArticleAuthor;
  tags: readonly ArticleTag[];
  publishedAt: string;
  publishedLabel: string;
  updatedAt?: string;
  updatedLabel?: string;
  readingTimeMinutes: number;
  readingTimeLabel: string;
  body: ArticleBodyValue;
  toc: readonly ArticleTocItem[];
  seo: {
    title: string;
    description: string;
  };
}

export type BlogListingAuthor = {
  name: string;
  role?: string;
  image?: ContentImage;
};

export type BlogListingArticle = {
  id: string;
  title: string;
  href: string;
  excerpt: string;
  image: ContentImage;
  publishedAt: string;
  publishedLabel: string;
  readingTimeMinutes: number;
  readingTimeLabel: string;
  tags: readonly ArticleTag[];
  author?: BlogListingAuthor;
};

export type BlogListingFilters = {
  query: string;
  tagId: string | null;
};

export type BlogTagFacet = {
  id: string;
  title: string;
  count: number;
};

export type BlogPaginationItem = number | "ellipsis";

export type ArticleWordSourceBlock = {
  _type?: string | null;
  _key?: string | null;
  children?: ReadonlyArray<{ text?: string | null }> | null;
  caption?: string | null;
  title?: string | null;
  text?: string | null;
  description?: string | null;
  headers?: readonly string[] | null;
  points?: readonly string[] | null;
  imageCaption?: string | null;
  rows?: ReadonlyArray<{ cells?: readonly string[] | null }> | null;
  cards?: ReadonlyArray<{
    title?: string | null;
    description?: string | null;
  }> | null;
  items?: ReadonlyArray<{
    question?: string | null;
    answer?: string | null;
    title?: string | null;
    description?: string | null;
  }> | null;
  body?: ReadonlyArray<{
    children?: ReadonlyArray<{ text?: string | null }> | null;
  }> | null;
  action?: { label?: string | null } | null;
};

export const DEFAULT_BLOG_WHATSAPP_NUMBER = "966500000000";

export const BLOG_PATH = "/blog";

export const BLOG_LISTING_PAGE_SIZE = 6;

const articleDateFormatter = new Intl.DateTimeFormat("ar-EG-u-ca-gregory", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

const MAX_SLUG_LENGTH = 96;

const ARABIC_DIACRITICS =
  /[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/g;

const ARABIC_INDIC_DIGITS = "٠١٢٣٤٥٦٧٨٩";

const EASTERN_ARABIC_DIGITS = "۰۱۲۳۴۵۶۷۸۹";

const ARABIC_MARKS_PATTERN = /[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED]/g;

const TATWEEL_PATTERN = /\u0640/g;

const ALEF_PATTERN = /[\u0622\u0623\u0625\u0671]/g;

const WORDS_PER_MINUTE = 200;

const WORD_PATTERN = /[\p{L}\p{N}]+/gu;

export function articlePath(slug: string) {
  return `${BLOG_PATH}/${encodeURIComponent(slug)}`;
}

export function formatArticleDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return articleDateFormatter.format(date);
}

export function isGenuineArticleUpdate(
  publishedAt: string,
  updatedAt: string | undefined,
) {
  if (!updatedAt) return false;

  const published = new Date(publishedAt).getTime();
  const updated = new Date(updatedAt).getTime();

  return (
    Number.isFinite(published) &&
    Number.isFinite(updated) &&
    updated > published
  );
}

function normalizeDigits(value: string) {
  return value.replace(/[٠-٩۰-۹]/g, (digit) => {
    const arabicIndex = ARABIC_INDIC_DIGITS.indexOf(digit);
    if (arabicIndex >= 0) return String(arabicIndex);

    const easternIndex = EASTERN_ARABIC_DIGITS.indexOf(digit);
    return easternIndex >= 0 ? String(easternIndex) : digit;
  });
}

export function slugifyArabic(source: string) {
  const normalized = normalizeDigits(
    source.normalize("NFKC").toLowerCase().replace(ARABIC_DIACRITICS, ""),
  )
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي");

  const cleaned = normalized
    .replace(/[^\p{L}\p{N}\s-]/gu, " ")
    .replace(/[\s-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (!cleaned) return "article";

  return cleaned.slice(0, MAX_SLUG_LENGTH).replace(/-+$/g, "") || "article";
}

export function normalizeBlogSearchText(value: string) {
  return value
    .toLowerCase()
    .replace(TATWEEL_PATTERN, "")
    .replace(ARABIC_MARKS_PATTERN, "")
    .replace(ALEF_PATTERN, "\u0627")
    .replace(/\s+/g, " ")
    .trim();
}

export function getBlogSearchTokens(query: string) {
  const normalized = normalizeBlogSearchText(query);
  return normalized ? normalized.split(" ") : [];
}

export function getBlogSearchIndex(article: BlogListingArticle) {
  return normalizeBlogSearchText(
    [article.title, article.excerpt, ...article.tags.map((tag) => tag.title)]
      .join(" "),
  );
}

export function filterBlogListing(
  articles: readonly BlogListingArticle[],
  filters: BlogListingFilters,
) {
  const tokens = getBlogSearchTokens(filters.query);

  if (tokens.length === 0 && !filters.tagId) {
    return [...articles];
  }

  return articles.filter((article) => {
    if (filters.tagId && !article.tags.some((tag) => tag.id === filters.tagId)) {
      return false;
    }
    if (tokens.length === 0) return true;

    const index = getBlogSearchIndex(article);
    return tokens.every((token) => index.includes(token));
  });
}

export function getBlogTagFacets(
  articles: readonly BlogListingArticle[],
): BlogTagFacet[] {
  const facets = new Map<string, BlogTagFacet>();

  for (const article of articles) {
    const seen = new Set<string>();

    for (const tag of article.tags) {
      if (seen.has(tag.id)) continue;
      seen.add(tag.id);

      const facet = facets.get(tag.id);
      if (facet) {
        facet.count += 1;
      } else {
        facets.set(tag.id, { id: tag.id, title: tag.title, count: 1 });
      }
    }
  }

  return [...facets.values()].sort(
    (left, right) =>
      right.count - left.count || left.title.localeCompare(right.title, "ar"),
  );
}

export function getBlogPageCount(
  totalItems: number,
  pageSize = BLOG_LISTING_PAGE_SIZE,
) {
  return Math.max(1, Math.ceil(totalItems / pageSize));
}

export function formatArticleCount(count: number) {
  if (count === 1) return "مقال واحد";
  if (count === 2) return "مقالين";
  if (count <= 10) return `${count} مقالات`;
  return `${count} مقالاً`;
}

export function formatBlogArticleCount(count: number) {
  if (count === 1) return "مقال فني واحد";
  if (count === 2) return "مقالين فنيين";
  if (count <= 10) return `${count} مقالات فنية`;
  return `${count} مقالاً فنياً`;
}

export function formatBlogReadingTime(minutes: number) {
  if (minutes <= 1) return "قراءة دقيقة واحدة";
  if (minutes === 2) return "قراءة دقيقتين";
  if (minutes <= 10) return `قراءة ${minutes} دقائق`;
  return `قراءة ${minutes} دقيقة`;
}

export function getBlogPageItems<T>(
  items: readonly T[],
  page: number,
  pageSize = BLOG_LISTING_PAGE_SIZE,
) {
  const pageCount = getBlogPageCount(items.length, pageSize);
  const current = Math.min(Math.max(Math.trunc(page) || 1, 1), pageCount);
  const start = (current - 1) * pageSize;
  const end = Math.min(start + pageSize, items.length);

  return {
    current,
    pageCount,
    start,
    end,
    items: items.slice(start, end),
  };
}

export function getBlogPaginationWindow(
  current: number,
  pageCount: number,
): BlogPaginationItem[] {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }

  const safeCurrent = Math.min(Math.max(current, 1), pageCount);
  const pages = new Set([1, pageCount, safeCurrent - 1, safeCurrent, safeCurrent + 1]);

  const sorted = [...pages]
    .filter((page) => page >= 1 && page <= pageCount)
    .sort((left, right) => left - right);

  const window: BlogPaginationItem[] = [];
  let previous = 0;

  for (const page of sorted) {
    if (previous > 0 && page - previous > 1) {
      window.push("ellipsis");
    }
    window.push(page);
    previous = page;
  }

  return window;
}

export function articleSectionId(blockKey: string) {
  return `article-section-${blockKey}`;
}

export function textFromArticleBlock(block: ArticleTextBlock) {
  return block.children
    .map((span) => span.text)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

export function extractArticleToc(
  body: ArticleBodyValue,
): ArticleTocItem[] {
  return body.flatMap((block) => {
    if (
      block._type !== "block" ||
      block.style !== "h2" ||
      block.listItem
    ) {
      return [];
    }

    const label = textFromArticleBlock(block);
    if (!label) return [];

    return [{ id: articleSectionId(block._key), label }];
  });
}

function countWords(value: string) {
  return value.match(WORD_PATTERN)?.length ?? 0;
}

function countTextBlockWords(block: {
  children?: ReadonlyArray<{ text?: string | null }> | null;
}) {
  return (block.children ?? []).reduce(
    (total, span) => total + countWords(span.text ?? ""),
    0,
  );
}

export function countArticleWords(body: ArticleBodyValue) {
  return countArticleSourceWords(body);
}

export function countArticleSourceWords(
  blocks: readonly ArticleWordSourceBlock[],
) {
  return blocks.reduce((total, block) => {
    switch (block._type) {
      case "block":
        return total + countTextBlockWords(block);
      case "articleBodyImage":
        return total + countWords(block.caption ?? "");
      case "articleCallout":
        return (
          total +
          countWords(block.title ?? "") +
          (block.body ?? []).reduce(
            (calloutTotal, textBlock) =>
              calloutTotal + countTextBlockWords(textBlock),
            0,
          )
        );
      case "articleTable":
        return (
          total +
          countWords(block.caption ?? "") +
          (block.headers ?? []).reduce(
            (tableTotal, header) => tableTotal + countWords(header),
            0,
          ) +
          (block.rows ?? []).reduce(
            (tableTotal, row) =>
              tableTotal +
              (row.cells ?? []).reduce(
                (rowTotal, cell) => rowTotal + countWords(cell),
                0,
              ),
            0,
          )
        );
      case "articleCardGroup":
        return (
          total +
          countWords(block.title ?? "") +
          countWords(block.description ?? "") +
          (block.cards ?? []).reduce(
            (cardsTotal, card) =>
              cardsTotal +
              countWords(card.title ?? "") +
              countWords(card.description ?? ""),
            0,
          )
        );
      case "articleExplanation":
        return (
          total +
          countWords(block.title ?? "") +
          countWords(block.text ?? "") +
          countWords(block.imageCaption ?? "") +
          (block.points ?? []).reduce(
            (pointsTotal, point) => pointsTotal + countWords(point),
            0,
          )
        );
      case "articleQaGroup":
        return (
          total +
          countWords(block.title ?? "") +
          (block.items ?? []).reduce(
            (itemsTotal, item) =>
              itemsTotal +
              countWords(item.question ?? "") +
              countWords(item.answer ?? ""),
            0,
          )
        );
      case "articleNumberedSteps":
        return (
          total +
          countWords(block.title ?? "") +
          (block.items ?? []).reduce(
            (itemsTotal, item) =>
              itemsTotal +
              countWords(item.title ?? "") +
              countWords(item.description ?? ""),
            0,
          )
        );
      case "articleServicePromo":
        return (
          total +
          countWords(block.title ?? "") +
          countWords(block.description ?? "") +
          countWords(block.action?.label ?? "")
        );
      default:
        return total;
    }
  }, 0);
}

export function getArticleReadingTimeMinutes(body: ArticleBodyValue) {
  return getArticleSourceReadingTimeMinutes(body);
}

export function getArticleSourceReadingTimeMinutes(
  blocks: readonly ArticleWordSourceBlock[],
) {
  return Math.max(1, Math.ceil(countArticleSourceWords(blocks) / WORDS_PER_MINUTE));
}

export function formatReadingTime(minutes: number) {
  if (minutes === 1) return "دقيقة قراءة";
  if (minutes === 2) return "دقيقتان قراءة";
  if (minutes >= 3 && minutes <= 10) return `${minutes} دقائق قراءة`;
  return `${minutes} دقيقة قراءة`;
}
