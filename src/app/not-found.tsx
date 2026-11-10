import type { Metadata } from "next";
import Link from "next/link";
import { cn } from "cn";
import {
  BadgeCheck,
  Building2,
  ClipboardCheck,
  Construction,
  Container,
  Droplets,
  Headset,
  House,
  Layers3,
  MessageCircle,
  Phone,
  Route,
  ShieldCheck,
  Signpost,
  Unlink,
  UsersRound,
} from "lucide-react";

import { MaxWidth } from "@/components/MaxWidth";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { buttonVariants } from "@/components/ui/button-variants";
import { Card, CardContent } from "@/components/ui/card";
import { isNavigationPageAvailable } from "@/sanity/data/page-availability";
import { getSiteShell } from "@/sanity/data/site-settings";

import SiteLayout from "./(site)/layout";

export const metadata: Metadata = {
  title: "الصفحة غير موجودة",
  description:
    "تعذر العثور على الصفحة المطلوبة. تصفح خدمات شركة عوازل بورسعيد أو تواصل مع فريقنا.",
  robots: { index: false, follow: false },
};

const quickLinks = [
  {
    id: "roof",
    icon: House,
    title: "عزل الأسطح والمباني",
    description: "تعرّف على تطبيقات العزل",
    href: "/services#service-applications-title",
    page: "/services",
  },
  {
    id: "foundations",
    icon: Layers3,
    title: "عزل الأساسات والقواعد",
    description: "اطّلع على أنظمة العزل المتاحة",
    href: "/services#service-applications-title",
    page: "/services",
  },
  {
    id: "tanks",
    icon: Container,
    title: "عزل الخزانات الأرضية",
    description: "استعرض تفاصيل تطبيقات العزل",
    href: "/services#service-applications-title",
    page: "/services",
  },
  {
    id: "projects",
    icon: Building2,
    title: "سابقة المشاريع المنفذة",
    description: "تصفّح المشاريع المنشورة",
    href: "/#projects",
    page: "/",
  },
  {
    id: "certificates",
    icon: BadgeCheck,
    title: "الاعتمادات والشهادات",
    description: "اطّلع على المستندات المنشورة",
    href: "/certificates",
    page: "/certificates",
  },
  {
    id: "quote",
    icon: ClipboardCheck,
    title: "طلب معاينة وتسعير",
    description: "تواصل لمناقشة احتياجات مشروعك",
    href: "/contact",
    page: "/contact",
  },
] as const;

const assurances = [
  {
    id: "code",
    icon: ShieldCheck,
    title: "المواصفات الفنية",
    description: "تُحدد حسب النظام والمشروع",
  },
  {
    id: "warranty",
    icon: ShieldCheck,
    title: "شروط الضمان",
    description: "راجع النطاق والمدة قبل الاعتماد",
  },
  {
    id: "team",
    icon: UsersRound,
    title: "تواصل مع الفريق",
    description: "وضّح متطلبات مشروعك",
  },
  {
    id: "water",
    icon: Droplets,
    title: "اختبارات التسليم",
    description: "استفسر عن الفحوص المطلوبة",
  },
] as const;

