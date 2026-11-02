import type { Metadata } from "next";
import {
  BadgeCheck,
  CircleCheck,
  Download,
  FileText,
  Leaf,
  MapPin,
  ShieldCheck,
  UserRoundCheck,
} from "lucide-react";

import { MaxWidth } from "@/components/MaxWidth";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { buttonVariants } from "@/components/ui/button-variants";
import { Card, CardContent } from "@/components/ui/card";
import { MediaFrame } from "@/components/ui/media-frame";
import { SectionHeading } from "@/components/ui/section-heading";
import { aboutData, type AboutPageContent, type AboutPageData } from "@/lib/about-data";
import { getAboutPageContent } from "@/sanity/data/about-page";
import { CertificateCard, ServiceCard } from "@/components/company-cards";
import { WorkStages } from "@/components/work-stages";
import { cn } from "cn";

const factIcons = {
  verified: BadgeCheck,
  distance: MapPin,
  security: ShieldCheck,
  engineering: UserRoundCheck,
} as const;

const valueIcons = {
  quality: BadgeCheck,
  safety: ShieldCheck,
  environment: Leaf,
} as const;

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getAboutPageContent();

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: "/about",
    },
  };
}

export default async function AboutPage() {
  const content = await getAboutPageContent();
  const { approvals } = aboutData;

  return (
    <>
      <AboutIntroduction
        breadcrumbs={content.breadcrumbs}
        intro={content.intro}
      />
      <CompanyOverview content={content.company} />
      <CapabilitiesSection content={content.capabilities} />
      <MethodologySection content={content.methodology} />
      <ValuesSection content={content.values} />
      <ApprovalsSection content={approvals} />
      <ProfileDownload content={content.profile} />
    </>
  );
}

function AboutIntroduction({
  breadcrumbs,
  intro,
}: {
  breadcrumbs: AboutPageContent["breadcrumbs"];
  intro: AboutPageContent["intro"];
}) {
  return (
    <section aria-labelledby="about-page-title" className="bg-background">
      <MaxWidth className="py-8 sm:py-10">
        <Breadcrumbs items={breadcrumbs} />
        <SectionHeading
          id="about-page-title"
          headingLevel={1}
          eyebrow={intro.eyebrow}
          title={intro.title}
          description={intro.description}
          className="mt-6"
          titleClassName="text-brand-navy"
        />
      </MaxWidth>
    </section>
  );
}

function CompanyOverview({
  content,
}: {
  content: AboutPageContent["company"];
}) {
  return (
    <section aria-labelledby="about-company-title" className="bg-card py-12">
      <MaxWidth>
        <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
          <div className="min-w-0 lg:col-span-7">
            <SectionHeading
              id="about-company-title"
              eyebrow={content.eyebrow}
              title={content.title}
              titleClassName="text-brand-navy"
            />

            <div className="mt-5 space-y-3">
              {content.paragraphs.map((paragraph) => (
                <p
                  key={paragraph.id}
                  className="text-sm leading-8 text-muted-foreground sm:text-base"
                >
                  {paragraph.text}
                </p>
              ))}
            </div>

            <ul className="mt-6 grid list-none gap-3 p-0 sm:grid-cols-2">
              {content.facts.map((fact) => (
                <AboutFact key={fact.id} fact={fact} />
              ))}
            </ul>
          </div>

          <div className="min-w-0 lg:col-span-5">
            <MediaFrame
              image={content.image}
              sizes="(min-width: 1024px) 42vw, 100vw"
              className="rounded-2xl bg-surface-blue shadow-xl"
              mediaClassName="lg:h-[460px] lg:aspect-auto"
              overlayClassName="inset-x-4 bottom-4 rounded-xl bg-card/95 p-4 shadow-lg backdrop-blur-sm"
              overlay={<AboutMediaPanel panel={content.panel} />}
            />
          </div>
        </div>
      </MaxWidth>
    </section>
  );
}

function AboutFact({
  fact,
}: {
  fact: AboutPageContent["company"]["facts"][number];
}) {
  const Icon = factIcons[fact.icon];

  return (
    <li className="rounded-lg bg-background p-3 shadow-sm ring-1 ring-border/60">
      <span className="flex items-start gap-1.5 text-xs leading-6 text-muted-foreground">
        <Icon aria-hidden="true" className="mt-1 size-4 shrink-0 text-link" />
        {fact.label}
      </span>
      <span className="mt-1 block text-sm font-semibold leading-6 text-brand-navy">
        {fact.value}
      </span>
    </li>
  );
}

function AboutMediaPanel({
  panel,
}: {
  panel: AboutPageContent["company"]["panel"];
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-3">
        <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg bg-surface-blue text-link">
          <BadgeCheck aria-hidden="true" className="size-6" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-bold leading-6 text-brand-navy sm:text-base">
            {panel.title}
          </p>
          <p className="text-xs leading-6 text-muted-foreground">
            {panel.description}
          </p>
        </div>
      </div>

      <div className="shrink-0 text-end">
        <p className="text-xl font-bold leading-7 text-link">
          {panel.metric.value}
        </p>
        <p className="text-[11px] leading-5 text-muted-foreground">
          {panel.metric.label}
        </p>
      </div>
    </div>
  );
}

