import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, Calendar, Clock3 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "cn";

type HeadingLevel = 2 | 3;

interface ContentImage {
  src: string;
  alt: string;
  objectPosition?: string;
}

interface ContentFact {
  id: string;
  label: string;
  value: string;
  emphasis?: boolean;
}

interface ProjectCardProps {
  title: string;
  description: string;
  image: ContentImage;
  href: string;
  category: string;
  facts: readonly ContentFact[];
  linkLabel?: string;
  imageSizes?: string;
  headingLevel?: HeadingLevel;
  className?: string;
}

interface BlogCardProps {
  title: string;
  description: string;
  image: ContentImage;
  href: string;
  category: string;
  readingTimeLabel: string;
  publishedDate?: string;
  linkLabel?: string;
  imageSizes?: string;
  headingLevel?: HeadingLevel;
  className?: string;
}

const defaultImageSizes =
  "(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw";

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

export function ProjectCard({
  title,
  description,
  image,
  href,
  category,
  facts,
  linkLabel = "تفاصيل المشروع",
  imageSizes = defaultImageSizes,
  headingLevel = 3,
  className,
}: ProjectCardProps) {
  return (
    <Card
      className={cn(
        "h-full gap-0 overflow-hidden bg-card py-0 shadow-sm ring-border/70 transition-shadow hover:shadow-md",
        className,
      )}
    >
      <div className="relative aspect-4/3 shrink-0 bg-muted">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={imageSizes}
          className="object-cover"
          style={
            image.objectPosition
              ? { objectPosition: image.objectPosition }
              : undefined
          }
        />
        <Badge className="absolute top-3 start-3 h-auto rounded bg-brand-navy px-2.5 py-1 text-[11px] font-medium text-primary-foreground">
          {category}
        </Badge>
      </div>

      <CardContent className="flex flex-1 flex-col gap-3 p-4">
        <CardHeading
          level={headingLevel}
          className="text-base font-bold leading-7 text-brand-navy"
        >
          {title}
        </CardHeading>
        <p className="text-sm leading-7 text-muted-foreground">{description}</p>

        <dl className="mt-auto grid grid-cols-3 gap-2 border-t border-border pt-3">
          {facts.map((fact) => (
            <div key={fact.id} className="min-w-0">
              <dt className="text-[11px] leading-5 text-muted-foreground">
                {fact.label}
              </dt>
              <dd
                className={cn(
                  "mt-0.5 text-xs font-semibold leading-5 text-brand-navy",
                  fact.emphasis && "text-link",
                )}
              >
                {fact.value}
              </dd>
            </div>
          ))}
        </dl>

        <Link
          href={href}
          className="inline-flex items-center gap-2 self-start rounded-sm text-sm font-semibold text-link underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        >
          {linkLabel}
          <ArrowRight aria-hidden="true" className="size-4 rtl:rotate-180" />
        </Link>
      </CardContent>
    </Card>
  );
}

export function BlogCard({
  title,
  description,
  image,
  href,
  category,
  readingTimeLabel,
  publishedDate,
  linkLabel = "اقرأ المقال",
  imageSizes = defaultImageSizes,
  headingLevel = 3,
  className,
}: BlogCardProps) {
  return (
    <Card
      className={cn(
        "h-full gap-0 overflow-hidden bg-card py-0 shadow-sm ring-border/70 transition-shadow hover:shadow-md",
        className,
      )}
    >
      <div className="relative aspect-16/10 shrink-0 bg-muted">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={imageSizes}
          className="object-cover"
          style={
            image.objectPosition
              ? { objectPosition: image.objectPosition }
              : undefined
          }
        />
        <Badge className="absolute top-3 start-3 h-auto rounded bg-brand-navy px-2.5 py-1 text-[11px] font-medium text-primary-foreground">
          {category}
        </Badge>
      </div>

      <CardContent className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Clock3 aria-hidden="true" className="size-3.5" />
            {readingTimeLabel}
          </span>
          {publishedDate ? (
            <span className="inline-flex items-center gap-1.5">
              <Calendar aria-hidden="true" className="size-3.5" />
              {publishedDate}
            </span>
          ) : null}
        </div>

        <CardHeading
          level={headingLevel}
          className="text-base font-bold leading-7 text-brand-navy"
        >
          {title}
        </CardHeading>
        <p className="text-sm leading-7 text-muted-foreground">{description}</p>

        <Link
          href={href}
          className="mt-auto inline-flex items-center gap-2 self-start rounded-sm pt-1 text-sm font-semibold text-link underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        >
          {linkLabel}
          <ArrowRight aria-hidden="true" className="size-4 rtl:rotate-180" />
        </Link>
      </CardContent>
    </Card>
  );
}

export type {
  BlogCardProps,
  ContentFact,
  ContentImage,
  HeadingLevel,
  ProjectCardProps,
};
