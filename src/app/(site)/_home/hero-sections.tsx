import Link from "next/link";
import { ArrowRight, BadgeCheck, ShieldCheck, UserRoundCheck } from "lucide-react";

import { MaxWidth } from "@/components/MaxWidth";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button-variants";
import { MediaFrame } from "@/components/ui/media-frame";
import { SectionHeading } from "@/components/ui/section-heading";
import { CertificateCard, ServiceCard } from "@/components/company-cards";
import { ProjectCard } from "@/components/content-cards";
import { cn } from "cn";

import type { HomepageData } from "@/lib/data";

const highlightIcons = {
  compliance: { Icon: BadgeCheck, tone: "text-success" },
  quality: { Icon: ShieldCheck, tone: "text-brand-blue" },
  supervision: { Icon: UserRoundCheck, tone: "text-brand-gold" },
} as const;

export function HeroSection({ content }: { content: HomepageData["hero"] }) {
  return (
    <section id="hero" aria-labelledby="home-hero-title" className="bg-background">
      <MaxWidth className="grid items-center gap-6 py-8 lg:grid-cols-12 lg:py-12">
        <div className="min-w-0 lg:col-span-7">
          <SectionHeading
            variant="home"
            id="home-hero-title"
            headingLevel={1}
            titleClassName="text-3xl sm:text-4xl lg:text-5xl lg:leading-[1.4]"
            eyebrow={content.eyebrow}
            title={
              <>
                {content.title}
                <span className="block text-brand-blue">
                  {content.highlight}
                </span>
              </>
            }
            description={content.description}
          />
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {content.primaryAction ? (
              <Link
                href={content.primaryAction.href}
                target={content.primaryAction.openInNewTab ? "_blank" : undefined}
                rel={content.primaryAction.openInNewTab ? "noreferrer" : undefined}
                className={buttonVariants({ size: "lg" })}
              >
                {content.primaryAction.label}
                <ArrowRight aria-hidden="true" className="size-4 rtl:rotate-180" />
              </Link>
            ) : null}
            {content.secondaryAction ? (
              <Link
                href={content.secondaryAction.href}
                target={content.secondaryAction.openInNewTab ? "_blank" : undefined}
                rel={content.secondaryAction.openInNewTab ? "noreferrer" : undefined}
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "border-border bg-card",
                )}
              >
                {content.secondaryAction.label}
              </Link>
            ) : null}
          </div>
          <ul className="mt-6 flex list-none flex-wrap gap-2 p-0">
            {content.highlights.map((highlight) => {
              const { Icon, tone } = highlightIcons[highlight.icon];

              return (
                <li key={highlight.id}>
                  <Badge
                    variant="outline"
                    className="h-auto gap-2 rounded border-0 bg-card px-2 py-2 text-xs font-medium text-foreground shadow-sm"
                  >
                    <Icon aria-hidden="true" className={cn("size-4", tone)} />
                    {highlight.label}
                  </Badge>
                </li>
              );
            })}
          </ul>
        </div>
        <HeroMedia content={content} />
      </MaxWidth>
    </section>
  );
}

export function ApprovalsSection({ content }: { content: HomepageData["approvals"] }) {
  return (
    <section
      id="certifications"
      aria-labelledby="certifications-title"
      className="bg-muted py-8"
    >
      <MaxWidth>
        <SectionHeading {...content.heading} variant="home" id="certifications-title" />
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {content.items.map(({ id, ...item }) => (
            <CertificateCard key={id} {...item} className="bg-card" />
          ))}
        </div>
      </MaxWidth>
    </section>
  );
}

export function ServicesSection({ content }: { content: HomepageData["services"] }) {
  return (
    <section
      id="services"
      aria-labelledby="services-title"
      className="bg-background py-12"
    >
      <MaxWidth>
        <SectionHeading {...content.heading} variant="home" id="services-title" />
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {content.items.map(({ id, ...item }) => (
            <ServiceCard key={id} {...item} />
          ))}
        </div>
      </MaxWidth>
    </section>
  );
}

export function ProjectsSection({ content }: { content: HomepageData["projects"] }) {
  return (
    <section
      id="projects"
      aria-labelledby="projects-title"
      className="bg-muted py-12"
    >
      <MaxWidth>
        <SectionHeading {...content.heading} variant="home" id="projects-title" />
        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {content.items.map(({ id, ...item }) => (
            <ProjectCard key={id} {...item} />
          ))}
        </div>
      </MaxWidth>
    </section>
  );
}

function HeroMedia({ content }: { content: HomepageData["hero"] }) {
  return (
    <MediaFrame
      image={content.image}
      sizes="(min-width: 1024px) 44vw, 100vw"
      preload
      className="bg-surface-blue shadow-xl lg:col-span-5"
      mediaClassName="lg:h-[460px] lg:aspect-auto"
      overlayClassName="inset-x-4 bottom-4 rounded-lg bg-card/95 p-4 shadow-md backdrop-blur-sm"
      overlay={
        <>
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-xs">
            <span className="inline-flex items-center gap-1.5 font-semibold text-success">
              <span aria-hidden="true" className="size-2 rounded-full bg-success" />
              {content.panel.status}
            </span>
            <span className="text-muted-foreground">{content.panel.location}</span>
          </div>
          <p className="mt-2 text-sm font-medium leading-6 text-brand-navy">
            {content.panel.title}
          </p>
        </>
      }
    />
  );
}
