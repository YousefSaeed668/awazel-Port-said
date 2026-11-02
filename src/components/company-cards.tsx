import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import {
  ArrowRight,
  Award,
  BadgeCheck,
  Building,
  CircleCheck,
  Download,
  Droplets,
  Factory,
  FileText,
  House,
  Landmark,
  Layers,
  Leaf,
  ShieldCheck,
  Target,
  Thermometer,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CertificatePreview } from "@/components/certificate-preview";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "cn";

const certificateIcons = {
  award: Award,
  badge: BadgeCheck,
  leaf: Leaf,
  shield: ShieldCheck,
} as const;

const serviceIcons = {
  building: Building,
  droplets: Droplets,
  factory: Factory,
  house: House,
  landmark: Landmark,
  layers: Layers,
  target: Target,
  thermometer: Thermometer,
} as const;

const featureIcons = {
  target: Target,
  badge: BadgeCheck,
  shield: ShieldCheck,
} as const;

type HeadingLevel = 2 | 3;

interface CertificateStatus {
  label: string;
  tone?: "valid" | "pending" | "expired" | "neutral";
}

interface CertificateLogo {
  src: string;
  alt: string;
}

interface CertificateScope {
  title?: string;
  description?: string;
  items?: readonly string[];
}

interface CertificateDocument {
  /** Inline asset URL used by the native PDF viewer. */
  previewUrl: string;
  /** Sanity CDN download URL that carries a meaningful filename. */
  downloadHref: string;
  fileName: string;
}

interface CertificateCardProps {
  issuer: string;
  issuerSecondaryName?: string;
  issuerLogo?: CertificateLogo;
  icon?: keyof typeof certificateIcons;
  status?: CertificateStatus;
  title?: string;
  subtitle?: string;
  reference?: string;
  issueDate?: string;
  description?: string;
  validity?: string;
  scope?: CertificateScope;
  badge?: string;
  document?: CertificateDocument;
  /** Only enable on the certificates page; Home and About never preview PDFs. */
  allowPreview?: boolean;
  downloadLabel?: string;
  headingLevel?: HeadingLevel;
  className?: string;
}

interface ServiceTag {
  id: string;
  label: string;
}

interface ServiceCardProps {
  title: string;
  description: string;
  icon: keyof typeof serviceIcons;
  href: string;
  linkLabel?: string;
  code?: string;
  tags?: readonly ServiceTag[];
  headingLevel?: HeadingLevel;
  className?: string;
}

interface FeatureCardProps {
  title: string;
  description: string;
  icon: keyof typeof featureIcons;
  headingLevel?: HeadingLevel;
  className?: string;
}

function CardHeading({
  level,
  className,
  children,
}: {
  level: HeadingLevel;
  className?: string;
  children: ReactNode;
}) {
  if (level === 2) {
    return <h2 className={className}>{children}</h2>;
  }
  return <h3 className={className}>{children}</h3>;
}

function CertificateStatusBadge({ status }: { status: CertificateStatus }) {
  return (
    <Badge
      variant="secondary"
      className={cn(
        "h-auto min-h-6 shrink-0 px-2.5 py-1 text-center text-[11px] leading-4 font-semibold whitespace-normal",
        status.tone === "valid" && "bg-success/10 text-success",
        status.tone === "pending" && "bg-brand-gold/15 text-brand-navy",
        status.tone === "expired" && "bg-destructive/10 text-destructive",
        (!status.tone || status.tone === "neutral") &&
          "text-muted-foreground",
      )}
    >
      {status.label}
    </Badge>
  );
}

