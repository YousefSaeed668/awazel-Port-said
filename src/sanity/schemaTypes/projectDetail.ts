import { defineArrayMember, defineField, defineType } from "sanity";

import {
  PROJECT_VERIFICATION_ICONS,
  PROJECT_VERIFICATION_TONES,
} from "@/lib/project-detail";

const verificationIconTitles: Record<
  (typeof PROJECT_VERIFICATION_ICONS)[number],
  string
> = {
  shield: "درع الحماية",
  energy: "كفاءة الطاقة",
  test: "اختبار ميداني",
  document: "وثيقة تسليم",
};

const verificationToneTitles: Record<
  (typeof PROJECT_VERIFICATION_TONES)[number],
  string
> = {
  neutral: "محايد",
  info: "أزرق معلوماتي",
  success: "أخضر نجاح",
};

export const projectTechnicalSpecType = defineType({
  name: "projectTechnicalSpec",
  title: "بند مواصفة فنية",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "تسمية البند",
      type: "string",
      validation: (Rule) => Rule.required().max(80),
    }),
    defineField({
      name: "value",
      title: "قيمة البند",
      type: "string",
      description: "تظهر بخط تقني مقابل التسمية.",
      validation: (Rule) => Rule.required().max(80),
    }),
    defineField({
      name: "emphasis",
      title: "إبراز القيمة بالأخضر",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: "label", subtitle: "value" },
  },
});

export const projectApprovalType = defineType({
  name: "projectApproval",
  title: "اعتماد مصنع أو منتج",
  type: "object",
  fields: [
    defineField({
      name: "name",
      title: "اسم المصنع أو المنتج",
      type: "string",
      validation: (Rule) => Rule.required().max(60),
    }),
    defineField({
      name: "description",
      title: "وصف مختصر",
      type: "string",
      validation: (Rule) => Rule.required().max(80),
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "description" },
  },
});

export const projectVerificationType = defineType({
  name: "projectVerification",
  title: "بطاقة توثيق وتسليم",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "عنوان البطاقة",
      type: "string",
      validation: (Rule) => Rule.required().max(100),
    }),
    defineField({
      name: "description",
      title: "نص البطاقة",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required().max(400),
    }),
    defineField({
      name: "icon",
      title: "الأيقونة",
      type: "string",
      initialValue: "shield",
      options: {
        layout: "radio",
        list: PROJECT_VERIFICATION_ICONS.map((icon) => ({
          title: verificationIconTitles[icon],
          value: icon,
        })),
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "footer",
      title: "سطر التذييل",
      type: "string",
      validation: (Rule) => Rule.required().max(100),
    }),
    defineField({
      name: "tone",
      title: "لون البطاقة",
      type: "string",
      initialValue: "neutral",
      options: {
        layout: "radio",
        list: PROJECT_VERIFICATION_TONES.map((tone) => ({
          title: verificationToneTitles[tone],
          value: tone,
        })),
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "footer" },
  },
});

export function projectDetailField() {
  return defineField({
    name: "detail",
    title: "بيانات صفحة المشروع",
    type: "object",
    group: "detail",
    description:
      "كل الحقول اختيارية. يظهر القسم المرتبط بالحقل فقط عند تعبئته، ولا تُنشأ بيانات تلقائية.",
    options: { collapsible: true, collapsed: false },
    fields: [
      defineField({
        name: "approvalNumber",
        title: "رقم بطاقة الاعتماد (اختياري)",
        type: "string",
        description: "سطر صغير فوق عنوان المشروع، مثل: بطاقة اعتماد رقم #PRJ-2026-088.",
        validation: (Rule) => Rule.max(80),
      }),
      defineField({
        name: "warranty",
        title: "الضمان والفحص (اختياري)",
        type: "string",
        description: "قيمة تظهر في شريط بيانات المشروع، مثل: ضمان 10 سنوات + شهادة فحص غمر.",
        validation: (Rule) => Rule.max(80),
      }),
      defineField({
        name: "scope",
        title: "نطاق العمل (اختياري)",
        type: "string",
        description: "قيمة تظهر في شريط بيانات المشروع، مثل: عزل مائي وحراري + ضبط ميول.",
        validation: (Rule) => Rule.max(80),
      }),
      defineField({
        name: "coverStandard",
        title: "المواصفة المعتمدة على صورة الغلاف (اختياري)",
        type: "string",
        validation: (Rule) => Rule.max(80),
      }),
      defineField({
        name: "coverNote",
        title: "تعليق صورة الغلاف (اختياري)",
        type: "string",
        description: "يظهر كشارة فوق صورة الغلاف عند وجوده.",
        validation: (Rule) => Rule.max(160),
      }),
      defineField({
        name: "engineeringRole",
        title: "المسؤولية الهندسية والدور التعاقدي (اختياري)",
        type: "object",
        fields: [
          defineField({
            name: "description",
            title: "النص",
            type: "text",
            rows: 4,
            validation: (Rule) => Rule.required().max(600),
          }),
          defineField({
            name: "tags",
            title: "وسوم مختصرة",
            type: "array",
            of: [defineArrayMember({ type: "string" })],
            validation: (Rule) =>
              Rule.max(6).warning("يفضل ألا تتجاوز ستة وسوم."),
          }),
        ],
      }),
      defineField({
        name: "technicalSpecs",
        title: "المواصفات الفنية المطبقة (اختياري)",
        type: "object",
        fields: [
          defineField({
            name: "note",
            title: "ملاحظة المعيار",
            type: "string",
            description: "مثل: ASTM & SASO.",
            validation: (Rule) => Rule.max(40),
          }),
          defineField({
            name: "rows",
            title: "بنود المواصفات",
            type: "array",
            of: [defineArrayMember({ type: "projectTechnicalSpec" })],
            validation: (Rule) => Rule.required().min(1).max(10),
          }),
        ],
      }),
      defineField({
        name: "approvals",
        title: "المصانع والمنتجات المعتمدة (اختياري)",
        type: "object",
        fields: [
          defineField({
            name: "items",
            title: "الاعتمادات",
            type: "array",
            of: [defineArrayMember({ type: "projectApproval" })],
            validation: (Rule) => Rule.required().min(1).max(6),
          }),
        ],
      }),
      defineField({
        name: "verification",
        title: "توثيق الجودة والتسليم (اختياري)",
        type: "object",
        fields: [
          defineField({
            name: "items",
            title: "بطاقات التوثيق",
            type: "array",
            of: [defineArrayMember({ type: "projectVerification" })],
            validation: (Rule) => Rule.required().min(1).max(3),
          }),
        ],
      }),
    ],
  });
}

export const projectDetailObjectTypes = [
  projectTechnicalSpecType,
  projectApprovalType,
  projectVerificationType,
];
