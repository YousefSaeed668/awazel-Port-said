import { defineArrayMember, defineField, defineType } from "sanity";

export const siteImageType = defineType({
  name: "siteImage",
  title: "صورة",
  type: "image",
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "النص البديل بالعربية",
      type: "string",
      description: "وصف قصير للصورة يُستخدم لقارئات الشاشة.",
      validation: (Rule) => Rule.max(160),
    }),
  ],
});

export const siteLinkType = defineType({
  name: "siteLink",
  title: "رابط",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "التسمية بالعربية",
      type: "string",
      validation: (Rule) => Rule.required().max(60),
    }),
    defineField({
      name: "enabled",
      title: "ظاهر",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "destination",
      title: "الوجهة",
      type: "destination",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: "label", enabled: "enabled" },
    prepare: ({ title, enabled }) => ({
      title: typeof title === "string" ? title : "رابط بدون تسمية",
      subtitle: enabled === false ? "غير ظاهر" : undefined,
    }),
  },
});

export const badgeType = defineType({
  name: "badge",
  title: "شارة معلوماتية",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "النص بالعربية",
      type: "string",
      validation: (Rule) => Rule.required().max(40),
    }),
    defineField({
      name: "enabled",
      title: "ظاهرة",
      type: "boolean",
      initialValue: true,
    }),
  ],
});

export const siteActionType = defineType({
  name: "siteAction",
  title: "إجراء",
  type: "object",
  fields: [
    defineField({
      name: "enabled",
      title: "مفعّل",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "label",
      title: "التسمية بالعربية",
      type: "string",
      validation: (Rule) => Rule.required().max(60),
    }),
    defineField({
      name: "destination",
      title: "الوجهة",
      type: "destination",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: "label", enabled: "enabled" },
    prepare: ({ title, enabled }) => ({
      title: typeof title === "string" ? title : "إجراء بدون تسمية",
      subtitle: enabled === false ? "غير مفعّل" : undefined,
    }),
  },
});

export const linkColumnType = defineType({
  name: "linkColumn",
  title: "عمود روابط",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "عنوان العمود بالعربية",
      type: "string",
      validation: (Rule) => Rule.required().max(40),
    }),
    defineField({
      name: "links",
      title: "الروابط",
      type: "array",
      of: [defineArrayMember({ type: "siteLink" })],
      validation: (Rule) => Rule.required().min(1).max(8),
    }),
  ],
});

export const contactColumnType = defineType({
  name: "contactColumn",
  title: "عمود التواصل",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "عنوان العمود بالعربية",
      type: "string",
      validation: (Rule) => Rule.required().max(40),
    }),
    defineField({
      name: "phoneLabel",
      title: "تسمية الهاتف",
      type: "string",
      initialValue: "الهاتف",
      validation: (Rule) => Rule.required().max(30),
    }),
    defineField({
      name: "emailLabel",
      title: "تسمية البريد الإلكتروني",
      type: "string",
      initialValue: "البريد الإلكتروني",
      validation: (Rule) => Rule.required().max(30),
    }),
    defineField({
      name: "addressLabel",
      title: "تسمية العنوان",
      type: "string",
      initialValue: "العنوان",
      validation: (Rule) => Rule.required().max(30),
    }),
    defineField({
      name: "hoursLabel",
      title: "تسمية ساعات العمل",
      type: "string",
      initialValue: "ساعات العمل",
      validation: (Rule) => Rule.required().max(30),
    }),
    defineField({
      name: "action",
      title: "إجراء التواصل (اختياري)",
      type: "siteAction",
      description:
        "يظهر أسفل بيانات التواصل. اتركه غير مفعّل لإخفاء الإجراء.",
    }),
  ],
});

export const ctaBlockType = defineType({
  name: "ctaBlock",
  title: "قسم الدعوة للتواصل",
  type: "object",
  fields: [
    defineField({
      name: "enabled",
      title: "إظهار القسم",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "eyebrow",
      title: "النص التمهيدي",
      type: "string",
      validation: (Rule) => Rule.required().max(60),
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
      validation: (Rule) => Rule.required().max(400),
    }),
    defineField({
      name: "primaryLabel",
      title: "تسمية الإجراء الأساسي",
      type: "string",
      validation: (Rule) => Rule.required().max(60),
    }),
    defineField({
      name: "primaryDestination",
      title: "وجهة الإجراء الأساسي",
      type: "destination",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "whatsappLabel",
      title: "تسمية التواصل عبر واتساب",
      type: "string",
      description: "تظهر فقط عند توفر رقم واتساب في بيانات التواصل.",
      validation: (Rule) => Rule.required().max(60),
    }),
    defineField({
      name: "contactLabel",
      title: "تسمية التواصل البديلة",
      type: "string",
      description: "تظهر بدلًا من واتساب عند عدم توفر رقم واتساب.",
      validation: (Rule) => Rule.required().max(60),
    }),
    defineField({
      name: "supportingText",
      title: "نص التواصل المساند (اختياري)",
      type: "string",
      description:
        "سطر صغير أسفل الأزرار يُستخدم عند عدم توفر رقم هاتف، ويشير إلى وجهة الإجراء الأساسي.",
      validation: (Rule) => Rule.max(120),
    }),
  ],
});

export const legalBlockType = defineType({
  name: "legalBlock",
  title: "المنطقة القانونية",
  type: "object",
  fields: [
    defineField({
      name: "links",
      title: "الروابط القانونية",
      type: "array",
      of: [defineArrayMember({ type: "siteLink" })],
      validation: (Rule) => Rule.required().min(1).max(6),
    }),
    defineField({
      name: "copyright",
      title: "نص حقوق النشر",
      type: "string",
      description: "تُضاف السنة تلقائيًا قبل هذا النص.",
      validation: (Rule) => Rule.required().max(160),
    }),
  ],
});
