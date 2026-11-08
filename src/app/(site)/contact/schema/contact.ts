import { z } from "zod";

export const CONTACT_FIELD_NAMES = [
  "fullName",
  "phone",
  "city",
  "service",
  "email",
  "area",
  "details",
] as const;

export type ContactFieldName = (typeof CONTACT_FIELD_NAMES)[number];

export type ContactFieldErrors = Partial<Record<ContactFieldName, string[]>>;

export type ContactFormState =
  | { status: "idle" }
  | { status: "invalid"; message: string; fieldErrors: ContactFieldErrors }
  | { status: "validated"; message: string }
  | { status: "unavailable"; message: string }
  | { status: "error"; message: string };

export type ContactFormValues = {
  fullName: string;
  phone: string;
  city: string;
  service: string;
  email: string;
  area: string;
  details: string;
};

const ARABIC_INDIC_DIGITS = /[\u0660-\u0669\u06f0-\u06f9]/g;
const SAUDI_MOBILE_PATTERN = /^(?:(?:\+|00)966|0)?5\d{8}$/;
const AREA_PATTERN = /^\d{1,7}([.,]\d{1,2})?$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeContactDigits(value: string) {
  return value.replace(ARABIC_INDIC_DIGITS, (digit) => {
    const code = digit.charCodeAt(0);
    const base = code >= 0x06f0 ? 0x06f0 : 0x0660;
    return String(code - base);
  });
}

export function isSaudiMobile(value: string) {
  const compact = normalizeContactDigits(value).replace(/[\s\-()]/g, "");
  return SAUDI_MOBILE_PATTERN.test(compact);
}

export function isContactArea(value: string) {
  return AREA_PATTERN.test(normalizeContactDigits(value).replace("٫", "."));
}

export function isContactFieldName(value: string): value is ContactFieldName {
  return CONTACT_FIELD_NAMES.some((name) => name === value);
}

const contactSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, "الاسم الكامل مطلوب.")
    .min(2, "أدخل الاسم الكامل بحرفين على الأقل.")
    .max(120, "الاسم الكامل طويل جدًا؛ استخدم 120 حرفًا كحد أقصى."),
  phone: z
    .string()
    .trim()
    .min(1, "رقم الجوال مطلوب.")
    .refine(
      isSaudiMobile,
      "أدخل رقم جوال سعودي صحيح، مثل 05XXXXXXXX أو 5XXXXXXXX.",
    ),
  city: z
    .string()
    .trim()
    .min(1, "المدينة أو موقع المشروع مطلوب.")
    .min(2, "أدخل المدينة أو موقع المشروع بحرفين على الأقل.")
    .max(120, "المدينة أو موقع المشروع طويل جدًا؛ استخدم 120 حرفًا كحد أقصى."),
  service: z.string().trim().min(1, "اختر الخدمة المطلوبة."),
  email: z
    .string()
    .trim()
    .max(254, "البريد الإلكتروني طويل جدًا.")
    .refine(
      (value) => value === "" || EMAIL_PATTERN.test(value),
      "أدخل بريدًا إلكترونيًا صحيحًا، مثل name@example.com.",
    ),
  area: z
    .string()
    .trim()
    .refine(
      (value) => value === "" || isContactArea(value),
      "أدخل المساحة بالأرقام فقط، مثل 450 أو 450.5.",
    ),
  details: z
    .string()
    .trim()
    .max(2000, "تفاصيل المشروع طويلة جدًا؛ استخدم 2000 حرف كحد أقصى."),
});

export function createContactSchema(serviceOptions: readonly string[]) {
  return contactSchema.superRefine((values, context) => {
    if (values.service && !serviceOptions.includes(values.service)) {
      context.addIssue({
        code: "custom",
        path: ["service"],
        message: "اختر خدمة من القائمة المتاحة.",
      });
    }
  });
}
