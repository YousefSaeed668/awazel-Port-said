import { defineArrayMember, defineField, defineType } from "sanity";

import { PRIVACY_CARD_ICONS } from "@/lib/privacy-data";

export const privacyText = (name: string, title: string, max = 180) =>
  defineField({
    name,
    title,
    type: "string",
    validation: (Rule) => Rule.required().max(max),
  });

export const privacyParagraph = (name: string, title: string, max = 2400) =>
  defineField({
    name,
    title,
    type: "text",
    rows: 4,
    validation: (Rule) => Rule.required().max(max),
  });

const paragraphs = (name: string, title: string, required = false) =>
  defineField({
    name,
    title,
    type: "array",
    of: [defineArrayMember({ type: "aboutParagraph" })],
    validation: (Rule) =>
      required ? Rule.required().min(1).max(12) : Rule.max(12),
  });

const textPanel = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: "object",
    fields: [privacyText("title", "العنوان"), privacyParagraph("text", "النص")],
  });

export const privacySectionType = defineType({
  name: "privacySection",
  title: "بند سياسة الخصوصية",
  type: "object",
  fields: [
    privacyText("title", "عنوان البند"),
    privacyText("tocLabel", "تسمية البند في الفهرس"),
    paragraphs("paragraphs", "الفقرات", true),
    defineField({
      name: "cards",
      title: "بطاقات البيانات أو الحماية",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            privacyText("title", "عنوان البطاقة"),
            defineField({
              name: "description",
              title: "وصف البطاقة",
              type: "text",
              rows: 3,
            }),
            defineField({
              name: "icon",
              title: "الأيقونة",
              type: "string",
              options: {
                list: PRIVACY_CARD_ICONS.map((value, index) => ({
                  value,
                  title: [
                    "بيانات الاتصال",
                    "المشروع",
                    "خوادم",
                    "صلاحيات الوصول",
                    "تشفير",
                  ][index],
                })),
              },
              validation: (Rule) => Rule.required(),
            }),
            paragraphs("items", "بنود البطاقة"),
          ],
          preview: { select: { title: "title" } },
        }),
      ],
      validation: (Rule) => Rule.max(3),
    }),
    defineField({
      name: "items",
      title: "الاستخدامات أو الجهات المصرح لها",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            privacyText("title", "العنوان"),
            privacyParagraph("description", "الوصف"),
          ],
          preview: { select: { title: "title" } },
        }),
      ],
      validation: (Rule) => Rule.max(10),
    }),
    textPanel("disclosure", "إيضاح المرفقات الاختيارية"),
    defineField({
      name: "itemsStyle",
      title: "تنسيق الاستخدامات والجهات",
      type: "string",
      initialValue: "rows",
      options: {
        list: [
          { title: "صفوف مظللة", value: "rows" },
          { title: "قائمة نقطية", value: "bullets" },
        ],
      },
    }),
    defineField({
      name: "footnote",
      title: "ملاحظة تفصيلية",
      type: "object",
      fields: [
        defineField({
          name: "title",
          title: "العنوان (اختياري)",
          type: "string",
        }),
        privacyParagraph("text", "النص"),
      ],
    }),
    defineField({
      name: "note",
      title: "التنبيه الختامي للبند",
      type: "object",
      fields: [
        privacyText("title", "العنوان"),
        privacyParagraph("text", "النص"),
        defineField({
          name: "tone",
          title: "نمط التنبيه",
          type: "string",
          initialValue: "muted",
          options: {
            list: [
              { title: "محايد", value: "muted" },
              { title: "أزرق", value: "blue" },
            ],
          },
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: "showContact",
      title: "إظهار قنوات الخصوصية داخل هذا البند",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "showPublication",
      title: "إظهار ختم النشر داخل هذا البند",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: { select: { title: "title", subtitle: "tocLabel" } },
});
