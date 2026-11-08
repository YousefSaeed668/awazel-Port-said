import { createClient } from "@sanity/client";
import {
  defineArrayMember,
  defineField,
  defineType,
  getDraftId,
  getPublishedId,
  type SlugValue,
} from "sanity";

import { slugifyArabic } from "@/lib/blog";
import {
  PROJECT_CATEGORIES,
  PROJECT_STATUS_TONES,
} from "@/lib/projects";

import { apiVersion, dataset, projectId } from "../env";
import { projectBodyMembers } from "./projectBody";
import { projectDetailField } from "./projectDetail";

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
        _type == "project" &&
        !(_id in $ids) &&
        slug.current == $slug
      ])`,
      { slug, ids },
    );

    return conflicts > 0
      ? "هذا المسار مستخدم بالفعل في مشروع آخر. اختر مسارًا مختلفًا."
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
    return "املأ عنوان ووصف تحسين محركات البحث معًا، أو اتركهما فارغين لاستخدام عنوان المشروع وملخصه.";
  }

  return true;
}

const statusToneTitles: Record<(typeof PROJECT_STATUS_TONES)[number], string> = {
  completed: "منفذ وموثق",
  certified: "معتمد فنياً",
  inProgress: "قيد التنفيذ",
  neutral: "حالة عامة",
};

export const projectType = defineType({
  name: "project",
  title: "مشروع",
  type: "document",
  groups: [
    { name: "content", title: "المحتوى", default: true },
    { name: "execution", title: "بيانات التنفيذ" },
    { name: "media", title: "الصور" },
    { name: "body", title: "تفاصيل المشروع" },
    { name: "detail", title: "صفحة المشروع" },
    { name: "seo", title: "تحسين محركات البحث" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "عنوان المشروع",
      type: "string",
      group: "content",
      validation: (Rule) => Rule.required().max(140),
    }),
    defineField({
      name: "slug",
      title: "مسار المشروع",
      type: "slug",
      group: "content",
      description:
        "مسار عربي مقروء يُشتق من العنوان عند الإنشاء. يُستخدم في رابط صفحة المشروع.",
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
          .error("أضف مسارًا عربيًا صالحًا للمشروع."),
    }),
    defineField({
      name: "summary",
      title: "ملخص المشروع",
      type: "text",
      group: "content",
      rows: 3,
      description: "يظهر في بطاقة المشروع ووصف البحث.",
      validation: (Rule) => Rule.required().max(300),
    }),
    defineField({
      name: "category",
      title: "التصنيف الهندسي",
      type: "string",
      group: "content",
      description: "يُستخدم في تصفية المشاريع وشارة البطاقة.",
      initialValue: PROJECT_CATEGORIES[0],
      options: {
        layout: "dropdown",
        list: PROJECT_CATEGORIES.map((category) => ({
          title: category,
          value: category,
        })),
      },
      validation: (Rule) =>
        Rule.required().custom((value) =>
          typeof value === "string" &&
          (PROJECT_CATEGORIES as readonly string[]).includes(value)
            ? true
            : "اختر تصنيفاً من القائمة.",
        ),
    }),
    defineField({
      name: "status",
      title: "حالة المشروع",
      type: "object",
      group: "content",
      validation: (Rule) => Rule.required(),
      fields: [
        defineField({
          name: "label",
          title: "نص الحالة",
          type: "string",
          validation: (Rule) => Rule.required().max(80),
        }),
        defineField({
          name: "tone",
          title: "لون الحالة",
          type: "string",
          initialValue: "completed",
          options: {
            layout: "radio",
            list: PROJECT_STATUS_TONES.map((tone) => ({
              title: statusToneTitles[tone],
              value: tone,
            })),
          },
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: "location",
      title: "الموقع",
      type: "string",
      group: "execution",
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: "completedAt",
      title: "تاريخ التنفيذ",
      type: "date",
      group: "execution",
      description: "يُستخدم لترتيب المشاريع من الأحدث إلى الأقدم.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "measurement",
      title: "القياس الرئيسي",
      type: "object",
      group: "execution",
      description:
        "مثل المساحة المنفذة أو السعة التقريبية أو نطاق العمل، بحسب طبيعة المشروع.",
      validation: (Rule) => Rule.required(),
      fields: [
        defineField({
          name: "label",
          title: "تسمية القياس",
          type: "string",
          validation: (Rule) => Rule.required().max(60),
        }),
        defineField({
          name: "value",
          title: "قيمة القياس",
          type: "string",
          validation: (Rule) => Rule.required().max(80),
        }),
      ],
    }),
    defineField({
      name: "system",
      title: "النظام المعتمد",
      type: "object",
      group: "execution",
      validation: (Rule) => Rule.required(),
      fields: [
        defineField({
          name: "label",
          title: "تسمية النظام",
          type: "string",
          initialValue: "النظام المعتمد",
          validation: (Rule) => Rule.required().max(60),
        }),
        defineField({
          name: "value",
          title: "قيمة النظام",
          type: "string",
          validation: (Rule) => Rule.required().max(120),
        }),
      ],
    }),
    defineField({
      name: "highlight",
      title: "ملاحظة مختصرة (اختيارية)",
      type: "string",
      group: "execution",
      description:
        "تظهر في تذييل بطاقة المشروع، مثل «ضمان 10 سنوات» أو «مطابق للمواصفات».",
      validation: (Rule) => Rule.max(80),
    }),
    defineField({
      name: "cover",
      title: "صورة الغلاف",
      type: "siteImage",
      group: "media",
      options: { hotspot: true },
      validation: (Rule) => Rule.required().custom(requiredImageAlt),
    }),
    defineField({
      name: "gallery",
      title: "معرض صور المشروع",
      type: "array",
      group: "media",
      description:
        "اسحب لتغيير ترتيب الصور. تُستخدم في صفحة تفاصيل المشروع.",
      of: [defineArrayMember({ type: "siteImage" })],
      validation: (Rule) => Rule.required().min(1).max(10),
    }),
    defineField({
      name: "body",
      title: "تفاصيل المشروع",
      type: "array",
      group: "body",
      of: projectBodyMembers(),
      validation: (Rule) => Rule.required().min(1),
    }),
    projectDetailField(),
    defineField({
      name: "seo",
      title: "تحسين محركات البحث (اختياري)",
      type: "object",
      group: "seo",
      description:
        "اتركه فارغًا لاستخدام عنوان المشروع وملخصه. عند تعبئته املأ الحقلين معًا.",
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
      title: "الأحدث تنفيذاً",
      name: "completedAtDesc",
      by: [{ field: "completedAt", direction: "desc" }],
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
      subtitle: "category",
      media: "cover",
    },
    prepare: ({ title, subtitle, media }) => ({
      title: typeof title === "string" ? title : "مشروع بدون عنوان",
      subtitle: typeof subtitle === "string" ? subtitle : undefined,
      media,
    }),
  },
});
