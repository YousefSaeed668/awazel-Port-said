import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Droplets,
  FileCheck2,
  Ruler,
  ShieldCheck,
  Target,
} from "lucide-react";

import { MaxWidth } from "@/components/MaxWidth";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button-variants";
import { MediaFrame } from "@/components/ui/media-frame";
import { SectionHeading } from "@/components/ui/section-heading";
import { WorkStages } from "@/components/work-stages";
import { cn } from "cn";

import type { CompanyProfileFile } from "@/lib/certificates-data";
import type { HomepageData } from "@/lib/data";

const featureIcons = {
  target: Target,
  badge: BadgeCheck,
  shield: ShieldCheck,
} as const;

const checkIcons = {
  water: Droplets,
  ruler: Ruler,
  document: FileCheck2,
} as const;

export function CompanySection({
  content,
  profileFile,
}: {
  content: HomepageData["company"];
  profileFile: CompanyProfileFile | null;
}) {
  return (
    <section id="about" aria-labelledby="about-title" className="bg-background py-12">
      <MaxWidth>
        <div className="grid gap-6 lg:grid-cols-12 lg:items-center">
          <CompanyMedia content={content} />
          <div className="min-w-0 lg:col-span-7">
            <SectionHeading
              variant="home"
              id="about-title"
              eyebrow={content.eyebrow}
              title={content.title}
              description={content.description}
            />
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {content.features.map((feature) => (
                <CompanyFeature key={feature.id} feature={feature} />
              ))}
            </div>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {content.primaryAction ? (
                <Link
                  href={content.primaryAction.href}
                  target={content.primaryAction.openInNewTab ? "_blank" : undefined}
                  rel={content.primaryAction.openInNewTab ? "noreferrer" : undefined}
                  className={buttonVariants()}
                >
                  {content.primaryAction.label}
                  <ArrowRight aria-hidden="true" className="size-4 rtl:rotate-180" />
                </Link>
              ) : null}
              {content.secondaryAction ? (
                <CompanySecondaryAction
                  action={content.secondaryAction}
                  file={profileFile}
                />
              ) : null}
            </div>
          </div>
        </div>
      </MaxWidth>
    </section>
  );
}

function CompanySecondaryAction({
  action,
  file,
}: {
  action: NonNullable<HomepageData["company"]["secondaryAction"]>;
  file: CompanyProfileFile | null;
}) {
  const className = cn(
    buttonVariants({ variant: "outline" }),
    "border-border bg-card",
  );

  if (action.kind === "link") {
    return (
      <Link
        href={action.href}
        target={action.openInNewTab ? "_blank" : undefined}
        rel={action.openInNewTab ? "noreferrer" : undefined}
        className={className}
      >
        {action.label}
      </Link>
    );
  }

  if (!file) {
    return (
      <div className="flex flex-col gap-2">
        <span
          aria-disabled="true"
          aria-describedby="home-profile-unavailable"
          className={cn(className, "cursor-not-allowed")}
        >
          {action.label}
        </span>
        <p
          id="home-profile-unavailable"
          className="text-xs leading-6 text-muted-foreground"
        >
          ملف الشركة غير متوفر حاليًا.
        </p>
      </div>
    );
  }

  return (
    <a
      href={file.href}
      download={file.fileName}
      title={file.fileName}
      className={className}
    >
      {action.label}
    </a>
  );
}

export function WorkStagesSection({
  content,
}: {
  content: HomepageData["workStages"];
}) {
  return (
    <section
      id="process"
      aria-labelledby="process-title"
      className="bg-muted py-12"
    >
      <MaxWidth>
        <SectionHeading {...content.heading} variant="home" id="process-title" />
        <WorkStages
          items={content.items}
          label={content.label}
          className="mt-8"
        />
      </MaxWidth>
    </section>
  );
}

