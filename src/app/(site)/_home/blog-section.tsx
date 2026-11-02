import { MaxWidth } from "@/components/MaxWidth";
import { SectionHeading } from "@/components/ui/section-heading";
import { BlogCard } from "@/components/content-cards";

import type { HomepageData } from "@/lib/data";

export function ArticlesSection({
  content,
}: {
  content: HomepageData["articles"];
}) {
  return (
    <section
      id="blog"
      aria-labelledby="articles-title"
      className="bg-background py-12"
    >
      <MaxWidth>
        <SectionHeading {...content.heading} variant="home" id="articles-title" />
        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {content.items.map(({ id, ...item }) => (
            <BlogCard key={id} {...item} />
          ))}
        </div>
      </MaxWidth>
    </section>
  );
}
