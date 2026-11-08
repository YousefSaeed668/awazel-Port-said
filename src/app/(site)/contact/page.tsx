import type { Metadata } from "next";
import { ClipboardList } from "lucide-react";

import { MaxWidth } from "@/components/MaxWidth";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { getSiteUrl } from "@/lib/utils";
import { requireNavigationPage } from "@/sanity/data/page-availability";
import { getSiteShell } from "@/sanity/data/site-settings";

import { ContactForm } from "./contact-form";
import { ContactInfo } from "./contact-info";

const CONTACT_PATH = "/contact";
const CONTACT_TITLE = "تواصل معنا واطلب عرض سعر";
const CONTACT_DESCRIPTION =
  "نرحب بتواصل ملاك المباني والمقاولين والمكاتب الهندسية. املأ النموذج المخصص لمشروعك، وسيقوم فريقنا الهندسي بدراسة المتطلبات الفنية وتقديم المقايسة المعتمدة وفق اشتراطات كود البناء السعودي.";

export async function generateMetadata(): Promise<Metadata> {
  await requireNavigationPage(CONTACT_PATH);
  const { defaultSeo } = await getSiteShell();
  const canonicalUrl = new URL(CONTACT_PATH, getSiteUrl()).toString();
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
    title: CONTACT_TITLE,
    description: CONTACT_DESCRIPTION,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "website",
      locale: "ar",
      url: canonicalUrl,
      siteName: defaultSeo.siteName,
      title: CONTACT_TITLE,
      description: CONTACT_DESCRIPTION,
      images,
    },
    twitter: {
      card: images ? "summary_large_image" : "summary",
      title: CONTACT_TITLE,
      description: CONTACT_DESCRIPTION,
      images: images?.map((image) => image.url),
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function ContactPage() {
  await requireNavigationPage(CONTACT_PATH);
  const { contact, footer } = await getSiteShell();
  const serviceOptions = footer.services.links.map((link) => link.label);

  return (
    <>
      <section className="bg-muted">
        <MaxWidth className="py-12">
          <Breadcrumbs
            items={[
              { label: "الرئيسية", href: "/" },
              { label: "تواصل معنا واطلب عرض سعر" },
            ]}
          />

          <div className="mt-6 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex max-w-3xl flex-col items-start gap-3">
              <p className="inline-flex items-center gap-2 rounded-full bg-surface-blue px-3 py-1.5 text-xs font-medium text-link shadow-sm">
                طلبات التسعير والاستشارات الفنية الميدانية
                <span
                  aria-hidden="true"
                  className="size-2 shrink-0 rounded-full bg-brand-blue"
                />
              </p>
              <h1 className="text-3xl font-semibold leading-tight tracking-[-1px] text-brand-navy sm:text-[40px] sm:leading-[58px]">
                {CONTACT_TITLE}
              </h1>
              <p className="text-base leading-relaxed text-muted-foreground sm:text-lg sm:leading-[29px]">
                {CONTACT_DESCRIPTION}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-3 rounded-xl bg-card p-3 shadow-sm">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-surface-blue text-brand-blue">
                <ClipboardList aria-hidden="true" className="size-5" />
              </span>
              <div className="flex flex-col items-start">
                <span className="text-base font-semibold text-brand-navy">
                  استجابة هندسية منظمة
                </span>
                <span className="text-sm leading-6 text-muted-foreground">
                  دراسة فنية للمخططات والمساحات
                </span>
              </div>
            </div>
          </div>
        </MaxWidth>
      </section>

      <section className="py-12 sm:py-16">
        <MaxWidth>
          <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-7">
              <ContactForm serviceOptions={serviceOptions} />
            </div>
            <aside
              aria-label="بيانات التواصل المباشر"
              className="lg:col-span-5"
            >
              <ContactInfo contact={contact} />
            </aside>
          </div>
        </MaxWidth>
      </section>
    </>
  );
}
