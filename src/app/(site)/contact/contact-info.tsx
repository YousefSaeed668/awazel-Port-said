import {
  CircleAlert,
  Clock,
  Compass,
  Lightbulb,
  Mail,
  MapPin,
  MapPinned,
  MessageCircle,
  Phone,
} from "lucide-react";

import type { ContactDetailsViewModel } from "@/lib/site-view-models";

export function ContactInfo({ contact }: { contact: ContactDetailsViewModel }) {
  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-6 rounded-xl bg-card p-5 shadow-xs sm:p-8">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold leading-snug text-brand-navy sm:text-[22px]">
            قنوات الاتصال المباشر
          </h2>
          <span
            aria-hidden="true"
            className="block h-0.5 w-8 rounded-full bg-brand-gold"
          />
          <p className="text-sm leading-6 text-muted-foreground">
            استخدم القنوات المنشورة أدناه، مع ذكر موقع المشروع والخدمة
            المطلوبة.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <ContactRow
            label="الاتصال الهاتفي المباشر"
            value={contact.phone}
            href={contact.phoneHref}
            icon={Phone}
            ltr
          />

          <div className="flex flex-col gap-2.5 rounded-lg bg-muted p-3">
            <div className="flex items-start gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-whatsapp/10 text-whatsapp">
                <MessageCircle aria-hidden="true" className="size-5" />
              </span>
              <div className="flex min-w-0 flex-col items-start gap-0.5">
                <span className="text-sm leading-6 text-muted-foreground">
                  واتساب الدعم الفني
                </span>
                {contact.whatsapp ? (
                  <a
                    href={contact.whatsappHref ?? undefined}
                    dir="ltr"
                    className="inline-block max-w-full truncate text-base font-semibold text-whatsapp underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                  >
                    {contact.whatsapp}
                  </a>
                ) : (
                  <UnavailableValue />
                )}
              </div>
            </div>

            {contact.whatsappHref ? (
              <a
                href={contact.whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-whatsapp px-4 text-sm font-medium text-whatsapp-foreground transition-colors hover:bg-whatsapp/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <MessageCircle aria-hidden="true" className="size-4" />
                محادثة فورية عبر واتساب
              </a>
            ) : (
              <p className="text-xs leading-5 text-muted-foreground">
                لم يُضف رقم واتساب معتمد إلى إعدادات الموقع بعد.
              </p>
            )}
          </div>

          <ContactRow
            label="المراسلات الرسمية"
            value={contact.email}
            href={contact.emailHref}
            icon={Mail}
            ltr
          />

          <ContactRow
            label="المقر الرئيسي"
            value={contact.address}
            icon={MapPin}
            ltr={false}
          />

          <ContactRow
            label="ساعات العمل الرسمية"
            value={contact.workingHours}
            icon={Clock}
            ltr={false}
          />
        </div>
      </section>

      <section className="flex flex-col gap-3 rounded-xl bg-card p-5 shadow-xs sm:p-8">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-base font-semibold text-brand-navy">
            مقر الشركة وموقع المشروع
          </h3>
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-surface-blue text-brand-blue">
            <MapPinned aria-hidden="true" className="size-4" />
          </span>
        </div>
        <p className="text-base leading-7 text-muted-foreground">
          مقر الشركة في الرياض. اذكر المدينة وموقع المشروع عند التواصل حتى يمكن
          تأكيد إمكان تنسيق المعاينة والتنفيذ قبل الاتفاق.
        </p>
      </section>

      <section className="overflow-hidden rounded-xl bg-card shadow-xs">
        {contact.mapEmbedUrl ? (
          <iframe
            src={contact.mapEmbedUrl}
            title="موقع مقر الشركة على خرائط Google"
            width="600"
            height="450"
            className="block h-80 w-full border-0"
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : (
          <div className="relative flex h-52 flex-col items-center justify-center gap-3 bg-surface-blue p-4 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-brand-navy text-primary-foreground shadow-lg">
              <MapPin aria-hidden="true" className="size-5" />
            </span>
            <span className="rounded-full bg-card px-3 py-1 text-sm font-semibold text-brand-navy shadow-sm">
              خريطة المقر غير متوفرة حاليًا
            </span>
            <p className="max-w-xs text-xs leading-5 text-muted-foreground">
              لتنسيق زيارة أو الحصول على وصف الوصول، استخدم إحدى قنوات التواصل
              المتاحة.
            </p>
          </div>
        )}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-4">
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-surface-blue px-3 py-1.5 text-sm text-muted-foreground">
            <Compass aria-hidden="true" className="size-3.5 text-brand-blue" />
            الوصول إلى الشركة
          </span>
          <span className="text-xs leading-5 text-muted-foreground">
            {contact.mapEmbedUrl ? "خرائط Google" : "الخريطة غير متوفرة حاليًا"}
          </span>
        </div>
      </section>

      <section className="flex gap-4 rounded-xl bg-surface-blue p-6 shadow-xs">
        <div className="flex flex-col gap-2">
          <h3 className="text-base font-semibold text-brand-navy">
            معلومات تساعدنا على فهم احتياجك
          </h3>
          <ul className="list-disc space-y-1 ps-5 text-sm leading-6 text-foreground">
            <li>نوع المساحة، مثل سطح أو خزان أو أساسات أو منطقة رطبة</li>
            <li>المساحة التقريبية وحالة التشطيب أو العزل القائم</li>
            <li>مواضع الرطوبة أو تجمع الماء ووقت ظهور المشكلة إن وجدت</li>
            <li>أي قيود للوصول إلى الموقع أو توقيت تنفيذ مطلوب</li>
          </ul>
        </div>
        <Lightbulb
          aria-hidden="true"
          className="mt-0.5 size-6 shrink-0 text-brand-gold"
        />
      </section>
    </div>
  );
}

function ContactRow({
  label,
  value,
  href,
  icon: Icon,
  ltr,
}: {
  label: string;
  value: string | null;
  href?: string | null;
  icon: typeof Phone;
  ltr: boolean;
}) {
  return (
    <div className="flex items-start  gap-3 rounded-lg bg-muted p-3">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-card text-brand-navy shadow-sm">
        <Icon aria-hidden="true" className="size-5" />
      </span>
      <div className="flex min-w-0 flex-col items-start gap-0.5">
        <span className="text-sm leading-6 text-muted-foreground">{label}</span>
        {value ? (
          href ? (
            <a
              href={href}
              dir={ltr ? "ltr" : undefined}
              className="inline-block max-w-full wrap-break-word text-base font-semibold text-brand-navy underline-offset-4 hover:text-link hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            >
              {value}
            </a>
          ) : (
            <span
              dir={ltr ? "ltr" : undefined}
              className="inline-block max-w-full wrap-break-word text-base font-medium leading-6 text-brand-navy"
            >
              {value}
            </span>
          )
        ) : (
          <UnavailableValue />
        )}
      </div>
    </div>
  );
}

function UnavailableValue() {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm leading-6 text-muted-foreground">
      <CircleAlert aria-hidden="true" className="size-4 shrink-0" />
      غير متوفر حاليًا
    </span>
  );
}
