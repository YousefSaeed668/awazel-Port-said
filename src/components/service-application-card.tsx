import { ShieldCheck } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { MediaFrame } from "@/components/ui/media-frame";
import type { ServiceApplication } from "@/lib/services-data";
import { cn } from "cn";

interface ServiceApplicationCardProps {
  service: ServiceApplication;
  number: number;
  reverse?: boolean;
}

export function ServiceApplicationCard({
  service,
  number,
  reverse = false,
}: ServiceApplicationCardProps) {
  return (
    <article aria-labelledby={`service-${service.id}`}>
      <Card className="gap-0 p-5 shadow-sm ring-0 sm:p-8">
        <CardContent className="grid gap-6 px-0 lg:grid-cols-2 lg:items-center lg:gap-8">
          <MediaFrame
            image={service.image}
            sizes="(min-width: 1344px) 576px, (min-width: 1024px) 45vw, 100vw"
            className={cn(
              "rounded-lg bg-muted",
              reverse && "lg:col-start-2 lg:row-start-1",
            )}
            mediaClassName="aspect-4/3 lg:aspect-auto lg:h-103.5"
            overlay={
              service.imageBadge ? (
                <span className="inline-flex items-center gap-1.5 rounded bg-brand-navy px-3 py-1 text-xs font-medium text-primary-foreground shadow-sm">
                  <ShieldCheck aria-hidden="true" className="size-4 shrink-0" />
                  {service.imageBadge}
                </span>
              ) : undefined
            }
            overlayClassName="start-4 top-4 max-w-[calc(100%-2rem)]"
          />
          <div
            className={cn(
              "flex min-w-0 flex-col gap-5",
              reverse && "lg:col-start-1 lg:row-start-1",
            )}
          >
            {service.tags.length ? (
              <ul className="flex flex-wrap gap-2" aria-label={service.title}>
                {service.tags.map((tag) => (
                  <li
                    key={tag.id}
                    className="rounded bg-muted px-2.5 py-1 text-xs font-medium leading-5"
                  >
                    {tag.label}
                  </li>
                ))}
              </ul>
            ) : null}
            <div>
              <div className="flex items-start gap-3">
                <span
                  aria-hidden="true"
                  className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-surface-blue text-base font-medium text-link"
                >
                  {String(number).padStart(2, "0")}
                </span>
                <h3
                  id={`service-${service.id}`}
                  className="min-w-0 text-xl leading-relaxed font-semibold wrap-break-word text-brand-navy sm:text-2xl"
                >
                  {service.title}
                </h3>
              </div>
              <div
                aria-hidden="true"
                className="mt-2 h-0.5 w-10 rounded bg-brand-gold"
              />
            </div>
            <p className="text-base leading-relaxed text-muted-foreground">
              {service.description}
            </p>
            {service.systems.length ? (
              <div className="rounded-lg bg-muted p-4">
                {service.systemsLabel ? (
                  <p className="mb-2 text-xs font-medium text-muted-foreground">
                    {service.systemsLabel}
                  </p>
                ) : null}
                <ul className="flex flex-wrap gap-x-3 gap-y-2 text-sm leading-6">
                  {service.systems.map((system) => (
                    <li key={system.id} className="flex items-start gap-1.5">
                      <span
                        aria-hidden="true"
                        className="mt-2 size-1.5 shrink-0 rounded-full bg-brand-blue"
                      />
                      {system.label}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {service.metrics.length ? (
              <dl className="grid grid-cols-1 gap-4 rounded-lg bg-muted p-4 sm:grid-cols-2">
                {service.metrics.map((metric) => (
                  <div key={metric.id}>
                    <dt className="text-xs text-muted-foreground">
                      {metric.label}
                    </dt>
                    <dd className="mt-1 flex flex-wrap items-baseline gap-2 text-2xl font-semibold text-brand-navy">
                      <span>{metric.value}</span>
                      {metric.unit ? (
                        <bdi className="text-sm font-normal text-muted-foreground">
                          {metric.unit}
                        </bdi>
                      ) : null}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </article>
  );
}
