"use client";

import { Search } from "lucide-react";

import { MaxWidth } from "@/components/MaxWidth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { BlogTagFacet } from "@/lib/blog";
import { cn } from "cn";

type BlogFilterBarProps = {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: () => void;
  facets: readonly BlogTagFacet[];
  allCount: number;
  selectedTagId: string | null;
  onSelectTag: (tagId: string | null) => void;
};

export function BlogFilterBar({
  searchValue,
  onSearchChange,
  onSearchSubmit,
  facets,
  allCount,
  selectedTagId,
  onSelectTag,
}: BlogFilterBarProps) {
  return (
    <section
      aria-label="البحث وتصفية المقالات"
      className="border-b border-border/80 bg-card shadow-[0_2px_4px_rgba(6,42,70,0.03)]"
    >
      <MaxWidth className="flex flex-col gap-4 py-4 lg:flex-row lg:items-center lg:justify-between">
        <form
          role="search"
          onSubmit={(event) => {
            event.preventDefault();
            onSearchSubmit();
          }}
          className="relative flex w-full items-center lg:max-w-105"
        >
          <label htmlFor="blog-search" className="sr-only">
            ابحث في مقالات المدونة
          </label>
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute inset-s-4 size-4 text-muted-foreground"
          />
          <Input
            id="blog-search"
            type="search"
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="ابحث في مقالات العزل، المواد، أو كود البناء..."
            className="h-13 rounded-lg border-input bg-background ps-10 pe-20 text-sm"
          />
          <Button
            type="submit"
            size="sm"
            className="absolute inset-e-2 top-1/2 h-8.5 -translate-y-1/2 rounded-lg px-4 text-xs"
          >
            بحث
          </Button>
        </form>

        <div
          role="group"
          aria-label="تصفية المقالات حسب التصنيف"
          className="-mx-1 flex w-full items-center gap-2 overflow-x-auto px-1 pb-1 lg:mx-0 lg:w-auto lg:overflow-visible lg:pb-0"
        >
          <FilterTab
            label="الكل"
            count={allCount}
            active={selectedTagId === null}
            onClick={() => onSelectTag(null)}
          />
          {facets.map((facet) => (
            <FilterTab
              key={facet.id}
              label={facet.title}
              count={facet.count}
              active={selectedTagId === facet.id}
              onClick={() => onSelectTag(facet.id)}
            />
          ))}
        </div>
      </MaxWidth>
    </section>
  );
}

function FilterTab({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "inline-flex shrink-0 items-center gap-2 rounded-lg border text-base font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        active
          ? "border-brand-navy bg-brand-navy px-4 py-2.5 text-primary-foreground"
          : "border-border/40 bg-[#f1f4f6] px-4.25 py-2.75 text-muted-foreground hover:bg-surface-blue hover:text-brand-navy",
      )}
    >
      <span
        className={cn(
          "rounded-full px-2 py-0.5 text-xs leading-5",
          active
            ? "bg-white/20 text-primary-foreground"
            : "bg-border text-brand-navy",
        )}
      >
        {count}
      </span>
      <span>{label}</span>
    </button>
  );
}
