"use client";

import { useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { ArrowDownWideNarrow } from "lucide-react";

import { BlogCard } from "@/components/content-cards";
import { MaxWidth } from "@/components/MaxWidth";
import type { BlogListingArticle } from "@/lib/blog";
import {
  filterBlogListing,
  formatBlogArticleCount,
  formatBlogReadingTime,
  getBlogPageItems,
  getBlogTagFacets,
} from "@/lib/blog";
import { cn } from "cn";

import { BlogEmptyState } from "./blog-empty-state";
import { BlogFilterBar } from "./blog-filter-bar";
import { BlogPaginationBar } from "./blog-pagination-bar";

const FEATURED_HEADING = "المقال الفني الأبرز";
const FEATURED_META = "أحدث ما نُشر في المدونة";
const ARCHIVE_HEADING = "شبكة المقالات الفنية";
const RESULTS_HEADING = "نتائج البحث";
const SORT_LABEL = "الترتيب حسب: الأحدث أولاً";

export function BlogDirectory({
  articles,
}: {
  articles: readonly BlogListingArticle[];
}) {
  const [searchValue, setSearchValue] = useState("");
  const [query, setQuery] = useState("");
  const [tagId, setTagId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const articlesRef = useRef<HTMLElement>(null);

  const searchResults = useMemo(
    () => filterBlogListing(articles, { query, tagId: null }),
    [articles, query],
  );
  const facets = useMemo(() => getBlogTagFacets(searchResults), [searchResults]);
  const filtered = useMemo(
    () => filterBlogListing(articles, { query, tagId }),
    [articles, query, tagId],
  );

  const pillFacets = useMemo(() => {
    if (!tagId || facets.some((facet) => facet.id === tagId)) return facets;
    const selected = getBlogTagFacets(articles).find(
      (facet) => facet.id === tagId,
    );
    return selected ? [...facets, { ...selected, count: 0 }] : facets;
  }, [articles, facets, tagId]);

  const hasCriteria = query.length > 0 || tagId !== null;
  const featured = hasCriteria ? null : (articles[0] ?? null);
  const gridArticles = featured
    ? filtered.filter((article) => article.id !== featured.id)
    : filtered;
  const { current, pageCount, start, end, items } = getBlogPageItems(
    gridArticles,
    page,
  );
  const showFeatured = Boolean(featured) && current === 1;

  function submitSearch() {
    setQuery(searchValue.trim());
    setPage(1);
  }

  function selectTag(nextTagId: string | null) {
    setTagId(nextTagId);
    setPage(1);
  }

  function resetFilters() {
    setSearchValue("");
    setQuery("");
    setTagId(null);
    setPage(1);
  }

  function changePage(nextPage: number) {
    setPage(nextPage);
    articlesRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <>
      {articles.length > 0 ? (
        <BlogFilterBar
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          onSearchSubmit={submitSearch}
          facets={pillFacets}
          allCount={searchResults.length}
          selectedTagId={tagId}
          onSelectTag={selectTag}
        />
      ) : null}

      <section
        ref={articlesRef}
        id="blog-articles"
        aria-label="مقالات المدونة"
        className="scroll-mt-24 bg-background py-12 lg:py-16"
      >
        <MaxWidth className="flex flex-col gap-12 lg:gap-16">
          {showFeatured && featured ? (
            <section
              aria-labelledby="blog-featured-title"
              className="flex flex-col gap-6"
            >
              <BlogSectionHeading
                id="blog-featured-title"
                title={FEATURED_HEADING}
                meta={FEATURED_META}
              />
              <BlogCard
                variant="featured"
                title={featured.title}
                description={featured.excerpt}
                image={featured.image}
                href={featured.href}
                category={featured.tags[0]?.title ?? "مقال فني"}
                readingTimeLabel={formatBlogReadingTime(
                  featured.readingTimeMinutes,
                )}
                publishedDate={featured.publishedLabel}
                author={featured.author}
              />
            </section>
          ) : null}

          {articles.length === 0 ? (
            <BlogEmptyState variant="empty-archive" />
          ) : filtered.length === 0 ? (
            <BlogEmptyState
              variant="no-results"
              query={query}
              onReset={resetFilters}
              secondaryAction={
                query && tagId
                  ? {
                      label: `عرض كل نتائج البحث (${formatBlogArticleCount(searchResults.length)})`,
                      onClick: () => selectTag(null),
                    }
                  : undefined
              }
            />
          ) : gridArticles.length > 0 ? (
            <section
              aria-labelledby="blog-archive-title"
              className="flex flex-col gap-8"
            >
              <div className="flex flex-col gap-8">
                <BlogSectionHeading
                  id="blog-archive-title"
                  title={hasCriteria ? RESULTS_HEADING : ARCHIVE_HEADING}
                  accent="blue"
                  bordered
                  meta={
                    <span className="inline-flex items-center gap-1.5">
                      <ArrowDownWideNarrow
                        aria-hidden="true"
                        className="size-3.5"
                      />
                      {SORT_LABEL}
                    </span>
                  }
                />

                <ul className="grid list-none gap-8 p-0 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((article) => (
                    <li key={article.id} className="min-w-0">
                      <BlogCard
                        variant="listing"
                        title={article.title}
                        description={article.excerpt}
                        image={article.image}
                        href={article.href}
                        category={article.tags[0]?.title ?? "مقال فني"}
                        readingTimeLabel={formatBlogReadingTime(
                          article.readingTimeMinutes,
                        )}
                        publishedDate={article.publishedLabel}
                        secondaryTag={article.tags[1]?.title}
                      />
                    </li>
                  ))}
                </ul>
              </div>

              <BlogPaginationBar
                page={current}
                pageCount={pageCount}
                from={start + 1}
                to={end}
                total={gridArticles.length}
                showFeatured={showFeatured}
                onPageChange={changePage}
              />
            </section>
          ) : null}
        </MaxWidth>
      </section>
    </>
  );
}

function BlogSectionHeading({
  id,
  title,
  meta,
  accent = "gold",
  bordered = false,
}: {
  id?: string;
  title: string;
  meta?: ReactNode;
  accent?: "gold" | "blue";
  bordered?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-3",
        bordered && "border-b border-border pb-4.25",
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        <span
          aria-hidden="true"
          className={cn(
            "h-6 w-2.5 shrink-0 rounded-sm",
            accent === "blue" ? "bg-brand-blue" : "bg-brand-gold",
          )}
        />
        <h2
          id={id}
          className="text-xl font-semibold text-brand-navy sm:text-2xl"
        >
          {title}
        </h2>
      </div>
      {meta ? (
        <div className="text-sm leading-6 text-muted-foreground">{meta}</div>
      ) : null}
    </div>
  );
}
