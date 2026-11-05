import type { Metadata } from "next";

import { MaxWidth } from "@/components/MaxWidth";
import { ServiceApplicationCard } from "@/components/service-application-card";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { getServicesPageContent } from "@/sanity/data/services-page";
import { requireNavigationPage } from "@/sanity/data/page-availability";

import {
  ServicesAssessment,
  ServicesTechnologies,
} from "./_sections/services-technical-sections";
import {
  ServicesConsultation,
  ServicesFaq,
  ServicesSectionHeading,
} from "./_sections/services-support-sections";

export async function generateMetadata(): Promise<Metadata> {
  await requireNavigationPage("/services");
  const { seo } = await getServicesPageContent();
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: "/services" },
  };
}

export default async function ServicesPage() {
  await requireNavigationPage("/services");
  const content = await getServicesPageContent();

  return (
    <>
      <section
        aria-labelledby="services-page-title"
        className="bg-muted py-12 sm:py-16"
      >
        <MaxWidth>
          <Breadcrumbs items={content.breadcrumbs} />
          <div className="mt-6 max-w-190">
            <p className="inline-flex items-center gap-2 rounded-full bg-surface-blue px-3 py-1 text-xs font-medium text-link">
              <span
                aria-hidden="true"
                className="size-1.5 rounded-full bg-brand-blue"
              />
              {content.intro.eyebrow}
            </p>
            <h1
              id="services-page-title"
              className="mt-3 text-3xl leading-tight font-semibold text-brand-navy sm:text-[40px] sm:leading-[1.25]"
            >
              {content.intro.title}
            </h1>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground sm:text-lg">
              {content.intro.description}
            </p>
          </div>
        </MaxWidth>
      </section>

      <section
        aria-labelledby="service-applications-title"
        className="py-16 lg:py-24"
      >
        <MaxWidth>
          <ServicesSectionHeading
            id="service-applications-title"
            heading={content.applications.heading}
          />
          <div className="mt-10 space-y-8 lg:mt-16 lg:space-y-12">
            {content.applications.items.map((service, index) => (
              <ServiceApplicationCard
                key={service.id}
                service={service}
                number={index + 1}
                reverse={index % 2 === 1}
              />
            ))}
          </div>
        </MaxWidth>
      </section>

      <ServicesTechnologies content={content.technologies} />
      <ServicesAssessment content={content.assessment} />
      <ServicesFaq content={content.faq} />
      <ServicesConsultation content={content.consultation} />
    </>
  );
}
