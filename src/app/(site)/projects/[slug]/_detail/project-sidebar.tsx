import { ClipboardCheck, FileCheck2, Factory } from "lucide-react";

import type { ProjectDetailSidebar } from "@/lib/project-detail";
import { cn } from "cn";

export function ProjectSidebar({ sidebar }: { sidebar: ProjectDetailSidebar }) {
  const { engineeringRole, technicalSpecs, approvals } = sidebar;

  if (!engineeringRole && !technicalSpecs && !approvals?.length) {
    return null;
  }

  return (
    <div className="flex flex-col gap-6">
      {engineeringRole ? (
        <section
          aria-labelledby="project-role-title"
          className="rounded-xl border border-border bg-surface-blue p-6"
        >
          <div className="flex items-center  gap-3">
            <ClipboardCheck
              aria-hidden="true"
              className="size-5 shrink-0 text-link"
            />
            <h3
              id="project-role-title"
              className="text-[22px] font-semibold leading-8.5 text-brand-navy"
            >
              المسؤولية الهندسية والدور التعاقدي
            </h3>
          </div>
          <p className="mt-3 text-sm leading-[22.75px] text-muted-foreground">
            {engineeringRole.description}
          </p>
          {engineeringRole.tags.length ? (
            <ul className="mt-4 flex list-none flex-wrap gap-2 border-t border-border p-0 pt-4">
              {engineeringRole.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-lg border border-border bg-card px-3 py-1 text-xs font-medium leading-4.5 text-brand-navy"
                >
                  {tag}
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      {technicalSpecs ? (
        <section
          aria-labelledby="project-specs-title"
          className="rounded-xl border border-border bg-card p-6 shadow-sm"
        >
          <div className="flex items-center justify-between gap-3 border-b border-border pb-3">
            <h3
              id="project-specs-title"
              className="flex items-center gap-2 text-[22px] font-semibold leading-8.5 text-brand-navy"
            >
              <FileCheck2 aria-hidden="true" className="size-4 text-link" />
              المواصفات الفنية المطبقة
            </h3>
            {technicalSpecs.note ? (
              <p className="shrink-0 text-xs font-medium leading-4.5 text-muted-foreground">
                {technicalSpecs.note}
              </p>
            ) : null}
          </div>

          <dl className="mt-1">
            {technicalSpecs.rows.map((row) => (
              <div
                key={row.id}
                className="flex items-center justify-between gap-4 border-b border-border/60 py-2.5"
              >
                <dt className="text-sm leading-[24.5px] text-muted-foreground">
                  {row.label}
                </dt>
                <dd
                  className={cn(
                    "shrink-0 font-mono text-sm font-bold leading-[24.5px]",
                    row.emphasis ? "text-success" : "text-brand-navy",
                  )}
                >
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}

      {approvals?.length ? (
        <section
          aria-labelledby="project-approvals-title"
          className="rounded-xl border border-border bg-secondary p-5"
        >
          <h3
            id="project-approvals-title"
            className="flex items-center gap-2 text-base font-semibold leading-6 text-brand-navy"
          >
            <Factory aria-hidden="true" className="size-4 text-link" />
            المصانع والمنتجات المعتمدة بالمشروع:
          </h3>
          <ul className="mt-3 grid list-none grid-cols-1 gap-2 p-0 sm:grid-cols-3">
            {approvals.map((approval) => (
              <li
                key={approval.id}
                className="flex flex-col items-center gap-1 rounded-lg border border-border bg-card px-3 py-3 text-center"
              >
                <span className="text-xs font-bold leading-4.5 text-brand-navy">
                  {approval.name}
                </span>
                <span className="text-[11px] leading-[19.8px] text-muted-foreground">
                  {approval.description}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
