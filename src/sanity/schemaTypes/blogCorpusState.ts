import { defineArrayMember, defineField, defineType } from "sanity";


export const blogCorpusStateType = defineType({
  name: "blogCorpusState",
  title: "حالة أرشيف المقالات (داخلي)",
  type: "document",
  fields: [
    defineField({
      name: "corpus",
      title: "معرّف الحزمة",
      type: "string",
      readOnly: true,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "version",
      title: "إصدار الحزمة",
      type: "string",
      readOnly: true,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "corpusHash",
      title: "بصمة سلامة المحتوى",
      type: "string",
      readOnly: true,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "migrationCompleted",
      title: "اكتمل الاستبدال الأولي",
      type: "boolean",
      readOnly: true,
    }),
    defineField({
      name: "migrationCompletedAt",
      title: "وقت اكتمال الاستبدال",
      type: "datetime",
      readOnly: true,
    }),
    defineField({
      name: "consumedKeys",
      title: "المفاتيح المنشورة",
      type: "array",
      readOnly: true,
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "committedOperations",
      title: "العمليات المنفذة",
      type: "array",
      readOnly: true,
      of: [
        defineArrayMember({
          type: "object",
          name: "blogCorpusOperation",
          fields: [
            defineField({ name: "operationId", type: "string", readOnly: true }),
            defineField({ name: "kind", type: "string", readOnly: true }),
            defineField({
              name: "keys",
              type: "array",
              readOnly: true,
              of: [defineArrayMember({ type: "string" })],
            }),
            defineField({ name: "committedAt", type: "datetime", readOnly: true }),
            defineField({
              name: "deletedArticleIds",
              title: "معرّفات المقالات المحذوفة",
              type: "array",
              readOnly: true,
              of: [defineArrayMember({ type: "string" })],
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "lastCommittedAt",
      title: "آخر عملية ناجحة",
      type: "datetime",
      readOnly: true,
    }),
  ],
  preview: {
    prepare: () => ({ title: "حالة أرشيف المقالات (داخلي)" }),
  },
});
