import { createClient } from "@sanity/client";
import {
  defineField,
  defineType,
  getDraftId,
  getPublishedId,
  type SlugValue,
} from "sanity";

import { slugifyArabic } from "@/lib/blog";

import { apiVersion, dataset, projectId } from "../env";
import { articleBodyMembers } from "./articleBody";

let validationClient: ReturnType<typeof createClient> | null = null;

function getValidationClient() {
  if (!validationClient) {
    validationClient = createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: false,
      perspective: "raw",
    });
  }
  return validationClient;
}

async function validateUniqueSlug(
  value: SlugValue | undefined,
  document: { _id?: string } | undefined,
) {
  const slug = value?.current?.trim();
  if (!slug) return true;

  const ids = document?._id
    ? [getPublishedId(document._id), getDraftId(document._id)]
    : [];

  try {
    const conflicts = await getValidationClient().fetch<number>(
      `count(*[
        _type == "article" &&
        !(_id in $ids) &&
        (slug.current == $slug || $slug in previousSlugs)
      ])`,
      { slug, ids },
    );

    return conflicts > 0
      ? "هذا المسار مستخدم بالفعل في مقال آخر أو في مسار قديم محفوظ. اختر مسارًا مختلفًا."
      : true;
  } catch {
    return "تعذّر التحقق من تفرد المسار الآن. أعد المحاولة بعد التأكد من الاتصال.";
  }
}

function requiredImageAlt(value: unknown) {
  const image = value as {
    asset?: { _ref?: string } | null;
    alt?: string | null;
  } | null;
  if (!image?.asset?._ref) return "أضف صورة الغلاف.";
  if (!image.alt?.trim()) return "أدخل النص البديل العربي لصورة الغلاف.";
  return true;
}

function validateSeo(value: unknown) {
  const seo = value as
    | { title?: string | null; description?: string | null }
    | null
    | undefined;
  if (!seo) return true;

  const hasTitle = Boolean(seo.title?.trim());
  const hasDescription = Boolean(seo.description?.trim());

  if (hasTitle !== hasDescription) {
    return "املأ عنوان ووصف تحسين محركات البحث معًا، أو اتركهما فارغين لاستخدام عنوان المقال وملخصه.";
  }

  return true;
}

export const articleType = defineType({
  name: "article",
  title: "مقال",
  type: "document",
  groups: [
    { name: "content", title: "المحتوى", default: true },
    { name: "publishing", title: "بيانات النشر" },
    { name: "seo", title: "تحسين محركات البحث" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "عنوان المقال",
      type: "string",
      group: "content",
      validation: (Rule) => Rule.required().max(140),
    }),
    defineField({
      name: "slug",
      title: "مسار المقال",
      type: "slug",
      group: "content",
      description:
        "مسار عربي مقروء يُشتق من العنوان عند الإنشاء. بعد النشر احتفظ بالمسار نفسه؛ المسارات القديمة تُحفظ تلقائيًا عند تغييره.",
      options: {
        source: "title",
        maxLength: 96,
        slugify: (input) => slugifyArabic(input),
      },
      validation: (Rule) =>
        Rule.required()
          .custom((value, context) =>
            validateUniqueSlug(
              value as SlugValue | undefined,
              context.document as { _id?: string } | undefined,
            ),
          )
          .error("أضف مسارًا عربيًا صالحًا للمقال."),
    }),
    defineField({
      name: "excerpt",
      title: "ملخص المقال",
      type: "text",
      group: "content",
      rows: 3,
      description: "يظهر أسفل العنوان وفي بطاقات المقالات ووصف البحث.",
      validation: (Rule) => Rule.required().max(300),
    }),
    defineField({
      name: "cover",
      title: "صورة الغلاف",
      type: "siteImage",
      group: "content",
      options: { hotspot: true },
      validation: (Rule) => Rule.required().custom(requiredImageAlt),
    }),
    defineField({
      name: "coverCaption",
      title: "تعليق صورة الغلاف (اختياري)",
      type: "string",
      group: "content",
      validation: (Rule) => Rule.max(220),
    }),
    defineField({
      name: "author",
      title: "الكاتب",
      type: "reference",
      group: "content",
      to: [{ type: "author" }],
      options: { disableNew: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tags",
      title: "الوسوم",
      type: "array",
      group: "content",
      description: "تُستخدم في شارات المقال وفي اختيار المقالات ذات الصلة.",
      of: [{ type: "reference", to: [{ type: "blogTag" }] }],
      validation: (Rule) => Rule.max(6).unique(),
    }),
    defineField({
      name: "body",
      title: "محتوى المقال",
      type: "array",
      group: "content",
      of: articleBodyMembers(),
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "publishedAt",
      title: "تاريخ النشر",
      type: "datetime",
      group: "publishing",
      readOnly: true,
      description:
        "يُضبط تلقائيًا عند أول نشر ناجح. لا يُعدّل يدويًا ولا يتغير عند حفظ المسودة.",
    }),
    defineField({
      name: "updatedAt",
      title: "تاريخ آخر تحديث منشور",
      type: "datetime",
      group: "publishing",
      readOnly: true,
      description:
        "يُضبط تلقائيًا فقط عند إعادة نشر تغيير حقيقي بعد النشر الأول.",
    }),
    defineField({
      name: "previousSlugs",
      title: "المسارات السابقة",
      type: "array",
      group: "publishing",
      readOnly: true,
      of: [{ type: "string" }],
      description:
        "تُحفظ تلقائيًا عند تغيير المسار بعد النشر لتوجيه الروابط القديمة إلى المسار الحالي.",
    }),
    defineField({
      name: "seo",
      title: "تحسين محركات البحث (اختياري)",
      type: "object",
      group: "seo",
      description:
        "اتركه فارغًا لاستخدام عنوان المقال وملخصه. عند تعبئته املأ الحقلين معًا.",
      validation: (Rule) => Rule.custom(validateSeo),
      fields: [
        defineField({
          name: "title",
          title: "عنوان البحث",
          type: "string",
          validation: (Rule) => Rule.max(80),
        }),
        defineField({
          name: "description",
          title: "وصف البحث",
          type: "text",
          rows: 3,
          validation: (Rule) => Rule.max(300),
        }),
      ],
    }),
  ],
  orderings: [
    {
      title: "الأحدث نشرًا",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
    {
      title: "العنوان",
      name: "titleAsc",
      by: [{ field: "title", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "excerpt",
      media: "cover",
    },
    prepare: ({ title, subtitle, media }) => ({
      title: typeof title === "string" ? title : "مقال بدون عنوان",
      subtitle: typeof subtitle === "string" ? subtitle : undefined,
      media,
    }),
  },
});
