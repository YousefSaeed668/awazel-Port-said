"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MaxWidth } from "@/components/MaxWidth";
import {
  formatProjectCount,
  PROJECT_SORT_OPTIONS,
  type ProjectCategory,
  type ProjectCategoryFacet,
  type ProjectSort,
} from "@/lib/projects";
import { cn } from "cn";

type ProjectsToolbarProps = {
  sort: ProjectSort;
  onSortChange: (sort: ProjectSort) => void;
  facets: readonly ProjectCategoryFacet[];
  allCount: number;
  selectedCategory: ProjectCategory | null;
  onSelectCategory: (category: ProjectCategory | null) => void;
  visibleCount: number;
};

export function ProjectsToolbar({
  sort,
  onSortChange,
  facets,
  allCount,
  selectedCategory,
  onSelectCategory,
  visibleCount,
}: ProjectsToolbarProps) {
  return (
    <section
      aria-label="ترتيب وتصفية المشاريع"
      className="border-b border-border bg-card/95 shadow-[0_2px_12px_rgba(0,0,0,0.03)] backdrop-blur-md"
    >
      <MaxWidth className="flex flex-col gap-4 py-6 lg:flex-row lg:items-center lg:justify-between">
        <div
          role="group"
          aria-label="تصفية المشاريع حسب التصنيف الهندسي"
          className="flex min-w-0 items-center gap-2 flex-wrap pb-1 lg:order-1 lg:flex-1 lg:pb-0"
        >
          <FilterPill
            label="الكل"
            count={allCount}
            active={selectedCategory === null}
            onClick={() => onSelectCategory(null)}
          />
          {facets.map((facet) => (
            <FilterPill
              key={facet.category}
              label={facet.category}
              count={facet.count}
              active={selectedCategory === facet.category}
              onClick={() => onSelectCategory(facet.category)}
            />
          ))}
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-4 lg:order-2">
          <Select
            items={PROJECT_SORT_OPTIONS}
            value={sort}
            onValueChange={(value) => {
              if (value === "newest" || value === "oldest") {
                onSortChange(value);
              }
            }}
          >
            <SelectTrigger
              aria-label="ترتيب المشاريع"
              className="h-10 w-auto min-w-40 rounded-lg border-input bg-background text-sm text-brand-navy"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PROJECT_SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <p className="text-sm leading-6 text-muted-foreground">
            عرض{" "}
            <span className="font-medium text-brand-navy">
              {formatProjectCount(visibleCount)}
            </span>
          </p>
        </div>
      </MaxWidth>
    </section>
  );
}

function FilterPill({
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
          ? "border-brand-navy bg-brand-navy px-4 py-2 text-primary-foreground"
          : "border-border bg-muted px-4 py-2 text-brand-navy hover:bg-surface-blue",
      )}
    >
      <span
        className={cn(
          "rounded-full px-2 py-0.5 text-xs leading-5",
          active
            ? "bg-primary-foreground/20 text-primary-foreground"
            : "bg-border text-brand-navy",
        )}
      >
        {count}
      </span>
      <span>{label}</span>
    </button>
  );
}
