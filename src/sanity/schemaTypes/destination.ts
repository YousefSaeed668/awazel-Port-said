import { defineField, defineType } from "sanity";

import { isSafeExternalUrl, isSafeInternalPath } from "@/lib/links";

export const destinationType = defineType({
  name: "destination",
  title: "الرابط",
  type: "object",
  fields: [
    defineField({
      name: "kind",
      title: "نوع الرابط",
      type: "string",
      initialValue: "internal",
      options: {
        layout: "radio",
        list: [
          { title: "مسار داخلي في الموقع", value: "internal" },
          { title: "رابط خارجي", value: "external" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "href",
      title: "العنوان",
      type: "string",
      description:
        "للمسارات الداخلية استخدم مسارًا يبدأ بشرطة مائلة مثل /contact، وللروابط الخارجية استخدم رابطًا يبدأ بـ https://",
      validation: (Rule) =>
        Rule.required().custom((value, context) => {
          if (typeof value !== "string" || !value.trim()) {
            return "أدخل عنوان الرابط.";
          }

          const kind = (context.parent as { kind?: string } | undefined)?.kind;
          const href = value.trim();

          if (kind === "external") {
            return isSafeExternalUrl(href)
              ? true
              : "أدخل رابطًا خارجيًا صالحًا يبدأ بـ http:// أو https://";
          }

          return isSafeInternalPath(href)
            ? true
            : "أدخل مسارًا داخليًا صالحًا يبدأ بـ / دون // أو أحرف خلفية";
        }),
    }),
    defineField({
      name: "openInNewTab",
      title: "فتح الرابط الخارجي في نافذة جديدة",
      type: "boolean",
      description: "يُطبّق على الروابط الخارجية فقط.",
      initialValue: true,
    }),
  ],
});
