import { defineArrayMember, defineField, defineType } from "sanity";

import { homePageCompanyAction } from "./homePageCompanyAction";

type ImageValue = {
  asset?: { _ref?: string } | null;
  alt?: string | null;
} | null;

function requiredImage(value: unknown) {
  const image = value as ImageValue;
  if (!image?.asset?._ref) return "ارفع الصورة.";
  if (!image.alt?.trim()) return "أدخل النص البديل العربي للصورة.";
  return true;
}

const shortText = (name: string, title: string, max: number) =>
  defineField({
    name,
    title,
    type: "string",
    validation: (Rule) => Rule.required().max(max),
  });

const paragraph = (name: string, title: string, max: number, rows = 3) =>
  defineField({
    name,
    title,
    type: "text",
    rows,
    validation: (Rule) => Rule.required().max(max),
  });

const action = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: "siteAction",
    validation: (Rule) => Rule.required(),
  });

export const homePageType = defineType({
  name: "homePage",
  title: "الصفحة الرئيسية",
  type: "document",
  groups: [
    { name: "hero", title: "القسم الرئيسي", default: true },
    { name: "company", title: "نبذة الشركة" },
    { name: "workStages", title: "مراحل العمل" },
    { name: "quality", title: "الجودة والضمان" },
    { name: "faq", title: "الأسئلة الشائعة" },
  ],
  preview: {
    select: { title: "hero.title", subtitle: "hero.eyebrow", media: "hero.image" },
    prepare: ({ title, subtitle, media }) => ({
      title: typeof title === "string" && title.trim() ? title : "الصفحة الرئيسية",
      subtitle: typeof subtitle === "string" ? subtitle : undefined,
      media,
    }),
  },
  fields: [
    defineField({
      name: "hero",
      title: "القسم الرئيسي",
      type: "object",
      group: "hero",
      validation: (Rule) => Rule.required(),
      fields: [
        shortText("eyebrow", "النص التمهيدي", 60),
        shortText("title", "العنوان", 120),
        shortText("highlight", "العبارة المميزة", 120),
        paragraph("description", "الوصف", 400),
        action("primaryAction", "الإجراء الأساسي"),
        action("secondaryAction", "الإجراء الثانوي"),
        defineField({
          name: "highlights",
          title: "مزايا الثقة",
          type: "array",
          of: [defineArrayMember({ type: "homePageHighlight" })],
          validation: (Rule) => Rule.required().min(1).max(6),
        }),
        defineField({
          name: "image",
          title: "الصورة",
          type: "siteImage",
          options: { hotspot: true },
          validation: (Rule) => Rule.custom(requiredImage),
        }),
        defineField({
          name: "panel",
          title: "لوحة المعلومات",
          type: "object",
          validation: (Rule) => Rule.required(),
          fields: [
            shortText("title", "عنوان اللوحة", 120),
            shortText("status", "الشارة (حالة النشاط)", 60),
            shortText("location", "الوصف (الموقع)", 80),
          ],
        }),
      ],
    }),
    defineField({
      name: "company",
      title: "نبذة الشركة",
      type: "object",
      group: "company",
      validation: (Rule) => Rule.required(),
      fields: [
        shortText("eyebrow", "النص التمهيدي", 60),
        shortText("title", "العنوان", 140),
        paragraph("description", "الوصف", 600, 4),
        defineField({
          name: "image",
          title: "الصورة",
          type: "siteImage",
          options: { hotspot: true },
          validation: (Rule) => Rule.custom(requiredImage),
        }),
        defineField({
          name: "panel",
          title: "لوحة المعلومات",
          type: "object",
          validation: (Rule) => Rule.required(),
          fields: [
            shortText("title", "العنوان", 80),
            paragraph("description", "الوصف", 240, 2),
          ],
        }),
        defineField({
          name: "features",
          title: "بطاقات المزايا",
          type: "array",
          of: [defineArrayMember({ type: "homePageFeature" })],
          validation: (Rule) => Rule.required().min(1).max(6),
        }),
        action("primaryAction", "الإجراء الأساسي"),
        homePageCompanyAction,
      ],
    }),
    defineField({
      name: "workStages",
      title: "مراحل العمل",
      type: "object",
      group: "workStages",
      validation: (Rule) => Rule.required(),
      fields: [
        defineField({
          name: "heading",
          title: "عنوان القسم",
          type: "homePageSectionHeading",
          validation: (Rule) => Rule.required(),
        }),
        shortText("label", "التسمية المقروءة للقائمة", 60),
        defineField({
          name: "items",
          title: "المراحل",
          type: "array",
          of: [defineArrayMember({ type: "homePageStage" })],
          validation: (Rule) => Rule.required().min(1).max(8),
        }),
      ],
    }),
    defineField({
      name: "quality",
      title: "الجودة والضمان",
      type: "object",
      group: "quality",
      validation: (Rule) => Rule.required(),
      fields: [
        shortText("eyebrow", "النص التمهيدي", 60),
        shortText("title", "العنوان", 140),
        paragraph("description", "الوصف", 500, 4),
        defineField({
          name: "checks",
          title: "فحوص الجودة",
          type: "array",
          of: [defineArrayMember({ type: "homePageQualityCheck" })],
          validation: (Rule) => Rule.required().min(1).max(6),
        }),
        defineField({
          name: "warranty",
          title: "ملخص الضمان",
          type: "object",
          validation: (Rule) => Rule.required(),
          fields: [
            defineField({
              name: "badge",
              title: "الشارة (اختيارية)",
              type: "string",
              validation: (Rule) => Rule.max(40),
            }),
            shortText("title", "العنوان", 100),
            paragraph("description", "الوصف", 240, 2),
            defineField({
              name: "items",
              title: "بنود الضمان (اختيارية)",
              type: "array",
              of: [defineArrayMember({ type: "string" })],
              validation: (Rule) => Rule.max(6),
            }),
            action("action", "إجراء الضمان"),
          ],
        }),
      ],
    }),
    defineField({
      name: "faq",
      title: "الأسئلة الشائعة",
      type: "object",
      group: "faq",
      validation: (Rule) => Rule.required(),
      fields: [
        defineField({
          name: "heading",
          title: "عنوان القسم",
          type: "homePageSectionHeading",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "items",
          title: "الأسئلة",
          type: "array",
          of: [defineArrayMember({ type: "homePageFaqItem" })],
          validation: (Rule) => Rule.required().min(1).max(12),
        }),
      ],
    }),
  ],
});
