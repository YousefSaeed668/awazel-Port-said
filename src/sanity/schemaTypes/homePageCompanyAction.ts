import { defineField } from "sanity";

import { isSafeExternalUrl, isSafeInternalPath } from "@/lib/links";

function destinationKind(parent: unknown) {
  return parent && typeof parent === "object" && "kind" in parent
    ? parent.kind
    : undefined;
}

export const homePageCompanyAction = defineField({
  name: "secondaryAction",
  title: "الإجراء الثانوي / ملف الشركة",
  type: "object",
  validation: (Rule) => Rule.required(),
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
      type: "object",
      validation: (Rule) => Rule.required(),
      fields: [
        defineField({
          name: "kind",
          title: "نوع الوجهة",
          type: "string",
          initialValue: "internal",
          options: {
            layout: "radio",
            list: [
              { title: "مسار داخلي في الموقع", value: "internal" },
              { title: "رابط خارجي", value: "external" },
              {
                title: "ملف الشركة المرفوع في صفحة «من نحن» (PDF)",
                value: "companyProfile",
              },
            ],
          },
          description:
            "خيار ملف الشركة يستخدم حقل «ملف الشركة (PDF)» في صفحة «من نحن». عند غياب الملف يظهر الزر غير متاح.",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "href",
          title: "العنوان",
          type: "string",
          description:
            "للمسار الداخلي استخدم /contact، وللرابط الخارجي استخدم https://",
          hidden: ({ parent }) => destinationKind(parent) === "companyProfile",
          validation: (Rule) =>
            Rule.custom((value, context) => {
              const kind = destinationKind(context.parent);
              if (kind === "companyProfile") return true;
              if (!value?.trim()) return "أدخل عنوان الرابط.";

              if (kind === "external") {
                return isSafeExternalUrl(value.trim())
                  ? true
                  : "أدخل رابطًا خارجيًا صالحًا يبدأ بـ http:// أو https://";
              }

              return isSafeInternalPath(value.trim())
                ? true
                : "أدخل مسارًا داخليًا صالحًا يبدأ بـ / دون // أو أحرف خلفية";
            }),
        }),
        defineField({
          name: "openInNewTab",
          title: "فتح الرابط الخارجي في نافذة جديدة",
          type: "boolean",
          initialValue: true,
          hidden: ({ parent }) => destinationKind(parent) !== "external",
        }),
      ],
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
