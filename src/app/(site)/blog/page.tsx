import type { Metadata } from "next";

import { BLOG_PATH } from "@/lib/blog";
import { getSiteUrl } from "@/lib/utils";
import { getBlogBanners } from "@/sanity/data/article";
import { getArticleIndex } from "@/sanity/data/article-index";
import { getSiteShell } from "@/sanity/data/site-settings";
import { requireNavigationPage } from "@/sanity/data/page-availability";

import { BlogAdvisoryCta } from "./_listing/blog-advisory-cta";
import { BlogDirectory } from "./_listing/blog-directory";
import { BlogHero } from "./_listing/blog-hero";

const BLOG_TITLE = "المدونة والإرشادات الفنية";
const BLOG_DESCRIPTION =
  "مقالات ودلائل فنية متخصصة في العزل الحراري والمائي وحماية المباني، من اختيار النظام المناسب إلى خطوات التنفيذ والفحص.";

export async function generateMetadata(): Promise<Metadata> {
  await requireNavigationPage(BLOG_PATH);
  const { defaultSeo } = await getSiteShell();
  const canonicalUrl = new URL(BLOG_PATH, getSiteUrl()).toString();
  const images = defaultSeo.image
    ? [
        {
          url: defaultSeo.image.src,
          width: defaultSeo.image.width,
          height: defaultSeo.image.height,
          alt: defaultSeo.image.alt,
        },
      ]
    : undefined;

  return {
    title: BLOG_TITLE,
    description: BLOG_DESCRIPTION,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "website",
      locale: "ar",
      url: canonicalUrl,
      siteName: defaultSeo.siteName,
      title: BLOG_TITLE,
      description: BLOG_DESCRIPTION,
      images,
    },
    twitter: {
      card: images ? "summary_large_image" : "summary",
      title: BLOG_TITLE,
      description: BLOG_DESCRIPTION,
      images: images?.map((image) => image.url),
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function BlogPage() {
  await requireNavigationPage(BLOG_PATH);
  const [articles, shell, banners] = await Promise.all([
    getArticleIndex(),
    getSiteShell(),
    getBlogBanners(),
  ]);

  return (
    <>
      <BlogHero articleCount={articles.length} />
      <BlogDirectory articles={articles} />
      <BlogAdvisoryCta
        consultation={shell.header.primaryAction}
        whatsapp={banners.whatsapp}
      />
    </>
  );
}
