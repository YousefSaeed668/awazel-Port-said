import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, Calendar, Clock3, Star, UserRound } from "lucide-react";

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

interface BlogCardAuthor {
  name: string;
  role?: string;
  image?: ContentImage;
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
  secondaryTag?: string;
  author?: BlogCardAuthor;
  imageSizes?: string;
  headingLevel?: HeadingLevel;
  className?: string;
  variant?: "default" | "article" | "listing" | "featured";
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

const blogLinkClass =
  "inline-flex items-center gap-2 rounded-sm text-sm font-semibold text-link underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring";

const featuredImageSizes = "(min-width: 1024px) 33vw, 100vw";

function FeaturedBlogCard({
  title,
  description,
  image,
  href,
  category,
  readingTimeLabel,
  publishedDate,
  linkLabel = "اقرأ المقال بالكامل",
  author,
  imageSizes = featuredImageSizes,
  headingLevel = 3,
  className,
}: BlogCardProps) {
  return (
    <Card
      className={cn(
        "grid h-full grid-cols-1 gap-0 rounded-xl border border-border bg-card py-0 shadow-sm ring-0 transition-shadow hover:shadow-md lg:grid-cols-12",
        className,
      )}
    >
      <div className="relative h-56 w-full shrink-0 overflow-hidden bg-muted sm:h-64 lg:order-2 lg:col-span-5 lg:col-start-8 lg:row-start-1 lg:h-auto lg:min-h-[405px]">
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
        <span className="absolute top-4 start-4 inline-flex items-center gap-1.5 rounded bg-brand-navy/90 px-3 py-1.5 text-[11px] font-medium text-primary-foreground backdrop-blur-sm">
          <Star aria-hidden="true" className="size-3.5 text-brand-gold" />
          أحدث مقال
        </span>
      </div>

      <div className="flex min-w-0 flex-col justify-between gap-6 p-6 sm:p-8 lg:order-1 lg:col-span-7 lg:col-start-1 lg:row-start-1 lg:p-10">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-xs text-muted-foreground">
            {publishedDate ? (
              <>
                <span>{publishedDate}</span>
                <span aria-hidden="true">•</span>
              </>
            ) : null}
            <span>{readingTimeLabel}</span>
            <span aria-hidden="true">•</span>
            <span className="rounded-[6px] bg-surface-blue px-2 py-1 text-[11px] font-semibold text-link">
              {category}
            </span>
          </div>

          <CardHeading
            level={headingLevel}
            className="text-2xl font-semibold leading-[1.4] text-brand-navy sm:text-[32px] sm:leading-[40px]"
          >
            {title}
          </CardHeading>

          <span
            aria-hidden="true"
            className="h-0.5 w-12 rounded-full bg-brand-gold"
          />

          <p className="line-clamp-3 text-base leading-[26px] text-muted-foreground">
            {description}
          </p>
        </div>

        <div className="flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          {author ? (
            <div className="flex min-w-0 items-center gap-3">
              <span className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface-blue text-link">
                {author.image ? (
                  <Image
                    src={author.image.src}
                    alt={author.image.alt}
                    fill
                    sizes="40px"
                    className="object-cover"
                    style={
                      author.image.objectPosition
                        ? { objectPosition: author.image.objectPosition }
                        : undefined
                    }
                  />
                ) : (
                  <UserRound aria-hidden="true" className="size-5" />
                )}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-brand-navy">
                  إعداد: {author.name}
                </p>
                {author.role ? (
                  <p className="truncate text-xs leading-[18px] text-muted-foreground">
                    {author.role}
                  </p>
                ) : null}
              </div>
            </div>
          ) : (
            <span />
          )}

          <Link href={href} className={cn(blogLinkClass, "text-base")}>
            {linkLabel}
            <ArrowRight aria-hidden="true" className="size-4 rtl:rotate-180" />
          </Link>
        </div>
      </div>
    </Card>
  );
}

