import type { Metadata } from "next";
import Link from "next/link";
import { cn } from "cn";
import {
  BadgeCheck,
  CalendarDays,
  ClipboardList,
  ClipboardPenLine,
  FileText,
  Files,
  MessageCircle,
  Scale,
  ShieldCheck,
  ShieldUser,
} from "lucide-react";

import { MaxWidth } from "@/components/MaxWidth";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { buttonVariants } from "@/components/ui/button-variants";
import { getMailtoHref } from "@/lib/links";
import { PRIVACY_PATH, type PrivacyPageContent } from "@/lib/privacy-data";
import { getPrivacyPageContent } from "@/sanity/data/privacy-page";

import { PrivacyArticle } from "./_components/privacy-article";
import { PrivacyToc } from "./_components/privacy-toc";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getPrivacyPageContent();
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: PRIVACY_PATH },
  };
}

export default async function PrivacyPage() {
  const content = await getPrivacyPageContent();
  const { intro } = content;
  return (
    <>
      <div className="bg-muted py-4 print:hidden">
        <MaxWidth className="flex flex-wrap items-center justify-between gap-3">
          <Breadcrumbs items={content.breadcrumbs} />
          <p className="flex items-center gap-2 rounded-full bg-surface-blue px-3 py-1 text-xs font-semibold text-link">
            <Scale aria-hidden="true" className="shrink-0 size-3.5" />
            {intro.context}
          </p>
        </MaxWidth>
      </div>
      <section
        aria-labelledby="privacy-page-title"
        className="bg-card py-12 shadow-sm print:py-4 print:shadow-none"
      >
        <MaxWidth className="flex flex-col justify-between gap-8 xl:flex-row xl:items-end">
          <div className="max-w-192">
            <p className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <span aria-hidden="true" className="h-0.5 w-6 bg-brand-gold" />
              {intro.eyebrow}
            </p>
            <h1
              id="privacy-page-title"
              className="mt-1 text-3xl leading-relaxed font-semibold text-brand-navy sm:text-[40px] sm:leading-[58px]"
            >
              {intro.title}
            </h1>
            <p className="mt-1 text-base leading-relaxed text-muted-foreground sm:text-lg">
              {intro.description}
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-sm">
              <p className="flex items-center gap-2 rounded bg-muted px-2 py-1">
                <CalendarDays aria-hidden="true" className="shrink-0 size-3" />
                {intro.updatedLabel}{" "}
                <time dateTime={intro.updatedOn}>
                  {new Intl.DateTimeFormat("ar-EG", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    numberingSystem: "latn",
                    timeZone: "UTC",
                  }).format(new Date(intro.updatedOn))}
                </time>
              </p>
              <p className="flex items-center gap-2 rounded bg-muted px-2 py-1">
                <Files aria-hidden="true" className="shrink-0 size-3.5" />
                {intro.versionLabel} {intro.version}
              </p>
              <p className="flex items-center gap-2 rounded bg-surface-blue px-2 py-1 font-medium text-link">
                <BadgeCheck aria-hidden="true" className="shrink-0 size-3.5" />
                {intro.compliance}
              </p>
            </div>
          </div>
        </MaxWidth>
      </section>
      <MaxWidth className="py-6 print:py-4">
        <section
          aria-labelledby="privacy-scope-title"
          className="flex items-start gap-4 rounded-xl bg-surface-blue p-6 shadow-sm print:shadow-none"
        >
          <span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-card text-link">
            <ShieldCheck aria-hidden="true" className="shrink-0 size-6" />
          </span>
          <div>
            <h2
              id="privacy-scope-title"
              className="text-xl font-semibold text-brand-navy sm:text-2xl"
            >
              {content.scope.title}
            </h2>
            <p className="mt-1 text-base leading-relaxed text-muted-foreground">
              {content.scope.description}
            </p>
          </div>
        </section>
      </MaxWidth>
      <MaxWidth className="grid items-start gap-6 pb-12 lg:grid-cols-12 print:block">
        <PrivacySidebar content={content} />
        <PrivacyArticle content={content} />
      </MaxWidth>
      <PrivacyConsultation content={content.consultation} />
      {content.whatsapp ? (
        <a
          href={content.whatsapp.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={content.whatsapp.label}
          className="fixed end-6 bottom-6 z-30 flex size-14 items-center justify-center rounded-full bg-whatsapp text-whatsapp-foreground shadow-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring print:hidden"
        >
          <MessageCircle aria-hidden="true" className="shrink-0 size-6" />
        </a>
      ) : null}
    </>
  );
}

