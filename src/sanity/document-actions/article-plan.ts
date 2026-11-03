import type { SanityDocument } from "sanity";

/**
 * Fields that are managed by the publish action itself. They are excluded from
 * the "did the public content change?" comparison so a draft-only edit does not
 * move the public update date.
 */
const MANAGED_FIELDS = new Set([
  "publishedAt",
  "updatedAt",
  "previousSlugs",
  "_id",
  "_type",
  "_rev",
  "_createdAt",
  "_updatedAt",
  "_system",
]);

export type ArticlePublishPatch = {
  set?: Record<string, string | string[]>;
  unset?: string[];
};

export type ArticlePublishExpected = Record<
  "publishedAt" | "updatedAt" | "previousSlugs",
  string | string[] | null
>;

export type ArticlePublishPlan = {
  patches: ArticlePublishPatch[];
  expected: Partial<ArticlePublishExpected>;
};

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function slugOf(document: SanityDocument | null) {
  const slug = document?.slug as { current?: unknown } | undefined;
  return text(slug?.current);
}

function previousSlugsOf(document: SanityDocument | null) {
  const value = document?.previousSlugs;
  if (!Array.isArray(value)) return [] as string[];

  return value
    .map((entry) => text(entry))
    .filter((entry): entry is string => Boolean(entry));
}

function canonicalize(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map(canonicalize).join(",")}]`;
  }

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    const entries = Object.keys(record)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${canonicalize(record[key])}`);
    return `{${entries.join(",")}}`;
  }

  return JSON.stringify(value) ?? "null";
}

function contentSignature(document: SanityDocument | null) {
  if (!document) return "";

  const content = Object.fromEntries(
    Object.entries(document).filter(([key]) => !MANAGED_FIELDS.has(key)),
  );

  return canonicalize(content);
}

function hasPublicContentChanged(
  draft: SanityDocument | null,
  published: SanityDocument | null,
) {
  if (!published) return false;
  return contentSignature(draft) !== contentSignature(published);
}

function sameList(left: string[], right: string[]) {
  return (
    left.length === right.length &&
    left.every((entry, index) => entry === right[index])
  );
}

function normalizeSlugHistory(
  draft: SanityDocument | null,
  published: SanityDocument | null,
) {
  const current = slugOf(draft);
  const publishedSlug = slugOf(published);
  const history = previousSlugsOf(draft);

  if (publishedSlug && current && publishedSlug !== current) {
    history.push(publishedSlug);
  }

  const unique: string[] = [];
  for (const entry of history) {
    if (entry !== current && !unique.includes(entry)) unique.push(entry);
  }

  return unique;
}

function futureTimestamp(now: Date, publishedAt: string) {
  const publishedTime = new Date(publishedAt).getTime();
  const nowTime = now.getTime();

  if (Number.isFinite(publishedTime) && nowTime <= publishedTime) {
    return new Date(publishedTime + 1000).toISOString();
  }

  return now.toISOString();
}

/**
 * Builds the draft patches that must be applied before the native publish
 * action runs. The native action remains responsible for validation,
 * permissions, loading state and error reporting.
 */
export function planArticlePublish(
  draft: SanityDocument | null,
  published: SanityDocument | null,
  now = new Date(),
): ArticlePublishPlan {
  if (!draft) return { patches: [], expected: {} };

  const set: Record<string, string | string[]> = {};
  const unset: string[] = [];
  const expected: ArticlePublishPlan["expected"] = {};

  const draftPublishedAt = text(draft.publishedAt);
  const publishedPublishedAt = text(published?.publishedAt);
  const createdAt = text(published?._createdAt);

  let publishedAt = publishedPublishedAt || draftPublishedAt || createdAt;
  if (!publishedAt) {
    publishedAt = now.toISOString();
  }

  if (publishedAt !== draftPublishedAt) {
    set.publishedAt = publishedAt;
    expected.publishedAt = publishedAt;
  }

  const contentChanged = hasPublicContentChanged(draft, published);
  const draftUpdatedAt = text(draft.updatedAt);

  if (published && contentChanged) {
    const updatedAt = futureTimestamp(now, publishedAt);
    if (updatedAt !== draftUpdatedAt) {
      set.updatedAt = updatedAt;
      expected.updatedAt = updatedAt;
    }
  } else if (!published && draftUpdatedAt) {
    unset.push("updatedAt");
  }

  const currentHistory = previousSlugsOf(draft);
  const history = normalizeSlugHistory(draft, published);

  if (!sameList(currentHistory, history)) {
    set.previousSlugs = history;
    expected.previousSlugs = history;
  }

  const patches: ArticlePublishPatch[] = [];
  if (Object.keys(set).length > 0) patches.push({ set });
  if (unset.length > 0) patches.push({ unset });

  return { patches, expected };
}

export function isArticlePublishPlanApplied(
  draft: SanityDocument | null,
  plan: ArticlePublishPlan,
) {
  if (!draft) return false;

  return Object.entries(plan.expected).every(([field, value]) => {
    const current = draft[field];

    if (value === null) {
      return current === undefined || current === null || current === "";
    }

    if (Array.isArray(value)) {
      return (
        Array.isArray(current) &&
        sameList(
          current.map((entry) => text(entry)).filter(Boolean),
          value,
        )
      );
    }

    return text(current) === value;
  });
}

/**
 * Duplicates must not inherit publication metadata or historical URLs from the
 * source article. Everything else is copied by the native duplicate action.
 */
export function resetArticleDuplicate<T extends Record<string, unknown>>(
  document: T,
): T {
  const next: Record<string, unknown> = { ...document };
  delete next.publishedAt;
  delete next.updatedAt;
  next.previousSlugs = [];

  // The document identity (`_id`, `_type`) is preserved by the spread.
  return next as T;
}