function CapabilitiesSection({
  content,
}: {
  content: AboutPageContent["capabilities"];
}) {
  return (
    <section
      aria-labelledby="about-capabilities-title"
      className="bg-muted py-12"
    >
      <MaxWidth>
        <SectionHeading
          {...content.heading}
          align="center"
          id="about-capabilities-title"
          titleClassName="text-brand-navy"
        />
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {content.items.map(({ id, ...item }) => (
            <ServiceCard key={id} {...item} />
          ))}
        </div>
      </MaxWidth>
    </section>
  );
}

function MethodologySection({
  content,
}: {
  content: AboutPageContent["methodology"];
}) {
  return (
    <section
      aria-labelledby="about-methodology-title"
      className="bg-card py-12"
    >
      <MaxWidth>
        <SectionHeading
          {...content.heading}
          id="about-methodology-title"
          titleClassName="text-brand-navy"
        />
        <WorkStages
          items={content.items}
          label={content.label}
          layout="list"
          className="mt-8"
        />
      </MaxWidth>
    </section>
  );
}

function ValuesSection({ content }: { content: AboutPageContent["values"] }) {
  return (
    <section aria-labelledby="about-values-title" className="bg-muted py-12">
      <MaxWidth>
        <SectionHeading
          {...content.heading}
          align="center"
          id="about-values-title"
          titleClassName="text-brand-navy"
        />
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {content.items.map((value) => (
            <ValueCard key={value.id} value={value} />
          ))}
        </div>
      </MaxWidth>
    </section>
  );
}

function ValueCard({
  value,
}: {
  value: AboutPageContent["values"]["items"][number];
}) {
  const Icon = valueIcons[value.icon];

  return (
    <Card className="h-full bg-card shadow-sm ring-border/70">
      <CardContent className="flex h-full flex-col gap-3">
        <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-xl bg-surface-blue text-link">
          <Icon aria-hidden="true" className="size-6" />
        </span>

        <div>
          <h3 className="text-lg font-bold leading-8 text-brand-navy">
            {value.title}
          </h3>
          <span
            aria-hidden="true"
            className="mt-2 block h-0.5 w-8 rounded-full bg-brand-gold"
          />
        </div>

        <p className="text-sm leading-7 text-muted-foreground">
          {value.description}
        </p>

        <ul className="mt-auto list-none space-y-2 p-0 pt-2">
          {value.checks.map((check) => (
            <li
              key={check.id}
              className="flex items-start gap-2 text-xs leading-6 text-muted-foreground"
            >
              <CircleCheck
                aria-hidden="true"
                className="mt-1 size-4 shrink-0 text-success"
              />
              <span>{check.label}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function ApprovalsSection({
  content,
}: {
  content: AboutPageData["approvals"];
}) {
  return (
    <section aria-labelledby="about-approvals-title" className="bg-card py-12">
      <MaxWidth>
        <SectionHeading
          {...content.heading}
          id="about-approvals-title"
          titleClassName="text-brand-navy"
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {content.items.map(({ id, ...item }) => (
            <CertificateCard key={id} {...item} className="bg-muted/60" />
          ))}
        </div>
      </MaxWidth>
    </section>
  );
}

function ProfileDownload({ content }: { content: AboutPageContent["profile"] }) {
  return (
    <section aria-labelledby="about-profile-title" className="bg-background py-12">
      <MaxWidth>
        <Card className="gap-0 bg-surface-blue py-0 shadow-sm ring-border/60">
          <CardContent className="flex flex-col gap-6 p-5 sm:p-6 md:flex-row md:items-center md:justify-between">
            <div className="flex min-w-0 items-start gap-4">
              <span className="inline-flex size-14 shrink-0 items-center justify-center rounded-2xl bg-card text-link shadow-sm">
                <FileText aria-hidden="true" className="size-7" />
              </span>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="h-auto rounded bg-card px-2 py-0.5 text-[11px] font-medium text-link"
                  >
                    {content.badge}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {content.version}
                  </span>
                </div>

                <h2
                  id="about-profile-title"
                  className="mt-2 text-lg font-bold leading-8 text-brand-navy sm:text-xl"
                >
                  {content.title}
                </h2>
                <p className="mt-1 text-sm leading-7 text-muted-foreground">
                  {content.description}
                </p>
              </div>
            </div>

            <div className="w-full shrink-0 md:w-auto">
              {content.file ? (
                <a
                  href={content.file.href}
                  download={content.file.fileName}
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "w-full md:w-auto",
                  )}
                >
                  <Download aria-hidden="true" className="size-5" />
                  {content.downloadLabel}
                  {content.file.sizeLabel ? (
                    <span className="text-xs font-normal opacity-80">
                      ({content.file.sizeLabel})
                    </span>
                  ) : null}
                </a>
              ) : (
                <div className="rounded-lg bg-card/70 p-3 text-center ring-1 ring-border/60">
                  <span
                    aria-disabled="true"
                    className={cn(
                      buttonVariants({ size: "lg" }),
                      "w-full cursor-not-allowed bg-muted text-muted-foreground",
                    )}
                  >
                    <FileText aria-hidden="true" className="size-5" />
                    {content.unavailableLabel}
                  </span>
                  <p className="mt-2 text-xs leading-5 text-muted-foreground">
                    {content.unavailableHint}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </MaxWidth>
    </section>
  );
}
