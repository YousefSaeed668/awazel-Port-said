import { MessageSquare, ScanLine } from "lucide-react";

import { buttonVariants } from "@/components/ui/button-variants";
import type { ResolvedDestination } from "@/lib/links";
import { cn } from "cn";

type BannerProps = {
  destination: ResolvedDestination | null;
  whatsappDestination: ResolvedDestination | null;
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
}: {
  destination: ResolvedDestination;
  label: string;
  whatsapp?: boolean;
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
        {whatsappDestination ? (
          <BannerAction
            destination={whatsappDestination}
            label="استفسر عبر واتساب"
            whatsapp
          />
        ) : null}
      </div>
    </section>
  );
}
