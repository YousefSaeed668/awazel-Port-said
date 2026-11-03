import { defineArrayMember, defineField, defineType } from "sanity";

import { isSafeExternalUrl } from "@/lib/links";

const shortText = (name: string, title: string, max: number) =>
  defineField({
    name,
    title,
    type: "string",
    validation: (Rule) => Rule.required().max(max),
  });

const optionalShortText = (name: string, title: string, max: number) =>
  defineField({
    name,
    title,
    type: "string",
    validation: (Rule) => Rule.max(max),
  });

const paragraph = (name: string, title: string, max: number, rows = 4) =>
  defineField({
    name,
    title,
    type: "text",
    rows,
    validation: (Rule) => Rule.required().max(max),
  });

const optionalParagraph = (
  name: string,
  title: string,
  max: number,
  rows = 3,
) =>
  defineField({
    name,
    title,
    type: "text",
    rows,
    validation: (Rule) => Rule.max(max),
  });

function textBlockMember() {
  return defineArrayMember({
    type: "block",
    styles: [
      { title: "نص عادي", value: "normal" },
      { title: "عنوان رئيسي", value: "h2" },
      { title: "عنوان فرعي", value: "h3" },
      { title: "عنوان أصغر", value: "h4" },
      { title: "اقتباس", value: "blockquote" },
    ],
    lists: [
      { title: "نقاط", value: "bullet" },
      { title: "ترقيم", value: "number" },
    ],
    marks: {
      decorators: [
        { title: "عريض", value: "strong" },
        { title: "مائل", value: "em" },
        { title: "تسطير", value: "underline" },
      ],
      annotations: [
        {
          name: "articleLink",
          title: "رابط خارجي",
          type: "object",
          fields: [
            defineField({
              name: "href",
              title: "الرابط",
              type: "url",
              description:
                "روابط خارجية فقط تبدأ بـ http:// أو https://. لربط مقال داخلي استخدم «مرجع مقال».",
              validation: (Rule) =>
                Rule.required().custom((value) =>
                  typeof value === "string" && isSafeExternalUrl(value)
                    ? true
                    : "أدخل رابطًا خارجيًا صالحًا يبدأ بـ http:// أو https://",
                ),
            }),
            defineField({
              name: "openInNewTab",
              title: "فتح الرابط في نافذة جديدة",
              type: "boolean",
              initialValue: true,
            }),
          ],
        },
        {
          name: "articleReference",
          title: "مرجع مقال داخلي",
          type: "object",
          fields: [
            defineField({
              name: "reference",
              title: "المقال",
              type: "reference",
              to: [{ type: "article" }],
              options: { disableNew: true },
              validation: (Rule) => Rule.required(),
            }),
          ],
        },
      ],
    },
  });
}

const headingLevelField = () =>
  optionalShortText("title", "عنوان المجموعة (اختياري)", 120);

function optionalImageAlt(value: unknown) {
  const image = value as {
    asset?: { _ref?: string } | null;
    alt?: string | null;
  } | null;
  if (!image?.asset?._ref) return true;
  if (!image.alt?.trim()) return "أدخل النص البديل العربي للصورة.";
  return true;
}

function validateTable(value: unknown) {
  const table = value as {
    headers?: string[] | null;
    rows?: Array<{ cells?: string[] | null } | null> | null;
  };
  const headerCount = table.headers?.length ?? 0;
  if (!headerCount) return true;

  const rows = table.rows ?? [];
  const mismatched = rows.some(
    (row) => (row?.cells?.length ?? 0) !== headerCount,
  );

  return mismatched
    ? "عدد خلايا كل صف يجب أن يطابق عدد الأعمدة في صف الرأس."
    : true;
}

export const articleBodyImageType = defineType({
  name: "articleBodyImage",
  title: "صورة توضيحية",
  type: "object",
  fields: [
    defineField({
      name: "image",
      title: "الصورة",
      type: "siteImage",
      options: { hotspot: true },
      validation: (Rule) => Rule.required().custom(optionalImageAlt),
    }),
    optionalShortText("caption", "التعليق (اختياري)", 220),
  ],
  preview: {
    select: { title: "caption", media: "image" },
    prepare: ({ title, media }) => ({
      title: typeof title === "string" ? title : "صورة توضيحية",
      media,
    }),
  },
});

