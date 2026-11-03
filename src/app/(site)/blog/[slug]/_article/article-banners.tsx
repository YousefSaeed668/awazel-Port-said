import { MapPin, MessageSquare, ScanLine } from "lucide-react";

import { MaxWidth } from "@/components/MaxWidth";
import { buttonVariants } from "@/components/ui/button-variants";
import type { ResolvedDestination } from "@/lib/links";
import { cn } from "cn";

type BannerProps = {
  destination: ResolvedDestination | null;
  whatsappDestination: ResolvedDestination;
};

const contactDestination: ResolvedDestination = {
  href: "/contact",
  external: false,
  openInNewTab: false,
};

function BannerAction({
  destination,
  label,
  whatsapp = false,
  className,
}: {
  destination: ResolvedDestination;
  label: string;
  whatsapp?: boolean;
  className?: string;
}) {
  return (
    <a
      href={destination.href}
      target={
        destination.external && destination.openInNewTab ? "_blank" : undefined
      }
      rel={
        destination.external && destination.openInNewTab
          ? "noopener noreferrer"
          : undefined
      }
      className={cn(
        buttonVariants({
          variant: whatsapp ? "whatsapp" : "inverse",
          size: "sm",
        }),
        "min-h-11 rounded-lg",
        className,
      )}
    >
      {whatsapp ? (
        <MessageSquare aria-hidden="true" className="size-4" />
      ) : null}
      {label}
    </a>
  );
}

export function ArticleSidebarBanner({
  destination,
  whatsappDestination,
}: BannerProps) {
  return (
    <section
      aria-labelledby="article-sidebar-banner-title"
      className="relative overflow-hidden rounded-xl bg-brand-navy p-6 text-white shadow-md print:hidden"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-12 -end-12 size-32 rounded-full bg-brand-blue/20 blur-2xl"
      />
      <p className="relative flex items-center gap-1 text-xs font-medium text-brand-gold">
        <ScanLine aria-hidden="true" className="size-3.5" />
        معاينة فنية لسطح مبناك
      </p>
      <h2
        id="article-sidebar-banner-title"
        className="relative mt-1 text-2xl leading-relaxed font-semibold"
      >
        هل تحتاج فحصاً هندسياً لسطحك؟
      </h2>
      <p className="relative mt-1 text-sm leading-6 text-white/70">
        يساعدك فريقنا في فحص حالة السطح والميول والرطوبة واختيار نظام العزل
        المناسب لاحتياجات المبنى.
      </p>
      <div className="relative mt-4 flex flex-col gap-1">
        <BannerAction
          destination={destination ?? contactDestination}
          label="احجز معاينة فنية لسطحك"
        />
        <BannerAction
          destination={whatsappDestination}
          label="استفسر عبر واتساب"
          whatsapp
        />
      </div>
    </section>
  );
}

export function ArticleWideBanner({
  destination,
  whatsappDestination,
}: BannerProps) {
  return (
    <section
      aria-labelledby="article-wide-banner-title"
      className="border-t border-border bg-card py-8 print:hidden"
    >
      <MaxWidth>
        <div className="flex flex-col justify-between gap-6 rounded-2xl bg-linear-to-l from-brand-navy-hover to-brand-navy p-6 text-white shadow-lg lg:flex-row lg:items-center lg:gap-8 lg:p-8">
          <div className="max-w-2xl">
            <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-brand-gold">
              <MapPin aria-hidden="true" className="size-4" />
              حلول عزل تناسب طبيعة مبناك
            </p>
            <h2
              id="article-wide-banner-title"
              className="text-[2rem] leading-normal font-semibold lg:text-[2.5rem] lg:leading-[1.45]"
            >
              جاهز لعزل سطح مبناك بمواصفات تدوم طويلاً؟
            </h2>
            <p className="mt-1 text-base leading-7 text-white/70">
              تواصل مع فريقنا لمعاينة الموقع وتحديد النظام الأنسب لسطحك وتقديم
              عرض أسعار تفصيلي واضح.
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row lg:max-w-sm lg:flex-wrap">
            <BannerAction
              destination={destination ?? contactDestination}
              label="اطلب عرض سعر الآن"
              className="flex-1 px-6"
            />
            <BannerAction
              destination={whatsappDestination}
              label="استشارة سريعة واتساب"
              whatsapp
              className="flex-1 px-6"
            />
          </div>
        </div>
      </MaxWidth>
    </section>
  );
}
