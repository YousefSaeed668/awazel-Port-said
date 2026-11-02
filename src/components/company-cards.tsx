import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowRight,
  Award,
  BadgeCheck,
  Building,
  Droplets,
  Factory,
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
  tone?: "valid" | "pending" | "neutral";
}

interface CertificateCardProps {
  title: string;
  issuer: string;
  description: string;
  badge?: string;
  icon?: keyof typeof certificateIcons;
  status?: CertificateStatus;
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

export function CertificateCard({
  title,
  issuer,
  description,
  badge,
  icon = "badge",
  status,
  headingLevel = 3,
  className,
}: CertificateCardProps) {
  const Icon = certificateIcons[icon];

  return (
    <Card
      className={cn(
        "h-full gap-3 bg-card shadow-sm ring-border/70",
        className,
      )}
    >
      <CardContent className="flex h-full flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg bg-surface-blue text-link">
            <Icon aria-hidden="true" className="size-5" />
          </span>
          {status ? (
            <Badge
              variant="secondary"
              className={cn(
                "h-auto min-h-6 px-2 py-1 text-center text-[11px] leading-4 whitespace-normal",
                status.tone === "valid"
                  ? "bg-success/10 text-success"
                  : "text-muted-foreground",
              )}
            >
              {status.label}
            </Badge>
          ) : null}
        </div>

        <div className="min-w-0">
          <CardHeading
            level={headingLevel}
            className="text-base font-bold leading-7 text-brand-navy"
          >
            {title}
          </CardHeading>
          <p className="mt-1 text-xs leading-6 text-muted-foreground">{issuer}</p>
        </div>

        <p className="text-sm leading-7 text-muted-foreground">{description}</p>

        {badge ? (
          <Badge
            variant="outline"
            className="mt-auto h-auto w-fit rounded bg-muted px-2 py-1 text-[11px] font-medium text-muted-foreground"
          >
            {badge}
          </Badge>
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
  CertificateStatus,
  FeatureCardProps,
  HeadingLevel,
  ServiceCardProps,
  ServiceTag,
};
