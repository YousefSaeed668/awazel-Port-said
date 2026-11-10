import { defineArrayMember, defineField } from "sanity";

import {
  HEADER_PAGE_LIMIT,
  getHeaderPagePath,
  validateHeaderNavigation,
} from "@/lib/header-navigation";

import { HeaderPageInput } from "../components/header-page-input";

export const headerNavigation = defineField({
  name: "navigation",
  title: "صفحات شريط التنقل",
  description:
    "اختر من الصفحات السبع المبرمجة فقط. الصفحات الموجودة، حتى غير الظاهرة، محجوزة ولا تتكرر؛ أعد إظهارها من مفتاح «ظاهر». تتوقف الإضافة عند اكتمال الصفحات السبع. يُحترم الترتيب هنا في سطح المكتب والجوّال. حذف صفحة أو إخفاؤها يمنع فتحها بعد النشر ويعرض 404، بما يشمل مقالات المدونة وتفاصيل المشاريع. سياسة الخصوصية مستقلة في الشريط السفلي.",
  type: "array",
  options: { disableActions: ["duplicate"] },
  validation: (Rule) =>
    Rule.required().min(1).max(HEADER_PAGE_LIMIT).custom(validateHeaderNavigation),
  of: [
    defineArrayMember({
      // Retain the existing stored _type without restricting the shared siteLink.
      name: "siteLink",
      title: "صفحة",
      type: "object",
      fields: [
        defineField({
          name: "label",
          title: "التسمية بالعربية",
          type: "string",
          validation: (Rule) => Rule.required().max(60),
        }),
        defineField({
          name: "enabled",
          title: "ظاهر",
          type: "boolean",
          initialValue: true,
        }),
        defineField({
          name: "destination",
          title: "الصفحة",
          type: "object",
          validation: (Rule) => Rule.required(),
          fields: [
            defineField({
              name: "kind",
              type: "string",
              initialValue: "internal",
              hidden: true,
              readOnly: true,
              options: { list: [{ title: "صفحة داخلية", value: "internal" }] },
            }),
            defineField({
              name: "href",
              title: "الصفحة المتاحة",
              type: "string",
              description:
                "تظهر الصفحات غير المستخدمة فقط. لا يمكن كتابة عنوان جديد أو إضافة رابط خارجي. القيم القديمة غير المدعومة تمنع النشر حتى تصحيحها أو حذفها.",
              // The input supplies the list without invalidating safe legacy URL variants.
              components: { input: HeaderPageInput },
              validation: (Rule) =>
                Rule.required().custom((value) =>
                  getHeaderPagePath(value)
                    ? true
                    : "اختر إحدى الصفحات السبع المبرمجة.",
                ),
            }),
            defineField({
              name: "openInNewTab",
              type: "boolean",
              initialValue: false,
              hidden: true,
              readOnly: true,
            }),
          ],
        }),
      ],
      preview: {
        select: { title: "label", enabled: "enabled", href: "destination.href" },
        prepare: ({ title, enabled, href }) => ({
          title: typeof title === "string" ? title : "صفحة بدون تسمية",
          subtitle: `${enabled === false ? "غير ظاهر — " : ""}${typeof href === "string" ? href : "اختر الصفحة"}`,
        }),
      },
    }),
  ],
});
