import { defineArrayMember, defineField, defineType } from "sanity";

import { headerNavigation } from "./headerNavigation";

const PHONE_PATTERN = /^\+?[\d\s().-]{7,24}$/;
const WHATSAPP_PATTERN = /^\+?[\d\s-]{7,24}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ImageValue = {
  asset?: { _ref?: string } | null;
  alt?: string | null;
} | null;

export const siteSettingsType = defineType({
  name: "siteSettings",
  title: "إعدادات الموقع",
  type: "document",
  groups: [
    { name: "brand", title: "الهوية", default: true },
    { name: "header", title: "شريط التنقل" },
    { name: "footer", title: "الشريط السفلى" },
    { name: "contact", title: "بيانات التواصل" },
    { name: "seo", title: "SEO الافتراضي" },
  ],
  preview: {
    select: {
      title: "brand.companyName",
      subtitle: "contact.address",
      media: "brand.logo",
    },
    prepare: ({ title, subtitle, media }) => ({
      title:
        typeof title === "string" && title.trim() ? title : "إعدادات الموقع",
      subtitle: typeof subtitle === "string" ? subtitle : undefined,
      media,
    }),
  },
  fields: [
    defineField({
      name: "brand",
      title: "الهوية",
      type: "object",
      group: "brand",
      fields: [
        defineField({
          name: "companyName",
          title: "اسم الشركة بالعربية",
          type: "string",
          validation: (Rule) => Rule.required().max(80),
        }),
        defineField({
          name: "tagline",
          title: "الشعار النصي (اختياري)",
          type: "string",
          validation: (Rule) => Rule.max(120),
        }),
        defineField({
          name: "logo",
          title: "الشعار الأصلي",
          type: "siteImage",
          description:
            "ارفع ملف الشعار الأصلي كما هو. تُقرأ أبعاده تلقائيًا من الأصل.",
          validation: (Rule) =>
            Rule.custom((value) => {
              const image = value as ImageValue;
              if (!image?.asset?._ref) return "اختر ملف الشعار.";
              if (!image.alt?.trim()) return "أدخل النص البديل العربي للشعار.";
              return true;
            }),
        }),
      ],
    }),
    defineField({
      name: "header",
      title: "شريط التنقل",
      type: "object",
      group: "header",
      fields: [
        headerNavigation,
        defineField({
          name: "primaryAction",
          title: "إجراء شريط التنقل الأساسي",
          type: "siteAction",
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: "footer",
      title: "الشريط السفلى",
      type: "object",
      group: "footer",
      fields: [
        defineField({
          name: "companyDescription",
          title: "وصف الشركة في الشريط السفلى",
          type: "text",
          rows: 4,
          validation: (Rule) => Rule.required().max(600),
        }),
        defineField({
          name: "footerLogo",
          title: "شعار بديل للشريط السفلى (اختيارى)",
          type: "siteImage",
          description:
            "اتركه فارغًا لاستخدام شعار الهوية نفسه. عند رفعه، أدخل نصًا بديلًا عربيًا.",
          validation: (Rule) =>
            Rule.custom((value) => {
              const image = value as ImageValue;
              if (!image?.asset?._ref) return true;
              return image.alt?.trim()
                ? true
                : "أدخل النص البديل العربي لشعار الشريط السفلى.";
            }),
        }),
        defineField({
          name: "badges",
          title: "الشارات المعلوماتية",
          type: "array",
          of: [defineArrayMember({ type: "badge" })],
          validation: (Rule) => Rule.max(6),
        }),
        defineField({
          name: "quickLinks",
          title: "الروابط السريعة",
          type: "linkColumn",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "serviceLinks",
          title: "روابط الخدمات",
          type: "linkColumn",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "contactColumn",
          title: "عمود التواصل",
          type: "contactColumn",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "cta",
          title: "الدعوة للتواصل",
          type: "ctaBlock",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "legal",
          title: "المنطقة القانونية",
          type: "legalBlock",
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: "contact",
      title: "بيانات التواصل",
      type: "object",
      group: "contact",
      fields: [
        defineField({
          name: "phone",
          title: "رقم الهاتف (اختياري)",
          type: "string",
          description:
            "اتركه فارغًا إن لم يكن هناك رقم موثّق. يُعرض باتجاه LTR داخل الصفحة العربية.",
          validation: (Rule) =>
            Rule.custom((value) =>
              !value || PHONE_PATTERN.test(value)
                ? true
                : "أدخل رقم هاتف صالحًا مع رمز الدولة عند الحاجة.",
            ),
        }),
        defineField({
          name: "whatsapp",
          title: "رقم واتساب (اختياري)",
          type: "string",
          description: "أرقام فقط، مع رمز الدولة وبدون رموز إضافية.",
          validation: (Rule) =>
            Rule.custom((value) =>
              !value || WHATSAPP_PATTERN.test(value)
                ? true
                : "أدخل رقم واتساب صالحًا مع رمز الدولة.",
            ),
        }),
        defineField({
          name: "email",
          title: "البريد الإلكتروني (اختياري)",
          type: "string",
          validation: (Rule) =>
            Rule.custom((value) =>
              !value || EMAIL_PATTERN.test(value)
                ? true
                : "أدخل بريدًا إلكترونيًا صالحًا.",
            ),
        }),
        defineField({
          name: "address",
          title: "العنوان بالعربية",
          type: "string",
          validation: (Rule) => Rule.required().max(200),
        }),
        defineField({
          name: "workingHours",
          title: "ساعات العمل (اختياري)",
          type: "string",
          validation: (Rule) => Rule.max(160),
        }),
      ],
    }),
    defineField({
      name: "defaultSeo",
      title: "SEO الافتراضي",
      type: "object",
      group: "seo",
      fields: [
        defineField({
          name: "title",
          title: "العنوان الافتراضي",
          type: "string",
          validation: (Rule) => Rule.required().max(70),
        }),
        defineField({
          name: "description",
          title: "الوصف الافتراضي",
          type: "text",
          rows: 3,
          validation: (Rule) => Rule.required().max(300),
        }),
        defineField({
          name: "siteName",
          title: "اسم الموقع",
          type: "string",
          validation: (Rule) => Rule.required().max(80),
        }),
        defineField({
          name: "image",
          title: "صورة المشاركة (اختياري)",
          type: "siteImage",
          validation: (Rule) =>
            Rule.custom((value) => {
              const image = value as ImageValue;
              if (!image?.asset?._ref) return true;
              return image.alt?.trim()
                ? true
                : "أدخل النص البديل العربي لصورة المشاركة.";
            }),
        }),
      ],
    }),
  ],
});
