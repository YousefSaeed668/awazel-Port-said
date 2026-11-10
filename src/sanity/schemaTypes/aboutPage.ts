import { defineArrayMember, defineField, defineType } from "sanity";

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

export const aboutPageType = defineType({
  name: "aboutPage",
  title: "من نحن",
  type: "document",
  groups: [
    { name: "intro", title: "مقدمة الصفحة", default: true },
    { name: "company", title: "نبذة الشركة" },
    { name: "capabilities", title: "القدرات والحلول" },
    { name: "methodology", title: "منهجية العمل" },
    { name: "values", title: "القيم والسلامة والبيئة" },
    { name: "profile", title: "الملف التعريفي" },
    { name: "seo", title: "تحسين محركات البحث" },
  ],
  preview: {
    select: {
      title: "intro.title",
      subtitle: "intro.eyebrow",
      media: "company.image",
    },
    prepare: ({ title, subtitle, media }) => ({
      title: typeof title === "string" && title.trim() ? title : "من نحن",
      subtitle: typeof subtitle === "string" ? subtitle : undefined,
      media,
    }),
  },
  fields: [
    defineField({
      name: "intro",
      title: "مقدمة الصفحة",
      type: "object",
      group: "intro",
      validation: (Rule) => Rule.required(),
      fields: [
        shortText("eyebrow", "النص التمهيدي", 60),
        shortText("title", "العنوان", 160),
        paragraph("description", "الوصف", 500, 4),
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
        shortText("title", "العنوان", 160),
        defineField({
          name: "paragraphs",
          title: "الفقرات",
          type: "array",
          of: [defineArrayMember({ type: "aboutParagraph" })],
          validation: (Rule) => Rule.required().min(1).max(6),
        }),
        defineField({
          name: "facts",
          title: "معلومات الشركة",
          type: "array",
          of: [defineArrayMember({ type: "aboutFact" })],
          validation: (Rule) => Rule.required().min(1).max(8),
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
          title: "لوحة الصورة",
          type: "object",
          validation: (Rule) => Rule.required(),
          fields: [
            shortText("title", "العنوان", 100),
            shortText("description", "الوصف", 160),
            defineField({
              name: "metric",
              title: "المؤشر",
              type: "object",
              validation: (Rule) => Rule.required(),
              fields: [
                shortText("value", "القيمة", 40),
                shortText("label", "التسمية", 80),
              ],
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "capabilities",
      title: "القدرات والحلول",
      type: "object",
      group: "capabilities",
      description:
        "تُعرض أول ثلاث خدمات بالترتيب من صفحة الخدمات. عدّل هنا النص التمهيدي والعنوان والوصف فقط.",
      validation: (Rule) => Rule.required(),
      fields: [
        defineField({
          name: "heading",
          title: "عنوان القسم",
          type: "homePageSectionHeading",
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: "methodology",
      title: "منهجية العمل",
      type: "object",
      group: "methodology",
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
          of: [defineArrayMember({ type: "aboutStage" })],
          validation: (Rule) => Rule.required().min(1).max(8),
        }),
      ],
    }),
    defineField({
      name: "values",
      title: "القيم والسلامة والبيئة",
      type: "object",
      group: "values",
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
          title: "البطاقات",
          type: "array",
          of: [defineArrayMember({ type: "aboutValue" })],
          validation: (Rule) => Rule.required().min(1).max(6),
        }),
      ],
    }),
    defineField({
      name: "profile",
      title: "الملف التعريفي",
      type: "object",
      group: "profile",
      validation: (Rule) => Rule.required(),
      fields: [
        shortText("badge", "الشارة", 40),
        shortText("version", "نص الإصدار", 60),
        shortText("title", "العنوان", 160),
        paragraph("description", "الوصف", 500, 4),
        shortText("downloadLabel", "تسمية التحميل", 60),
        defineField({
          name: "file",
          title: "ملف الشركة (PDF)",
          type: "file",
          description:
            "ملف PDF اختياري. عند غيابه تظهر حالة عدم التوفر أدناه.",
          options: { accept: "application/pdf" },
        }),
        shortText("unavailableLabel", "تسمية عدم التوفر", 80),
        shortText("unavailableHint", "شرح عدم التوفر", 160),
      ],
    }),
    defineField({
      name: "seo",
      title: "تحسين محركات البحث",
      type: "object",
      group: "seo",
      validation: (Rule) => Rule.required(),
      fields: [
        shortText("title", "عنوان الصفحة", 80),
        paragraph("description", "وصف الصفحة", 300, 3),
      ],
    }),
  ],
});
