import { defineField, defineType } from "sanity";

export const homePageSectionHeadingType = defineType({
  name: "homePageSectionHeading",
  title: "عنوان قسم",
  type: "object",
  fields: [
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
      validation: (Rule) => Rule.required().max(140),
    }),
    defineField({
      name: "description",
      title: "الوصف",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required().max(400),
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "eyebrow" },
  },
});

export const homePageHighlightType = defineType({
  name: "homePageHighlight",
  title: "ميزة ثقة",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "النص بالعربية",
      type: "string",
      validation: (Rule) => Rule.required().max(80),
    }),
    defineField({
      name: "icon",
      title: "الأيقونة",
      type: "string",
      options: {
        layout: "dropdown",
        list: [
          { title: "مطابقة الكود", value: "compliance" },
          { title: "الجودة", value: "quality" },
          { title: "الإشراف", value: "supervision" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: "label", subtitle: "icon" },
  },
});

export const homePageFeatureType = defineType({
  name: "homePageFeature",
  title: "بطاقة ميزة",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "العنوان",
      type: "string",
      validation: (Rule) => Rule.required().max(80),
    }),
    defineField({
      name: "description",
      title: "الوصف",
      type: "text",
      rows: 2,
      validation: (Rule) => Rule.required().max(240),
    }),
    defineField({
      name: "icon",
      title: "الأيقونة",
      type: "string",
      options: {
        layout: "dropdown",
        list: [
          { title: "هدف", value: "target" },
          { title: "شارة اعتماد", value: "badge" },
          { title: "درع", value: "shield" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "icon" },
  },
});

export const homePageStageNoteType = defineType({
  name: "homePageStageNote",
  title: "ملاحظة المرحلة",
  type: "object",
  fields: [
    defineField({
      name: "text",
      title: "النص",
      type: "string",
      validation: (Rule) => Rule.required().max(60),
    }),
    defineField({
      name: "tone",
      title: "النبرة",
      type: "string",
      initialValue: "default",
      options: {
        layout: "radio",
        list: [
          { title: "افتراضية", value: "default" },
          { title: "نجاح", value: "success" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
});

export const homePageStageType = defineType({
  name: "homePageStage",
  title: "مرحلة عمل",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "العنوان",
      type: "string",
      validation: (Rule) => Rule.required().max(80),
    }),
    defineField({
      name: "description",
      title: "الوصف",
      type: "text",
      rows: 2,
      validation: (Rule) => Rule.required().max(240),
    }),
    defineField({
      name: "icon",
      title: "الأيقونة",
      type: "string",
      options: {
        layout: "dropdown",
        list: [
          { title: "استقبال", value: "headset" },
          { title: "هدف", value: "target" },
          { title: "ملف", value: "file" },
          { title: "إعدادات", value: "settings" },
          { title: "فحص", value: "check" },
          { title: "شارة اعتماد", value: "badge" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "note",
      title: "ملاحظة (اختيارية)",
      type: "homePageStageNote",
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "icon" },
  },
});

export const homePageQualityCheckType = defineType({
  name: "homePageQualityCheck",
  title: "فحص جودة",
  type: "object",
  fields: [
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
      name: "icon",
      title: "الأيقونة",
      type: "string",
      options: {
        layout: "dropdown",
        list: [
          { title: "مياه", value: "water" },
          { title: "قياس", value: "ruler" },
          { title: "وثيقة", value: "document" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "icon" },
  },
});

export const homePageFaqItemType = defineType({
  name: "homePageFaqItem",
  title: "سؤال شائع",
  type: "object",
  fields: [
    defineField({
      name: "question",
      title: "السؤال",
      type: "string",
      validation: (Rule) => Rule.required().max(180),
    }),
    defineField({
      name: "answer",
      title: "الإجابة",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required().max(1200),
    }),
  ],
  preview: {
    select: { title: "question" },
  },
});
