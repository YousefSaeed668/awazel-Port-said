import { ClipboardList } from "lucide-react";

import { MaxWidth } from "@/components/MaxWidth";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import type { ProjectsPageContent } from "@/lib/projects";

export function ProjectsHero({
  content,
  totalProjects,
  categoryCount,
}: {
  content: ProjectsPageContent;
  totalProjects: number;
  categoryCount: number;
}) {
  return (
    <>
      <section className="border-b border-border bg-muted">
        <MaxWidth className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="inline-flex items-center gap-2 text-xs leading-[18px] text-muted-foreground">
            <span
              aria-hidden="true"
              className="size-2 shrink-0 rounded-full bg-success"
            />
            {content.intro.context}
          </p>
          <Breadcrumbs items={content.breadcrumbs} />
        </MaxWidth>
      </section>

      <section
        aria-labelledby="projects-page-title"
        className="bg-card py-12 sm:py-16"
      >
        <MaxWidth>
          <div className="flex flex-col gap-10 border-b border-border pb-10 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex max-w-190 flex-col items-start gap-3">
              <p className="inline-flex items-center gap-2 rounded-[4px] bg-surface-blue px-2.5 py-1 text-xs font-medium text-link">
                {content.intro.eyebrow}
                <ClipboardList aria-hidden="true" className="size-3.5" />
              </p>
              <h1
                id="projects-page-title"
                className="text-3xl font-semibold leading-tight tracking-[-1px] text-brand-navy sm:text-[40px] sm:leading-[58px]"
              >
                {content.intro.title}
              </h1>
              <p className="text-base leading-relaxed text-muted-foreground sm:text-lg sm:leading-[29px]">
                {content.intro.description}
              </p>
            </div>

            <div className="grid w-full shrink-0 grid-cols-2 gap-6 rounded-xl border border-border bg-muted p-5 sm:w-auto sm:min-w-80">
              <div className="flex flex-col items-end">
                <span className="text-[32px] font-bold leading-12 text-brand-navy tabular-nums">
                  {totalProjects}
                </span>
                <span className="text-xs leading-[18px] text-muted-foreground">
                  إجمالي المشاريع الموثقة
                </span>
              </div>
              <div className="flex flex-col items-end border-s border-border ps-6">
                <span className="text-[32px] font-bold leading-12 text-brand-blue tabular-nums">
                  {categoryCount}
                </span>
                <span className="text-xs leading-[18px] text-muted-foreground">
                  تصنيفات هندسية
                </span>
              </div>
            </div>
          </div>
        </MaxWidth>
      </section>
    </>
  );
}
