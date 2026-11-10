import { MaxWidth } from "@/components/MaxWidth";
import { SectionHeading } from "@/components/ui/section-heading";
import { BlogCard } from "@/components/content-cards";

import type { BlogListingArticle } from "@/lib/blog";
import type { HomepageData } from "@/lib/data";

export function ArticlesSection({
  content,
  items,
}: {
  content: HomepageData["articles"];
  items: readonly BlogListingArticle[];
}) {
  return (
    <section
      id="blog"
      aria-labelledby="articles-title"
      className="bg-background py-12"
    >
      <MaxWidth>
        <SectionHeading {...content.heading} variant="home" id="articles-title" />
        {items.length ? (
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {items.map((article) => (
              <BlogCard
                key={article.id}
                title={article.title}
                description={article.excerpt}
                image={article.image}
                href={article.href}
                category={article.tags[0]?.title ?? "مقال فني"}
                readingTimeLabel={article.readingTimeLabel}
              />
            ))}
          </div>
        ) : (
          <p className="mt-8 rounded-lg border border-dashed border-border bg-card p-6 text-center text-sm leading-7 text-muted-foreground">
            لا توجد مقالات منشورة حاليًا.
          </p>
        )}
      </MaxWidth>
    </section>
  );
}
