import { defineArrayMember, defineField, defineType } from "sanity";

import { SERVICE_TECHNOLOGY_ICONS } from "@/lib/services-data";

const text = (name: string, title: string, max = 160) =>
  defineField({
    name,
    title,
    type: "string",
    validation: (Rule) => Rule.required().max(max),
  });
const paragraph = (name: string, title: string, max = 800) =>
  defineField({
    name,
    title,
    type: "text",
    rows: 3,
    validation: (Rule) => Rule.required().max(max),
  });
const heading = () =>
  defineField({
    name: "heading",
    title: "عنوان القسم",
    type: "homePageSectionHeading",
    validation: (Rule) => Rule.required(),
  });
const image = () =>
  defineField({
    name: "image",
    title: "الصورة",
    type: "siteImage",
    validation: (Rule) =>
      Rule.required().custom((value) => {
        if (
          !value ||
          typeof value !== "object" ||
          !("asset" in value) ||
          !value.asset
        )
          return "ارفع الصورة.";
        if (
          typeof value.asset !== "object" ||
          !("_ref" in value.asset) ||
          !value.asset._ref
        )
          return "ارفع الصورة.";
        if (
          !("alt" in value) ||
          typeof value.alt !== "string" ||
          !value.alt.trim()
        )
          return "أدخل النص البديل للصورة.";
        return true;
      }),
  });
const labels = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: "array",
    of: [
      defineArrayMember({
        type: "object",
        fields: [text("label", "النص", 180)],
        preview: { select: { title: "label" } },
      }),
    ],
    validation: (Rule) => Rule.max(8),
  });

export const serviceApplicationType = defineType({
  name: "serviceApplication",
  title: "خدمة عزل",
  type: "object",
  fields: [
    text("title", "اسم الخدمة"),
    paragraph("description", "وصف الخدمة"),
    labels("tags", "التصنيفات التوضيحية"),
    image(),
    defineField({
      name: "imageBadge",
      title: "شارة الصورة (اختيارية)",
      type: "string",
      validation: (Rule) => Rule.max(100),
    }),
    defineField({
      name: "systemsLabel",
      title: "عنوان الأنظمة (اختياري)",
      type: "string",
      validation: (Rule) => Rule.max(120),
    }),
    labels("systems", "الأنظمة الهندسية"),
    defineField({
      name: "metrics",
      title: "المؤشرات الفنية (اختيارية)",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            text("label", "التسمية", 100),
            text("value", "القيمة", 60),
            defineField({
              name: "unit",
              title: "الوحدة (اختيارية)",
              type: "string",
              validation: (Rule) => Rule.max(30),
            }),
          ],
          preview: { select: { title: "label", subtitle: "value" } },
        }),
      ],
      validation: (Rule) => Rule.max(2),
    }),
  ],
  preview: { select: { title: "title", media: "image" } },
});

export const serviceTechnologyType = defineType({
  name: "serviceTechnology",
  title: "نظام أو تقنية",
  type: "object",
  fields: [
    text("title", "الاسم العربي", 100),
    text("englishTitle", "الاسم الإنجليزي", 100),
    paragraph("description", "الوصف", 500),
    defineField({
      name: "icon",
      title: "الأيقونة",
      type: "string",
      options: {
        list: SERVICE_TECHNOLOGY_ICONS.map((value, i) => ({
          value,
          title: ["الفوم", "الرش", "اللفائف", "الميول"][i],
        })),
      },
      validation: (Rule) =>
        Rule.required().custom(
          (value) =>
            SERVICE_TECHNOLOGY_ICONS.some((icon) => icon === value) ||
            "اختر أيقونة معتمدة.",
        ),
    }),
    text("noteLabel", "عنوان الملاحظة أو التطبيقات", 80),
    paragraph("note", "الملاحظة أو التطبيقات", 300),
  ],
  preview: { select: { title: "title", subtitle: "englishTitle" } },
});

export const servicesPageFields = { text, paragraph, heading, image };
