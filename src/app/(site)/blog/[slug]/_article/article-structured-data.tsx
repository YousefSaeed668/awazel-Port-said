import { BLOG_PATH } from "@/lib/blog";
import type { ArticlePageContent } from "@/lib/blog";

import { getSiteUrl } from "@/lib/utils";

export function ArticleStructuredData({
  article,
  canonicalUrl,
  siteName,
  siteLogoUrl,
}: {
  article: ArticlePageContent;
  canonicalUrl: string;
  siteName: string;
  siteLogoUrl: string;
}) {
  const siteUrl = getSiteUrl();
  const dateModified = article.updatedAt ?? article.publishedAt;

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        headline: article.title,
        description: article.seo.description,
        image: [article.cover.src],
        datePublished: article.publishedAt,
        dateModified,
        inLanguage: "ar",
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": canonicalUrl,
        },
        url: canonicalUrl,
        author: {
          "@type": "Person",
          name: article.author.name,
        },
        publisher: {
          "@type": "Organization",
          name: siteName,
          logo: {
            "@type": "ImageObject",
            url: siteLogoUrl,
          },
        },
        ...(article.tags.length
          ? { keywords: article.tags.map((tag) => tag.title).join(", ") }
          : {}),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "الرئيسية",
            item: new URL("/", siteUrl).toString(),
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "المدونة",
            item: new URL(BLOG_PATH, siteUrl).toString(),
          },
          {
            "@type": "ListItem",
            position: 3,
            name: article.title,
            item: canonicalUrl,
          },
        ],
      },
    ],
  };

  const json = JSON.stringify(graph).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
