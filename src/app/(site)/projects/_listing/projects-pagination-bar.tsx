"use client";

import type { MouseEvent } from "react";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  formatProjectCount,
  getProjectPaginationWindow,
} from "@/lib/projects";
import { cn } from "cn";

type ProjectsPaginationBarProps = {
  page: number;
  pageCount: number;
  from: number;
  to: number;
  total: number;
  onPageChange: (page: number) => void;
};

const controlClass =
  "h-10 rounded-lg border-border bg-card px-4 text-sm font-normal text-card-foreground transition-colors hover:bg-surface-blue hover:text-brand-navy";
const pageControlClass =
  "size-10 border-border bg-card px-0 text-base font-medium text-card-foreground tabular-nums transition-colors hover:bg-surface-blue hover:text-brand-navy";
const activePageControlClass =
  "border-brand-navy bg-brand-navy text-primary-foreground hover:bg-brand-navy hover:text-primary-foreground";
const disabledControlClass =
  "border-transparent bg-muted text-muted-foreground hover:bg-muted hover:text-muted-foreground";

export function ProjectsPaginationBar({
  page,
  pageCount,
  from,
  to,
  total,
  onPageChange,
}: ProjectsPaginationBarProps) {
  const pageWindow = getProjectPaginationWindow(page, pageCount);
  const isFirstPage = page === 1;
  const isLastPage = page === pageCount;

  const goTo = (next: number) => {
    if (next < 1 || next > pageCount || next === page) return;
    onPageChange(next);
  };

  const controlProps = (target: number) => ({
    href: "#projects-list",
    onClick: (event: MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      goTo(target);
    },
  });

  return (
    <div className="flex flex-col-reverse gap-4 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm leading-6 text-muted-foreground" aria-live="polite">
        عرض{" "}
        <span className="font-medium text-brand-navy tabular-nums">
          {from}–{to}
        </span>{" "}
        من أصل {formatProjectCount(total)}
      </p>

      {pageCount > 1 ? (
        <Pagination
          aria-label="التنقل بين صفحات المشاريع"
          className="mx-0 w-auto"
        >
          <PaginationContent className="gap-1.5">
            <PaginationItem>
              <PaginationPrevious
                text="السابق"
                aria-label="الصفحة السابقة"
                aria-disabled={isFirstPage || undefined}
                tabIndex={isFirstPage ? -1 : undefined}
                className={cn(
                  controlClass,
                  "ps-4!",
                  isFirstPage && disabledControlClass,
                )}
                {...controlProps(page - 1)}
              />
            </PaginationItem>

            <PaginationItem className="sm:hidden">
              <span className="px-1 text-xs text-muted-foreground tabular-nums">
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
              <PaginationNext
                text="التالي"
                aria-label="الصفحة التالية"
                aria-disabled={isLastPage || undefined}
                tabIndex={isLastPage ? -1 : undefined}
                className={cn(
                  controlClass,
                  "pe-4!",
                  isLastPage && disabledControlClass,
                )}
                {...controlProps(page + 1)}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      ) : null}
    </div>
  );
}
