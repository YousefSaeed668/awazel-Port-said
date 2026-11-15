"use server";

import { getSiteShell } from "@/sanity/data/site-settings";

import { prepareContactWhatsAppHref } from "./contact-request";
import {
  createContactSchema,
  isContactFieldName,
  type ContactFieldErrors,
  type ContactFieldName,
  type ContactFormState,
} from "./schema/contact";

const INVALID_MESSAGE =
  "راجع الحقول المشار إليها وأكمل البيانات المطلوبة لتجهيز الرسالة.";
const READY_MESSAGE =
  "رسالة الطلب جاهزة للمراجعة. افتح واتساب وراجع البيانات، ثم اضغط إرسال داخل المحادثة. لم يُرسل الطلب تلقائيًا.";
const UNAVAILABLE_MESSAGE =
  "قائمة الخدمات غير مضبوطة في إعدادات الموقع، لذا لا يمكن التحقق من الطلب حاليًا.";
const WHATSAPP_UNAVAILABLE_MESSAGE =
  "تجهيز الطلب عبر واتساب غير متاح حاليًا. يمكنك استخدام أي قناة تواصل مباشرة منشورة في هذه الصفحة.";
const ERROR_MESSAGE =
  "تعذر تجهيز الرسالة الآن. حاول مرة أخرى أو استخدم إحدى قنوات التواصل المتاحة.";

function readText(formData: FormData, name: ContactFieldName) {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

export async function prepareContactRequest(
  formData: FormData,
): Promise<ContactFormState> {
  try {
    const { contact, footer } = await getSiteShell();
    const serviceOptions = footer.services.links.map((link) => link.label);

    if (serviceOptions.length === 0) {
      return { status: "unavailable", message: UNAVAILABLE_MESSAGE };
    }

    const raw = {
      fullName: readText(formData, "fullName"),
      phone: readText(formData, "phone"),
      city: readText(formData, "city"),
      service: readText(formData, "service"),
      email: readText(formData, "email"),
      area: readText(formData, "area"),
      details: readText(formData, "details"),
    };

    const result = createContactSchema(serviceOptions).safeParse(raw);

    if (!result.success) {
      const fieldErrors: ContactFieldErrors = {};

      for (const issue of result.error.issues) {
        const [field] = issue.path;
        if (typeof field !== "string" || !isContactFieldName(field)) continue;

        fieldErrors[field] = [...(fieldErrors[field] ?? []), issue.message];
      }

      return {
        status: "invalid",
        message: INVALID_MESSAGE,
        fieldErrors,
      };
    }

    // TODO: Add future email delivery here using the validated values and pure
    // formatter. This flow only prepares a WhatsApp chat; it sends no message.
    const whatsappHref = prepareContactWhatsAppHref(
      result.data,
      contact.whatsapp,
    );
    if (!whatsappHref) {
      return { status: "unavailable", message: WHATSAPP_UNAVAILABLE_MESSAGE };
    }

    return { status: "ready", message: READY_MESSAGE, whatsappHref };
  } catch {
    return { status: "error", message: ERROR_MESSAGE };
  }
}