function PrivacySidebar({ content }: { content: PrivacyPageContent }) {
  const { sidebar } = content;
  return (
    <aside className="space-y-4 lg:sticky lg:top-6 lg:col-span-4 print:hidden">
      <PrivacyToc
        sections={content.sections}
        title={sidebar.tocTitle}
        countLabel={sidebar.countLabel}
      />
      <div className="rounded-xl border-t-4 border-brand-blue bg-card p-6 shadow-sm">
        <span className="flex size-10 items-center justify-center rounded-lg bg-surface-blue text-link">
          <ClipboardList aria-hidden="true" className="shrink-0 size-5" />
        </span>
        <h2 className="mt-2 text-xl leading-relaxed font-semibold text-brand-navy">
          {sidebar.projectTitle}
        </h2>
        <p className="mt-1 text-base leading-relaxed text-muted-foreground">
          {sidebar.projectDescription}
        </p>
        {sidebar.action ? (
          <Link
            href={sidebar.action.href}
            target={sidebar.action.openInNewTab ? "_blank" : undefined}
            rel={
              sidebar.action.openInNewTab ? "noopener noreferrer" : undefined
            }
            className={cn(buttonVariants(), "mt-4 w-full")}
          >
            <FileText aria-hidden="true" className="size-4 shrink-0" />
            {sidebar.action.label}
          </Link>
        ) : null}
      </div>
      <div className="rounded-xl bg-muted p-4 text-sm shadow-sm">
        <h2 className="flex items-center gap-2 font-semibold text-brand-navy">
          <ShieldUser
            aria-hidden="true"
            className="size-4 shrink-0 text-link"
          />
          {sidebar.contactTitle}
        </h2>
        <p className="mt-1 text-muted-foreground">{sidebar.emailLabel}</p>
        <a
          href={getMailtoHref(content.contact.email)}
          dir="ltr"
          className="mt-1 inline-block max-w-full break-all rounded-sm font-medium text-link hover:underline focus-visible:outline-2 focus-visible:outline-ring"
        >
          {content.contact.email}
        </a>
        <p className="mt-1 text-xs text-muted-foreground">{sidebar.location}</p>
      </div>
    </aside>
  );
}

function PrivacyConsultation({
  content,
}: {
  content: PrivacyPageContent["consultation"];
}) {
  return (
    <section
      aria-labelledby="privacy-consultation-title"
      className="bg-brand-navy py-12 text-white print:hidden"
    >
      <MaxWidth className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
        <div className="max-w-168">
          <p className="text-xs font-medium text-brand-gold">
            {content.eyebrow}
          </p>
          <h2
            id="privacy-consultation-title"
            className="mt-1 text-2xl leading-relaxed font-semibold sm:text-3xl"
          >
            {content.title}
          </h2>
          <p className="mt-1 text-base leading-relaxed text-white/80 sm:text-lg">
            {content.description}
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-4 sm:flex-row">
          {[content.primaryAction, content.secondaryAction].map(
            (action, index) =>
              action ? (
                <Link
                  key={index === 0 ? "primary" : "secondary"}
                  href={action.href}
                  target={action.openInNewTab ? "_blank" : undefined}
                  rel={action.openInNewTab ? "noopener noreferrer" : undefined}
                  className={cn(
                    buttonVariants({ variant: "inverse" }),
                    index === 1 &&
                      "border-white/30 bg-white/10 text-white hover:bg-white/20",
                  )}
                >
                  {index === 0 ? (
                    <ClipboardPenLine
                      aria-hidden="true"
                      className="size-4 shrink-0"
                    />
                  ) : (
                    <MessageCircle
                      aria-hidden="true"
                      className="size-4 shrink-0"
                    />
                  )}
                  {action.label}
                </Link>
              ) : null,
          )}
        </div>
      </MaxWidth>
    </section>
  );
}
