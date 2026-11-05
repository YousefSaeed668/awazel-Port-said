import { defineArrayMember, defineField, defineType } from "sanity";

import { servicesPageFields } from "./servicesPageSections";

const { text, paragraph, heading, image } = servicesPageFields;

export const servicesPageType = defineType({
  name: "servicesPage",
  title: "جميع الخدمات",
  type: "document",
  groups: [
    { name: "intro", title: "مقدمة الصفحة", default: true },
    { name: "applications", title: "الخدمات" },
    { name: "technologies", title: "الأنظمة والتقنيات" },
    { name: "assessment", title: "منهجية الفحص" },
    { name: "faq", title: "الأسئلة الشائعة" },
    { name: "consultation", title: "دعوة الاستشارة" },
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
        text("eyebrow", "النص التمهيدي", 80),
        text("title", "العنوان"),
        paragraph("description", "الوصف"),
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
      name: "applications",
      title: "خدمات العزل حسب التطبيق",
      type: "object",
      group: "applications",
      validation: (Rule) => Rule.required(),
      fields: [
        heading(),
        defineField({
          name: "items",
          title: "الخدمات بالترتيب",
          type: "array",
          description:
            "اسحب لتغيير الترتيب. تتناوب الصور تلقائياً ولا تظهر أزرار أو تصفية للخدمات.",
          of: [defineArrayMember({ type: "serviceApplication" })],
          validation: (Rule) => Rule.required().min(1).max(20),
        }),
      ],
    }),
    defineField({
      name: "technologies",
      title: "الأنظمة والتقنيات",
      type: "object",
      group: "technologies",
      validation: (Rule) => Rule.required(),
      fields: [
        heading(),
        paragraph("note", "ملاحظة جودة المواد", 400),
        defineField({
          name: "items",
          title: "التقنيات بالترتيب",
          type: "array",
          of: [defineArrayMember({ type: "serviceTechnology" })],
          validation: (Rule) => Rule.required().min(1).max(8),
        }),
      ],
    }),
    defineField({
      name: "assessment",
      title: "منهجية الفحص الفني",
      type: "object",
      group: "assessment",
      validation: (Rule) => Rule.required(),
      fields: [
        heading(),
        defineField({
          name: "factors",
          title: "معايير اختيار النظام",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              fields: [
                text("title", "العنوان", 100),
                paragraph("description", "الوصف", 400),
              ],
              preview: { select: { title: "title" } },
            }),
          ],
          validation: (Rule) => Rule.required().min(1).max(8),
        }),
        defineField({
          name: "project",
          title: "نموذج العمل الميداني",
          type: "object",
          validation: (Rule) => Rule.required(),
          fields: [
            text("badge", "شارة النموذج", 80),
            text("location", "الموقع", 100),
            image(),
            text("imageLabel", "التسمية على الصورة", 100),
            text("title", "عنوان المشروع"),
            paragraph("description", "وصف المشروع"),
            text("durationLabel", "تسمية المدة", 80),
            text("duration", "المدة", 100),
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
        heading(),
        defineField({
          name: "items",
          title: "الأسئلة بالترتيب",
          type: "array",
          of: [defineArrayMember({ type: "homePageFaqItem" })],
          validation: (Rule) => Rule.required().min(1).max(12),
        }),
      ],
    }),
    defineField({
      name: "consultation",
      title: "دعوة الاستشارة",
      type: "object",
      group: "consultation",
      validation: (Rule) => Rule.required(),
      fields: [
        text("eyebrow", "النص التمهيدي", 80),
        text("title", "العنوان"),
        paragraph("description", "الوصف", 600),
        defineField({
          name: "primaryAction",
          title: "الإجراء الأساسي",
          type: "siteAction",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "secondaryAction",
          title: "إجراء التواصل الآخر",
          type: "siteAction",
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
        text("title", "عنوان الصفحة", 80),
        paragraph("description", "وصف الصفحة", 300),
      ],
    }),
  ],
  preview: { select: { title: "intro.title", subtitle: "intro.eyebrow" } },
});
