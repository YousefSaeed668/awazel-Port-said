import {
  BadgeCheck,
  Layers,
  MapPin,
  PaintBucket,
  ScanLine,
  Waves,
} from "lucide-react";

import { MaxWidth } from "@/components/MaxWidth";
import { Card, CardContent } from "@/components/ui/card";
import { MediaFrame } from "@/components/ui/media-frame";
import type { ServicesPageContent } from "@/lib/services-data";

import { ServicesSectionHeading } from "./services-support-sections";

const technologyIcons = {
  foam: Waves,
  spray: PaintBucket,
  layers: Layers,
  slope: ScanLine,
};

export function ServicesTechnologies({
  content,
}: {
  content: ServicesPageContent["technologies"];
}) {
  return (
    <section
      aria-labelledby="services-technologies-title"
      className="bg-card py-16 lg:py-24"
    >
      <MaxWidth>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
          <ServicesSectionHeading
            id="services-technologies-title"
            heading={content.heading}
          />
          <div className="flex items-start gap-3 rounded-xl bg-muted p-4 text-sm leading-relaxed text-muted-foreground lg:max-w-90 xl:max-w-105">
            <BadgeCheck
              aria-hidden="true"
              className="mt-1 size-4 shrink-0 text-link"
            />
            <p>{content.note}</p>
          </div>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4">
          {content.items.map((technology) => {
            const Icon = technologyIcons[technology.icon];
            return (
              <Card
                key={technology.id}
                className="h-full gap-0 bg-background py-0 shadow-sm ring-0"
              >
                <CardContent className="flex h-full flex-col gap-6 p-6">
                  <div className="flex size-12 items-center justify-center rounded-lg bg-surface-blue text-link">
                    <Icon aria-hidden="true" className="size-6" />
                  </div>
                  <div>
                    <h3 className="text-[22px] leading-relaxed font-semibold text-brand-navy">
                      {technology.title}
                    </h3>
                    <p lang="en" className="mt-1 text-xs text-muted-foreground">
                      {technology.englishTitle}
                    </p>
                  </div>
                  <p className="text-base leading-[1.625] text-muted-foreground">
                    {technology.description}
                  </p>
                  <div className="mt-auto border-t border-border pt-4">
                    <p className="text-xs font-medium text-link">
                      {technology.noteLabel}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-brand-navy">
                      {technology.note}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </MaxWidth>
    </section>
  );
}

export function ServicesAssessment({
  content,
}: {
  content: ServicesPageContent["assessment"];
}) {
  const { project } = content;
  return (
    <section
      aria-labelledby="services-assessment-title"
      className="bg-muted py-16 lg:py-24"
    >
      <MaxWidth>
        <ServicesSectionHeading
          id="services-assessment-title"
          heading={content.heading}
        />
        <div className="mt-10 grid items-start gap-8 lg:mt-12 lg:grid-cols-12">
          <ol className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
            {content.factors.map((factor, index) => (
              <li key={factor.id} className="rounded-xl bg-card p-6 shadow-sm">
                <span
                  aria-hidden="true"
                  className="flex size-10 items-center justify-center rounded-lg bg-surface-blue text-[22px] font-semibold text-link"
                >
                  {index + 1}
                </span>
                <h3 className="mt-3 text-xl leading-relaxed font-semibold text-brand-navy">
                  {factor.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {factor.description}
                </p>
              </li>
            ))}
          </ol>
          <Card className="gap-0 py-0 shadow-sm ring-0 lg:col-span-5">
            <CardContent className="p-6">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <span className="rounded bg-surface-blue px-2.5 py-1 text-xs font-medium text-link">
                  {project.badge}
                </span>
                <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin aria-hidden="true" className="size-3.5 shrink-0" />
                  {project.location}
                </p>
              </div>
              <MediaFrame
                image={project.image}
                sizes="(min-width: 1344px) 464px, (min-width: 1024px) 38vw, 100vw"
                className="rounded-lg"
                mediaClassName="aspect-3/2"
                overlay={
                  <span className="rounded bg-brand-navy px-2.5 py-1 text-xs text-primary-foreground">
                    {project.imageLabel}
                  </span>
                }
                overlayClassName="start-3 bottom-3"
              />
              <h3 className="mt-4 text-[22px] leading-relaxed font-semibold text-brand-navy">
                {project.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {project.description}
              </p>
              <dl className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-4 text-sm">
                <dt className="text-muted-foreground">
                  {project.durationLabel}
                </dt>
                <dd className="font-medium text-brand-navy">
                  {project.duration}
                </dd>
              </dl>
            </CardContent>
          </Card>
        </div>
      </MaxWidth>
    </section>
  );
}
