import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Hammer,
  Info,
  ShieldCheck,
} from "lucide-react";

import type {
  ProjectListingItem,
  ProjectStatusTone,
} from "@/lib/projects";
import { cn } from "cn";

const imageSizes = "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw";

const statusToneClasses: Record<ProjectStatusTone, string> = {
  completed: "bg-success/90 text-success-foreground",
  certified: "bg-brand-navy/90 text-primary-foreground",
  inProgress: "bg-brand-blue/90 text-primary-foreground",
  neutral: "bg-muted-foreground/90 text-primary-foreground",
};

const statusToneIcons: Record<
  ProjectStatusTone,
  typeof CheckCircle2
> = {
  completed: CheckCircle2,
  certified: BadgeCheck,
  inProgress: Hammer,
  neutral: Info,
};

export function ProjectCard({ project }: { project: ProjectListingItem }) {
  const StatusIcon = statusToneIcons[project.status.tone];

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
      <div className="relative h-64 shrink-0 overflow-hidden bg-muted sm:h-[282px]">
        <Image
          src={project.image.src}
          alt={project.image.alt}
          fill
          sizes={imageSizes}
          className="object-cover"
          style={
            project.image.objectPosition
              ? { objectPosition: project.image.objectPosition }
              : undefined
          }
        />

        <div className="absolute start-3 top-3 flex max-w-[calc(100%-1.5rem)] flex-col items-start gap-1.5">
          <span className="rounded-[4px] bg-card/90 px-2.5 py-1 text-xs font-medium text-brand-navy shadow-sm backdrop-blur-sm">
            {project.category}
          </span>
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-[4px] px-2 py-0.5 text-xs font-medium shadow-sm backdrop-blur-sm",
              statusToneClasses[project.status.tone],
            )}
          >
            {project.status.label}
            <StatusIcon aria-hidden="true" className="size-3 shrink-0" />
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 px-6 pt-6 pb-6">
        <div className="flex flex-col gap-2">
          <h2 className="line-clamp-2 text-[22px] font-semibold leading-[34px] text-brand-navy">
            {project.title}
          </h2>
          <span
            aria-hidden="true"
            className="h-0.5 w-6 rounded-full bg-brand-gold"
          />
          <p className="line-clamp-2 min-h-13 text-base leading-[26px] text-muted-foreground">
            {project.summary}
          </p>
        </div>

        <dl className="flex flex-col gap-2 rounded-lg border border-border/80 bg-muted p-4">
          <FactRow label="الموقع" value={project.location} />
          <FactRow
            label={project.measurement.label}
            value={project.measurement.value}
          />
          <FactRow label={project.system.label} value={project.system.value} />
        </dl>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3">
          <Link
            href={project.href}
            className="inline-flex items-center gap-1 rounded-sm text-base font-medium text-link underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          >
            عرض تفاصيل المشروع
            <ArrowRight
              aria-hidden="true"
              className="size-3.5 rtl:rotate-180"
            />
          </Link>

          {project.highlight ? (
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              {project.highlight}
              <ShieldCheck
                aria-hidden="true"
                className="size-3.5 shrink-0 text-success"
              />
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function FactRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-row-reverse items-center justify-between gap-3">
      <dt className="shrink-0 text-sm leading-6 text-muted-foreground">
        {label}:
      </dt>
      <dd className="min-w-0 text-sm font-medium leading-6 text-brand-navy">
        {value}
      </dd>
    </div>
  );
}
