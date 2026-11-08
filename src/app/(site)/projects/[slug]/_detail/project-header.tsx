import {
  CalendarDays,
  Layers,
  ListChecks,
  MapPin,
  Ruler,
  ShieldCheck,
} from "lucide-react";

import { MaxWidth } from "@/components/MaxWidth";
import type {
  ProjectDetailContent,
  ProjectFactIcon,
} from "@/lib/project-detail";
import { cn } from "cn";

const factIcons: Record<ProjectFactIcon, typeof ShieldCheck> = {
  warranty: ShieldCheck,
  date: CalendarDays,
  measurement: Ruler,
  system: Layers,
  scope: ListChecks,
  location: MapPin,
};

export function ProjectHeader({ project }: { project: ProjectDetailContent }) {
  return (
    <section className="border-b border-border bg-card py-12">
      <MaxWidth className="flex flex-col gap-8">
        <div className="flex max-w-205 flex-col gap-4">
          {project.approvalNumber ? (
            <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.6px] text-muted-foreground">
              {project.approvalNumber}
              <span
                aria-hidden="true"
                className="size-2 shrink-0 rounded-full bg-brand-gold"
              />
            </p>
          ) : null}

          <h1 className="text-3xl font-semibold leading-[1.35] tracking-[-1px] text-brand-navy sm:text-[40px] sm:leading-13.5">
            {project.title}
          </h1>

          <p className="text-base leading-7.25 text-muted-foreground sm:text-lg">
            {project.summary}
          </p>
        </div>

        <dl className="grid grid-cols-2 gap-x-4 gap-y-6 rounded-xl border border-border bg-secondary p-5 sm:grid-cols-3 lg:grid-cols-6 lg:gap-x-0">
          {project.facts.map((fact, index) => {
            const Icon = factIcons[fact.icon];

            return (
              <div
                key={fact.id}
                className={cn(
                  "flex min-w-0 flex-col gap-1",
                  index > 0 && "lg:border-s lg:border-border/80 lg:ps-4",
                )}
              >
                <dt className="flex items-center  gap-2 text-sm leading-6 text-muted-foreground">
                  <Icon aria-hidden="true" className="size-3.5 shrink-0" />
                  {fact.label}
                </dt>
                <dd
                  className={cn(
                    "text-[15px] font-semibold leading-6.75",
                    fact.icon === "warranty"
                      ? "text-success"
                      : "text-brand-navy",
                  )}
                >
                  {fact.value}
                </dd>
              </div>
            );
          })}
        </dl>
      </MaxWidth>
    </section>
  );
}