export function BlogCard(props: BlogCardProps) {
  if (props.variant === "featured") {
    return <FeaturedBlogCard {...props} />;
  }

  if (props.variant === "listing") {
    return <ListingBlogCard {...props} />;
  }

  const {
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
    variant = "default",
  } = props;
  const article = variant === "article";

  return (
    <Card
      className={cn(
        "h-full gap-0 overflow-hidden bg-card py-0 shadow-sm ring-border/70 transition-shadow hover:shadow-md",
        className,
      )}
    >
      <div
        className={cn(
          "relative shrink-0 bg-muted",
          article ? "h-48" : "aspect-16/10",
        )}
      >
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
        <div
          className={cn(
            "flex flex-wrap items-center gap-x-4 gap-y-1 text-muted-foreground",
            article
              ? "flex-row-reverse justify-end text-sm"
              : "text-[11px]",
          )}
        >
          <span className="inline-flex items-center gap-1.5">
            {!article ? (
              <Clock3 aria-hidden="true" className="size-3.5" />
            ) : null}
            {readingTimeLabel}
          </span>
          {publishedDate ? (
            <span className="inline-flex items-center gap-1.5">
              {!article ? (
                <Calendar aria-hidden="true" className="size-3.5" />
              ) : null}
              {publishedDate}
              {article ? <span aria-hidden="true">•</span> : null}
            </span>
          ) : null}
        </div>

        <CardHeading
          level={headingLevel}
          className={cn(
            "text-brand-navy",
            article
              ? "line-clamp-2 text-xl font-semibold leading-[1.55]"
              : "text-base font-bold leading-7",
          )}
        >
          {title}
        </CardHeading>

        <p
          className={cn(
            "text-sm leading-7 text-muted-foreground",
            article && "line-clamp-2",
          )}
        >
          {description}
        </p>

        <Link
          href={href}
          className={cn(
            blogLinkClass,
            "mt-auto",
            article ? "w-full border-t border-border pt-2" : "self-start pt-1",
          )}
        >
          {linkLabel}
          <ArrowRight aria-hidden="true" className="size-4 rtl:rotate-180" />
        </Link>
      </CardContent>
    </Card>
  );
}

/**
 * Archive card from the blog listing design: cover with a tag chip, icon-less
 * meta line, gold rule, and a footer that pairs the secondary tag with the
 * reading link.
 */
function ListingBlogCard({
  title,
  description,
  image,
  href,
  category,
  readingTimeLabel,
  publishedDate,
  linkLabel = "اقرأ المقال",
  secondaryTag,
  imageSizes = defaultImageSizes,
  headingLevel = 3,
  className,
}: BlogCardProps) {
  return (
    <Card
      className={cn(
        "h-full gap-0 rounded-xl border border-border bg-card py-0 shadow-sm ring-0 transition-shadow hover:shadow-md",
        className,
      )}
    >
      <div className="relative h-52 shrink-0 overflow-hidden bg-muted">
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
        <span className="absolute top-3 start-3 rounded-[4px] bg-surface-blue px-2.5 py-1 text-xs font-semibold text-link">
          {category}
        </span>
      </div>

      <CardContent className="flex flex-1 flex-col gap-4 p-6">
        <p className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span>{readingTimeLabel}</span>
          {publishedDate ? (
            <>
              <span aria-hidden="true">•</span>
              <span>{publishedDate}</span>
            </>
          ) : null}
        </p>

        <CardHeading
          level={headingLevel}
          className="line-clamp-3 text-[22px] font-semibold leading-[30px] text-brand-navy"
        >
          {title}
        </CardHeading>

        <span
          aria-hidden="true"
          className="h-0.5 w-8 rounded-full bg-brand-gold"
        />

        <p className="line-clamp-3 text-base leading-[1.8] text-muted-foreground">
          {description}
        </p>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-[17px]">
          <span className="text-xs text-muted-foreground">
            {secondaryTag ?? ""}
          </span>
          <Link href={href} className={blogLinkClass}>
            {linkLabel}
            <ArrowRight aria-hidden="true" className="size-4 rtl:rotate-180" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export type {
  BlogCardAuthor,
  BlogCardProps,
  ContentFact,
  ContentImage,
  HeadingLevel,
  ProjectCardProps,
};
