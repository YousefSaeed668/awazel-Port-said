import {
  BookOpen,
  CalendarDays,
  Clock3,
  History,
  UserRoundPen,
} from "lucide-react";

import { MaxWidth } from "@/components/MaxWidth";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { BLOG_PATH } from "@/lib/blog";
import type { ArticlePageContent } from "@/lib/blog";

import { cn } from "cn";

import { ArticleShare } from "./article-share";

export function ArticleHeader({
  article,
  canonicalUrl,
}: {
  article: ArticlePageContent;
  canonicalUrl: string;
}) {
  return (
    <header className="border-b border-border bg-card print:bg-white">
      <MaxWidth className="py-8">
        <Breadcrumbs
          className="mb-4 print:hidden"
          items={[
            { label: "الرئيسية", href: "/" },
            { label: "المدونة", href: BLOG_PATH },
            { label: article.title },
          ]}
        />
        <ul className="mb-4 flex list-none flex-wrap gap-1 p-0">
          {article.tags.map((tag, index) => (
            <li key={tag.id}>
              <Badge
                variant="secondary"
                className={cn(
                  "h-auto rounded-sm px-2 py-1 text-xs font-medium",
                  index === 0
                    ? "bg-surface-blue text-link"
                    : "bg-muted text-muted-foreground",
                )}
              >
                {tag.title}
              </Badge>
            </li>
          ))}
          <li>
            <Badge className="h-auto gap-1 rounded-sm bg-brand-gold/15 px-2 py-1 text-xs font-medium text-brand-navy">
              <BookOpen aria-hidden="true" className="size-3.5" />
              دليل فني
            </Badge>
          </li>
        </ul>
        <h1
          id="article-title"
          className="max-w-4xl text-[2rem] leading-normal font-semibold text-brand-navy lg:text-[2.5rem] lg:leading-[1.45]"
        >
          {article.title}
        </h1>
        <p className="mt-4 max-w-4xl text-base leading-8 text-muted-foreground sm:text-lg">
          {article.excerpt}
        </p>
        <div className="mt-6 flex flex-col justify-between gap-4 border-t border-border/70 pt-4 xl:flex-row xl:items-center">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs leading-6 text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays
                aria-hidden="true"
                className="size-4 shrink-0 text-link"
              />
              تاريخ النشر:
              <time dateTime={article.publishedAt}>
                {article.publishedLabel}
              </time>
            </span>
            {article.updatedAt && article.updatedLabel ? (
              <span className="inline-flex items-center gap-1.5">
                <History
                  aria-hidden="true"
                  className="size-4 shrink-0 text-brand-gold"
                />
                تاريخ تحديث المقال:
                <time dateTime={article.updatedAt}>{article.updatedLabel}</time>
              </span>
            ) : null}
            <span className="inline-flex items-center gap-1.5">
              <Clock3
                aria-hidden="true"
                className="size-4 shrink-0 text-brand-navy"
              />
              وقت القراءة التقريبي: {article.readingTimeLabel}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <UserRoundPen
                aria-hidden="true"
                className="size-4 shrink-0 text-success"
              />
              إعداد: {article.author.name}
            </span>
          </div>
          <ArticleShare title={article.title} url={canonicalUrl} />
        </div>
      </MaxWidth>
    </header>
  );
}