export const articleCalloutType = defineType({
  name: "articleCallout",
  title: "تنبيه",
  type: "object",
  fields: [
    defineField({
      name: "tone",
      title: "نوع التنبيه",
      type: "string",
      initialValue: "info",
      options: {
        layout: "radio",
        list: [
          { title: "معلومة", value: "info" },
          { title: "تحذير", value: "warning" },
          { title: "ملاحظة فنية", value: "technical" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    optionalShortText("title", "عنوان التنبيه (اختياري)", 120),
    defineField({
      name: "body",
      title: "نص التنبيه",
      type: "array",
      of: [textBlockMember()],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "tone" },
    prepare: ({ title, subtitle }) => ({
      title: typeof title === "string" ? title : "تنبيه",
      subtitle:
        subtitle === "warning"
          ? "تحذير"
          : subtitle === "technical"
            ? "ملاحظة فنية"
            : "معلومة",
    }),
  },
});

export const articleTableRowType = defineType({
  name: "articleTableRow",
  title: "صف جدول",
  type: "object",
  fields: [
    defineField({
      name: "cells",
      title: "الخلايا",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      validation: (Rule) => Rule.required().min(1).max(6),
    }),
  ],
});

export const articleTableType = defineType({
  name: "articleTable",
  title: "جدول مقارنة",
  type: "object",
  fields: [
    optionalShortText("caption", "تعليق الجدول (اختياري)", 220),
    defineField({
      name: "headers",
      title: "صف الرأس (اختياري)",
      type: "array",
      description: "عند إضافته يجب أن يطابق عدد خلايا كل صف عدد الأعمدة هنا.",
      of: [defineArrayMember({ type: "string" })],
      validation: (Rule) => Rule.max(6),
    }),
    defineField({
      name: "rows",
      title: "الصفوف",
      type: "array",
      of: [defineArrayMember({ type: "articleTableRow" })],
      validation: (Rule) => Rule.required().min(1).max(20),
    }),
  ],
  preview: {
    select: { title: "caption" },
    prepare: ({ title }) => ({
      title: typeof title === "string" ? title : "جدول مقارنة",
    }),
  },
});

export const articleCardType = defineType({
  name: "articleCard",
  title: "بطاقة",
  type: "object",
  fields: [
    shortText("title", "عنوان البطاقة", 100),
    paragraph("description", "وصف البطاقة", 300, 3),
    defineField({
      name: "icon",
      title: "أيقونة البطاقة (اختيارية)",
      type: "string",
      options: {
        list: [
          { title: "قطرة ماء", value: "water" },
          { title: "درجة الحرارة", value: "thermal" },
          { title: "طبقات العزل", value: "layers" },
        ],
      },
      validation: (Rule) =>
        Rule.custom((value) =>
          !value || ["water", "thermal", "layers"].includes(value)
            ? true
            : "اختر أيقونة من القائمة.",
        ),
    }),
  ],
});

export const articleCardGroupType = defineType({
  name: "articleCardGroup",
  title: "مجموعة بطاقات",
  type: "object",
  fields: [
    headingLevelField(),
    optionalParagraph("description", "وصف المجموعة (اختياري)", 300),
    defineField({
      name: "cards",
      title: "البطاقات",
      type: "array",
      of: [defineArrayMember({ type: "articleCard" })],
      validation: (Rule) => Rule.required().min(2).max(4),
    }),
  ],
  preview: {
    select: { title: "title" },
    prepare: ({ title }) => ({
      title: typeof title === "string" ? title : "مجموعة بطاقات",
    }),
  },
});

export const articleExplanationType = defineType({
  name: "articleExplanation",
  title: "شرح مصوّر",
  type: "object",
  fields: [
    shortText("title", "عنوان الشرح", 120),
    paragraph("text", "نص الشرح", 900, 5),
    defineField({
      name: "image",
      title: "الصورة (اختيارية)",
      type: "siteImage",
      options: { hotspot: true },
      validation: (Rule) => Rule.custom(optionalImageAlt),
    }),
    optionalShortText("imageCaption", "تعليق الصورة (اختياري)", 220),
    defineField({
      name: "points",
      title: "نقاط مساندة (اختيارية)",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      validation: (Rule) => Rule.max(6),
    }),
    defineField({
      name: "imageSide",
      title: "موضع الصورة على الشاشات الكبيرة",
      type: "string",
      initialValue: "start",
      options: {
        layout: "radio",
        list: [
          { title: "بداية السطر", value: "start" },
          { title: "نهاية السطر", value: "end" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: "title", media: "image" },
    prepare: ({ title, media }) => ({
      title: typeof title === "string" ? title : "شرح مصوّر",
      media,
    }),
  },
});

export const articleQaItemType = defineType({
  name: "articleQaItem",
  title: "سؤال وجواب",
  type: "object",
  fields: [
    shortText("question", "السؤال", 180),
    paragraph("answer", "الإجابة", 700, 4),
  ],
});

export const articleQaGroupType = defineType({
  name: "articleQaGroup",
  title: "أسئلة وأجوبة",
  type: "object",
  fields: [
    headingLevelField(),
    defineField({
      name: "items",
      title: "الأسئلة",
      type: "array",
      of: [defineArrayMember({ type: "articleQaItem" })],
      validation: (Rule) => Rule.required().min(2).max(10),
    }),
  ],
  preview: {
    select: { title: "title" },
    prepare: ({ title }) => ({
      title: typeof title === "string" ? title : "أسئلة وأجوبة",
    }),
  },
});

export const articleStepType = defineType({
  name: "articleStep",
  title: "خطوة",
  type: "object",
  fields: [
    shortText("title", "عنوان الخطوة", 120),
    optionalParagraph("description", "وصف الخطوة (اختياري)", 400),
  ],
});

export const articleNumberedStepsType = defineType({
  name: "articleNumberedSteps",
  title: "خطوات مرقمة",
  type: "object",
  fields: [
    headingLevelField(),
    defineField({
      name: "items",
      title: "الخطوات",
      type: "array",
      of: [defineArrayMember({ type: "articleStep" })],
      validation: (Rule) => Rule.required().min(2).max(12),
    }),
  ],
  preview: {
    select: { title: "title" },
    prepare: ({ title }) => ({
      title: typeof title === "string" ? title : "خطوات مرقمة",
    }),
  },
});

export const articlePromoActionType = defineType({
  name: "articlePromoAction",
  title: "إجراء العرض",
  type: "object",
  fields: [
    shortText("label", "تسمية الإجراء", 60),
    defineField({
      name: "destination",
      title: "الوجهة",
      type: "destination",
      validation: (Rule) => Rule.required(),
    }),
  ],
});

export const articleServicePromoType = defineType({
  name: "articleServicePromo",
  title: "عرض خدمة",
  type: "object",
  fields: [
    shortText("title", "عنوان العرض", 120),
    paragraph("description", "وصف العرض", 500, 4),
    defineField({
      name: "action",
      title: "إجراء العرض (اختياري)",
      type: "articlePromoAction",
      description: "اتركه فارغًا لإظهار العرض دون زر.",
    }),
  ],
  preview: {
    select: { title: "title" },
    prepare: ({ title }) => ({
      title: typeof title === "string" ? title : "عرض خدمة",
    }),
  },
});

export function articleBodyMembers() {
  return [
    textBlockMember(),
    defineArrayMember({ type: "articleBodyImage" }),
    defineArrayMember({ type: "articleCallout" }),
    defineArrayMember({
      type: "articleTable",
      validation: (Rule) => Rule.custom(validateTable),
    }),
    defineArrayMember({ type: "articleCardGroup" }),
    defineArrayMember({ type: "articleExplanation" }),
    defineArrayMember({ type: "articleQaGroup" }),
    defineArrayMember({ type: "articleNumberedSteps" }),
    defineArrayMember({ type: "articleServicePromo" }),
  ];
}

export const articleBodyObjectTypes = [
  articleBodyImageType,
  articleCalloutType,
  articleTableRowType,
  articleTableType,
  articleCardType,
  articleCardGroupType,
  articleExplanationType,
  articleQaItemType,
  articleQaGroupType,
  articleStepType,
  articleNumberedStepsType,
  articlePromoActionType,
  articleServicePromoType,
];
