import { defineArrayMember, defineField, defineType } from "sanity";

import { isSafeExternalUrl } from "@/lib/links";

function optionalShortText(name: string, title: string, max: number) {
  return defineField({
    name,
    title,
    type: "string",
    validation: (Rule) => Rule.max(max),
  });
}

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
          name: "projectLink",
          title: "رابط خارجي",
          type: "object",
          fields: [
            defineField({
              name: "href",
              title: "الرابط",
              type: "url",
              description:
                "روابط خارجية فقط تبدأ بـ http:// أو https://.",
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
      ],
    },
  });
}

function optionalImageAlt(value: unknown) {
  const image = value as {
    asset?: { _ref?: string } | null;
    alt?: string | null;
  } | null;
  if (!image?.asset?._ref) return true;
  if (!image.alt?.trim()) return "أدخل النص البديل العربي للصورة.";
  return true;
}

export const projectBodyImageType = defineType({
  name: "projectBodyImage",
  title: "صورة من التنفيذ",
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
      title: typeof title === "string" ? title : "صورة من التنفيذ",
      media,
    }),
  },
});

export const projectCalloutType = defineType({
  name: "projectCallout",
  title: "ملاحظة فنية",
  type: "object",
  fields: [
    defineField({
      name: "tone",
      title: "نوع الملاحظة",
      type: "string",
      initialValue: "technical",
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
    optionalShortText("title", "عنوان الملاحظة (اختياري)", 120),
    defineField({
      name: "body",
      title: "نص الملاحظة",
      type: "array",
      of: [textBlockMember()],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "tone" },
    prepare: ({ title, subtitle }) => ({
      title: typeof title === "string" ? title : "ملاحظة فنية",
      subtitle:
        subtitle === "warning"
          ? "تحذير"
          : subtitle === "info"
            ? "معلومة"
            : "ملاحظة فنية",
    }),
  },
});

export function projectBodyMembers() {
  return [
    textBlockMember(),
    defineArrayMember({ type: "projectBodyImage" }),
    defineArrayMember({ type: "projectCallout" }),
  ];
}

export const projectBodyObjectTypes = [
  projectBodyImageType,
  projectCalloutType,
];