export default async function NotFound() {
  const { header, footer } = await getSiteShell();
  const phone = footer.contact.rows.find((row) => row.key === "phone");
  const whatsapp = footer.cta?.secondary.href.startsWith("https://wa.me/")
    ? footer.cta.secondary
    : null;
  const links = quickLinks.filter((link) =>
    isNavigationPageAvailable(header, link.page),
  );
  const contactAction = header.primaryAction;

  return (
    <SiteLayout>
      <div className="border-b border-border bg-muted py-4">
        <MaxWidth className="flex flex-wrap items-center justify-between gap-3">
          <Breadcrumbs
            items={[
              { label: "الرئيسية", href: "/" },
              { label: "خطأ 404 (الصفحة غير موجودة)" },
            ]}
          />
          <p className="flex items-center gap-1 rounded bg-card px-2 py-1 text-xs text-muted-foreground">
            <span
              aria-hidden="true"
              className="size-2 rounded-full bg-brand-blue"
            />
            كود النظام الهندسي: <bdi>REF-404-NOTFOUND</bdi>
          </p>
        </MaxWidth>
      </div>
      <section
        aria-labelledby="not-found-title"
        className="relative overflow-hidden py-16 sm:py-24"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 inset-s-1/4 h-96 w-96 rounded-full bg-surface-blue/70 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 inset-e-1/4 h-96 w-96 rounded-full bg-amber-100/20 blur-3xl"
        />
        <MaxWidth className="relative">
          <Card className="mx-auto max-w-195 gap-0 py-8 shadow-md ring-0">
            <CardContent className="px-5 sm:px-8">
              <div className="text-center">
                <p className="inline-flex items-center gap-1 rounded-full bg-surface-blue px-4 py-1.5 text-xs font-medium text-link">
                  <Signpost aria-hidden="true" className="shrink-0 size-3.5" />
                  رمز التوجيه الفني المقاولاتي
                </p>
                <div
                  aria-label="404"
                  dir="ltr"
                  className="mt-6 flex items-center justify-center gap-3 font-english text-[88px] leading-none font-bold text-brand-navy"
                >
                  <span aria-hidden="true">4</span>
                  <span
                    aria-hidden="true"
                    className="relative flex size-20 items-center justify-center rounded-lg bg-muted"
                  >
                    <Unlink
                      aria-hidden="true"
                      className="shrink-0 size-10 text-brand-blue"
                    />
                    <span className="absolute -top-1 -right-1 size-3 rounded-full bg-brand-gold" />
                  </span>
                  <span aria-hidden="true">4</span>
                </div>
                <div
                  aria-hidden="true"
                  className="mx-auto mt-4 h-0.75 w-16 rounded-full bg-brand-gold"
                />
                <h1
                  id="not-found-title"
                  className="mt-4 text-3xl leading-relaxed font-semibold text-brand-navy sm:text-[40px] sm:leading-14.5"
                >
                  الصفحة غير موجودة
                </h1>
                <p className="mx-auto mt-1 max-w-155 text-base leading-relaxed text-muted-foreground sm:text-lg">
                  قد يكون الرابط المدخل قد تغيّر أو نُقلت الصفحة إلى مسار جديد.
                  يمكنك العودة إلى الرئيسية أو استخدام الروابط المتاحة للوصول
                  إلى المحتوى الذي تبحث عنه.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-4">
                  <Link href="/" className={cn(buttonVariants(), "px-8")}>
                    <House aria-hidden="true" className="size-4 shrink-0" />
                    العودة إلى الرئيسية
                  </Link>
                  {isNavigationPageAvailable(header, "/services") ? (
                    <Link
                      href="/services"
                      className={buttonVariants({ variant: "secondary" })}
                    >
                      <Construction
                        aria-hidden="true"
                        className="size-4 shrink-0"
                      />
                      استعراض خدماتنا
                    </Link>
                  ) : null}
                </div>
              </div>
              {links.length > 0 ? (
                <div className="mt-8 rounded-lg px-0 pt-6 pb-4 sm:px-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2 className="flex items-center gap-1 text-sm font-medium text-brand-navy">
                      <Route
                        aria-hidden="true"
                        className="size-4 shrink-0 text-brand-blue"
                      />
                      روابط سريعة لتصفح الموقع:
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      اختر القسم المناسب لاحتياجك
                    </p>
                  </div>
                  <div className="mt-2 grid gap-2 sm:grid-cols-2 md:grid-cols-3">
                    {links.map((link) => (
                      <Link
                        key={link.id}
                        href={
                          link.id === "quote" && contactAction
                            ? contactAction.href
                            : link.href
                        }
                        className="flex min-w-0 items-start gap-2 rounded-lg bg-card p-2 shadow-sm transition-colors hover:bg-surface-blue focus-visible:outline-2 focus-visible:outline-ring"
                      >
                        <span className="flex size-9 shrink-0 items-center justify-center rounded bg-surface-blue text-brand-blue">
                          <link.icon
                            aria-hidden="true"
                            className="size-4.5 shrink-0"
                          />
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-brand-navy">
                            {link.title}
                          </p>
                          <p className="text-xs leading-5 text-muted-foreground">
                            {link.description}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}
              <div className="mt-6 flex flex-col justify-between gap-4 border-t border-border pt-4 lg:flex-row lg:items-center">
                <p className="flex max-w-94 items-center gap-2 text-sm leading-6 text-muted-foreground">
                  <Headset
                    aria-hidden="true"
                    className="shrink-0 size-5 text-brand-gold"
                  />
                  هل تحتاج إلى مساعدة في العثور على معلومات معينة؟ تواصل معنا
                  عبر القنوات المتاحة:
                </p>
                <div className="flex flex-wrap gap-2">
                  {phone?.href ? (
                    <a
                      href={phone.href}
                      className={buttonVariants({
                        variant: "secondary",
                        size: "sm",
                      })}
                    >
                      <Phone aria-hidden="true" className="size-4 shrink-0" />
                      <bdi>{phone.value}</bdi>
                    </a>
                  ) : null}
                  {whatsapp ? (
                    <a
                      href={whatsapp.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={buttonVariants({
                        variant: "whatsapp",
                        size: "sm",
                      })}
                    >
                      <MessageCircle
                        aria-hidden="true"
                        className="size-4 shrink-0"
                      />
                      محادثة واتساب فورية
                    </a>
                  ) : contactAction ? (
                    <Link
                      href={contactAction.href}
                      className={buttonVariants({ size: "sm" })}
                    >
                      {contactAction.label}
                    </Link>
                  ) : null}
                </div>
              </div>
            </CardContent>
          </Card>
        </MaxWidth>
      </section>
      <section aria-label="إرشادات قبل طلب الخدمة" className="bg-muted py-6">
        <MaxWidth className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {assurances.map((item) => (
            <div key={item.id} className="text-center">
              <item.icon
                aria-hidden="true"
                className="mx-auto size-6 shrink-0 text-brand-blue"
              />
              <h2 className="mt-1 text-sm font-semibold text-brand-navy">
                {item.title}
              </h2>
              <p className="text-xs text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </MaxWidth>
      </section>
      {whatsapp ? (
        <a
          href={whatsapp.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="محادثة واتساب"
          className="fixed inset-e-6 bottom-6 z-30 flex size-14 items-center justify-center rounded-full bg-whatsapp text-whatsapp-foreground shadow-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring print:hidden"
        >
          <MessageCircle aria-hidden="true" className="shrink-0 size-6" />
        </a>
      ) : null}
    </SiteLayout>
  );
}
