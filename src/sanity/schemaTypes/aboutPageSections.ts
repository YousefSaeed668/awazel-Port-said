import { defineField, defineType } from "sanity";

const FACT_ICONS = [
  { title: "سجل معتمد", value: "verified" },
  { title: "نطاق جغرافي", value: "distance" },
  { title: "ضمان", value: "security" },
  { title: "كادر هندسي", value: "engineering" },
];

const VALUE_ICONS = [
  { title: "الجودة", value: "quality" },
  { title: "السلامة", value: "safety" },
  { title: "البيئة", value: "environment" },
];

export const aboutParagraphType = defineType({
  name: "aboutParagraph",
  title: "فقرة",
  type: "object",
  fields: [
    defineField({
      name: "text",
      title: "النص",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required().max(1200),
    }),
  ],
  preview: {
    select: { title: "text" },
  },
});

export const aboutFactType = defineType({
  name: "aboutFact",
  title: "معلومة عن الشركة",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "التسمية",
      type: "string",
      validation: (Rule) => Rule.required().max(80),
    }),
    defineField({
      name: "value",
      title: "القيمة",
      type: "string",
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: "icon",
      title: "الأيقونة",
      type: "string",
      options: { layout: "dropdown", list: FACT_ICONS },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: "label", subtitle: "value" },
  },
});

export const aboutStageNoteType = defineType({
  name: "aboutStageNote",
  title: "ملاحظة مرحلة",
  type: "object",
  fields: [
    defineField({
      name: "text",
      title: "النص",
      type: "string",
      validation: (Rule) => Rule.required().max(80),
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

export const aboutStageType = defineType({
  name: "aboutStage",
  title: "مرحلة في منهجية العمل",
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
      validation: (Rule) => Rule.required().max(500),
    }),
    defineField({
      name: "phase",
      title: "المرحلة (اختيارية)",
      type: "aboutStageNote",
      description: "تظهر كشارة بجانب المرحلة في عرض القائمة.",
    }),
    defineField({
      name: "note",
      title: "ملاحظة إضافية (اختيارية)",
      type: "aboutStageNote",
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "phase.text" },
  },
});

export const aboutValueCheckType = defineType({
  name: "aboutValueCheck",
  title: "بند في قائمة القيم",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "النص",
      type: "string",
      validation: (Rule) => Rule.required().max(160),
    }),
  ],
  preview: {
    select: { title: "label" },
  },
});

export const aboutValueType = defineType({
  name: "aboutValue",
  title: "بطاقة قيمة",
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
      rows: 4,
      validation: (Rule) => Rule.required().max(500),
    }),
    defineField({
      name: "icon",
      title: "الأيقونة",
      type: "string",
      options: { layout: "dropdown", list: VALUE_ICONS },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "checks",
      title: "بنود القائمة",
      type: "array",
      of: [{ type: "aboutValueCheck" }],
      validation: (Rule) => Rule.required().min(1).max(6),
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "icon" },
  },
});
