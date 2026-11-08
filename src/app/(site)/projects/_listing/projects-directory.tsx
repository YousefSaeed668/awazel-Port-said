"use client";

import { useMemo, useRef, useState } from "react";

import { MaxWidth } from "@/components/MaxWidth";
import {
  filterProjectsByCategory,
  getProjectCategoryFacets,
  getProjectPageItems,
  sortProjects,
  type ProjectCategory,
  type ProjectListingItem,
  type ProjectSort,
} from "@/lib/projects";

import { ProjectCard } from "./project-card";
import { ProjectsEmptyState } from "./projects-empty-state";
import { ProjectsPaginationBar } from "./projects-pagination-bar";
import { ProjectsToolbar } from "./projects-toolbar";

export function ProjectsDirectory({
  projects,
}: {
  projects: readonly ProjectListingItem[];
}) {
  const [sort, setSort] = useState<ProjectSort>("newest");
  const [category, setCategory] = useState<ProjectCategory | null>(null);
  const [page, setPage] = useState(1);
  const listRef = useRef<HTMLElement>(null);

  const facets = useMemo(() => getProjectCategoryFacets(projects), [projects]);
  const filtered = useMemo(
    () =>
      sortProjects(filterProjectsByCategory(projects, category), sort),
    [projects, category, sort],
  );
  const { current, pageCount, start, end, items } = getProjectPageItems(
    filtered,
    page,
  );

  function changeSort(nextSort: ProjectSort) {
    setSort(nextSort);
    setPage(1);
  }

  function selectCategory(nextCategory: ProjectCategory | null) {
    setCategory(nextCategory);
    setPage(1);
  }

  function changePage(nextPage: number) {
    setPage(nextPage);
    listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <>
      {projects.length > 0 ? (
        <ProjectsToolbar
          sort={sort}
          onSortChange={changeSort}
          facets={facets}
          allCount={projects.length}
          selectedCategory={category}
          onSelectCategory={selectCategory}
          visibleCount={filtered.length}
        />
      ) : null}

      <section
        ref={listRef}
        id="projects-list"
        aria-label="المشاريع المنفذة"
        className="scroll-mt-24 bg-background py-12 lg:py-16"
      >
        <MaxWidth>
          {projects.length === 0 ? (
            <ProjectsEmptyState variant="empty-archive" />
          ) : filtered.length === 0 && category ? (
            <ProjectsEmptyState
              variant="no-results"
              category={category}
              onReset={() => selectCategory(null)}
            />
          ) : (
            <div className="flex flex-col gap-8 lg:gap-14">
              <ul className="grid list-none gap-8 p-0 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((project) => (
                  <li key={project.id} className="min-w-0">
                    <ProjectCard project={project} />
                  </li>
                ))}
              </ul>

              <ProjectsPaginationBar
                page={current}
                pageCount={pageCount}
                from={start + 1}
                to={end}
                total={filtered.length}
                onPageChange={changePage}
              />
            </div>
          )}
        </MaxWidth>
      </section>
    </>
  );
}