export function CertificateCard({
  issuer,
  issuerSecondaryName,
  issuerLogo,
  icon = "badge",
  status,
  title,
  subtitle,
  reference,
  issueDate,
  description,
  validity,
  scope,
  badge,
  document,
  allowPreview = false,
  downloadLabel,
  headingLevel = 3,
  className,
}: CertificateCardProps) {
  const Icon = certificateIcons[icon];
  const hasSummary = Boolean(title || subtitle || reference || issueDate);
  const documentTitle = title ?? issuer;
  const resolvedDownloadLabel =
    downloadLabel ?? (allowPreview ? "PDF" : "تحميل PDF");

  return (
    <Card
      className={cn(
        "h-full gap-0 bg-card shadow-sm ring-border/70",
        className,
      )}
    >
      <CardContent className="flex h-full flex-col gap-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            {issuerLogo ? (
              <span className="relative inline-flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-surface-blue ring-1 ring-border/60">
                <Image
                  src={issuerLogo.src}
                  alt={issuerLogo.alt}
                  fill
                  sizes="48px"
                  className="object-contain p-2"
                />
              </span>
            ) : (
              <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-lg bg-surface-blue text-link">
                <Icon aria-hidden="true" className="size-6" />
              </span>
            )}

            <div className="min-w-0">
              <CardHeading
                level={headingLevel}
                className="text-base font-bold leading-7 wrap-break-word text-brand-navy"
              >
                {issuer}
              </CardHeading>
              {issuerSecondaryName ? (
                <p className="mt-0.5 text-xs leading-6 wrap-break-word text-muted-foreground">
                  {issuerSecondaryName}
                </p>
              ) : null}
            </div>
          </div>

          {status ? <CertificateStatusBadge status={status} /> : null}
        </div>

        {hasSummary ? (
          <div className="flex flex-col gap-3 rounded-lg bg-muted/60 p-4 ring-1 ring-border/60">
            {reference ? (
              <p className="text-[11px] leading-5 wrap-break-word text-muted-foreground">
                مرجع: {reference}
              </p>
            ) : null}

            <div className="text-center">
              {title ? (
                <p className="text-sm font-semibold leading-6 text-brand-navy">
                  {title}
                </p>
              ) : null}
              {subtitle ? (
                <p className="mt-1 text-xs leading-6 text-muted-foreground">
                  {subtitle}
                </p>
              ) : null}
            </div>

            <div className="flex items-center justify-between gap-2">
              {issueDate ? (
                <p className="text-[11px] leading-5 text-muted-foreground">
                  تاريخ الإصدار: {issueDate}
                </p>
              ) : (
                <span />
              )}
              <FileText
                aria-hidden="true"
                className="size-4 shrink-0 text-brand-gold"
              />
            </div>
          </div>
        ) : null}

        <div className="flex flex-1 flex-col gap-3">
          {description ? (
            <p className="text-sm leading-7 text-muted-foreground">
              {description}
            </p>
          ) : null}

          {validity ? (
            <dl className="flex items-start justify-between gap-3 border-t border-border/70 pt-3 text-xs leading-6">
              <dt className="shrink-0 text-muted-foreground">الصلاحية</dt>
              <dd className="text-end font-medium text-brand-navy">
                {validity}
              </dd>
            </dl>
          ) : null}

          {scope ? (
            <div className="mt-auto rounded-lg bg-muted/50 p-3">
              {scope.title ? (
                <p className="text-xs font-medium leading-6 text-muted-foreground">
                  {scope.title}
                </p>
              ) : null}
              {scope.description ? (
                <p className="mt-1 text-[13px] leading-6 text-brand-navy">
                  {scope.description}
                </p>
              ) : null}
              {scope.items?.length ? (
                <ul className="mt-2 list-none space-y-1.5 p-0">
                  {scope.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-1.5 text-[13px] leading-6 text-brand-navy"
                    >
                      <CircleCheck
                        aria-hidden="true"
                        className="mt-1 size-3.5 shrink-0 text-brand-blue"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ) : null}
        </div>

        {badge || document ? (
          <div className="mt-auto flex flex-col gap-3 pt-1">
            {badge ? (
              <Badge
                variant="outline"
                className="h-auto w-fit rounded bg-muted px-2 py-1 text-[11px] font-medium text-muted-foreground"
              >
                {badge}
              </Badge>
            ) : null}

            {document ? (
              <div className="flex items-stretch gap-2">
                {allowPreview ? (
                  <CertificatePreview
                    title={documentTitle}
                    issuer={issuerSecondaryName ?? issuer}
                    reference={reference}
                    previewUrl={document.previewUrl}
                    downloadHref={document.downloadHref}
                    fileName={document.fileName}
                  />
                ) : null}

                <a
                  href={document.downloadHref}
                  download={document.fileName}
                  title={document.fileName}
                  aria-label={`تحميل ${documentTitle} بصيغة PDF`}
                  className={cn(
                    buttonVariants({
                      variant: allowPreview ? "outline" : "default",
                    }),
                    allowPreview ? "shrink-0 px-3" : "w-full",
                  )}
                >
                  <Download aria-hidden="true" className="size-4" />
                  {resolvedDownloadLabel}
                </a>
              </div>
            ) : null}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

export function ServiceCard({
  title,
  description,
  icon,
  href,
  linkLabel = "تفاصيل الخدمة",
  code,
  tags,
  headingLevel = 3,
  className,
}: ServiceCardProps) {
  const Icon = serviceIcons[icon];

  return (
    <Card
      className={cn(
        "h-full bg-card shadow-sm ring-border/70 transition-shadow hover:shadow-md",
        className,
      )}
    >
      <CardContent className="flex h-full flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <span className="inline-flex size-14 shrink-0 items-center justify-center rounded-xl bg-surface-blue text-link">
            <Icon aria-hidden="true" className="size-7" />
          </span>
          {code ? (
            <span className="rounded bg-muted px-2 py-1 text-[11px] font-medium text-muted-foreground">
              {code}
            </span>
          ) : null}
        </div>

        <div className="min-w-0">
          <CardHeading
            level={headingLevel}
            className="text-lg font-bold leading-8 text-brand-navy"
          >
            {title}
          </CardHeading>
          <span
            aria-hidden="true"
            className="mt-2 block h-0.5 w-6 rounded-full bg-brand-gold"
          />
        </div>

        <p className="text-sm leading-7 text-muted-foreground">{description}</p>

        {tags?.length ? (
          <ul className="flex list-none flex-wrap gap-1.5 p-0">
            {tags.map((tag) => (
              <li key={tag.id}>
                <Badge
                  variant="outline"
                  className="h-auto rounded bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
                >
                  {tag.label}
                </Badge>
              </li>
            ))}
          </ul>
        ) : null}

        <Link
          href={href}
          className="mt-auto inline-flex items-center gap-2 self-start rounded-sm pt-2 text-sm font-semibold text-link underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        >
          {linkLabel}
          <ArrowRight aria-hidden="true" className="size-4 rtl:rotate-180" />
        </Link>
      </CardContent>
    </Card>
  );
}

export function FeatureCard({
  title,
  description,
  icon,
  headingLevel = 3,
  className,
}: FeatureCardProps) {
  const Icon = featureIcons[icon];

  return (
    <div className={cn("rounded-lg bg-card p-4 shadow-sm", className)}>
      <span className="inline-flex size-9 items-center justify-center rounded-lg bg-card text-brand-blue ring-1 ring-border">
        <Icon aria-hidden="true" className="size-4" />
      </span>
      <CardHeading
        level={headingLevel}
        className="mt-3 text-sm font-bold leading-6 text-brand-navy"
      >
        {title}
      </CardHeading>
      <p className="mt-1 text-xs leading-6 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

export type {
  CertificateCardProps,
  CertificateDocument,
  CertificateLogo,
  CertificateScope,
  CertificateStatus,
  FeatureCardProps,
  HeadingLevel,
  ServiceCardProps,
  ServiceTag,
};
