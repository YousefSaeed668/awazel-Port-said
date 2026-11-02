import { defineArrayMember, defineField, defineType } from "sanity";

type OptionalImageValue = {
  asset?: { _ref?: string } | null;
  alt?: string | null;
} | null;

function optionalImage(value: unknown) {
  const image = value as OptionalImageValue;
  if (!image?.asset?._ref) return true;
  if (!image.alt?.trim()) return "أدخل النص البديل العربي للشعار.";
  return true;
}

const shortText = (name: string, title: string, max: number) =>
  defineField({
    name,
    title,
    type: "string",
    validation: (Rule) => Rule.required().max(max),
  });

const optionalShortText = (
  name: string,
  title: string,
  max: number,
  description?: string,
) =>
  defineField({
    name,
    title,
    type: "string",
    description,
    validation: (Rule) => Rule.max(max),
  });

const paragraph = (name: string, title: string, max: number, rows = 4) =>
  defineField({
    name,
    title,
    type: "text",
    rows,
    validation: (Rule) => Rule.required().max(max),
  });

const optionalParagraph = (name: string, title: string, max: number, rows = 3) =>
  defineField({
    name,
    title,
    type: "text",
    rows,
    validation: (Rule) => Rule.max(max),
  });

const STATUS_TONES = [
  { title: "سارية أو نافذة", value: "valid" },
  { title: "قيد المراجعة أو التجديد", value: "pending" },
  { title: "منتهية", value: "expired" },
  { title: "محايدة", value: "neutral" },
];

export const certificateRecordType = defineType({
  name: "certificateRecord",
  title: "شهادة أو اعتماد",
  type: "object",
  fields: [
    shortText("issuerName", "اسم الجهة المصدرة", 140),
    optionalShortText(
      "issuerSecondaryName",
      "الاسم الثانوي للجهة (اختياري)",
      180,
      "مثل الاسم التجاري بالإنجليزية أو وصف مختصر للجهة.",
    ),
    defineField({
      name: "issuerLogo",
      title: "شعار الجهة (اختياري)",
      type: "siteImage",
      description:
        "عند رفعه يظهر بدل الأيقونة الافتراضية. يجب إدخال نص بديل عربي.",
      options: { hotspot: true },
      validation: (Rule) => Rule.custom(optionalImage),
    }),
    shortText("certificateTitle", "عنوان الشهادة", 160),
    optionalShortText(
      "certificateSubtitle",
      "الوصف الفرعي للشهادة (اختياري)",
      200,
      "مثل نوع النظام أو التطبيق الذي تغطيه الشهادة.",
    ),
    optionalShortText(
      "reference",
      "المرجع أو رقم الشهادة (اختياري)",
      80,
      "اكتب الرقم كما يظهر في المستند الأصلي.",
    ),
    defineField({
      name: "status",
      title: "حالة الشهادة (اختيارية)",
      type: "object",
      description:
        "اكتب حالة المستند الفعلية وحدّثها يدوياً عند التجديد أو الانتهاء. لا تُحسب الحالة تلقائياً من التواريخ بسبب التخزين المؤقت طويل الأمد للمحتوى.",
      fields: [
        defineField({
          name: "label",
          title: "نص الحالة",
          type: "string",
          validation: (Rule) => Rule.required().max(60),
        }),
        defineField({
          name: "tone",
          title: "لون الحالة",
          type: "string",
          initialValue: "neutral",
          options: { layout: "dropdown", list: STATUS_TONES },
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    optionalParagraph(
      "authorizationDescription",
      "وصف التفويض أو الاعتماد (اختياري)",
      700,
    ),
    defineField({
      name: "issuedOn",
      title: "تاريخ الإصدار (اختياري)",
      type: "date",
      description: "اتركه فارغاً إذا لم يكن التاريخ مذكوراً في المستند.",
    }),
    defineField({
      name: "validUntil",
      title: "تاريخ نهاية الصلاحية (اختياري)",
      type: "date",
      description: "لا يُستخدم لحساب الحالة تلقائياً؛ الحالة تُكتب يدوياً.",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if (!value) return true;
          const parent = context.parent as { issuedOn?: string } | undefined;
          if (parent?.issuedOn && value < parent.issuedOn) {
            return "تاريخ نهاية الصلاحية يجب ألا يسبق تاريخ الإصدار.";
          }
          return true;
        }),
    }),
    optionalShortText(
      "validityNote",
      "ملاحظة الصلاحية (اختيارية)",
      180,
      "مثل: سارية لمدة عام وتُجدد سنوياً. لا تكتب هنا ادعاءً غير موجود في المستند.",
    ),
    defineField({
      name: "scope",
      title: "نطاق التطبيق (اختياري)",
      type: "object",
      fields: [
        optionalShortText("title", "عنوان النطاق", 100),
        optionalParagraph("description", "وصف النطاق", 500, 3),
        defineField({
          name: "items",
          title: "بنود النطاق (اختيارية)",
          type: "array",
          of: [defineArrayMember({ type: "string" })],
          validation: (Rule) => Rule.max(8),
        }),
      ],
    }),
    defineField({
      name: "document",
      title: "ملف الشهادة (PDF)",
      type: "file",
      description:
        "الملف الفعلي الذي تُعرض معاينته وتُحمّل نسخته. ارفع PDF فقط.",
      options: { accept: "application/pdf" },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "issuerName",
      subtitle: "certificateTitle",
      media: "issuerLogo",
    },
  },
});

export const certificatesPageType = defineType({
  name: "certificatesPage",
  title: "الاعتمادات والشهادات",
  type: "document",
  groups: [
    { name: "intro", title: "مقدمة الصفحة", default: true },
    { name: "certificates", title: "قسم الاعتمادات" },
    { name: "seo", title: "تحسين محركات البحث" },
  ],
  fields: [
    defineField({
      name: "intro",
      title: "مقدمة الصفحة",
      type: "object",
      group: "intro",
      validation: (Rule) => Rule.required(),
      fields: [
        shortText("eyebrow", "النص التمهيدي", 60),
        shortText("title", "العنوان", 160),
        paragraph("description", "الوصف", 700, 4),
      ],
    }),
    defineField({
      name: "certificates",
      title: "قسم الاعتمادات",
      type: "object",
      group: "certificates",
      validation: (Rule) => Rule.required(),
      fields: [
        defineField({
          name: "heading",
          title: "عنوان القسم",
          type: "homePageSectionHeading",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "items",
          title: "الشهادات والاعتمادات",
          type: "array",
          description:
            "رتّب الشهادات بالسحب والإفلات؛ يظهر الترتيب نفسه في الصفحة. يمكن ترك القائمة فارغة مؤقتاً.",
          of: [defineArrayMember({ type: "certificateRecord" })],
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: "seo",
      title: "تحسين محركات البحث",
      type: "object",
      group: "seo",
      validation: (Rule) => Rule.required(),
      fields: [
        shortText("title", "عنوان الصفحة", 80),
        paragraph("description", "وصف الصفحة", 300, 3),
      ],
    }),
  ],
  preview: {
    select: { title: "intro.title", subtitle: "intro.eyebrow" },
    prepare: ({ title, subtitle }) => ({
      title:
        typeof title === "string" && title.trim()
          ? title
          : "الاعتمادات والشهادات",
      subtitle: typeof subtitle === "string" ? subtitle : undefined,
    }),
  },
});
