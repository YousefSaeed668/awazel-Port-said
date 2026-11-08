import Image from "next/image";
import { BadgeCheck } from "lucide-react";

import { MaxWidth } from "@/components/MaxWidth";
import type { ProjectDetailContent } from "@/lib/project-detail";

export function ProjectHero({ project }: { project: ProjectDetailContent }) {
  return (
    <section className="bg-background py-8">
      <MaxWidth>
        <div className="relative h-80 overflow-hidden rounded-xl border border-border bg-muted shadow-sm sm:h-105 lg:h-[520px]">
          <Image
            src={project.cover.src}
            alt={project.cover.alt}
            fill
            preload
            sizes="(min-width: 1344px) 1248px, 100vw"
            className="object-cover"
            style={
              project.cover.objectPosition
                ? { objectPosition: project.cover.objectPosition }
                : undefined
            }
          />

          {project.coverStandard ? (
            <p className="absolute inset-e-5 top-5 inline-flex items-center gap-2 rounded-lg bg-card/95 px-3.5 py-1.5 text-xs font-semibold leading-[18px] text-brand-navy shadow-sm backdrop-blur-sm">
              <BadgeCheck aria-hidden="true" className="size-3.5" />
              {project.coverStandard}
            </p>
          ) : null}

          {project.coverNote ? (
            <p className="absolute bottom-5 inset-s-5 inline-flex max-w-[calc(100%-2.5rem)] items-center gap-2.5 rounded-lg bg-brand-navy/90 px-4 py-2 text-sm font-medium leading-[24px] text-primary-foreground shadow-md backdrop-blur-sm">
              {project.coverNote}
              <span
                aria-hidden="true"
                className="size-2.5 shrink-0 rounded-full bg-success-foreground"
              />
            </p>
          ) : null}
        </div>
      </MaxWidth>
    </section>
  );
}
