import { Headset, MessageSquare, PhoneCall } from "lucide-react";

import { MaxWidth } from "@/components/MaxWidth";
import { buttonVariants } from "@/components/ui/button-variants";
import type { ResolvedDestination } from "@/lib/links";
import type { SiteActionViewModel } from "@/lib/site-view-models";
import { cn } from "cn";

type BlogAdvisoryCtaProps = {
  consultation: SiteActionViewModel | null;
  whatsapp: ResolvedDestination;
};

const fallbackConsultation: SiteActionViewModel = {
  label: "اطلب استشارة أو معاينة فنية",
  href: "/contact",
  external: false,
  openInNewTab: false,
};

function ActionLink({
  href,
  external,
  openInNewTab,
  label,
  variant,
  icon,
}: {
  href: string;
  external: boolean;
  openInNewTab: boolean;
  label: string;
  variant: "whatsapp" | "inverse";
  icon: typeof MessageSquare;
}) {
  const Icon = icon;

  return (
    <a
      href={href}
      target={external && openInNewTab ? "_blank" : undefined}
      rel={external && openInNewTab ? "noopener noreferrer" : undefined}
      className={cn(
        buttonVariants({ variant, size: "sm" }),
        "min-h-11 whitespace-nowrap px-5",
      )}
    >
      <Icon aria-hidden="true" className="size-4" />
      {label}
    </a>
  );
}

/**
 * Closing call to action below the listing. Copy is deliberately limited to
 * engineering support the site already offers; destinations come from the
 * published site shell and blog settings.
 */
export function BlogAdvisoryCta({
  consultation,
  whatsapp,
}: BlogAdvisoryCtaProps) {
  const action = consultation ?? fallbackConsultation;

  return (
    <section aria-labelledby="blog-advisory-title" className="bg-background pb-12 lg:pb-16">
      <MaxWidth>
        <div className="relative overflow-hidden rounded-2xl bg-brand-navy px-6 py-8 text-white shadow-md sm:px-10 lg:px-16 lg:py-12 xl:px-32">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 inset-e-10 size-56 rounded-full bg-brand-blue/20 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-28 inset-s-6 size-64 rounded-full bg-brand-gold/10 blur-3xl"
          />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
            <div className="max-w-2xl">
              <p className="flex items-center gap-1.5 text-xs font-medium text-brand-gold">
                <Headset aria-hidden="true" className="size-4" />
                الاستشارة الفنية
              </p>
              <h2
                id="blog-advisory-title"
                className="mt-2 text-2xl font-semibold leading-snug lg:text-[32px] lg:leading-12"
              >
                هل لديك استفسار هندسي محدد حول منشأتك؟
              </h2>
              <p className="mt-2 text-base leading-6.5 text-[#e5e9eb]">
                فريقنا الفني يجيب على أسئلتك حول أنظمة العزل واختيار المواد
                المناسبة لمنشأتك، ويمكنه تنسيق معاينة فنية للموقع عند الحاجة.
              </p>
            </div>

            <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:items-center">
              <ActionLink
                href={whatsapp.href}
                external={whatsapp.external}
                openInNewTab={whatsapp.openInNewTab}
                label="تواصل عبر واتساب"
                variant="whatsapp"
                icon={MessageSquare}
              />
              <ActionLink
                href={action.href}
                external={action.external}
                openInNewTab={action.openInNewTab}
                label={action.label}
                variant="inverse"
                icon={PhoneCall}
              />
            </div>
          </div>
        </div>
      </MaxWidth>
    </section>
  );
}