export function QualitySection({
  content,
}: {
  content: HomepageData["quality"];
}) {
  return (
    <section id="quality" aria-labelledby="quality-title" className="bg-background py-12">
      <MaxWidth>
        <div className="grid items-center gap-6 rounded-xl bg-surface-blue p-6 shadow-sm lg:grid-cols-12 lg:p-8">
          <div className="lg:col-span-8">
            <SectionHeading
              id="quality-title"
              variant="home"
              eyebrow={content.eyebrow}
              title={content.title}
              description={content.description}
            />
            <ul className="mt-5 grid list-none gap-2 p-0">
              {content.checks.map((check) => {
                const Icon = checkIcons[check.icon];

                return (
                  <li
                    key={check.id}
                    className="flex items-start gap-3 rounded-lg bg-card p-4"
                  >
                    <Icon aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-brand-blue" />
                    <div className="min-w-0">
                      <h3 className="text-base font-semibold leading-7 text-brand-navy">
                        {check.title}
                      </h3>
                      <p className="mt-1 text-sm leading-7 text-muted-foreground">
                        {check.description}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
          <aside className="rounded-xl bg-card p-6 text-center shadow-sm lg:col-span-4">
            <span className="inline-flex size-16 items-center justify-center rounded-full bg-surface-blue text-brand-blue">
              <ShieldCheck aria-hidden="true" className="size-7" />
            </span>
            <h3 className="mt-4 text-xl font-bold leading-relaxed text-brand-navy">
              {content.warranty.title}
            </h3>
            {content.warranty.badge ? (
              <Badge
                variant="secondary"
                className="mt-2 h-auto px-2.5 py-1 text-xs font-semibold text-muted-foreground"
              >
                {content.warranty.badge}
              </Badge>
            ) : null}
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              {content.warranty.description}
            </p>
            {content.warranty.items?.length ? (
              <ul className="mt-4 grid list-none gap-1.5 p-0 text-start text-xs leading-6 text-muted-foreground">
                {content.warranty.items.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <ShieldCheck
                      aria-hidden="true"
                      className="mt-1 size-3.5 shrink-0 text-brand-blue"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            ) : null}
            {content.warranty.action ? (
              <Link
                href={content.warranty.action.href}
                target={content.warranty.action.openInNewTab ? "_blank" : undefined}
                rel={content.warranty.action.openInNewTab ? "noreferrer" : undefined}
                className={cn(buttonVariants(), "mt-6 w-full")}
              >
                {content.warranty.action.label}
                <ArrowRight aria-hidden="true" className="size-4 rtl:rotate-180" />
              </Link>
            ) : null}
          </aside>
        </div>
      </MaxWidth>
    </section>
  );
}

function CompanyFeature({
  feature,
}: {
  feature: HomepageData["company"]["features"][number];
}) {
  const Icon = featureIcons[feature.icon];

  return (
    <div className="rounded-lg bg-card p-4 shadow-sm">
      <span className="inline-flex size-9 items-center justify-center rounded-lg bg-card text-brand-blue ring-1 ring-border">
        <Icon aria-hidden="true" className="size-4" />
      </span>
      <h3 className="mt-3 text-sm font-bold leading-6 text-black">
        {feature.title}
      </h3>
      <p className="mt-1 text-xs leading-6 text-muted-foreground">
        {feature.description}
      </p>
    </div>
  );
}

function CompanyMedia({ content }: { content: HomepageData["company"] }) {
  return (
    <MediaFrame
      image={content.image}
      sizes="(min-width: 1024px) 46vw, 100vw"
      className="bg-muted shadow-md lg:col-span-5"
      mediaClassName="lg:h-[420px] lg:aspect-auto"
      overlayClassName="inset-x-3 bottom-3 rounded-xl bg-card/95 p-4 shadow-lg backdrop-blur-sm sm:inset-x-5 sm:bottom-5"
      overlay={
        <>
          <p className="flex items-center gap-2 text-base font-bold leading-7 text-brand-navy">
            <ShieldCheck aria-hidden="true" className="size-5 shrink-0 text-brand-blue" />
            {content.panel.title}
          </p>
          <p className="mt-1 text-xs leading-6 text-muted-foreground">
            {content.panel.description}
          </p>
        </>
      }
    />
  );
}
