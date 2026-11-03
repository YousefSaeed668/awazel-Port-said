import Image from "next/image";
import { BookOpen, Camera, UserRoundPen } from "lucide-react";

import { BlogCard } from "@/components/content-cards";
import { MaxWidth } from "@/components/MaxWidth";
import { SectionHeading } from "@/components/ui/section-heading";
import type {
  ArticlePageContent,
  BlogBanners,
  RelatedArticle,
} from "@/lib/blog";

import { ArticleSidebarBanner, ArticleWideBanner } from "./article-banners";
import { ArticleBody } from "./article-body";
import { ArticleHeader } from "./article-header";
import { ArticleShareLink } from "./article-share";
import { ArticleMobileToc, ArticleToc } from "./article-toc";

function ArticleCover({ article }: { article: ArticlePageContent }) {
  return (
    <figure className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <Image
        src={article.cover.src}
        alt={article.cover.alt}
        width={article.cover.width ?? 1600}
        height={article.cover.height ?? 900}
        sizes="(min-width: 1344px) 760px, (min-width: 1024px) 62vw, 100vw"
        preload
        className="h-72 w-full object-cover sm:h-96 print:h-auto"
        style={
          article.cover.objectPosition
            ? { objectPosition: article.cover.objectPosition }
            : undefined
        }
      />
      {article.coverCaption ? (
        <figcaption className="flex items-start gap-2 border-t border-border bg-muted px-3 py-2 text-sm leading-6 text-muted-foreground">
          <Camera
            aria-hidden="true"
            className="mt-1 size-4 shrink-0 text-link"
          />
          {article.coverCaption}
        </figcaption>
      ) : null}
    </figure>
  );
}

function ArticleAuthor({
  article,
  canonicalUrl,
}: {
  article: ArticlePageContent;
  canonicalUrl: string;
}) {
  return (
    <section
      aria-labelledby="article-author-title"
      className="mt-8 flex flex-col gap-4 rounded-xl border border-border bg-muted p-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex min-w-0 items-start gap-3">
        {article.author.image ? (
          <Image
            src={article.author.image.src}
            alt={article.author.image.alt}
            width={article.author.image.width ?? 160}
            height={article.author.image.height ?? 160}
            sizes="40px"
            className="size-10 shrink-0 rounded-full object-cover"
            style={
              article.author.image.objectPosition
                ? { objectPosition: article.author.image.objectPosition }
                : undefined
            }
          />
        ) : (
          <span
            aria-hidden="true"
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-navy text-brand-gold"
          >
            <UserRoundPen className="size-5" />
          </span>
        )}
        <div className="min-w-0">
          <h2
            id="article-author-title"
            className="text-base font-medium text-brand-navy"
          >
            إعداد: {article.author.name}
          </h2>
          {article.author.role ? (
            <p className="text-sm text-muted-foreground">
              {article.author.role}
            </p>
          ) : null}
          {article.author.bio ? (
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              {article.author.bio}
            </p>
          ) : null}
        </div>
      </div>
      <ArticleShareLink title={article.title} url={canonicalUrl} />
    </section>
  );
}

function RelatedArticles({
  articles,
}: {
  articles: readonly RelatedArticle[];
}) {
  if (articles.length === 0) return null;

  return (
    <section
      aria-labelledby="related-articles-title"
      className="border-t border-border bg-background py-8 print:hidden"
    >
      <MaxWidth>
        <SectionHeading
          id="related-articles-title"
          eyebrow="قاعدة المعرفة الهندسية"
          title="مقالات وإرشادات فنية ذات صلة"
          className="border-b border-border pb-3"
          eyebrowVariant="plain"
          titleClassName="mt-1 font-semibold text-brand-navy"
        />
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <BlogCard
              key={article.id}
              {...article}
              variant="article"
              linkLabel="قراءة الدليل"
              headingLevel={3}
              imageSizes="(min-width: 1344px) 400px, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            />
          ))}
        </div>
      </MaxWidth>
    </section>
  );
}

export function ArticleView({
  article,
  banners,
  related,
  canonicalUrl,
}: {
  article: ArticlePageContent;
  banners: BlogBanners;
  related: readonly RelatedArticle[];
  canonicalUrl: string;
}) {
  return (
    <div className="article-page print:bg-white print:text-black">
      <article aria-labelledby="article-title">
        <ArticleHeader article={article} canonicalUrl={canonicalUrl} />
        <MaxWidth className="py-8">
          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-12 print:block">
            <aside className="hidden space-y-6 lg:sticky lg:top-8 lg:col-start-1 lg:row-start-1 lg:block print:hidden">
              <ArticleToc items={article.toc} />
              <ArticleSidebarBanner
                destination={banners.sidebar}
                whatsappDestination={banners.whatsapp}
              />
              <div className="rounded-xl border border-border/80 bg-surface-blue/60 p-4">
                <p className="mb-2 flex items-center gap-2 text-base font-medium text-link">
                  <BookOpen aria-hidden="true" className="size-5 shrink-0" />
                  قبل اعتماد نظام العزل
                </p>
                <p className="text-sm leading-6 text-muted-foreground">
                  راجع مواصفات النظام ونشرة المصنّع ومتطلبات كود البناء المعمول
                  به مع المهندس المختص قبل التنفيذ.
                </p>
              </div>
            </aside>
            <div className="min-w-0 lg:col-start-2 lg:row-start-1">
              <ArticleMobileToc items={article.toc} className="mb-6" />
              <ArticleCover article={article} />
              <div className="mt-8">
                <ArticleBody value={article.body} />
              </div>
              <ArticleAuthor article={article} canonicalUrl={canonicalUrl} />
            </div>
          </div>
        </MaxWidth>
      </article>
      <ArticleWideBanner
        destination={banners.wide}
        whatsappDestination={banners.whatsapp}
      />
      <RelatedArticles articles={related} />
    </div>
  );
}
