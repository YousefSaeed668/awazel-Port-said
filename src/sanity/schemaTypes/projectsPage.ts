import { defineArrayMember, defineField, defineType } from "sanity";

import { PROJECT_ASSURANCE_ICONS } from "@/lib/projects";

const assuranceIconTitles: Record<
  (typeof PROJECT_ASSURANCE_ICONS)[number],
  string
> = {
  shield: "درع الضمان",
  compliance: "مطابقة الكود",
  test: "اختبار ميداني",
};

export const projectsPageType = defineType({
  name: "projectsPage",
  title: "جميع المشاريع",
  type: "document",
  groups: [
    { name: "intro", title: "مقدمة الصفحة", default: true },
    { name: "assurance", title: "شريط ضمان الجودة" },
    { name: "closing", title: "دعوة التواصل" },
    { name: "seo", title: "محركات البحث" },
  ],
  fields: [
    defineField({
      name: "intro",
      title: "مقدمة الصفحة",
      type: "object",
      group: "intro",
      validation: (Rule) => Rule.required(),
      fields: [
        defineField({
          name: "eyebrow",
          title: "النص التمهيدي",
          type: "string",
          validation: (Rule) => Rule.required().max(80),
        }),
        defineField({
          name: "title",
          title: "العنوان",
          type: "string",
          validation: (Rule) => Rule.required().max(120),
        }),
        defineField({
          name: "description",
          title: "الوصف",
          type: "text",
          rows: 3,
          validation: (Rule) => Rule.required().max(600),
        }),
        defineField({
          name: "context",
          title: "نص شريط السياق",
          type: "string",
          description:
            "يظهر أعلى الصفحة بجوار مسار التصفح مع نقطة خضراء.",
          validation: (Rule) => Rule.required().max(160),
        }),
        defineField({
          name: "breadcrumbs",
          title: "مسار التصفح",
          type: "array",
          of: [defineArrayMember({ type: "aboutBreadcrumb" })],
          validation: (Rule) => Rule.required().min(2).max(5),
        }),
      ],
    }),
    defineField({
      name: "assurance",
      title: "شريط ضمان الجودة",
      type: "object",
      group: "assurance",
      validation: (Rule) => Rule.required(),
      fields: [
        defineField({
          name: "items",
          title: "عناصر الضمان بالترتيب",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              fields: [
                defineField({
                  name: "title",
                  title: "العنوان",
                  type: "string",
                  validation: (Rule) => Rule.required().max(100),
                }),
                defineField({
                  name: "description",
                  title: "الوصف",
                  type: "text",
                  rows: 3,
                  validation: (Rule) => Rule.required().max(400),
                }),
                defineField({
                  name: "icon",
                  title: "الأيقونة",
                  type: "string",
                  options: {
                    layout: "dropdown",
                    list: PROJECT_ASSURANCE_ICONS.map((icon) => ({
                      title: assuranceIconTitles[icon],
                      value: icon,
                    })),
                  },
                  validation: (Rule) =>
                    Rule.required().custom((value) =>
                      typeof value === "string" &&
                      (PROJECT_ASSURANCE_ICONS as readonly string[]).includes(
                        value,
                      )
                        ? true
                        : "اختر أيقونة من القائمة.",
                    ),
                }),
              ],
              preview: {
                select: { title: "title", subtitle: "icon" },
              },
            }),
          ],
          validation: (Rule) => Rule.required().min(2).max(4),
        }),
      ],
    }),
    defineField({
      name: "closing",
      title: "دعوة التواصل",
      type: "object",
      group: "closing",
      validation: (Rule) => Rule.required(),
      fields: [
        defineField({
          name: "eyebrow",
          title: "النص التمهيدي",
          type: "string",
          validation: (Rule) => Rule.required().max(80),
        }),
        defineField({
          name: "title",
          title: "العنوان",
          type: "string",
          validation: (Rule) => Rule.required().max(140),
        }),
        defineField({
          name: "description",
          title: "الوصف",
          type: "text",
          rows: 3,
          validation: (Rule) => Rule.required().max(600),
        }),
        defineField({
          name: "whatsappAction",
          title: "إجراء واتساب",
          type: "siteAction",
          description:
            "الإجراء الوحيد في هذه اللوحة؛ لا يوجد إجراء طلب عرض سعر منفصل.",
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: "seo",
      title: "محركات البحث",
      type: "object",
      group: "seo",
      validation: (Rule) => Rule.required(),
      fields: [
        defineField({
          name: "title",
          title: "عنوان الصفحة",
          type: "string",
          validation: (Rule) => Rule.required().max(80),
        }),
        defineField({
          name: "description",
          title: "وصف الصفحة",
          type: "text",
          rows: 3,
          validation: (Rule) => Rule.required().max(300),
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "intro.title", subtitle: "intro.eyebrow" },
  },
});
