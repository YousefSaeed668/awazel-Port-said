import { defineField, defineType } from "sanity";

import { DEFAULT_BLOG_WHATSAPP_NUMBER } from "@/lib/blog";

type OptionalImageValue = {
  asset?: { _ref?: string } | null;
  alt?: string | null;
} | null;

function optionalImageAlt(value: unknown) {
  const image = value as OptionalImageValue;
  if (!image?.asset?._ref) return true;
  if (!image.alt?.trim()) return "أدخل النص البديل العربي لصورة الكاتب.";
  return true;
}

export const authorType = defineType({
  name: "author",
  title: "كاتب مقال",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "اسم الكاتب",
      type: "string",
      validation: (Rule) => Rule.required().max(80),
    }),
    defineField({
      name: "role",
      title: "المسمى أو الدور (اختياري)",
      type: "string",
      description: "مثل: مهندس عزل، مسؤول المحتوى الفني.",
      validation: (Rule) => Rule.max(80),
    }),
    defineField({
      name: "bio",
      title: "نبذة قصيرة (اختيارية)",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.max(400),
    }),
    defineField({
      name: "image",
      title: "صورة الكاتب (اختيارية)",
      type: "siteImage",
      description: "عند رفع الصورة يجب إدخال نص بديل عربي.",
      options: { hotspot: true },
      validation: (Rule) => Rule.custom(optionalImageAlt),
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "role", media: "image" },
    prepare: ({ title, subtitle, media }) => ({
      title: typeof title === "string" ? title : "كاتب بدون اسم",
      subtitle: typeof subtitle === "string" ? subtitle : undefined,
      media,
    }),
  },
});

export const blogTagType = defineType({
  name: "blogTag",
  title: "وسم مقال",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "اسم الوسم",
      type: "string",
      validation: (Rule) => Rule.required().max(40),
    }),
    defineField({
      name: "description",
      title: "وصف مختصر (اختياري)",
      type: "string",
      description: "يظهر في شاشة اختيار الوسم فقط.",
      validation: (Rule) => Rule.max(200),
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "description" },
  },
});

export const blogSettingsType = defineType({
  name: "blogSettings",
  title: "إعدادات المدونة",
  type: "document",
  fields: [
    defineField({
      name: "whatsappNumber",
      title: "رقم واتساب لبانرات المدونة",
      type: "string",
      initialValue: DEFAULT_BLOG_WHATSAPP_NUMBER,
      description:
        "يُستخدم في زري واتساب بالبانر الجانبي والعريض. أدخل الرقم الدولي مع رمز البلد دون مسافات. الرقم الافتراضي تجريبي؛ استبدله برقم الشركة قبل الاستخدام الفعلي.",
      validation: (Rule) =>
        Rule.custom((value) =>
          !value || /^\+?[1-9]\d{7,14}$/.test(value)
            ? true
            : "أدخل رقمًا دوليًا من 8 إلى 15 رقمًا مع رمز البلد، دون مسافات.",
        ),
    }),
    defineField({
      name: "sidebarDestination",
      title: "وجهة بطاقة الشريط الجانبي",
      type: "destination",
      description:
        "وجهة زر حجز المعاينة أسفل فهرس المقال. عند تركها فارغة يُستخدم رابط طلب عرض السعر من إعدادات الموقع.",
    }),
    defineField({
      name: "wideDestination",
      title: "وجهة الدعوة العريضة قبل المقالات ذات الصلة",
      type: "destination",
      description:
        "وجهة زر طلب عرض السعر في نهاية المقال. عند تركها فارغة يُستخدم رابط طلب عرض السعر من إعدادات الموقع.",
    }),
  ],
  preview: {
    prepare: () => ({ title: "إعدادات المدونة" }),
  },
});
