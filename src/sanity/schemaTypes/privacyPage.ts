import { defineArrayMember, defineField, defineType } from "sanity";

import {
  privacyParagraph as paragraph,
  privacyText as text,
} from "./privacyPageSections";

const object = (
  name: string,
  title: string,
  fields: ReturnType<typeof defineField>[],
) =>
  defineField({
    name,
    title,
    type: "object",
    group: name,
    fields,
    validation: (Rule) => Rule.required(),
  });

export const privacyPageType = defineType({
  name: "privacyPage",
  title: "سياسة الخصوصية",
  type: "document",
  groups: [
    { name: "intro", title: "المقدمة", default: true },
    { name: "scope", title: "نطاق السياسة" },
    { name: "sections", title: "بنود السياسة" },
    { name: "contact", title: "قنوات الخصوصية" },
    { name: "publication", title: "ختم النشر" },
    { name: "sidebar", title: "الفهرس والشريط الجانبي" },
    { name: "consultation", title: "دعوة الاستشارة" },
    { name: "whatsapp", title: "واتساب" },
    { name: "seo", title: "محركات البحث" },
  ],
  fields: [
    object("intro", "مقدمة الوثيقة", [
      text("context", "شارة المعلومات القانونية"),
      text("eyebrow", "النص التمهيدي"),
      text("title", "عنوان الصفحة"),
      paragraph("description", "الوصف"),
      defineField({
        name: "breadcrumbs",
        title: "مسار التصفح",
        type: "array",
        of: [defineArrayMember({ type: "aboutBreadcrumb" })],
        validation: (Rule) => Rule.required().min(2).max(5),
      }),
      text("updatedLabel", "تسمية تاريخ التحديث"),
      defineField({
        name: "updatedOn",
        title: "تاريخ آخر تحديث",
        type: "date",
        validation: (Rule) => Rule.required(),
      }),
      text("versionLabel", "تسمية الإصدار"),
      text("version", "الإصدار وحالة النشر"),
      text("compliance", "نص الإطار التنظيمي"),
    ]),
    object("scope", "نطاق تطبيق السياسة", [
      text("title", "العنوان"),
      paragraph("description", "الوصف"),
    ]),
    defineField({
      name: "sections",
      title: "بنود السياسة بالترتيب",
      type: "array",
      group: "sections",
      of: [defineArrayMember({ type: "privacySection" })],
      validation: (Rule) => Rule.required().min(1).max(20),
    }),
    object("contact", "قنوات الخصوصية", [
      text("title", "العنوان"),
      text("subtitle", "الجهة المسؤولة"),
      text("emailLabel", "تسمية البريد الإلكتروني"),
      defineField({
        name: "email",
        title: "البريد الإلكتروني",
        type: "string",
        validation: (Rule) => Rule.required().email(),
      }),
      text("phoneLabel", "تسمية الهاتف"),
      defineField({
        name: "phone",
        title: "رقم الهاتف",
        type: "string",
        validation: (Rule) => Rule.required().regex(/^\+?[\d\s().-]{7,24}$/),
      }),
      text("addressLabel", "تسمية العنوان"),
      text("address", "العنوان"),
      text("hoursLabel", "تسمية ساعات الاستجابة"),
      text("hours", "ساعات الاستجابة"),
    ]),
    object("publication", "ختم النشر", [
      text("label", "نص الختم"),
      text("reference", "مرجع الوثيقة"),
    ]),
    object("sidebar", "الفهرس والشريط الجانبي", [
      text("tocTitle", "عنوان الفهرس"),
      text("countLabel", "تسمية عدد الأقسام"),
      text("projectTitle", "عنوان بطاقة المشروع"),
      paragraph("projectDescription", "وصف بطاقة المشروع"),
      defineField({
        name: "action",
        title: "إجراء بطاقة المشروع",
        type: "siteAction",
      }),
      text("contactTitle", "عنوان بطاقة مسؤول الخصوصية"),
      text("emailLabel", "تسمية البريد"),
      text("location", "الموقع المختصر"),
    ]),
    object("consultation", "دعوة الاستشارة", [
      text("eyebrow", "النص التمهيدي"),
      text("title", "العنوان"),
      paragraph("description", "الوصف"),
      defineField({
        name: "primaryAction",
        title: "الإجراء الأساسي",
        type: "siteAction",
      }),
      defineField({
        name: "secondaryAction",
        title: "الإجراء الآخر",
        type: "siteAction",
      }),
    ]),
    object("whatsapp", "رابط واتساب العائم", [
      defineField({
        name: "enabled",
        title: "إظهار الرابط",
        type: "boolean",
        initialValue: true,
      }),
      text("label", "التسمية المتاحة لقارئ الشاشة"),
      defineField({
        name: "number",
        title: "رقم واتساب الدولي",
        type: "string",
        validation: (Rule) => Rule.required().regex(/^\+?\d{8,15}$/),
      }),
    ]),
    object("seo", "محركات البحث", [
      text("title", "عنوان الصفحة", 80),
      paragraph("description", "وصف الصفحة", 300),
    ]),
  ],
  preview: { select: { title: "intro.title", subtitle: "intro.version" } },
});
