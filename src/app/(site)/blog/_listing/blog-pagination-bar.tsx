"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import type { MouseEvent } from "react";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import {
  formatBlogArticleCount,
  getBlogPaginationWindow,
} from "@/lib/blog";
import { cn } from "cn";

type BlogPaginationBarProps = {
  page: number;
  pageCount: number;
  from: number;
  to: number;
  total: number;
  showFeatured: boolean;
  onPageChange: (page: number) => void;
};

const pageControlClass =
  "size-10 border-border px-0 text-sm text-brand-navy tabular-nums transition-colors hover:bg-surface-blue hover:text-brand-navy";
const activePageControlClass =
  "border-brand-navy bg-brand-navy text-primary-foreground hover:bg-brand-navy hover:text-primary-foreground";
const disabledControlClass =
  "border-transparent bg-[#f1f4f6] text-muted-foreground hover:bg-[#f1f4f6] hover:text-muted-foreground";

export function BlogPaginationBar({
  page,
  pageCount,
  from,
  to,
  total,
  showFeatured,
  onPageChange,
}: BlogPaginationBarProps) {
  const pageWindow = getBlogPaginationWindow(page, pageCount);
  const isFirstPage = page === 1;
  const isLastPage = page === pageCount;

  const goTo = (next: number) => {
    if (next < 1 || next > pageCount || next === page) return;
    onPageChange(next);
  };

  const controlProps = (target: number) => ({
    href: "#blog-articles",
    onClick: (event: MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      goTo(target);
    },
  });

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p
          className="text-xs leading-6 text-muted-foreground"
          aria-live="polite"
        >
          {total === 1 ? (
            `${formatBlogArticleCount(1)} معروض`
          ) : (
            <>
              عرض{" "}
              <span className="font-semibold text-brand-navy">
                {from}–{to}
              </span>{" "}
              من أصل {formatBlogArticleCount(total)}
            </>
          )}
          {showFeatured ? "، إضافة إلى المقال الأبرز" : ""}
        </p>

        {pageCount > 1 ? (
          <Pagination
            aria-label="التنقل بين صفحات المقالات"
            className="mx-0 w-auto"
          >
            <PaginationContent className="gap-1.5 sm:gap-2">
              <PaginationItem>
                <PaginationLink
                  size="icon-sm"
                  aria-label="الصفحة السابقة"
                  aria-disabled={isFirstPage || undefined}
                  tabIndex={isFirstPage ? -1 : undefined}
                  className={cn(
                    pageControlClass,
                    isFirstPage && disabledControlClass,
                  )}
                  {...controlProps(page - 1)}
                >
                  <ChevronRight aria-hidden="true" />
                </PaginationLink>
              </PaginationItem>

              <PaginationItem className="sm:hidden">
                <span className="text-xs text-muted-foreground tabular-nums">
                  {page} من {pageCount}
                </span>
              </PaginationItem>

              {pageWindow.map((item, index) =>
                item === "ellipsis" ? (
                  <PaginationItem
                    key={`ellipsis-${index}`}
                    className="hidden sm:block"
                  >
                    <PaginationEllipsis className="size-10 text-muted-foreground" />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={item} className="hidden sm:block">
                    <PaginationLink
                      size="icon-sm"
                      isActive={item === page}
                      aria-label={`الصفحة ${item}`}
                      className={cn(
                        pageControlClass,
                        item === page && activePageControlClass,
                      )}
                      {...controlProps(item)}
                    >
                      {item}
                    </PaginationLink>
                  </PaginationItem>
                ),
              )}

              <PaginationItem>
                <PaginationLink
                  size="icon-sm"
                  aria-label="الصفحة التالية"
                  aria-disabled={isLastPage || undefined}
                  tabIndex={isLastPage ? -1 : undefined}
                  className={cn(
                    pageControlClass,
                    isLastPage && disabledControlClass,
                  )}
                  {...controlProps(page + 1)}
                >
                  <ChevronLeft aria-hidden="true" />
                </PaginationLink>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        ) : null}
      </div>
    </div>
  );
}
