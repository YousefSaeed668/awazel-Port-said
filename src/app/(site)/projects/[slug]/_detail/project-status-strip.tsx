import {
  BadgeCheck,
  CheckCircle2,
  Hammer,
  Info,
  Layers,
} from "lucide-react";

import { MaxWidth } from "@/components/MaxWidth";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import type { ProjectDetailContent } from "@/lib/project-detail";
import type { ProjectStatusTone } from "@/lib/projects";
import { cn } from "cn";

const statusToneClasses: Record<ProjectStatusTone, string> = {
  completed: "bg-success/10 text-success",
  certified: "bg-brand-navy/10 text-brand-navy",
  inProgress: "bg-brand-blue/10 text-brand-blue",
  neutral: "bg-muted text-muted-foreground",
};

const statusToneIcons: Record<ProjectStatusTone, typeof CheckCircle2> = {
  completed: CheckCircle2,
  certified: BadgeCheck,
  inProgress: Hammer,
  neutral: Info,
};

export function ProjectStatusStrip({
  project,
}: {
  project: ProjectDetailContent;
}) {
  const StatusIcon = statusToneIcons[project.status.tone];

  return (
    <section className="border-b border-border bg-secondary">
      <MaxWidth className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-lg px-3 py-1 text-xs font-semibold leading-4.5",
              statusToneClasses[project.status.tone],
            )}
          >
            {project.status.label}
            <StatusIcon aria-hidden="true" className="size-3.5" />
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-surface-blue px-3 py-1 text-xs font-semibold leading-4.5 text-link">
            {project.category}
            <Layers aria-hidden="true" className="size-3.5" />
          </span>
        </div>

        <Breadcrumbs
          items={[
            { id: "home", label: "الرئيسية", href: "/" },
            { id: "projects", label: "مشاريعنا", href: "/projects" },
            { id: "project", label: project.title },
          ]}
        />
      </MaxWidth>
    </section>
  );
}
