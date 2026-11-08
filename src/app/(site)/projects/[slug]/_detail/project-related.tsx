import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

import { MaxWidth } from "@/components/MaxWidth";
import type { ProjectListingItem } from "@/lib/projects";

export function ProjectRelated({
  projects,
}: {
  projects: ProjectListingItem[];
}) {
  if (!projects.length) return null;

  return (
    <section
      aria-labelledby="project-related-title"
      className="border-t border-border bg-secondary py-14"
    >
      <MaxWidth className="flex flex-col gap-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2
            id="project-related-title"
            className="text-2xl font-semibold leading-[37px] text-brand-navy"
          >
            مشاريع هندسية مماثلة نفذتها الشركة
          </h2>
          <Link
            href="/projects"
            className="inline-flex items-center gap-1 rounded-sm text-base font-medium leading-6 text-link transition-colors hover:text-brand-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            عرض كافة المشاريع
            <ArrowLeft aria-hidden="true" className="size-3.5" />
          </Link>
        </div>

        <ul className="grid list-none grid-cols-1 gap-6 p-0 lg:grid-cols-2">
          {projects.map((project) => (
            <li key={project.id}>
              <Link
                href={project.href}
                className="group flex h-full flex-col-reverse gap-5 rounded-xl border border-border bg-card p-5 shadow-sm transition-colors hover:border-brand-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:flex-row sm:items-stretch"
              >
                <div className="flex min-w-0 flex-1 flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm leading-[24.5px] text-muted-foreground">
                        {project.location}
                      </p>
                      <span className="rounded-[4px] bg-surface-blue px-2 py-0.5 text-xs font-medium leading-[18px] text-link">
                        {project.category}
                      </span>
                    </div>
                    <h3 className="mt-1 text-lg font-semibold leading-[32.4px] text-brand-navy">
                      {project.title}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-sm leading-[24.5px] text-muted-foreground">
                      {project.summary}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-2">
                    <span className="inline-flex items-center gap-1 text-xs font-medium leading-[18px] text-brand-navy">
                      <ArrowUpRight
                        aria-hidden="true"
                        className="size-2.5 text-link"
                      />
                      عرض المشروع
                    </span>
                    <span className="text-xs font-medium leading-[18px] text-muted-foreground">
                      {project.measurement.label}: {project.measurement.value}
                    </span>
                  </div>
                </div>

                <div className="relative h-40 w-full shrink-0 overflow-hidden rounded-lg bg-muted sm:w-48">
                  <Image
                    src={project.image.src}
                    alt={project.image.alt}
                    fill
                    sizes="(min-width: 1024px) 192px, 100vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    style={
                      project.image.objectPosition
                        ? { objectPosition: project.image.objectPosition }
                        : undefined
                    }
                  />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </MaxWidth>
    </section>
  );
}
